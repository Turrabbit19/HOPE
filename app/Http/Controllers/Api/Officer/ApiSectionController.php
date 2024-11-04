<?php

namespace App\Http\Controllers\Api\Officer;

use App\Events\NewNotification;
use App\Models\StudentNotification;
use Carbon\Carbon;
use App\Models\Section;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\Notification;
use App\Models\Student;
use Illuminate\Support\Facades\Validator;
use Illuminate\Database\Eloquent\ModelNotFoundException;

class ApiSectionController extends Controller
{
    public function index()
    {
        try {
            $sections = Section::get();

            $data = $sections->map(function($section) {
                return [
                    'id' => $section->id,
                    'name' => $section->name,
                ];
            });
            return response()->json(['data' => $data], 200);
        } catch (\Exception $e) {
            return response()->json(['error'=>'Không thể truy vấn tới bảng Sections', 'message' => $e->getMessage()], 500);
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:100|unique:sections',   
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 400);
        }

        try {
            $data = $validator->validated();
            $section = Section::create($data);
            
            return response()->json(['data' => $section, 'message' => 'Tạo mới thành công'], 201);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Tạo mới thất bại', 'message' => $e->getMessage()], 500);
        }
    }

    public function show(string $id)
    {
        try {
            $section = Section::findOrFail($id);
            $data = [
                    'id' => $section->id,
                    'name' => $section->name,
                ];

            return response()->json(['data' => $data], 200);
        } catch (ModelNotFoundException $e) {
            return response()->json(['error' => 'Không tìm thấy phần mục với ID: ' . $id], 404);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Không thể truy vấn tới bảng Sections', 'message' => $e->getMessage()], 500);
        }
    }

    public function update(Request $request, string $id)
    {
         $validator = Validator::make($request->all(), [
            'name' => 'sometimes|string|max:100|unique:sections,name,' . $id,   
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 400);
        }

        try {
            $section = Section::findOrFail($id);
            
            $data = $validator->validated();
            $section->update($data);

            return response()->json(['data' => $section, 'message' => 'Cập nhật thành công'], 200);
        } catch (ModelNotFoundException $e) {
            return response()->json(['error' => 'Không tìm thấy phần mục với ID: ' . $id], 404);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Cập nhật thất bại', 'message' => $e->getMessage()], 500);
        }
    }

    public function destroy(string $id)
    {
        try {
            $section = Section::findOrFail($id);
            $section->delete();
            return response()->json(['message' => 'Xóa mềm thành công'], 200);
        } catch (ModelNotFoundException $e) {
            return response()->json(['error' => 'Không tìm thấy phần mục với ID: ' . $id], 404);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Xóa mềm thất bại', 'message' => $e->getMessage()], 500);
        }
    }

    public function getNotifications(Request $request, string $id){
        try {
            $perPage = $request->input('perPage', 9);

            $notifications = Notification::with('section', 'courses')->where('section_id',$id)->paginate($perPage);
    
            $data = collect($notifications->items())->map(function ($notification) {
                return [
                    'id' => $notification->id,
                    'section_name' => $notification->section->name,
                    'name' => $notification->name,
                    'description' => $notification->description,
                    'time' => Carbon::parse($notification->time)->format('H:i, d/m/Y'),
                    'courses' => $notification->courses->map(function ($course) {
                        return [
                            "id" => $course->id,
                            "name" => $course->name
                        ];
                    }),
                ];
            });
    
            return response()->json([
                'data' => $data,
                'pagination' => [
                    'total' => $notifications->total(),               
                    'per_page' => $notifications->perPage(),     
                    'first_page' => 1,             
                    'current_page' => $notifications->currentPage(),  
                    'last_page' => $notifications->lastPage(),        
                    'first_page_url' => $notifications->url(1),       
                    'last_page_url' => $notifications->url($notifications->lastPage()),  
                    'next_page_url' => $notifications->nextPageUrl(), 
                    'prev_page_url' => $notifications->previousPageUrl(),  
                    'from' => $notifications->firstItem(),            
                    'to' => $notifications->lastItem(),              
                ]
            ], 200);
        } catch (ModelNotFoundException $e) {
            return response()->json(['error' => 'Không tìm thấy môn học với ID: ' . $id], 404);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Không thể truy vấn tới bảng Notifications', 'message' => $e->getMessage()], 500);
        }
    }
    public function addNotification(Request $request, string $id){
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255|unique:notifications',   
            'description' => 'required|string',
            'courses' => 'required|array',
            'courses.*.id' => 'required|exists:courses,id',  
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 400);
        }

        try {
            $data = $validator->validated();

            $data['section_id'] = $id;
            $data['time'] = Carbon::now();

            $notification = Notification::create($data);

            $courses = collect($data['courses'])->mapWithKeys(function ($course) {
                return [$course['id'] => []];
            });
            
            $notification->courses()->sync($courses);

            foreach ($data['courses'] as $course) {
                $students = Student::where('course_id', $course['id'])->get();
    
                foreach ($students as $student) {
                    StudentNotification::create([
                        'student_id' => $student->id,
                        'notification_id' => $notification->id,
                        'status' => 0
                    ]);
                }
            }

            broadcast(new NewNotification($notification));
            
            return response()->json(['data' => $notification, 'message' => 'Tạo mới thành công'], 201);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Tạo mới thất bại', 'message' => $e->getMessage()], 500);
        }
    }
}
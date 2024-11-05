<?php

namespace App\Http\Controllers\Api\Admin;

use Carbon\Carbon;
use App\Models\Student;
use App\Models\Notification;
use Illuminate\Http\Request;
use App\Events\NewNotification;
use App\Events\NotificationEvent;
use App\Models\StudentNotification;
use Illuminate\Support\Facades\Log;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Validator;
use Illuminate\Database\Eloquent\ModelNotFoundException;

class ApiNotificationController extends Controller
{
    public function index()
    {
        try {
            $notifications = Notification::with('sections')->paginate(9);

            $data = collect($notifications->items())->map(function ($notification) {
                return [
                    'id' => $notification->id,
                    'section_name' => $notification->sections->name,
                    'name' => $notification->name,
                    'description' => $notification->description,
                    'time' => $notification->time,
                ];
            });

            return response()->json([
                'data' => $data,
                'pagination' => [
                    'total' => $notifications->total(),
                    'per_page' => $notifications->perPage(),
                    'current_page' => $notifications->currentPage(),
                    'last_page' => $notifications->lastPage(),
                ]
            ], 200);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Không thể truy vấn tới bảng Notifications', 'message' => $e->getMessage()], 500);
        }
    }

    public function getAll()
    {
        try {
            $notifications = Notification::with('section')->get();

            $data = $notifications->map(function ($notification) {
                return [
                    'id' => $notification->id,
                    'section_name' => $notification->section->name,
                    'name' => $notification->name,
                    'description' => $notification->description,
                    'time' => $notification->time,
                ];
            });

            return response()->json(['data' => $data], 200);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Không thể truy vấn tới bảng Notifications', 'message' => $e->getMessage()], 500);
        }
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'section_id' => 'required|exists:sections,id',   
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
            $data['time'] = Carbon::now();

            $notification = Notification::create($data);

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
            Log::error('Error creating StudentNotification: ' . $e->getMessage());
            return response()->json(['error' => 'Tạo mới thất bại', 'message' => $e->getMessage()], 500);
        }
    }

    public function show(string $id)
    {
        try {
            $notification = Notification::with('section', 'courses')->findOrFail($id);
            $data = [
                    'id' => $notification->id,
                    'section_name' => $notification->section->name,
                    'name' => $notification->name,
                    'description' => $notification->description,
                    'time' => $notification->time,
                    'courses' => $notification->courses->map(function ($course) {
                        return [
                            "id" => $course->id,
                            "name" => $course->name
                        ];
                    }),
                ];

            return response()->json(['data' => $data], 200);
        } catch (ModelNotFoundException $e) {
            return response()->json(['error' => 'Không tìm thấy thông báo với ID: ' . $id], 404);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Không thể truy vấn tới bảng Notifications', 'message' => $e->getMessage()], 500);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $validator = Validator::make($request->all(), [
            'section_id' => 'sometimes|exists:sections,id',
            'name' => 'sometimes|string|max:255|unique:notifications,name,' . $id,
            'description' => 'sometimes|string',
            'time' => 'sometimes|date_format:Y-m-d H:i:s',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 400);
        }

        try {
            $notification = Notification::findOrFail($id);

            $data = $validator->validated();
            $notification->update($data);

            return response()->json(['data' => $notification, 'message' => 'Cập nhật thành công'], 200);
        } catch (ModelNotFoundException $e) {
            return response()->json(['error' => 'Không tìm thấy thông báo với ID: ' . $id], 404);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Cập nhật thất bại', 'message' => $e->getMessage()], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        try {
            $notification = Notification::findOrFail($id);
            $notification->delete();
            return response()->json(['message' => 'Xóa mềm thành công'], 200);
        } catch (ModelNotFoundException $e) {
            return response()->json(['error' => 'Không tìm thấy thông báo với ID: ' . $id], 404);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Xóa mềm thất bại', 'message' => $e->getMessage()], 500);
        }
    }
}
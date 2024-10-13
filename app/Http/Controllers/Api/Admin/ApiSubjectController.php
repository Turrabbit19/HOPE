<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Classroom;
use App\Models\Lesson;
use App\Models\Subject;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ApiSubjectController extends Controller
{
    public function index()
    {
        try {
            $subjects = Subject::paginate(9);

            $data = collect($subjects->items())->map(function ($subject){
                return [
                    'id' => $subject->id,
                    'code' => $subject->code,
                    'name' => $subject->name,
                    'description' => $subject->description,
                    'credit' => $subject->credit,
                    'status' => $subject->status ? "Đang hoạt động" : "Tạm dừng",
                ];
            }); 

            return response()->json([
                'data' => $data,
                'pagination' => [
                    'total' => $subjects->total(),
                    'per_page' => $subjects->perPage(),
                    'current_page' => $subjects->currentPage(),
                    'last_page' => $subjects->lastPage(),
                ]
            ], 200);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Không thể truy vấn tới bảng Subjects', 'message' => $e->getMessage()], 500);
        }
    }

    public function getAll()
    {
        try {
            $subjects = Subject::get();

            $data = $subjects->map(function ($subject) {
                return [
                    'id' => $subject->id,
                    'code' => $subject->code,
                    'name' => $subject->name,
                    'description' => $subject->description,
                    'credit' => $subject->credit,
                    'status' => $subject->status ? "Đang hoạt động" : "Tạm dừng",
                ];
            });
            return response()->json(['data' => $data], 200);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Không thể truy vấn tới bảng Subjects', 'message' => $e->getMessage()], 500);
        }
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'code' => 'required|string|max:50|unique:subjects', 
            'name' => 'required|string|max:100|unique:subjects', 
            'description' => 'nullable|string|max:255', 
            'credit' => 'required|integer|min:1|max:19',
            'status' => 'boolean',
            'majors' => 'required|array',
            'majors.*.id' => 'required|exists:majors,id',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 400);
        }

        try {
            $data = $validator->validated();
            $subject = Subject::create($data);

            $majors = collect($data['majors'])->mapWithKeys(function ($major) {
                return [$major['id'] => []];
            });
            
            $subject->majors()->sync($majors);
            
            return response()->json(['data' => $subject, 'message' => 'Tạo mới thành công'], 201);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Tạo mới thất bại', 'message' => $e->getMessage()], 500);
        }
    }

    public function show(string $id)
    {
        try {
            $subject = Subject::findOrFail($id);
            $data = [
                'id' => $subject->id,
                'code' => $subject->code,
                'name' => $subject->name,
                'description' => $subject->description,
                'credit' => $subject->credit,
                'status' => $subject->status ? "Đang hoạt động" : "Tạm dừng",
                'majors' => $subject->majors->map(function ($major) {
                    return [
                        'id' => $major->id,
                        'name' => $major->name,
                    ];
                }),
            ];

            return response()->json(['data' => $data], 200);
        } catch (ModelNotFoundException $e) {
            return response()->json(['error' => 'Không tìm thấy môn học với ID: ' . $id], 404);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Không thể truy vấn tới bảng Subjects', 'message' => $e->getMessage()], 500);
        }
    }

    public function update(Request $request, string $id)
    {
        $validator = Validator::make($request->all(), [
            'code' => 'sometimes|string|max:50|unique:subjects,code,' . $id, 
            'name' => 'sometimes|string|max:100|unique:subjects,name,' . $id, 
            'description' => 'nullable|string|max:255', 
            'credit' => 'sometimes|integer|min:1|max:19',
            'status' => 'sometimes|boolean',
            'majors' => 'sometimes|array',
            'majors.*.id' => 'sometimes|exists:majors,id',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 400);
        }

        try {
            $subject = Subject::findOrFail($id);
            
            $data = $validator->validated();
            $subject->update($data);

            if(isset($data['majors'])) {
                $majors = collect($data['majors'])->mapWithKeys(function ($major) {
                    return [$major['id'] => []];
                });
                
                $subject->majors()->sync($majors);
            }

            return response()->json(['data' => $subject, 'message' => 'Cập nhật thành công'], 200);
        } catch (ModelNotFoundException $e) {
            return response()->json(['error' => 'Không tìm thấy môn học với ID: ' . $id], 404);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Cập nhật thất bại', 'message' => $e->getMessage()], 500);
        }
    }

    public function destroy(string $id)
    {
        try {
            $subject = Subject::findOrFail($id);
            $subject->delete();
            return response()->json(['message' => 'Xóa mềm thành công'], 200);
        } catch (ModelNotFoundException $e) {
            return response()->json(['error' => 'Không tìm thấy môn học với ID: ' . $id], 404);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Xóa mềm thất bại', 'message' => $e->getMessage()], 500);
        }
    }

    public function getAllLesson(string $id){
        try {
            $lessons = Lesson::with('subject')->where('subject_id', $id)->get();

            $data = $lessons->map(function ($lesson){
                return [
                    'id' => $lesson->id,
                    'name' => $lesson->name,
                    'description' =>$lesson->description,
                ];
            });

            return response()->json(['data' =>$data], 200);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Không thể truy vấn tới bảng Lessons', 'message' => $e->getMessage()], 500);
        }
    }
    public function getAllClassroom(string $id){
        try {
            $classrooms = Classroom::with('subject')->where('subject_id', $id)->get();

            $data = $classrooms->map(function($classroom) {
                return [
                    'id' => $classroom->id,
                    'code' => $classroom->code,
                    'max_students' => $classroom->max_students,
                    'status' => $classroom->status ? "Đang hoạt động" : "Tạm dừng",
                ];
            });

            return response()->json(['data' =>$data], 200);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Không thể truy vấn tới bảng Classrooms', 'message' => $e->getMessage()], 500);
        }
    }
}
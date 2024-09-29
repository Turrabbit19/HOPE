<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Student;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ApiStudentController extends Controller
{
    public function index()
    {
        try {
            $students = Student::with(['user', 'course', 'major', 'currentSemester'])->paginate(9);
            
            $data = collect($students->items())->map(function($student){
                return [
                    'id' => $student->id,
                    'name' => $student->user->name,
                    'code' => $student->student_code,
                    'email' => $student->user->email,
                    'phone' => $student->user->phone,
                    'course' => $student->course->name,
                    'major' => $student->major->name,
                    'current_semester' => $student->currentSemester->order,
                    'status' => $student->status,
                ];
            });

            return response()->json([
                'data' => $data,
                'pagination' => [
                    'total' => $students->total(),
                    'per_page' => $students->perPage(),
                    'current_page' => $students->currentPage(),
                    'last_page' => $students->lastPage(),
                ]
            ], 200);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Không thể truy vấn tới bảng Students', 'message' => $e->getMessage()], 500);
        }
    }

    public function getAll()
    {
        try {
            $students = Student::with(['user', 'course', 'major', 'currentSemester'])->get();

            $data = $students->map(function($student) {
                return [
                    'id' => $student->id,
                    'name' => $student->user->name,
                    'code' => $student->student_code,
                    'email' => $student->user->email,
                    'phone' => $student->user->phone,
                    'course' => $student->course->name,
                    'major' => $student->major->name,
                    'current_semester' => $student->currentSemester->order,
                    'status' => $student->status,
                ];
            });
            return response()->json(['data' => $data], 200);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Không thể truy vấn tới bảng Students', 'message' => $e->getMessage()], 500);
        }
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'user_id' => 'required|exists:users,id',
            'course_id' => 'required|exists:courses,id',
            'major_id' => 'required|exists:majors,id',
            'current_semester_id' => 'required|exists:course_semesters,id', 
            'student_code' => 'required|string|max:19|unique:students',
            'status' => 'required|integer',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 400);
        }

        try {
            $data = $validator->validated();
            $student = Student::create($data);
            
            return response()->json(['data' => $student, 'message' => 'Tạo mới thành công'], 201);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Tạo mới thất bại', 'message' => $e->getMessage()], 500);
        }
    }

    public function show(string $id)
    {
        try {
            $student = Student::findOrFail($id);
            return response()->json(['data' => $student], 200);
        } catch (ModelNotFoundException $e) {
            return response()->json(['error' => 'Không tìm thấy id'], 404);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Không thể truy vấn tới bảng Students', 'message' => $e->getMessage()], 500);
        }
    }

    public function update(Request $request, string $id)
    {
        $validator = Validator::make($request->all(), [
            'user_id' => 'sometimes|exists:users,id',
            'course_id' => 'sometimes|exists:courses,id',
            'major_id' => 'sometimes|exists:majors,id',
            'current_semester_id' => 'sometimes|exists:course_semesters,id',
            'student_code' => 'sometimes|string|max:19|unique:students,student_code,' . $id,
            'status' => 'sometimes|integer',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 400);
        }

        try {
            $student = Student::findOrFail($id);
            
            $data = $validator->validated();
            $data['updated_at'] = Carbon::now();
            $student->update($data);

            return response()->json(['data' => $student, 'message' => 'Cập nhật thành công'], 200);
        } catch (ModelNotFoundException $e) {
            return response()->json(['error' => 'Không tìm thấy id'], 404);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Cập nhật thất bại', 'message' => $e->getMessage()], 500);
        }
    }

    public function destroy(string $id)
    {
        try {
            $student = Student::findOrFail($id);
            $student->delete();
            return response()->json(['message' => 'Xóa mềm thành công'], 200);
        } catch (ModelNotFoundException $e) {
            return response()->json(['error' => 'Không tìm thấy id'], 404);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Xóa mềm thất bại', 'message' => $e->getMessage()], 500);
        }
    }
}
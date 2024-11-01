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
            $students = Student::get();
            $data = $students->map(function ($student) {
                return [
                    'id' => $student->id,
                    'user_id' => $student->user_id,
                    'course_id' => $student->course_id,
                    'major_id' => $student->major_id,
                    'semester_id' => $student->semester_id,
                    'student_code' => $student->student_code,
                    'status' => $student->status,
                ];
            });
            return response()->json(['data' => $data], 200);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Không thể truy vấn tới bảng Students', 'message' => $e->getMessage()], 500);
        }
    }

    public function getAll()
    {
        try {
            $students = Student::select('id', 'user_id', 'course_id', 'major_id', 'semester_id', 'student_code', 'status')->get();
            return response()->json(['data' => $students], 200);
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
            'semester_id' => 'required|exists:semesters,id',
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
            'semester_id' => 'sometimes|exists:semesters,id',
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

    public function getStudentByMajorAndSemester($major_id, $current_semester)
    {
        try {
            $students = Student::with('major', 'semester')
                ->where('major_id', $major_id)
                ->where('current_semester', $current_semester)
                ->get();

            $data = $students->map(function ($student) {
                return [
                    'id' => $student->id,
                    'user_id' => $student->user_id,
                    'course_id' => $student->course->name,
                    'major_id' => $student->major->name,
                    'current_semester' => $student->current_semester,
                    'student_code' => $student->student_code,
                    'status' => $student->status,
                ];
            });

            return response()->json($data, 200);
        } catch (ModelNotFoundException $e) {
            return response()->json(['error' => 'Không tìm thấy học sinh nào thông qua ngành và kỳ'], 404);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Không thể truy vấn tới học sinh', 'message' => $e->getMessage()], 500);
        }
    }
}

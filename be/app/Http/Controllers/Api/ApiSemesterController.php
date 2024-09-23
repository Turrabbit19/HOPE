<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Semester;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ApiSemesterController extends Controller
{
    public function index()
    {

        try {
            $semesters = Semester::with('course')->get();

        $result = $semesters->map(function ($semester) {
            return [
                'id' => $semester->id,
                'name' => $semester->name,
                'course_id' => $semester->course_id,
                'course_name' => $semester->course->name,
                'start_date' => $semester->start_date,
                'end_date' => $semester->end_date,

            ];
        });
        return response()->json(['data' => $result], 200);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Không thể truy vấn tới bảng Semesters', 'message' => $e->getMessage()], 500);
        }
    }

    public function store(Request $request)
    {
        $semesterName = strtoupper($request->name);
        $existingSemester = Semester::where('name', $semesterName)->first();
        if($existingSemester){
            return response()->json(['message' => 'Tên kỳ học đã tồn tại'], 409);
        }
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255|unique:semesters',
            // 'number' => 'required|integer|min:1',
            'course_id' => 'required|exists:courses,id',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 400);
        }

        try {
            $data = $validator->validated();
            $semester = Semester::create($data);

            return response()->json(['data' => $semester, 'message' => 'Tạo mới thành công'], 201);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Tạo mới thất bại', 'message' => $e->getMessage()], 500);
        }
    }

    public function show(string $id)
    {
        try {
            $semester = Semester::findOrFail($id);
            return response()->json(['data' => $semester], 200);
        } catch (ModelNotFoundException $e) {
            return response()->json(['error' => 'Không tìm thấy id'], 404);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Không thể truy vấn tới bảng Semesters', 'message' => $e->getMessage()], 500);
        }
    }

    public function update(Request $request, string $id)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255|unique:semesters|sometimes',
            // 'number' => 'required|integer|min:1',
            'course_id' => 'required|exists:courses,id',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 400);
        }

        try {
            $semester = Semester::findOrFail($id);

            $data = $request->all();
            $data['updated_at'] = Carbon::now();
            $semester->update($data);

            return response()->json(['data' => $semester, 'message' => 'Cập nhật thành công'], 200);
        } catch (ModelNotFoundException $e) {
            return response()->json(['error' => 'Không tìm thấy id'], 404);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Cập nhật thất bại', 'message' => $e->getMessage()], 500);
        }
    }

    public function destroy(string $name)
    {
        try {
            $semester = Semester::where('name', $name)->firstOrFail();
            $semester->delete();
            return response()->json(['message' => 'Xóa mềm thành công'], 200);
        } catch (ModelNotFoundException $e) {
            return response()->json(['error' => 'Không tìm thấy id'], 404);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Xóa mềm thất bại', 'message' => $e->getMessage()], 500);
        }
    }
}

<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Classroom;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redis;
use Illuminate\Support\Facades\Validator;

class ApiClassroomController extends Controller
{
    public function index()
    {
        try {

            $classrooms = Classroom::with('subject')->paginate(10);


            $data = collect($classrooms->items())->map(function($classroom) {
                return [
                    'id' => $classroom->id,
                    'subject_name' => $classroom->subject->name,
                    'code' => $classroom->code,
                    'max_students' => $classroom->max_students,
                    'status' => $classroom->status ? "Đang hoạt động" : "Tạm dừng",
                ];
            });

            return response()->json([
                'data' => $data,
                'pagination' => [
                    'total' => $classrooms->total(),
                    'per_page' => $classrooms->perPage(),
                    'current_page' => $classrooms->currentPage(),
                    'last_page' => $classrooms->lastPage(),
                ]
            ], 200);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Không thể truy vấn tới bảng Classrooms', 'message' => $e->getMessage()], 500);
        }
    }


    public function getAll()
    {
        try {
            $classrooms = Classroom::get();


            $data = $classrooms->map(function ($classroom){
                return [
                    'id' => $classroom->id,
                    'subject_name' => $classroom->subject->name,
                    'code' => $classroom->code,
                    'max_students' => $classroom->max_students,
                    'status' => $classroom->status ? "Đang hoạt động" : "Tạm dừng",
                ];

            });

            return response()->json([
                'data' => $data
            ], 200);

        } catch (\Exception $e) {
            return response()->json(['error' => 'Không thể truy vấn tới bảng Classrooms', 'message' => $e->getMessage()], 500);
        }
    }

    public function getClassroomsWithoutSchedule($subjectId)
    {
        try {

            $today = Carbon::today();


            $classrooms = Classroom::where('subject_id', $subjectId)
                ->whereDoesntHave('schedules', function ($query) use ($subjectId) {
                    $query->where('subject_id', $subjectId);
                })
                ->orWhereHas('schedules', function ($query) use ($subjectId, $today) {
                    $query->where('subject_id', $subjectId)

                          ->where('end_date', '<', $today);
                })
                ->get();

            if ($classrooms->isEmpty()) {
                return response()->json([
                    'message' => 'Không có lớp học nào thỏa điều kiện.',
                ], 404);
            }


            return response()->json([
                'classrooms' => $classrooms
            ], 200);


        } catch (\Exception $e) {
            return response()->json(['error' => 'Có lỗi xảy ra', 'message' => $e->getMessage()], 500);
        }
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'subject_id' => 'required|exists:subjects,id',
            'code' => 'required|string|max:10|unique:classrooms',
            'max_students' => 'required|integer|min:1',
            'status' => 'boolean',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 400);
        }

        try {
            $data = $validator->validated();
            $classroom = Classroom::create($data);


            $data = [
                'id' => $classroom->id,
                'subject_id' => $classroom->subject->id,
                'subject_name' => $classroom->subject->name,
                'code' => $classroom->code,
                'max_students' => $classroom->max_students,
                'status' => $classroom->status,
            ];

            return response()->json(['data' => $data, 'message' => 'Tạo mới thành công'], 201);

        } catch (\Exception $e) {
            return response()->json(['error' => 'Tạo mới thất bại', 'message' => $e->getMessage()], 500);
        }

    }

    public function show(string $id)
    {
        try {
            $classroom = Classroom::with('subject')->findOrFail($id);
            $data = [
                    'subject_name' => $classroom->subject->name,
                    'code' => $classroom->code,
                    'max_students' => $classroom->max_students,
                    'status' => $classroom->status ? "Đang hoạt động" : "Tạm dừng",
                ];

            return response()->json(['data' => $data], 200);
        } catch (ModelNotFoundException $e) {
            return response()->json(['error' => 'Không tìm thấy lớp học với ID: ' . $id], 404);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Không thể truy vấn tới bảng Classrooms', 'message' => $e->getMessage()], 500);
        }
    }

    public function update(Request $request, string $id)
    {
        $validator = Validator::make($request->all(), [
            'subject_id' => 'sometimes|required|exists:subjects,id',
            'code' => 'sometimes|required|string|max:10|unique:classrooms,code,' . $id,
            'max_students' => 'sometimes|required|integer|min:1',
            'status' => 'boolean',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 400);
        }

        try {
            $classroom = Classroom::findOrFail($id);

            $data = $validator->validated();
            $classroom->update($data);

            return response()->json(['data' => $classroom, 'message' => 'Cập nhật thành công'], 200);
        } catch (ModelNotFoundException $e) {
            return response()->json(['error' => 'Không tìm thấy lớp học với ID: ' . $id], 404);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Cập nhật thất bại', 'message' => $e->getMessage()], 500);
        }
    }

    public function destroy(string $id)
{
    try {
        $classroom = Classroom::findOrFail($id);

        $subjectId = $classroom->subject_id;

        $classroom->delete();

        $cacheKey = 'classrooms_subject_' . $subjectId;
        Redis::del($cacheKey);

        return response()->json(['message' => 'Xóa mềm thành công'], 200);
    } catch (ModelNotFoundException $e) {
        return response()->json(['error' => 'Không tìm thấy lớp học với ID: ' . $id], 404);
    } catch (\Exception $e) {
        return response()->json(['error' => 'Xóa thất bại', 'message' => $e->getMessage()], 500);
    }
}

}

<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Classroom;
use App\Models\Schedule;
use App\Models\Semester;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ApiClassroomController extends Controller
{
    public function index()
    {
        try {
            $perPage = 10;

            $latestSemester = Semester::orderBy('end_date', 'desc')->first();
            $schedules = [];

            if ($latestSemester) {
                $schedules = Schedule::where('semester_id', $latestSemester->id)
                    ->pluck('classroom_id')->toArray();
            }

            $classroomsQuery = Classroom::with('subject');

            $classroomsQuery->orderByRaw("CASE WHEN id IN (" . implode(',', $schedules) . ") THEN 0 ELSE 1 END");

            $classrooms = $classroomsQuery->paginate($perPage);

            $classrooms->getCollection()->transform(function ($classroom) use ($schedules) {
                $scheduleExists = in_array($classroom->id, $schedules);

                return [
                    'id' => $classroom->id,
                    'subject_name' => $classroom->subject->name,
                    'code' => $classroom->code,
                    'max_students' => $classroom->max_students,
                    'status' => $scheduleExists ? "Đang có lịch học" : "Không có lịch học",
                    'has_schedule' => $scheduleExists
                ];
            });

            return response()->json([
                'data' => $classrooms->items(),
                'pagination' => [
                    'total' => $classrooms->total(),
                    'per_page' => $classrooms->perPage(),
                    'current_page' => $classrooms->currentPage(),
                    'last_page' => $classrooms->lastPage()
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

            $data = $classrooms->map(function ($classroom) {
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
            'name' => 'required|string|max:19|unique:rooms',
            'subject_id' => 'required|exists:subjects,id',
            'code' => 'required|string|max:10|unique:classrooms',
            'max_students' => 'required|integer|min:1',
            'status' => 'boolean',
        ], [
            'name.unique' => 'Tên phòng học đã tồn tại.',
            'subject_id.required' => 'Mã môn học là bắt buộc.',
            'subject_id.exists' => 'Mã môn học không tồn tại.',
            'code.required' => 'Mã lớp học là bắt buộc.',
            'code.unique' => 'Mã lớp học đã tồn tại.',
            'max_students.required' => 'Số lượng học viên tối đa là bắt buộc.',
            'max_students.integer' => 'Số lượng học viên tối đa phải là số nguyên.',
            'max_students.min' => 'Số lượng học viên tối đa phải lớn hơn hoặc bằng 1.',
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
        ], [
            'subject_id.required' => 'Mã môn học là bắt buộc.',
            'subject_id.exists' => 'Mã môn học không tồn tại.',
            'code.required' => 'Mã lớp học là bắt buộc.',
            'code.unique' => 'Mã lớp học đã tồn tại.',
            'code.max' => 'Mã lớp học không được vượt quá 10 ký tự.',
            'max_students.required' => 'Số lượng học viên tối đa là bắt buộc.',
            'max_students.integer' => 'Số lượng học viên tối đa phải là số nguyên.',
            'max_students.min' => 'Số lượng học viên tối đa phải lớn hơn hoặc bằng 1.',
            'status.boolean' => 'Trạng thái phải là giá trị true hoặc false.',
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
            $classroom->delete();

            return response()->json(['message' => 'Xóa mềm thành công'], 200);
        } catch (ModelNotFoundException $e) {
            return response()->json(['error' => 'Không tìm thấy lớp học với ID: ' . $id], 404);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Xóa thất bại', 'message' => $e->getMessage()], 500);
        }
    }
}

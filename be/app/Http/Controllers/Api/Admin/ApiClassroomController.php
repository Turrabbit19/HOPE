<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Classroom;
use App\Models\Schedule;
use App\Models\Semester;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Redis;
use Illuminate\Support\Facades\Validator;

class ApiClassroomController extends Controller
{
    public function index()
    {
        try {
            $perPage = 10;
            $cacheTTL = 300;
            $cacheKey = 'classrooms_index_page_' . request()->get('page', 1);

            $cachedData = Redis::get($cacheKey);
            if ($cachedData) {
                return response()->json(json_decode($cachedData, true), 200);
            }

            $latestSemester = Semester::orderBy('end_date', 'desc')->first();
            $schedules = $latestSemester ? Schedule::where('semester_id', $latestSemester->id)->pluck('classroom_id')->toArray() : [];

            $orderCondition = empty($schedules) ? "1" : "CASE WHEN id IN (" . implode(',', $schedules) . ") THEN 0 ELSE 1 END";

            $classrooms = Classroom::with('subject')
                ->orderByRaw($orderCondition)
                ->paginate($perPage);

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

            $responseData = [
                'data' => $classrooms->items(),
                'pagination' => [
                    'total' => $classrooms->total(),
                    'per_page' => $classrooms->perPage(),
                    'current_page' => $classrooms->currentPage(),
                    'last_page' => $classrooms->lastPage()
                ]
            ];

            Redis::setex($cacheKey, $cacheTTL, json_encode($responseData));

            return response()->json($responseData, 200);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Không thể truy vấn tới bảng Classrooms', 'message' => $e->getMessage()], 500);
        }
    }

    public function getAll()
    {
        try {
            $cacheKey = 'classrooms_all';
            $cacheTTL = 300;

            $cachedData = Redis::get($cacheKey);
            if ($cachedData) {
                return response()->json(['data' => json_decode($cachedData, true)], 200);
            }

            $classrooms = Classroom::with('subject')->get();

            $data = $classrooms->map(function ($classroom) {
                return [
                    'id' => $classroom->id,
                    'subject_name' => $classroom->subject->name,
                    'code' => $classroom->code,
                    'max_students' => $classroom->max_students,
                    'status' => $classroom->status ? "Đang hoạt động" : "Tạm dừng",
                ];
            });

            Redis::setex($cacheKey, $cacheTTL, json_encode($data));

            return response()->json(['data' => $data], 200);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Không thể truy vấn tới bảng Classrooms', 'message' => $e->getMessage()], 500);
        }
    }

    public function getClassroomsWithoutSchedule($subjectId)
    {
        try {
            $today = Carbon::today();

            $classrooms = Classroom::where('subject_id', $subjectId)
                ->whereDoesntHave('schedules', function ($query) use ($today) {
                    $query->where('end_date', '>=', $today);
                })
                ->get();

            return response()->json(['classrooms' => $classrooms], 200);
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
            DB::transaction(function () use ($request) {
                $data = $request->validated();
                $classroom = Classroom::create($data);

                $this->updateClassroomsCache();
            });

            return response()->json(['message' => 'Tạo mới thành công'], 201);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Tạo mới thất bại', 'message' => $e->getMessage()], 500);
        }
    }

    public function show(string $id)
    {
        try {
            $classroom = Classroom::with('subject')->findOrFail($id);

            return response()->json([
                'data' => [
                    'subject_name' => $classroom->subject->name,
                    'code' => $classroom->code,
                    'max_students' => $classroom->max_students,
                    'status' => $classroom->status ? "Đang hoạt động" : "Tạm dừng",
                ]
            ], 200);
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
            DB::transaction(function () use ($request, $id) {
                $classroom = Classroom::findOrFail($id);

                $data = $request->validated();
                $classroom->update($data);

                $this->updateClassroomsCache();
            });

            return response()->json(['message' => 'Cập nhật thành công'], 200);
        } catch (ModelNotFoundException $e) {
            return response()->json(['error' => 'Không tìm thấy lớp học với ID: ' . $id], 404);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Cập nhật thất bại', 'message' => $e->getMessage()], 500);
        }
    }

    public function destroy(string $id)
    {
        try {
            DB::transaction(function () use ($id) {
                $classroom = Classroom::with('schedules')->findOrFail($id);

                if ($classroom->schedules()->exists()) {
                    throw new \Exception('Không thể xóa lớp học vì vẫn còn lịch học liên kết.');
                }

                $classroom->delete();
                $this->updateClassroomsCache();
            });

            return response()->json(['message' => 'Xóa lớp học thành công'], 200);
        } catch (ModelNotFoundException $e) {
            return response()->json(['error' => 'Không tìm thấy lớp học với ID: ' . $id], 404);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Không thể xóa lớp học.', 'message' => $e->getMessage()], 500);
        }
    }

    private function updateClassroomsCache()
    {
        Redis::del('classrooms_all');
        $this->clearPaginatedCache('classrooms_index_page_');
    }

    private function clearPaginatedCache(string $prefix)
    {
        $keys = Redis::keys($prefix . '*');
        foreach ($keys as $key) {
            Redis::del($key);
        }
    }
}

<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Course;
use App\Models\CourseSemester;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ApiCourseController extends Controller
{
    public function index()
    {
        try {
            $courses = Course::get();

            $now = Carbon::now();

            $data = $courses->map(function ($course) use ($now) {
                $currentSemester = $course->semesters()
                    ->where('start_date', '<=', $now)
                    ->where('end_date', '>=', $now)
                    ->first();

                $semesterOrder = $currentSemester ? $currentSemester->pivot->order : null;

                if ($now->lt(Carbon::parse($course->start_date))) {
                    $status = "Chờ diễn ra";
                } elseif ($now->between(Carbon::parse($course->start_date), Carbon::parse($course->end_date))) {
                    $status = "Đang diễn ra";
                } elseif ($now->gt(Carbon::parse($course->end_date))) {
                    $status = "Kết thúc";
                }


                return [
                    'id' => $course->id,
                    'name' => $course->name,
                    'start_date' => Carbon::parse($course->start_date),
                    'end_date' => Carbon::parse($course->end_date),
                    'status' => $status,
                    'semester_order' => $semesterOrder,
                ];
            });


            return response()->json(['data' => $data], 200);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Không thể truy vấn tới bảng Courses', 'message' => $e->getMessage()], 500);
        }

    public function getSemestersByCourse($courseId)
    {
        try {
            $semestersByCourse = CourseSemester::where('course_id', $courseId)

            ->with('semester')

            ->get();

            $data = $semestersByCourse->map(function($value){
                return [
                    "id" => $value->semester->id,
                    "name" => $value->semester->name,
                    "start_date" => Carbon::parse($value->semester->start_date),
                    "end_date" => Carbon::parse($value->semester->end_date),
                    "order" => "Kì học thứ"." ".$value->order
                ];
            });

        return response()->json(["semesters" => $data], 200);
        } catch (ModelNotFoundException $e) {
            return response()->json(['error' => 'Không tìm thấy khóa học với ID: ' . $courseId], 404);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Không thể truy vấn tới bảng CourseSemester', 'message' => $e->getMessage()], 500);
        }
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:10|unique:courses',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 400);
        }

        try {
            $data = $validator->validated();
            $course = Course::create($data);

            return response()->json(['data' => $course, 'message' => 'Tạo mới thành công'], 201);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Tạo mới thất bại', 'message' => $e->getMessage()], 500);
        }
    }

    public function show(string $id)
    {
        try {
            $course = Course::with('plan')->findOrFail($id);
            $now = Carbon::now();

            if ($now->lt(Carbon::parse($course->start_date))) {

                $status = "Chờ diễn ra";
            } elseif ($now->between(Carbon::parse($course->start_date), Carbon::parse($course->end_date))) {
                $status = "Đang diễn ra";
            } elseif ($now->gt(Carbon::parse($course->end_date))) {
                $status = "Kết thúc";

            }

            $data = [
                    'id' => $course->id,
                    'name' => $course->name,

                    'start_date' => Carbon::parse($course->start_date),
                    'end_date' => Carbon::parse($course->end_date),

                    'status' => $status
                ];

            return response()->json(['data' => $data], 200);
        } catch (ModelNotFoundException $e) {
            return response()->json(['error' => 'Không tìm thấy khóa học với ID: ' . $id], 404);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Không thể truy vấn tới bảng Courses', 'message' => $e->getMessage()], 500);
        }
    }

    public function update(Request $request, string $id)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'sometimes|string|max:50|unique:courses,name,' . $id,
            'start_date' => 'sometimes|date',
            'end_date' => 'sometimes|date|after_or_equal:start_date',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 400);
        }

        try {
            $course = Course::findOrFail($id);
            $data = $validator->validated();

            $course->update($data);

            return response()->json(['data' => $course, 'message' => 'Cập nhật thành công'], 200);
        } catch (ModelNotFoundException $e) {
            return response()->json(['error' => 'Không tìm thấy khóa học với ID: ' . $id], 404);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Cập nhật thất bại', 'message' => $e->getMessage()], 500);
        }
    }

    public function destroy(string $id)
    {
        try {
            $course = Course::findOrFail($id);
            $course->delete();

            return response()->json(['message' => 'Xóa mềm thành công'], 200);
        } catch (ModelNotFoundException $e) {
            return response()->json(['error' => 'Không tìm thấy khóa học với ID: ' . $id], 404);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Xóa mềm thất bại', 'message' => $e->getMessage()], 500);
        }
    }

    public function restore(string $id)
    {
        try {
            $course = Course::withTrashed()->findOrFail($id);

            if (!$course->trashed()) {
                return response()->json(['error' => 'Khóa học này chưa bị xóa.'], 400);
            }

            $course->restore();

            return response()->json(['data' => $course, 'message' => 'Khôi phục thành công.'], 200);
        } catch (ModelNotFoundException $e) {
            return response()->json(['error' => 'Không tìm thấy khóa học với ID: ' . $id], 404);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Khôi phục thất bại', 'message' => $e->getMessage()], 500);
        }
    }


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
    public function getSemestersByCourse($courseId)
    {
        try {
            $semesters = CourseSemester::where('course_id', $courseId)
            ->with('semester') 
            ->get()
            ->sortBy(function ($value) {
                return $value->semester->start_date; 
            });

            if ($semesters->isEmpty()) {
                return response()->json(['error' => 'Không tìm thấy kỳ học nào cho khóa học với ID: ' . $courseId], 404);
            }

            $data = $semesters->map(function($value){
                return [
                    "id" => $value->semester->id,
                    "name" => $value->semester->name,
                    "order" => "Kì hiện tại"." ".$value->order
                ];
            });

        return response()->json(["semesters" => $data->values()], 200);
        } catch (ModelNotFoundException $e) {
            return response()->json(['error' => 'Không tìm thấy khóa học với ID: ' . $courseId], 404);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Không thể truy vấn tới bảng CourseSemester', 'message' => $e->getMessage()], 500);
        }
    }
    
    public function index()
    {
        try {
            $courses = Course::with('plan')->get();

            $data = $courses->map(function ($course) {
                return [
                    'id' => $course->id,
                    'name' => $course->name,
                    'plan' => $course->plan->name,
                    'start_date' => Carbon::parse($course->start_date)->format('d/m/Y'),
                    'end_date' => Carbon::parse($course->end_date)->format('d/m/Y'),
                    'status' => match($course->status) {
                        "0" => "Chờ diễn ra",
                        "1" => "Đang diễn ra",
                        "2" => "Kết thúc",
                        default => "Không xác định",
                    },
                ];
            });
            return response()->json(['data' => $data], 200);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Không thể truy vấn tới bảng Courses', 'message' => $e->getMessage()], 500);
        }
    }

    public function getSemestersByCourse($courseId)
    {
        try {
            $semestersByCourse = CourseSemester::where('course_id', $courseId)
            ->with('semester') 
            ->get();
        
            if ($semestersByCourse->isEmpty()) {
                return response()->json(['error' => 'Không tìm thấy kỳ học nào cho khóa học với ID: ' . $courseId], 404);
            }

            $data = $semestersByCourse->map(function($value){
                return [
                    "id" => $value->semester->id,
                    "name" => $value->semester->name,
                    "start_date" => Carbon::parse($value->semester->start_date)->format('d/m/Y'),
                    "end_date" => Carbon::parse($value->semester->end_date)->format('d/m/Y'),
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
            'name' => 'required|string|max:50|unique:courses',
            'plan_id' => 'required|exists:plans,id',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 400);
        }

        try {
            $data = $validator->validated();
            if($data['start_date'] >= Carbon::now()) {

            }
            elseif($data['start_date'] <= Carbon::now() && Carbon::now() <= $data['end_date']) {
                $data['status'] = "1";
            } else {
                $data['status'] = "2";
            }

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
            $data = [
                    'id' => $course->id,
                    'name' => $course->name,
                    'plan' => $course->plan->name,
                    'start_date' => Carbon::parse($course->start_date)->format('d/m/Y'),
                    'end_date' => Carbon::parse($course->end_date)->format('d/m/Y'),
                    'status' => match($course->status) {
                        "0" => "Chờ diễn ra",
                        "1" => "Đang diễn ra",
                        "2" => "Kết thúc",
                        default => "Không xác định",
                    },
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
            'plan_id' => 'sometimes|exists:plans,id',
            'start_date' => 'sometimes|date',
            'end_date' => 'sometimes|date|after_or_equal:start_date',
            'status' => 'sometimes|integer|in:0,1,2',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 400);
        }

        try {
            $course = Course::findOrFail($id);
            
            $data = $validator->validated();
            if(isset($data['start_date'])) {
                if($data['start_date'] >= Carbon::now()) {

                }
                elseif($data['start_date'] <= Carbon::now() && Carbon::now() <= $data['end_date']) {
                    $data['status'] = "1";
                } else {
                    $data['status'] = "2";
                }
            }

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
}
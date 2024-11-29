<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Course;

use App\Models\Major;
use App\Models\MajorSubject;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ApiSyllabusController extends Controller
{
    public function getSubjectsFromOrder(string $majorId)
{
    try {
        $basicId = 1;

        $subjects = MajorSubject::whereIn('major_id', [$majorId, $basicId])
            ->with('subject')
            ->get()
            ->groupBy('subject.order')
            ->map(function ($subjects, $order) {
                $totalCredit = $subjects->sum(function ($majorSubject) {
                    return $majorSubject->subject->credit;
                });

                return [
                    'order' => $order,
                    'total_credit' => $totalCredit,
                    'subjects' => $subjects->map(function ($majorSubject) {
                        $subject = $majorSubject->subject;
                        return [
                            'id' => $subject->id,
                            'code' => $subject->code,
                            'name' => $subject->name,
                            'credit' => $subject->credit,
                            'description' => $subject->description,
                            'status' => $subject->status,
                        ];
                    })->values()
                ];
            })
            ->values();

        if ($subjects->isEmpty()) {
            return response()->json([
                'success' => false,
                'error' => 'Không tìm thấy môn học cho ngành với ID: ' . $majorId
            ], 404);
        }

        return response()->json($subjects, 200);
    } catch (ModelNotFoundException $e) {
        return response()->json(['error' => 'Không tìm thấy ngành học với ID: ' . $majorId], 404);
    } catch (\Exception $e) {
        return response()->json(['error' => "Không thể truy cập vào bảng Majors", 'message' => $e->getMessage()], 500);
    }
}


    public function getCoursesByMajor($majorId)
    {
        try {
            $currentDate = Carbon::now();

            $courses = Course::whereHas('students.majors', function ($query) use ($majorId) {
                $query->where('major_id', $majorId);
            })
                ->where('start_date', '<=', $currentDate)
                ->where('end_date', '>=', $currentDate)
                ->withCount('students')
                ->get();

            $data = $courses->map(function ($course) {
                return [
                    'id' => $course->id,
                    'name' => $course->name,
                    'start_date' => Carbon::parse($course->start_date)->format('d/m/Y'),
                    'end_date' => Carbon::parse($course->end_date)->format('d/m/Y'),
                    'student_count' => $course->students_count,
                ];
            });

            if ($data->isEmpty()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Không có khóa học nào đang hoạt động cho ngành với ID: ' . $majorId
                ], 404);
            }

            return response()->json([
                'success' => true,
                'data' => $data
            ], 200);
        } catch (ModelNotFoundException $e) {
            return response()->json([
                'error' => 'Không tìm thấy ngành với ID: ' . $majorId
            ], 404);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Không thể truy vấn tới bảng Courses',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    public function getMajorAndSubMajor()
    {
        try {
            $mainMajors = Major::where('main', 1)->get();

            $currentDate = Carbon::now();

            $data = $mainMajors->map(function ($mm) use ($currentDate) {
                $courses = Course::whereHas('students.majors', function ($query) use ($mm) {
                    $query->where('major_id', $mm->id);
                })
                    ->where('start_date', '<=', $currentDate)
                    ->where('end_date', '>=', $currentDate)
                    ->withCount('students')
                    ->get();

                $courseData = $courses->isEmpty() ? [] : $courses->map(function ($course) {
                    return [
                        'id' => $course->id,
                        'name' => $course->name,
                    ];
                });

                return [
                    'id' => $mm->id,
                    'code' => $mm->code,
                    'name' => $mm->name,
                    'children' => $mm->children->map(function ($child) use ($courseData) {
                        return [
                            'id' => $child->id,
                            'code' => $child->code,
                            'name' => $child->name,
                            'courses' => $courseData,
                        ];
                    }),
                ];
            });

            return response()->json( $data, 200);

        } catch (\Exception $e) {
            return response()->json(['error' => 'Không thể truy vấn tới bảng Majors hoặc Courses', 'message' => $e->getMessage()], 500);
        }
    }
}

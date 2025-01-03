<?php

namespace App\Http\Controllers\api\admin;

use App\Http\Controllers\Controller;
use App\Models\Course;
use App\Models\Major;
use App\Models\Schedule;
use App\Models\Semester;
use App\Models\Student;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class StatisticsController extends Controller
{

    public function getStudentStatistics(Request $request)
    {
        try {
            $year = $request->input('year');

            $query = Student::select('course_id')
                ->groupBy('course_id');

            if ($year) {
                $query->whereHas('course', function ($query) use ($year) {
                    $query->whereYear('start_date', $year);
                });
            }

            $statistics = $query->get();

            $result = $statistics->mapWithKeys(function ($stat) {
                $courseName = Course::find($stat->course_id)->name;
                $studentCount = Student::where('course_id', $stat->course_id)->count();

                return [$stat->course_id => ['course_name' => $courseName, 'student_count' => $studentCount]];
            });

            return response()->json($result);
        } catch (Exception $e) {
            return response()->json(['error' => 'An error occurred: ' . $e->getMessage()], 500);
        }
    }


    public function getStudentCountByMajorInCourse(Request $request, string $id)
    {
        try {
            $year = $request->input('year');  // Lọc theo năm
            $semesterId = $request->input('semester_id');  // Lọc theo kỳ học

            $majorsWithCounts = Major::whereHas('students', function ($query) use ($id, $year, $semesterId) {
                $query->where('course_id', $id);

                // Lọc theo năm nếu có tham số year
                if ($year) {
                    $query->whereHas('course', function ($query) use ($year) {
                        $query->whereYear('start_date', $year);
                    });
                }

                // Lọc theo kỳ học nếu có tham số semester_id
                if ($semesterId) {
                    $query->whereHas('course', function ($query) use ($semesterId) {
                        $query->where('semester_id', $semesterId);
                    });
                }
            })
                ->withCount([
                    'students' => function ($query) use ($id, $year, $semesterId) {
                        $query->where('course_id', $id);

                        // Lọc theo năm nếu có tham số year
                        if ($year) {
                            $query->whereHas('course', function ($query) use ($year) {
                                $query->whereYear('start_date', $year);
                            });
                        }

                        // Lọc theo kỳ học nếu có tham số semester_id
                        if ($semesterId) {
                            $query->whereHas('course', function ($query) use ($semesterId) {
                                $query->where('semester_id', $semesterId);
                            });
                        }
                    }
                ])
                ->where('main', 1)
                ->get();

            $result = $majorsWithCounts->map(function ($major) {
                return [
                    'major_id' => $major->id,
                    'major_name' => $major->name,
                    'student_count' => $major->students_count,
                ];
            });

            return response()->json($result);
        } catch (Exception $e) {
            return response()->json(['error' => 'An error occurred: ' . $e->getMessage()], 500);
        }
    }

    public function getStudentandTeacherCountByMajorInCourse()
    {
        try {
            $currentDate = now();

            $majorsWithCounts = Major::whereHas('students', function ($query) use ($currentDate) {
                $query->join('courses', 'courses.id', '=', 'students.course_id')
                    ->whereDate('courses.start_date', '<=', $currentDate)
                    ->whereDate('courses.end_date', '>=', $currentDate);
            })
                ->where('main', 1)
                ->orWhere('id', 1)
                ->withCount([
                    'students' => function ($query) use ($currentDate) {
                        $query->join('courses', 'courses.id', '=', 'students.course_id')
                            ->whereDate('courses.start_date', '<=', $currentDate)
                            ->whereDate('courses.end_date', '>=', $currentDate);
                    },
                    'teachers'
                ])
                ->get();

            $result = $majorsWithCounts->map(function ($major) {
                return [
                    'major_id' => $major->id,
                    'major_name' => $major->name,
                    'student_count' => $major->students_count,
                    'teacher_count' => $major->teachers_count,
                ];
            });

            return response()->json($result);
        } catch (Exception $e) {
            return response()->json(['error' => 'An error occurred: ' . $e->getMessage()], 500);
        }
    }

    public function statisticSubMajors($majorId)
    {
        try {
            $currentDate = now();
            $majorsWithCounts = Major::where('major_id', $majorId) // Chắc chắn rằng majorId được tìm kiếm chính xác
                ->whereHas('students', function ($query) use ($currentDate) {
                    $query->join('courses', 'courses.id', '=', 'students.course_id')
                        ->whereDate('courses.start_date', '<=', $currentDate)
                        ->whereDate('courses.end_date', '>=', $currentDate);
                })
                ->withCount([
                    'students' => function ($query) use ($currentDate) {
                        $query->join('courses', 'courses.id', '=', 'students.course_id')
                            ->whereDate('courses.start_date', '<=', $currentDate)
                            ->whereDate('courses.end_date', '>=', $currentDate);
                    },
                    'teachers'
                ])
                ->get();

            $result = $majorsWithCounts->map(function ($major) {
                return [
                    'major_id' => $major->id,
                    'major_name' => $major->name,
                    'student_count' => $major->students_count,
                ];
            });

            return response()->json($result);
        } catch (Exception $e) {
            return response()->json(['error' => 'An error occurred: ' . $e->getMessage()], 500);
        }
    }


    public function getMajorsByCourse($courseId)
    {
        try {
            $majorStats = Major::where('main', 1)->orWhere('id', 1)->withCount(['students' => function ($query) use ($courseId) {
                $query->where('course_id', $courseId);
            }])
                ->having('students_count', '>', 0)
                ->get(['id', 'name']);

            foreach ($majorStats as $major) {
                if (strtolower($major->name) === 'cơ bản') {
                    $major->name = 'Tổng sinh viên';
                }
            }

            return response()->json($majorStats, 200);
        } catch (Exception $e) {
            Log::error('Error retrieving majors by course: ' . $e->getMessage());
            return response()->json(['error' => 'Lỗi khi lấy dữ liệu'], 500);
        }
    }

    public function getClassrooms(Request $request)
    {
        try {
            $semesterId = $request->input('semester_id');

            $query = Schedule::query();

            if ($semesterId) {
                $query->where('semester_id', $semesterId);
            }

            $classroomCount = $query->whereHas('students')
                ->distinct('classroom_id')
                ->count('classroom_id');

            return response()->json([
                'semester' => $semesterId ? Semester::find($semesterId)->name : 'Tất cả các kỳ học',
                'total_classrooms' => $classroomCount,
            ], 200);
        } catch (Exception $e) {
            Log::error('Error fetching classroom statistics: ' . $e->getMessage());
            return response()->json(['error' => 'Đã xảy ra lỗi: ' . $e->getMessage()], 500);
        }
    }
}

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

    public function getStudentStatistics()
    {
        try {
            $statistics = Student::whereIn('course_id', Course::pluck('id'))
                ->select('course_id')
                ->groupBy('course_id')
                ->get();

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
    public function getStudentCountByMajorInCourse(string $id)
    {
        try {
            $majorsWithCounts = Major::whereHas('students', function ($query) use ($id) {
                $query->where('course_id', $id);
            })
                ->withCount([
                    'students' => function ($query) use ($id) {
                        $query->where('course_id', $id);
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

    public function getClassrooms()
    {
        try {
            $latestSemester = Semester::orderBy('start_date', 'desc')->first();

            if (!$latestSemester) {
                return response()->json(['message' => 'Không tìm thấy kỳ học nào'], 404);
            }

            $classroomCount = Schedule::where('semester_id', $latestSemester->id)
                ->whereHas('students')
                ->distinct('classroom_id')
                ->count('classroom_id');

            return response()->json([
                'latest_semester' => $latestSemester->name,
                'total_classrooms' => $classroomCount,
            ], 200);
        } catch (Exception $e) {
            Log::error('Error fetching classroom statistics: ' . $e->getMessage());
            return response()->json(['error' => 'An error occurred: ' . $e->getMessage()], 500);
        }
    }
}

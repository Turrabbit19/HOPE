<?php

namespace App\Http\Controllers\api\admin;

use App\Http\Controllers\Controller;
use App\Models\Course;
use App\Models\Major;
use App\Models\Student;
use App\Models\StudentMajor;
use Exception;
use Illuminate\Http\Request;

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

            $majorsWithCounts = Major::whereHas('students', function ($query) use ($currentDate) {
                $query->join('courses', 'courses.id', '=', 'students.course_id')
                    ->whereDate('courses.start_date', '<=', $currentDate)
                    ->whereDate('courses.end_date', '>=', $currentDate);
            })
                ->where('major_id', $majorId)
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
}

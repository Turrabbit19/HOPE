<?php

namespace App\Http\Controllers\api\admin;

use App\Http\Controllers\Controller;
use App\Models\Course;
use App\Models\Major;
use App\Models\Student;
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
            $studentCounts = Student::where('course_id', $id)
                ->join('student_majors', 'students.id', '=', 'student_majors.student_id')
                ->join('majors', 'student_majors.major_id', '=', 'majors.id')
                ->where('majors.main', 1)
                ->select('majors.id as major_id', 'majors.name as major_name', \DB::raw('count(students.id) as student_count'))
                ->groupBy('majors.id', 'majors.name')
                ->get();

            return response()->json($studentCounts);

        } catch (Exception $e) {
            return response()->json(['error' => 'An error occurred: ' . $e->getMessage()], 500);
        }
    }
}

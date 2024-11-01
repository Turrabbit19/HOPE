<?php

namespace App\Http\Controllers\Api\Student;

use App\Http\Controllers\Controller;
use App\Models\CourseSemester;
use App\Models\NotificationCourse;
use App\Models\Schedule;
use App\Models\Student;
use App\Models\StudentClassroom;
use App\Models\StudentNotification;
use App\Models\StudentSchedule;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Support\Facades\Auth;

class ApiClientController extends Controller
{
    public function getStudentDetail()
    {
        $user = Auth::user();

        try {
            $student = Student::with(['user', 'course', 'major'])->where('user_id', $user->id)->firstOrFail();
            
            $data = [
                'id' => $student->id,
                'avatar' => $student->user->avatar,
                'name' => $student->user->name,
                'email' => $student->user->email,
                'phone' => $student->user->phone,
                'dob' => Carbon::parse($student->user->dob)->format('d/m/Y'),
                'gender' => $student->user->gender ? "Nam" : "Nữ",
                'ethnicity' => $student->user->ethnicity,
                'address' => $student->user->address,
                
                'student_code' => $student->student_code,
                'course_name' => $student->course->name,
                'major_name' => $student->major->name,
                'current_semester' => $student->current_semester,
                'status' => match($student->status) {
                    "0" => "Đang học",
                    "1" => "Bảo lưu",
                    "2" => "Hoàn thành",
                    default => "Không xác định"
                },
            ];

            return response()->json(['data' => $data], 200);
        } catch (ModelNotFoundException $e) {
            return response()->json(['error' => 'Không tìm thấy thông tin cho sinh viên đã đăng nhập.'], 404);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Không thể truy vấn tới bảng Students', 'message' => $e->getMessage()], 500);
        }
    }

    public function getSchedules()
    {
        $user = Auth::user();

        try {
            $student = Student::where('user_id', $user->id)->firstOrFail();

            $courseId = $student->course_id;
            $majorId = $student->major_id;

            $courseSemester = CourseSemester::where('course_id', $courseId)
            ->where('order', $student->current_semester)
            ->firstOrFail();

            $semesterId = $courseSemester->semester_id;

            $schedules = Schedule::where('course_id', $courseId)
            ->where('semester_id', $semesterId)->where('major_id', $majorId)
            ->get();

            $data = $schedules->map(function ($schedule) {
                return [
                    'id' => $schedule->id,
                    'course_name' => $schedule->course->name,
                    'semester_name' => $schedule->semester->name,
                    'major_name' => $schedule->major->name,
                    'subject_name' => $schedule->subject->name,
                    'teacher_name' => $schedule->teacher->name,
                    'shift_name' => $schedule->shift->name,
                    'room_name' => $schedule->room->name,
                    'link' => $schedule->link ? $schedule->link : "NULL",
                    'start_date' => Carbon::parse($schedule->start_date)->format('d/m/Y'),
                    'end_date' => Carbon::parse($schedule->end_date)->format('d/m/Y'),
                    'days_of_week' => $schedule->days->map(function($day) {
                        return [
                            "Thứ" => $day->id,
                        ];
                    }),
                ];
            });

            return response()->json(['data' => $data], 200);
        } catch (ModelNotFoundException $e) {
            return response()->json(['error' => 'Không tìm thấy thông tin cho sinh viên đã đăng nhập.'], 404);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Không thể truy vấn tới bảng Students', 'message' => $e->getMessage()], 500);
        }
    }

    public function registerSchedule($id) {
        $user = Auth::user();

        try {
            $student = Student::where('user_id', $user->id)->firstOrFail();

            $checkrSchedule = StudentSchedule::where('student_id', $student->id)
            ->where('schedule_id', $id)
            ->first();

            if($checkrSchedule) {
                return response()->json(['message' => 'Bạn đã đăng ký rồi, vui lòng không đăng ký lại'], 409);
            }

            $rschedule = StudentSchedule::create([
                    'student_id' => $student->id,
                    'schedule_id' => $id
                ]);
            
                
            StudentClassroom::create([
                'student_id' => $student->id,
                'classroom_id' => $rschedule->schedule->classroom_id
            ]);

            $data = [
                    'id' => $rschedule->id,
                    'course_name' => $rschedule->schedule->course->name,
                    'semester_name' => $rschedule->schedule->semester->name,
                    'major_name' => $rschedule->schedule->major->name,
                    'subject_name' => $rschedule->schedule->subject->name,
                    'teacher_name' => $rschedule->schedule->teacher->name,
                    'shift_name' => $rschedule->schedule->shift->name,
                    'room_name' => $rschedule->schedule->room->name,
                    'link' => $rschedule->schedule->link ? $rschedule->link : "NULL",
                    'start_date' => Carbon::parse($rschedule->schedule->start_date)->format('d/m/Y'),
                    'end_date' => Carbon::parse($rschedule->schedule->end_date)->format('d/m/Y'),
                    'days_of_week' => $rschedule->schedule->days->map(function($day) {
                        return [
                            "Thứ" => $day->id,
                        ];
                    }),
                ];

            return response()->json(['message' => 'Đăng ký thành công', 'data' => $data], 200);
        } catch (ModelNotFoundException $e) {
            return response()->json(['error' => 'Không tìm thấy thông tin cho sinh viên đã đăng nhập.'], 404);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Không thể truy vấn tới bảng Students', 'message' => $e->getMessage()], 500);
        }
    }
}

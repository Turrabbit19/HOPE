<?php

namespace App\Http\Controllers\Api\Student;

use App\Http\Controllers\Controller;
use App\Models\Course;
use App\Models\CourseSemester;
use App\Models\PlanSubject;
use App\Models\Schedule;
use App\Models\Student;
use App\Models\StudentClassroom;
use App\Models\StudentSchedule;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Support\Facades\Auth;

class StudentController extends Controller
{
    public function getStudentDetail()
    {
        $user = Auth::user();

        try {
            $student = Student::with(['user', 'course', 'major'])->where('user_id', $user->id)->firstOrFail();
            
            $data = [
                'avatar' => $student->user->avatar,
                'name' => $student->user->name,
                'student_code' => $student->student_code,
                'course_name' => $student->course->name,
                'major_name' => $student->major->name,
                'current_semester' => $student->current_semester,

                'email' => $student->user->email,
                'phone' => $student->user->phone,
                'dob' => Carbon::parse($student->user->dob)->format('d/m/Y'),
                'gender' => $student->user->gender ? "Nam" : "Nữ",
                'ethnicity' => $student->user->ethnicity,
                'address' => $student->user->address,
                
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

    public function getSubjects() 
    {
        $user = Auth::user();

        try {
            $student = Student::where('user_id', $user->id)->firstOrFail();

            $courseId = $student->course_id;
            $majorId = $student->major_id; 

            $planId = Course::where('id', $courseId)->value('plan_id');

            $subjects = PlanSubject::where('plan_id', $planId)->where('semester_order', $student->current_semester)
                        ->join('major_subjects', 'plan_subjects.major_subject_id', '=', 'major_subjects.id')
                        ->join('subjects', 'major_subjects.subject_id', '=', 'subjects.id')
                        ->where('major_subjects.major_id', $majorId)
                        ->select('subjects.code', 'subjects.name', 'subjects.credit')
                        ->get();

            $listSubjects = $subjects->map(function ($ls) {
                return [
                    'code' => $ls->code,
                    'name' => $ls->name,
                    'credit' => $ls->credit,
                ];
            });

            return response()->json(['data' => $listSubjects], 200);
        } catch (ModelNotFoundException $e) {
            return response()->json(['error' => 'Không tìm thấy thông tin cho sinh viên đã đăng nhập.'], 404);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Không thể truy vấn tới bảng Students', 'message' => $e->getMessage()], 500);
        }
    }

    public function getClassrooms(string $subjectid, string $shiftId)
    {
        try {
            $schedules = Schedule::where('subject_id', $subjectid)
            ->where('shift_id', $shiftId)
            ->where('end_date', '>=', Carbon::now())
            ->get();

            $data = $schedules->map(function ($schedule) {
                return [
                    'id' => $schedule->id,
                    'classroom' => $schedule->classroom->code,
                    'room' => $schedule->room->name ? $schedule->room->name : "NULL",
                    'link' => $schedule->link ? $schedule->link : "NULL",
                    'start_date' => Carbon::parse($schedule->start_date)->format('d/m/Y'),
                    'days_of_week' => $schedule->days->map(function($day) {
                        return [
                            "Thứ" => $day->id,
                        ];
                    }),
                    'students' => $schedule->classroom->students->count(),
                    'max_students' => $schedule->classroom->max_students, 
                ];
            });

            return response()->json(['data' => $data], 200);
        } catch (ModelNotFoundException $e) {
            return response()->json(['error' => 'Không tìm thấy thông tin cho sinh viên đã đăng nhập.'], 404);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Không thể truy vấn tới bảng Students', 'message' => $e->getMessage()], 500);
        }
    }
    
    public function registerSchedule($id) 
    {
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

    public function getTimetable() 
    {
        $user = Auth::user();

        try {
            $student = Student::where('user_id', $user->id)->firstOrFail();

            $timetable = StudentSchedule::where('student_id', $student->id)
            ->get();

            $data = $timetable->map(function($tt) {
                return [
                    'id' => $tt->schedule->id,
                    'subject_name' => $tt->schedule->subject->name,
                    'teacher_name' => $tt->schedule->teacher->user->name,
                    'shift_name' => $tt->schedule->shift->name,
                    'room_name' => $tt->schedule->room->name ?? "Null",
                    'link' => $tt->schedule->link ?? "Null",
                    'start_date' => Carbon::parse($tt->schedule->start_date)->format('d/m/Y'),
                    'end_date' => Carbon::parse($tt->schedule->end_date)->format('d/m/Y'),
                    'schedule_lessons' => $tt->schedule->lessons->map(function ($lesson) {
                        return [
                            'name' => $lesson->name,
                            'date' => Carbon::parse($lesson->pivot->study_date)->format('d/m/Y'),
                            'status' => Carbon::parse($lesson->pivot->study_date)->lt(Carbon::now()) ? "Đã học" : "Chưa học",
                        ];
                    }),
                ];
            });

            return response()->json(['data' => $data], 200);
        } catch (ModelNotFoundException $e) {
            return response()->json(['error' => 'Không tìm thấy thông tin cho sinh viên đã đăng nhập.'], 404);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Không thể truy vấn tới bảng Schedule', 'message' => $e->getMessage()], 500);
        }
    }
}

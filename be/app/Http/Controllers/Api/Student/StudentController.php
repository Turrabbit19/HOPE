<?php

namespace App\Http\Controllers\Api\Student;

use App\Http\Controllers\Controller;
use App\Models\Course;
use App\Models\Schedule;
use App\Models\Shift;
use App\Models\Student;
use App\Models\StudentClassroom;
use App\Models\StudentMajor;
use App\Models\StudentSchedule;
use App\Models\StudyDay;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class StudentController extends Controller
{
    public function getStudentDetail()
    {
        $user = Auth::user();

        try {
            $student = Student::with(['user', 'course'])->where('user_id', $user->id)->firstOrFail();
            
            $major = StudentMajor::where('status', 1)->firstOrFail();
            
            $data = [
                'avatar' => $student->user->avatar,
                'name' => $student->user->name,
                'student_code' => $student->student_code,
                'course_name' => $student->course->name,
                'major_name' => $major->major->name,
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
    
            $registeredSubjects = StudentSchedule::where('student_id', $student->id)
                ->join('schedules', 'schedules.id', '=', 'student_schedules.schedule_id')
                ->pluck('schedules.subject_id')
                ->toArray();
    
            $subjects = StudentMajor::where('student_majors.student_id', $student->id)
                ->join('majors', 'majors.id', '=', 'student_majors.major_id')
                ->join('major_subjects', 'major_subjects.major_id', '=', 'majors.id')
                ->join('subjects', 'subjects.id', '=', 'major_subjects.subject_id')
                ->where('subjects.order', $student->current_semester)
                ->whereNotIn('subjects.id', $registeredSubjects) 
                ->select('subjects.id', 'subjects.code', 'subjects.name', 'subjects.credit')
                ->get();
    
            $listSubjects = $subjects->map(function ($subject) {
                return [
                    'id' => $subject->id,
                    'code' => $subject->code,
                    'name' => $subject->name,
                    'credit' => $subject->credit,
                ];
            });
    
            return response()->json(['subjects' => $listSubjects], 200);
    
        } catch (ModelNotFoundException $e) {
            return response()->json(['error' => 'Không tìm thấy thông tin cho sinh viên đã đăng nhập.'], 404);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Không thể truy vấn tới bảng Students',
                'message' => $e->getMessage()
            ], 500);
        }
    }
    
    
    public function getShifts() 
    {
        try {
            $shifts = Shift::all();

            $listShifts = $shifts->map(function ($shift) {
                return [
                    'id' => $shift->id,
                    'name' => $shift->name,
                    'start_time' => Carbon::parse($shift->start_time)->format('H:i'), 
                    'end_time' => Carbon::parse($shift->end_time)->format('H:i'),     
                ];
            });

            return response()->json(['shifts' => $listShifts], 200);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Không thể truy vấn tới bảng Shifts', 'message' => $e->getMessage()], 500);
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
                $studentsCount = $schedule->classroom->students->count();
                $maxStudents = $schedule->classroom->max_students;
                
                $status = ($studentsCount >= $maxStudents) ? 'Đã đầy' : 'Còn chỗ';

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
                    'students' => $studentsCount,
                    'max_students' => $maxStudents,
                    'status' => $status,
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
    
            if (StudentSchedule::where('student_id', $student->id)->where('schedule_id', $id)->exists()) {
                return response()->json(['message' => 'Bạn đã đăng ký rồi, vui lòng không đăng ký lại'], 409);
            }
    
            $newSchedule = Schedule::with('days')->findOrFail($id);
    
            $newScheduleDays = StudyDay::where('schedule_id', $id)->pluck('day_id')->toArray();
            $newScheduleShift = $newSchedule->shift_id;
    
            $registeredSchedules = StudentSchedule::where('student_id', $student->id)
                ->with(['schedule.days', 'schedule.shift'])
                ->get();
    
            foreach ($registeredSchedules as $rSchedule) {
                $existingSchedule = $rSchedule->schedule;
                $existingDays = $existingSchedule->days->pluck('id')->toArray();
                $existingShift = $existingSchedule->shift_id;
    
                if (
                    !empty(array_intersect($newScheduleDays, $existingDays)) && 
                    $newScheduleShift === $existingShift
                ) {
                    return response()->json([
                        'message' => 'Lịch học này bị trùng ca và ngày học với lịch học của môn ' . $existingSchedule->subject->name,
                        'conflict_schedule' => [
                            'course_name' => $existingSchedule->course->name,
                            'subject_name' => $existingSchedule->subject->name,
                            'start_date' => $existingSchedule->start_date,
                            'end_date' => $existingSchedule->end_date,
                            'shift_name' => $existingSchedule->shift->name,
                            'conflict_days' => array_intersect($newScheduleDays, $existingDays),
                        ]
                    ], 409);
                }
            }
    
            $rschedule = StudentSchedule::create([
                'student_id' => $student->id,
                'schedule_id' => $id
            ]);
    
            StudentClassroom::create([
                'student_id' => $student->id,
                'classroom_id' => $newSchedule->classroom_id,
                'study_date' => $newSchedule->start_date
            ]);
    
            $data = [
                'id' => $rschedule->id,
                'course_name' => $newSchedule->course->name,
                'semester_name' => $newSchedule->semester->name,
                'major_name' => $newSchedule->major->name,
                'subject_name' => $newSchedule->subject->name,
                'shift_name' => $newSchedule->shift->name,
                'room_name' => $newSchedule->room->name,
                'link' => $newSchedule->link ?? 'NULL',
                'start_date' => Carbon::parse($newSchedule->start_date)->format('d/m/Y'),
                'end_date' => Carbon::parse($newSchedule->end_date)->format('d/m/Y'),
                'days_of_week' => $newSchedule->days->map(fn($day) => ["Thứ" => $day->id]),
            ];
    
            return response()->json(['message' => 'Đăng ký thành công', 'data' => $data], 200);
        } catch (ModelNotFoundException $e) {
            return response()->json(['error' => 'Không tìm thấy thông tin cho sinh viên đã đăng nhập.'], 404);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Không thể xử lý yêu cầu',
                'message' => $e->getMessage()
            ], 500);
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
<?php

namespace App\Http\Controllers\Api\Teacher;

use App\Http\Controllers\Controller;
use App\Models\CourseSemester;
use App\Models\Schedule;
use App\Models\StudentClassroom;
use App\Models\Teacher;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Support\Facades\Auth;

class TeacherController extends Controller
{
    public function getTeacherDetail()
    {
        $user = Auth::user();

        try {
            $teacher = Teacher::with(['user', 'major'])->where('user_id', $user->id)->firstOrFail();
            
            $data = [
                'avatar' => $teacher->user->avatar,
                'name' => $teacher->user->name,
                'teacher_code' => $teacher->teacher_code,
                'major_name' => $teacher->major->name,

                'email' => $teacher->user->email,
                'phone' => $teacher->user->phone,
                'dob' => Carbon::parse($teacher->user->dob)->format('d/m/Y'),
                'gender' => $teacher->user->gender ? "Nam" : "Nữ",
                'ethnicity' => $teacher->user->ethnicity,
                'address' => $teacher->user->address,
                
                'status' => match($teacher->status) {
                    "0" => "Đang dạy",
                    "1" => "Tạm dừng",
                    "2" => "Kết thúc",
                    default => "Không xác định"
                },
            ];

            return response()->json(['data' => $data], 200);
        } catch (ModelNotFoundException $e) {
            return response()->json(['error' => 'Không tìm thấy thông tin cho giảng viên đã đăng nhập.'], 404);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Không thể truy vấn tới bảng Teachers', 'message' => $e->getMessage()], 500);
        }
    }

    public function getSchedules()
    {
        $user = Auth::user();

        try {
            $teacher = Teacher::where('user_id', $user->id)->firstOrFail();

            $schedules = Schedule::where('teacher_id', $teacher->id)
            ->where('end_date', '>=', Carbon::now())
            ->get();

            $data = $schedules->map(function ($schedule) {
                return [
                    'id' => $schedule->id,
                    'classroom' => $schedule->classroom->code,
                    'course_name' => $schedule->course->name,
                    'semester_name' => $schedule->semester->name,
                    'major_name' => $schedule->major->name,
                    'subject_name' => $schedule->subject->name,
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
            return response()->json(['error' => 'Không tìm thấy thông tin cho giảng viên đã đăng nhập.'], 404);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Không thể truy vấn tới bảng Teachers', 'message' => $e->getMessage()], 500);
        }
    }
    
    public function getDetailSchedule(string $scheduleId) {
        $user = Auth::user();

        try {
            $teacher = Teacher::where('user_id', $user->id)->firstOrFail();

            $scheduleInfor = Schedule::where('teacher_id', $teacher->id)
            ->where('id', $scheduleId)
            ->firstOrFail();

            $data = [
                'classroom' => $scheduleInfor->classroom->code,
                'subject_name' => $scheduleInfor->subject->name,
                'shift_name' => $scheduleInfor->shift->name,
                'room_name' => $scheduleInfor->room->name ?? "Null",
                'link' => $scheduleInfor->link ?? "Null",
                'start_date' => Carbon::parse($scheduleInfor->start_date)->format('d/m/Y'),
                'end_date' => Carbon::parse($scheduleInfor->end_date)->format('d/m/Y'),
                'schedule_lessons' => $scheduleInfor->lessons->map(function ($lesson) {
                    return [
                        'name' => $lesson->name,
                        'description' => $lesson->description,
                        'date' => Carbon::parse($lesson->pivot->study_date)->format('d/m/Y'),
                        'status' => Carbon::parse($lesson->pivot->study_date)->lt(Carbon::now()) ? "Đã học" : "Chưa học",
                    ];
                }),
            ];

            return response()->json(['ScheduleInfor' => $data], 200);
        } catch (ModelNotFoundException $e) {
            return response()->json(['error' => 'Không tìm thấy thông tin cho giảng viên đã đăng nhập.'], 404);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Không thể truy vấn tới bảng Teachers', 'message' => $e->getMessage()], 500);
        }
    }

    public function getDetailClassroom(string $scheduleId) {
        $user = Auth::user();

        try {
            $teacher = Teacher::where('user_id', $user->id)->firstOrFail();

            $scheduleInfor = Schedule::where('teacher_id', $teacher->id)
            ->where('id', $scheduleId)
            ->firstOrFail();

            $classroomId = $scheduleInfor->classroom->id;

            $listStudents = StudentClassroom::where('classroom_id', $classroomId)->get();

            if($listStudents) {
                $data = $listStudents->map(function ($ls) {
                    return [
                        'name' => $ls->student->user->name
                    ];
                });

                return response()->json(['ListStudents' => $data], 200);
            } else {
                return response()->json(['message' => 'Hiện chưa có học sinh nào trong lớp này'], 200);
            }
        } catch (ModelNotFoundException $e) {
            return response()->json(['error' => 'Không tìm thấy thông tin cho giảng viên đã đăng nhập.'], 404);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Không thể truy vấn tới bảng Teachers', 'message' => $e->getMessage()], 500);
        }    
    }
}
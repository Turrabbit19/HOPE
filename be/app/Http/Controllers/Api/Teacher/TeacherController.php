<?php

namespace App\Http\Controllers\Api\Teacher;

use App\Http\Controllers\Controller;
use App\Models\Schedule;
use App\Models\ScheduleLesson;
use App\Models\Semester;
use App\Models\StudentClassroom;
use App\Models\StudentLesson;
use App\Models\Teacher;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

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

                'status' => match ($teacher->status) {
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
                ->with('days', 'shift', 'room', 'classroom', 'course', 'semester', 'major', 'subject')
                ->get();

            $currentDateTime = Carbon::now();
            $carbonDayOfWeek = $currentDateTime->dayOfWeek;

            $currentDayOfWeek = $carbonDayOfWeek === 0 ? 1 : $carbonDayOfWeek + 1;

            $data = $schedules->map(function ($schedule) use ($currentDateTime, $currentDayOfWeek) {
                $todayHasSchedule = $schedule->days
                    ->pluck('id')
                    ->contains($currentDayOfWeek);

                $status = null;

                if ($todayHasSchedule) {
                    $shiftStart = Carbon::parse($schedule->shift->start_time);
                    $shiftEnd = Carbon::parse($schedule->shift->end_time);

                    if ($currentDateTime < $shiftStart) {
                        $status = "Sắp tới (Bắt đầu lúc: " . $shiftStart->format('H:i') . ")";
                    } elseif ($currentDateTime > $shiftEnd) {
                        $status = "Đã hoàn thành (Kết thúc lúc: " . $shiftEnd->format('H:i') . ")";
                    } else {
                        $status = "Đang diễn ra (Bắt đầu lúc: " . $shiftStart->format('H:i') . ")";
                    }
                } else {
                    $status = "Không có lịch hôm nay";
                }

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
                    'days_of_week' => $schedule->days->sortBy('id')->map(fn($day) => ["Thứ" => $day->id])->values()->toArray(),
                    'schedule_status' => $status,
                ];
            });

            return response()->json(['data' => $data], 200);
        } catch (ModelNotFoundException $e) {
            return response()->json(['error' => 'Không tìm thấy thông tin cho giảng viên đã đăng nhập.'], 404);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Không thể truy vấn tới bảng Teachers', 'message' => $e->getMessage()], 500);
        }
    }

    public function getTimetable()
    {
        $user = Auth::user();

        try {
            $teacher = Teacher::where('user_id', $user->id)->firstOrFail();

            $timetable = Schedule::where('teacher_id', $teacher->id)
                ->where('end_date', '>=', Carbon::now())
                ->get();

            $data = $timetable->map(function ($tt) {
                return [
                    'id' => $tt->id,
                    'classroom_code' => $tt->classroom->code,
                    'subject_name' => $tt->subject->name,
                    'shift_name' => $tt->shift->name,
                    'room_name' => $tt->room->name ?? "Null",
                    'link' => $tt->link ?? "Null",
                    'start_date' => Carbon::parse($tt->start_date)->format('d/m/Y'),
                    'end_date' => Carbon::parse($tt->end_date)->format('d/m/Y'),
                    'schedule_lessons' => $tt->lessons->map(function ($lesson) use ($tt) {
                        $lessonDateTime = Carbon::parse($lesson->pivot->study_date)
                            ->setTimeFrom(Carbon::parse($tt->shift->start_time));

                        $currentDateTime = now();

                        if ($currentDateTime < $lessonDateTime) {
                            $status = "Chưa tới";
                        } elseif ($currentDateTime >= $lessonDateTime && $currentDateTime <= $lessonDateTime->copy()->addMinutes($tt->shift->duration)) {
                            $status = "Đang giảng dạy";
                        } else {
                            $status = "Đã kết thúc";
                        }

                        return [
                            'name' => $lesson->name,
                            'description' => $lesson->description,
                            'date' => Carbon::parse($lesson->pivot->study_date)->format('d/m/Y'),
                            'status' => $status,
                        ];
                    }),
                ];
            });

            return response()->json(['data' => $data], 200);
        } catch (ModelNotFoundException $e) {
            return response()->json(['error' => 'Không tìm thấy thông tin cho giảng viên đã đăng nhập.'], 404);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Không thể truy vấn tới bảng Schedules', 'message' => $e->getMessage()], 500);
        }
    }

    public function getSemesterForTeacher()
    {
        $user = Auth::user();

        try {
            $teacher = Teacher::where('user_id', $user->id)->firstOrFail();

            $semesters = Semester::all();

            $data = $semesters->map(function ($sm) {
                return [
                    'id' => $sm->id,
                    'name' => $sm->name,
                    'start_date' => Carbon::parse($sm->start_date)->format('d/m/Y'),
                    'end_date' => Carbon::parse($sm->end_date)->format('d/m/Y'),
                ];
            });

            return response()->json(['data' => $data], 200);
        } catch (ModelNotFoundException $e) {
            return response()->json(['error' => 'Không tìm thấy thông tin cho giảng viên đã đăng nhập.'], 404);
        }
    }
    public function getTimetableBySemesterForTeacher(string $semesterId)
    {
        $user = Auth::user();

        try {
            $teacher = Teacher::where('user_id', $user->id)->firstOrFail();

            $semester = Semester::findOrFail($semesterId);
            $semesterStartDate = Carbon::parse($semester->start_date);
            $semesterEndDate = Carbon::parse($semester->end_date);

            $timetable = Schedule::where('teacher_id', $teacher->id)
                ->whereBetween('start_date', [$semesterStartDate, $semesterEndDate])
                ->whereBetween('end_date', [$semesterStartDate, $semesterEndDate])
                ->get();

            $data = $timetable->map(function ($tt) {
                return [
                    'id' => $tt->id,
                    'subject_name' => $tt->subject->name,
                    'classroom_code' => $tt->classroom->code,
                    'shift_name' => $tt->shift->name,
                    'room_name' => $tt->room->name ?? "Null",
                    'link' => $tt->link ?? "Null",
                    'start_date' => Carbon::parse($tt->start_date)->format('d/m/Y'),
                    'end_date' => Carbon::parse($tt->end_date)->format('d/m/Y'),
                    'schedule_lessons' => $tt->lessons->map(function ($lesson) use ($tt) {
                        $lessonDateTime = Carbon::parse($lesson->pivot->study_date)
                            ->setTimeFrom(Carbon::parse($tt->shift->start_time));

                        $currentDateTime = now();

                        if ($currentDateTime < $lessonDateTime) {
                            $status = "Chưa tới";
                        } elseif ($currentDateTime >= $lessonDateTime && $currentDateTime <= $lessonDateTime->copy()->addMinutes($tt->shift->duration)) {
                            $status = "Đang giảng dạy";
                        } else {
                            $status = "Đã kết thúc";
                        }

                        return [
                            'name' => $lesson->name,
                            'description' => $lesson->description,
                            'date' => Carbon::parse($lesson->pivot->study_date)->format('d/m/Y'),
                            'status' => $status,
                        ];
                    }),
                ];
            });

            return response()->json(['data' => $data], 200);
        } catch (ModelNotFoundException $e) {
            return response()->json(['error' => 'Không tìm thấy thông tin cho giảng viên đã đăng nhập hoặc kỳ học không tồn tại.'], 404);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Không thể truy vấn tới bảng Schedule', 'message' => $e->getMessage()], 500);
        }
    }


    public function getDetailSchedule(string $scheduleId)
    {
        $user = Auth::user();

        try {
            $teacher = Teacher::where('user_id', $user->id)->firstOrFail();

            $scheduleInfor = Schedule::where('teacher_id', $teacher->id)
                ->where('id', $scheduleId)
                ->firstOrFail();

            $now = Carbon::now();
            $shiftStartTime = Carbon::parse($scheduleInfor->shift->start_time);
            $shiftEndTime = Carbon::parse($scheduleInfor->shift->end_time);

            $isCurrentShift = $now->between($shiftStartTime, $shiftEndTime);

            $data = [
                'id' => $scheduleInfor->id,
                'classroom' => $scheduleInfor->classroom->code,
                'subject_name' => $scheduleInfor->subject->name,
                'shift_name' => $scheduleInfor->shift->name,
                'room_name' => $scheduleInfor->room->name ?? "Null",
                'link' => $scheduleInfor->link ?? "Null",
                'start_date' => Carbon::parse($scheduleInfor->start_date)->format('d/m/Y'),
                'end_date' => Carbon::parse($scheduleInfor->end_date)->format('d/m/Y'),
                'schedule_lessons' => $scheduleInfor->lessons->map(function ($lesson) use ($now, $shiftEndTime, $isCurrentShift) {
                    $studyDate = Carbon::parse($lesson->pivot->study_date);

                    if ($studyDate->isToday()) {
                        if ($isCurrentShift) {
                            $status = "Đang dạy";
                        } elseif ($now->gt($shiftEndTime)) {
                            $status = "Đã hoàn thành";
                        } else {
                            $status = "Chưa hoàn thành";
                        }
                    } elseif ($studyDate->lt($now)) {
                        $status = "Đã hoàn thành";
                    } else {
                        $status = "Chưa hoàn thành";
                    }

                    return [
                        'id' => $lesson->id,
                        'name' => $lesson->name,
                        'description' => $lesson->description,
                        'date' => $studyDate->format('d/m/Y'),
                        'status' => $status,
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

    public function getDetailsClassroom(string $scheduleId)
    {
        $user = Auth::user();

        try {
            $teacher = Teacher::where('user_id', $user->id)->firstOrFail();

            $scheduleInfor = Schedule::where('teacher_id', $teacher->id)
                ->where('id', $scheduleId)
                ->with('shift')
                ->firstOrFail();

            $classroomId = $scheduleInfor->classroom->id;
            $shiftEndTime = Carbon::parse($scheduleInfor->shift->end_time);

            $listStudents = StudentClassroom::where('classroom_id', $classroomId)->get();

            if ($listStudents->isEmpty()) {
                return response()->json(['message' => 'Hiện chưa có học sinh nào trong lớp này'], 200);
            }

            $lessons = ScheduleLesson::where('schedule_id', $scheduleId)
                ->orderBy('study_date', 'asc')
                ->get();

            $currentDateTime = now();

            $data = $listStudents->map(function ($ls) use ($lessons, $shiftEndTime, $currentDateTime) {
                $attendedCount = 0;
                $absentCount = 0;
                $absentDetails = [];
                $upcomingLessons = 0;

                foreach ($lessons as $lesson) {
                    $lessonEndTime = Carbon::parse($lesson->study_date)->setTimeFrom($shiftEndTime);

                    if ($lessonEndTime <= $currentDateTime) {
                        $attendance = StudentLesson::where('student_id', $ls->student_id)
                            ->where('lesson_id', $lesson->lesson_id)
                            ->first();

                        if ($attendance) {
                            if ($attendance->status == 1) {
                                $attendedCount++;
                            } else {
                                $absentCount++;
                                $absentDetails[] = [
                                    'lesson_id' => $lesson->lesson_id,
                                    'study_date' => Carbon::parse($lesson->study_date)->format('d/m/Y'),
                                    'status' => 'Vắng'
                                ];
                            }
                        } else {
                            $absentCount++;
                            $absentDetails[] = [
                                'lesson_id' => $lesson->lesson_id,
                                'study_date' => Carbon::parse($lesson->study_date)->format('d/m/Y'),
                                'status' => 'Vắng'
                            ];
                        }
                    } else {
                        $upcomingLessons++;
                        $absentDetails[] = [
                            'lesson_id' => $lesson->lesson_id,
                            'study_date' => Carbon::parse($lesson->study_date)->format('d/m/Y'),
                            'status' => 'Chưa rõ'
                        ];
                    }
                }

                return [
                    'student_id' => $ls->student->id,
                    'student_name' => $ls->student->user->name,
                    'student_avatar' => $ls->student->user->avatar,
                    'student_code' => $ls->student->student_code,
                    'total_lessons' => $lessons->count(),
                    'attended_lessons' => $attendedCount,
                    'absent_lessons' => $absentCount,
                    'upcoming_lessons' => $upcomingLessons,
                    'absent_details' => $absentDetails,
                ];
            });

            return response()->json(['ListStudents' => $data], 200);
        } catch (ModelNotFoundException $e) {
            return response()->json(['error' => 'Không tìm thấy thông tin cho giảng viên đã đăng nhập.'], 404);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Không thể truy vấn tới bảng Teachers',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    public function getDetailClassroom(string $scheduleId, $lessonId)
    {
        $user = Auth::user();

        try {
            $teacher = Teacher::where('user_id', $user->id)->firstOrFail();

            $scheduleInfor = Schedule::where('teacher_id', $teacher->id)
                ->where('id', $scheduleId)
                ->with('shift')
                ->firstOrFail();

            $currentDateTime = now();
            $lesson = ScheduleLesson::where('schedule_id', $scheduleId)
                ->where('lesson_id', $lessonId)
                ->firstOrFail();

            $shiftStartTime = Carbon::parse($scheduleInfor->shift->start_time);
            $shiftEndTime = Carbon::parse($scheduleInfor->shift->end_time);

            $lessonStartTime = Carbon::parse($lesson->study_date)->setTimeFrom($shiftStartTime);

            if ($currentDateTime < $lessonStartTime) {
                return response()->json(['message' => 'Chưa đến giờ học.'], 400);
            }

            $classroomId = $scheduleInfor->classroom->id;
            $listStudents = StudentClassroom::where('classroom_id', $classroomId)
                ->where('study_start', '<=', now())
                ->where('study_end', '>=', now())
                ->get();

            if ($listStudents->isEmpty()) {
                return response()->json(['message' => 'Hiện chưa có học sinh nào trong lớp này'], 200);
            }

            $data = [
                'lesson_id' => $lesson->lesson_id,
                'study_date' => Carbon::parse($lesson->study_date)->format('d/m/Y'),
                'ListStudents' => $listStudents->map(function ($ls) use ($lessonId) {
                    $studentId = $ls->student->id;

                    $attendance = StudentLesson::where('student_id', $studentId)
                        ->where('lesson_id', $lessonId)
                        ->first();

                    if ($attendance && $attendance->status == 1) {
                        $status = 'Có mặt';
                    } else {
                        $status = 'Vắng';
                    }

                    return [
                        'student_id' => $studentId,
                        'student_avatar' => $ls->student->user->avatar,
                        'student_code' => $ls->student->student_code,
                        'student_name' => $ls->student->user->name,
                        'status' => $status,
                    ];
                }),
            ];

            return response()->json($data, 200);
        } catch (ModelNotFoundException $e) {
            return response()->json(['error' => 'Không tìm thấy thông tin cho giảng viên đã đăng nhập.'], 404);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Không thể truy vấn tới bảng Teachers',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    public function markAttendance(Request $request, $schedule_id, $lesson_id)
    {
        $user = Auth::user();

        try {
            $teacher = Teacher::where('user_id', $user->id)->firstOrFail();

            $data = $request->validate([
                'attendance' => 'required|array',
                'attendance.*.student_id' => 'required|exists:students,id',
                'attendance.*.status' => 'required|in:0,1',
            ]);

            $attendanceData = $data['attendance'];

            $schedule = Schedule::where('teacher_id', $teacher->id)
                ->where('id', $schedule_id)
                ->firstOrFail();

            $lesson = ScheduleLesson::where('schedule_id', $schedule_id)
                ->where('lesson_id', $lesson_id)
                ->firstOrFail();

            $currentDateTime = now();
            $lessonStartTime = Carbon::parse($lesson->study_date)->setTimeFrom($schedule->shift->start_time);
            $lessonEndTime = $lessonStartTime->copy()->addMinutes(15);

            if ($currentDateTime < $lessonStartTime || $currentDateTime > $lessonEndTime) {
                return response()->json(['message' => 'Chỉ có thể điểm danh trong 15 phút đầu buổi học.'], 400);
            }

            DB::beginTransaction();

            foreach ($attendanceData as $attendance) {
                $studentId = $attendance['student_id'];
                $status = $attendance['status'];

                $studentLesson = StudentLesson::where('student_id', $studentId)
                    ->where('lesson_id', $lesson_id)
                    ->first();

                if ($studentLesson) {
                    $studentLesson->status = $status;
                    $studentLesson->save();
                } elseif ($status == 1) {
                    StudentLesson::create([
                        'student_id' => $studentId,
                        'lesson_id' => $lesson_id,
                        'status' => $status,
                    ]);
                }
            }

            DB::commit();

            return response()->json(['message' => 'Điểm danh thành công.'], 200);
        } catch (ModelNotFoundException $e) {
            return response()->json(['error' => 'Không tìm thấy thông tin cho giảng viên đã đăng nhập.'], 404);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'error' => 'Lỗi khi điểm danh.',
                'message' => $e->getMessage()
            ], 500);
        }
    }
}

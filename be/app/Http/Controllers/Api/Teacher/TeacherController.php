<?php

namespace App\Http\Controllers\Api\Teacher;

use App\Http\Controllers\Controller;
use App\Models\Schedule;
use App\Models\ScheduleLesson;
use App\Models\Semester;
use App\Models\StudentClassroom;
use App\Models\StudentLesson;
use App\Models\Teacher;
use App\Models\User;
use Carbon\Carbon;
use Exception;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redis;
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
                $studentsCount = $schedule->classroom->students->count();
                $maxStudents = $schedule->classroom->max_students;
                $minStudents = (int) ($maxStudents * 0.7);

                $status = null;
                if ($studentsCount < $minStudents) {
                    $status = "Đang chờ xếp lớp";
                } else {
                    $scheduleStartDate = Carbon::parse($schedule->start_date);
                    $scheduleEndDate = Carbon::parse($schedule->end_date);

                    if ($currentDateTime < $scheduleStartDate) {
                        $status = "Chưa tới thời gian bắt đầu lịch";
                    } elseif ($currentDateTime > $scheduleEndDate) {
                        $status = "Đã kết thúc lịch";
                    } else {
                        $todayHasSchedule = $schedule->days->contains(fn($day) => $day->id === $currentDayOfWeek);
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
                    }
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
                    'link' => $schedule->link ?? "NULL",
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

            $lastestSemester = Semester::orderByDesc('start_date')->firstOrFail();

            $timetable = Schedule::where('teacher_id', $teacher->id)
                ->where('semester_id', $lastestSemester->id)
                ->with(['classroom', 'subject', 'shift', 'room', 'lessons'])
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
                        if (!isset($lesson->pivot) || !isset($lesson->pivot->study_date)) {
                            return null;
                        }

                        $lessonDate = Carbon::parse($lesson->pivot->study_date);
                        $shiftStartTime = Carbon::parse($tt->shift->start_time);
                        $shiftEndTime = Carbon::parse($tt->shift->end_time);

                        $currentDateTime = now();

                        if ($lessonDate->isToday()) {
                            $status = match (true) {
                                $currentDateTime->lt($shiftStartTime) => "Chưa tới",
                                $currentDateTime->between($shiftStartTime, $shiftEndTime) => "Đang giảng dạy",
                                default => "Đã kết thúc",
                            };
                        } else {
                            $status = $currentDateTime->lt($lessonDate) ? "Chưa tới" : "Đã kết thúc";
                        }

                        return [
                            'name' => $lesson->name ?? "Chưa cập nhật",
                            'description' => $lesson->description ?? "Không có mô tả",
                            'date' => $lessonDate->format('d/m/Y'),
                            'status' => $status,
                        ];
                    })->filter(),
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

            $semesters = Schedule::where('teacher_id', $teacher->id)->get();

            $data = $semesters->map(function ($sm) {
                return [
                    'id' => $sm->semester->id,
                    'name' => $sm->semester->name,
                    'start_date' => Carbon::parse($sm->semester->start_date)->format('d/m/Y'),
                    'end_date' => Carbon::parse($sm->semester->end_date)->format('d/m/Y'),
                ];
            })->unique('id')
                ->values();

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

            $schedules = Schedule::where('semester_id', $semesterId)
                ->where('teacher_id', $teacher->id)
                ->with(['classroom.students', 'subject', 'shift', 'room', 'lessons'])
                ->get();
            $data = $schedules->map(function ($tt) {
                $classroom = $tt->classroom;

                if (!$classroom || !$classroom->students) {
                    return null;
                }

                $studentsCount = $classroom->students->count();
                $maxStudents = $classroom->max_students;
                $minStudents = (int) ($maxStudents * 0.7);

                if ($studentsCount < $minStudents) {
                    return null;
                }

                return [
                    'id' => $tt->id,
                    'subject_name' => $tt->subject->name,
                    'classroom_code' => $tt->classroom->code,
                    'shift_name' => $tt->shift->name,
                    'shift_id' => $tt->shift->id,
                    'room_name' => $tt->room->name ?? "Null",
                    'link' => $tt->link ?? "Null",
                    'start_date' => Carbon::parse($tt->start_date)->format('d/m/Y'),
                    'end_date' => Carbon::parse($tt->end_date)->format('d/m/Y'),
                    'schedule_lessons' => $tt->lessons->map(function ($lesson) use ($tt) {
                        if (!isset($lesson->pivot) || !isset($lesson->pivot->study_date)) {
                            return null;
                        };

                        $lessonDate = Carbon::parse($lesson->pivot->study_date);
                        $shiftStartTime = Carbon::parse($tt->shift->start_time);
                        $shiftEndTime = Carbon::parse($tt->shift->end_time);

                        $currentDateTime = now();

                        if ($lessonDate->isToday()) {
                            $status = match (true) {
                                $currentDateTime->lt($shiftStartTime) => "Chưa tới",
                                $currentDateTime->between($shiftStartTime, $shiftEndTime) => "Đang giảng dạy",
                                default => "Đã kết thúc",
                            };
                        } else {
                            $status = $currentDateTime->lt($lessonDate) ? "Chưa tới" : "Đã kết thúc";
                        }

                        return [
                            'name' => $lesson->name ?? "Chưa cập nhật",
                            'description' => $lesson->description ?? "Không có mô tả",
                            'date' => $lessonDate->format('d/m/Y'),
                            'status' => $status,
                            'teacher_id' => $lesson->pivot->teacher_id,
                        ];
                    })->filter(),
                ];
            })->filter()
                ->values();

            return response()->json(['data' => $data], 200);
        } catch (ModelNotFoundException $e) {
            return response()->json(['error' => 'Không tìm thấy thông tin cho giảng viên hoặc kỳ học không tồn tại.'], 404);
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
                'shift_start_time' => $scheduleInfor->shift->start_time,
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
            $shiftStartTime = Carbon::parse($scheduleInfor->shift->start_time);

            $listStudents = StudentClassroom::where('classroom_id', $classroomId)->get();

            if ($listStudents->isEmpty()) {
                return response()->json(['message' => 'Hiện chưa có học sinh nào trong lớp này'], 200);
            }

            $lessons = ScheduleLesson::where('schedule_id', $scheduleId)
                ->orderBy('study_date', 'asc')
                ->get();

            $currentDateTime = now();

            $data = $listStudents->map(function ($ls) use ($lessons, $shiftStartTime, $shiftEndTime, $currentDateTime) {
                $attendedCount = 0;
                $absentCount = 0;
                $absentDetails = [];
                $upcomingLessons = 0;

                foreach ($lessons as $lesson) {
                    $lessonStartTime = Carbon::parse($lesson->study_date)->setTimeFrom($shiftStartTime);
                    $lessonEndTime = Carbon::parse($lesson->study_date)->setTimeFrom($shiftEndTime);

                    if ($lessonEndTime < $currentDateTime || $currentDateTime >= $lessonStartTime && $currentDateTime <= $lessonEndTime) {
                        $attendance = StudentLesson::where('student_id', $ls->student_id)
                            ->where('lesson_id', $lesson->lesson_id)
                            ->first();

                        if ($attendance) {
                            if ($attendance->status == 1) {
                                $attendedCount++;
                                $absentDetails[] = [
                                    'lesson_id' => $lesson->lesson_id,
                                    'study_date' => Carbon::parse($lesson->study_date)->format('d/m/Y'),
                                    'status' => 'Có mặt',
                                ];
                            } else {
                                $absentCount++;
                                $absentDetails[] = [
                                    'lesson_id' => $lesson->lesson_id,
                                    'study_date' => Carbon::parse($lesson->study_date)->format('d/m/Y'),
                                    'status' => 'Vắng',
                                ];
                            }
                        } else {
                            $absentCount++;
                            $absentDetails[] = [
                                'lesson_id' => $lesson->lesson_id,
                                'study_date' => Carbon::parse($lesson->study_date)->format('d/m/Y'),
                                'status' => 'Vắng',
                            ];
                        }
                    } else {
                        $upcomingLessons++;
                        $absentDetails[] = [
                            'lesson_id' => $lesson->lesson_id,
                            'study_date' => Carbon::parse($lesson->study_date)->format('d/m/Y'),
                            'status' => 'Chưa rõ',
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

            $substituteSchedule = ScheduleLesson::with('schedule', 'lesson')  // Load quan hệ 'schedule' và 'lesson'
                ->where('schedule_id', $scheduleId)
                ->where('lesson_id', $lessonId)
                ->whereHas('schedule', function ($query) use ($teacher) {
                    // Kiểm tra trong bảng schedule nếu teacher_id khác với giảng viên đang đăng nhập
                    $query->where('teacher_id', '!=', $teacher->id);
                })
                ->firstOrFail();


            if ($substituteSchedule) {
                // Nếu là lớp dạy thay, tiếp tục xử lý điểm danh cho lớp thay thế
                $scheduleInfor = $substituteSchedule->schedule;  // Sử dụng lịch dạy thay
                $lesson = $substituteSchedule;  // Lớp học này chính là lớp dạy thay để điểm danh

                // Logic để tính giờ học và so sánh thời gian
                $currentDateTime = now();
                $shiftStartTime = Carbon::parse($scheduleInfor->shift->start_time);
                $shiftEndTime = Carbon::parse($scheduleInfor->shift->end_time);
                $lessonStartTime = Carbon::parse($lesson->study_date)->setTimeFrom($shiftStartTime);

                if ($currentDateTime < $lessonStartTime) {
                    return response()->json(['message' => 'Chưa đến giờ học.'], 400);
                }

                // Lấy danh sách sinh viên trong lớp
                $classroomId = $scheduleInfor->classroom->id;
                $listStudents = StudentClassroom::where('classroom_id', $classroomId)
                    ->where('study_start', '<=', now())
                    ->where('study_end', '>=', now())
                    ->get();

                if ($listStudents->isEmpty()) {
                    return response()->json(['message' => 'Hiện chưa có học sinh nào trong lớp này'], 200);
                }

                // Trả về dữ liệu sinh viên với trạng thái điểm danh
                $data = [
                    'lesson_id' => $lesson->lesson_id,
                    'study_date' => Carbon::parse($lesson->study_date)->format('d/m/Y'),
                    'ListStudents' => $listStudents->map(function ($ls) use ($lessonId) {
                        $studentId = $ls->student->id;

                        // Lấy thông tin điểm danh của sinh viên
                        $attendance = StudentLesson::where('student_id', $studentId)
                            ->where('lesson_id', $lessonId)
                            ->first();

                        $status = $attendance && $attendance->status == 1 ? 'Có mặt' : 'Vắng';

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
            } else {
                $scheduleInfor = Schedule::where('teacher_id', $teacher->id)
                    ->where('id', $scheduleId)
                    ->with('shift')
                    ->firstOrFail();

                $lesson = ScheduleLesson::where('schedule_id', $scheduleId)
                    ->where('lesson_id', $lessonId)
                    ->firstOrFail();

                // Tiếp tục xử lý điểm danh cho lớp học chính như thông thường
                $currentDateTime = now();
                $shiftStartTime = Carbon::parse($scheduleInfor->shift->start_time);
                $shiftEndTime = Carbon::parse($scheduleInfor->shift->end_time);
                $lessonStartTime = Carbon::parse($lesson->study_date)->setTimeFrom($shiftStartTime);

                if ($currentDateTime < $lessonStartTime) {
                    return response()->json(['message' => 'Chưa đến giờ học.'], 400);
                }

                // Lấy danh sách sinh viên trong lớp học
                $classroomId = $scheduleInfor->classroom->id;
                $listStudents = StudentClassroom::where('classroom_id', $classroomId)
                    ->where('study_start', '<=', now())
                    ->where('study_end', '>=', now())
                    ->get();

                if ($listStudents->isEmpty()) {
                    return response()->json(['message' => 'Hiện chưa có học sinh nào trong lớp này'], 200);
                }

                // Trả về dữ liệu điểm danh cho lớp học chính
                $data = [
                    'lesson_id' => $lesson->lesson_id,
                    'study_date' => Carbon::parse($lesson->study_date)->format('d/m/Y'),
                    'ListStudents' => $listStudents->map(function ($ls) use ($lessonId) {
                        $studentId = $ls->student->id;

                        // Lấy thông tin điểm danh của sinh viên
                        $attendance = StudentLesson::where('student_id', $studentId)
                            ->where('lesson_id', $lessonId)
                            ->first();

                        $status = $attendance && $attendance->status == 1 ? 'Có mặt' : 'Vắng';

                        return [
                            'student_id' => $studentId,
                            'student_avatar' => $ls->student->user->avatar,
                            'student_code' => $ls->student->student_code,
                            'student_name' => $ls->student->user->name,
                            'status' => $status,
                        ];
                    }),
                ];
            }

            return response()->json($data, 200);
        } catch (ModelNotFoundException $e) {
            return response()->json(['error' => 'Không tìm thấy thông tin cho giảng viên đã đăng nhập.'], 404);
        } catch (Exception $e) {
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
            // Lấy thông tin giảng viên từ user hiện tại
            $teacher = Teacher::where('user_id', $user->id)->firstOrFail();

            // Validate dữ liệu đầu vào của điểm danh
            $data = $request->validate([
                'attendance' => 'required|array',
                'attendance.*.student_id' => 'required|exists:students,id',
                'attendance.*.status' => 'required|in:0,1',
            ]);

            $attendanceData = $data['attendance'];

            // Kiểm tra lớp có phải lớp dạy thay không
            $substituteSchedule = ScheduleLesson::with('schedule', 'lesson')  // Load quan hệ 'schedule' và 'lesson'
                ->where('schedule_id', $schedule_id)
                ->where('lesson_id', $lesson_id)
                ->whereHas('schedule', function ($query) use ($teacher) {
                    $query->where('teacher_id', '!=', $teacher->id);  // Kiểm tra giảng viên dạy thay
                })
                ->first();

            // Nếu là lớp dạy thay, lấy thông tin lịch dạy thay
            if ($substituteSchedule) {
                $scheduleInfor = $substituteSchedule->schedule; // Sử dụng thông tin lớp học dạy thay
                $lesson = $substituteSchedule; // Thông tin lớp học (lesson)

            } else {  // Nếu là lớp chính, lấy thông tin bình thường
                $scheduleInfor = Schedule::where('teacher_id', $teacher->id)
                    ->where('id', $schedule_id)
                    ->with('shift')
                    ->firstOrFail();

                $lesson = ScheduleLesson::where('schedule_id', $schedule_id)
                    ->where('lesson_id', $lesson_id)
                    ->firstOrFail();
            }

            // Kiểm tra thời gian điểm danh
            $currentDateTime = now();
            $shiftStartTime = Carbon::parse($scheduleInfor->shift->start_time);
            $shiftEndTime = Carbon::parse($scheduleInfor->shift->end_time);
            $lessonStartTime = Carbon::parse($lesson->study_date)->setTimeFrom($shiftStartTime);

            if ($currentDateTime < $lessonStartTime || $currentDateTime > $lessonStartTime->copy()->addMinutes(60)) {
                return response()->json(['message' => 'Chỉ có thể điểm danh trong 60 phút đầu buổi học.'], 400);
            }

            DB::beginTransaction();

            // Lấy danh sách sinh viên trong lớp
            $classroomId = $scheduleInfor->classroom->id;
            $listStudents = StudentClassroom::where('classroom_id', $classroomId)
                ->where('study_start', '<=', now())
                ->where('study_end', '>=', now())
                ->get();

            // Nếu không có sinh viên trong lớp
            if ($listStudents->isEmpty()) {
                return response()->json(['message' => 'Hiện chưa có học sinh nào trong lớp này'], 200);
            }

            // Tiến hành điểm danh cho sinh viên trong lớp
            foreach ($attendanceData as $attendance) {
                $studentId = $attendance['student_id'];
                $status = $attendance['status'];

                // Kiểm tra sinh viên đã có điểm danh hay chưa
                $studentLesson = StudentLesson::where('student_id', $studentId)
                    ->where('lesson_id', $lesson_id)
                    ->first();

                if ($studentLesson) {
                    // Nếu có, cập nhật trạng thái điểm danh
                    $studentLesson->status = $status;
                    $studentLesson->save();
                } elseif ($status == 1) {
                    // Nếu chưa, tạo mới bản điểm danh
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


    public function getTeacher(Request $request)
    {
        $user = Auth::user();

        try {
            $shiftId = $request->input('shift_id');
            $date = $request->input('date');

            $teacher = Teacher::select('id', 'major_id')
                ->where('user_id', $user->id)
                ->firstOrFail();

            $majorId = $teacher->major_id;
            $teacherId = $teacher->id;

            $currentSemester = Semester::where('start_date', '<=', now())
                ->where('end_date', '>=', now())
                ->orderByDesc('end_date')
                ->first();

            if (!$currentSemester) {
                return response()->json(['message' => 'Không tìm thấy kỳ học hiện tại.'], 404);
            }

            $teachersWithClassesInSemester = Schedule::distinct()
                ->join('schedule_lessons', 'schedules.id', '=', 'schedule_lessons.schedule_id')
                ->where('schedules.semester_id', $currentSemester->id)
                ->pluck('schedules.teacher_id');

            $conflictedTeacherIds = Schedule::join('schedule_lessons', 'schedules.id', '=', 'schedule_lessons.schedule_id')
                ->where('schedules.major_id', $majorId)
                ->where('schedule_lessons.study_date', '=', $date)
                ->where('schedules.shift_id', '=', $shiftId)
                ->where('schedules.semester_id', $currentSemester->id)
                ->pluck('schedules.teacher_id');

            $availableTeachers = Teacher::select('teachers.teacher_code', 'users.name', 'teachers.id')
                ->join('users', 'users.id', '=', 'teachers.user_id')
                ->whereIn('teachers.id', $teachersWithClassesInSemester)
                ->where('teachers.major_id', $majorId)
                ->where('teachers.id', '!=', $teacherId)
                ->whereNotIn('teachers.id', $conflictedTeacherIds)
                ->get();

            return response()->json($availableTeachers, 200);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Đã xảy ra lỗi', 'error' => $e->getMessage()], 500);
        }
    }


    public function changeTeacher(Request $request)
    {
        $validated = $request->validate([
            'schedule_id' => 'required|integer',
            'new_teacher' => 'required|integer',
            'room_name' => 'required|string',
            'shift_name' => 'required|string',
            'subject_name' => 'required|string',
            'date' => 'required|date',
        ]);

        $user = Auth::user();

        try {
            $teacher = Teacher::where('user_id', $user->id)->firstOrFail();

            $dataToStore = array_merge($validated, [
                'requester' => $teacher->id,
                'requester_name' => $teacher->user->name,
            ]);

            $redisKey = "schedule_change_{$dataToStore['new_teacher']}";
            Redis::setex($redisKey, 900, json_encode($dataToStore));

            return response()->json([
                'success' => true,
                'message' => 'Dữ liệu được nhận thành công.',
                'data' => collect($dataToStore)->only(['schedule_id', 'new_teacher', 'subject_name', 'date']),
            ], 200);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Đã xảy ra lỗi', 'error' => $e->getMessage()], 500);
        }
    }

    public function notificationChangeSchedule()
    {
        $user = Auth::user();

        try {
            $teacher = Teacher::with('user')->where('user_id', $user->id)->firstOrFail();
            $redisKey = "schedule_change_{$teacher->id}";
            $abc = json_decode(Redis::get($redisKey));
            return response()->json($abc, 200);
        } catch (\Throwable $th) {
            return response()->json(['message' => 'error'], 500);
        }
    }
    public function handleSubmit(Request $request)
    {
        $user = Auth::user();

        try {
            $teacher = Teacher::where('user_id', $user->id)->firstOrFail();
            $teacher_name = $teacher->user->name;

            $currentTime = now()->format('Y-m-d H:i');
            $redisKey = "schedule_change_{$teacher->id}";

            Redis::del($redisKey);

            $dateInput = $request->input('date');
            $date = null;

            if ($dateInput) {
                try {
                    $date = Carbon::parse($dateInput)->format('d/m/Y');
                } catch (\Exception $e) {
                    return response()->json(['message' => 'Ngày không hợp lệ.'], 400);
                }
            } else {
                return response()->json(['message' => 'Ngày không được cung cấp.'], 400);
            }

            $redisAdminChangeSchedule = "schedule_manage_change";

            // Dữ liệu lịch học mới
            $scheduleData = [
                'schedule_id' => $request->input('schedule_id'),
                'new_teacher_id' => $teacher->id,
                'new_teacher_name' => $teacher_name,
                'room_name' => $request->input('room_name'),
                'shift_name' => $request->input('shift_name'),
                'subject_name' => $request->input('subject_name'),
                'date' => $date,
                'requester' => $request->requester,
                'time_request' => $currentTime,
                'requester_name' => $request->requester_name,
            ];

            // Lưu thông tin vào Redis
            Redis::rpush($redisAdminChangeSchedule, json_encode($scheduleData));

            return response()->json(['message' => 'Request pushed successfully']);
        } catch (\Throwable $th) {
            // Xử lý lỗi
            return response()->json(['message' => 'Error', 'error' => $th->getMessage()], 500);
        }
    }

    public function getSubSchedules()
    {
        try {
            $user = Auth::user();

            $teacher = Teacher::where('user_id', $user->id)->firstOrFail();

            $subSchedules = ScheduleLesson::with([
                'schedule',
                'lesson',
                'schedule.subject',
                'schedule.classroom',
                'schedule.room',
                'schedule.shift',
            ])
                ->where('teacher_id', $teacher->id)
                ->whereDoesntHave('schedule', function ($query) use ($teacher) {
                    $query->where('teacher_id', $teacher->id);
                })
                ->select('id', 'schedule_id', 'lesson_id', 'study_date')
                ->orderBy('study_date', 'asc')
                ->get();

            if ($subSchedules->isEmpty()) {
                return response()->json(['message' => 'Không có lịch dạy bù nào'], 200);
            }

            $formattedData = $subSchedules->map(function ($lesson) {
                return [
                    'id' => $lesson->id,
                    'lesson_id' => $lesson->lesson->id,
                    'schedule_id' => $lesson->schedule->id,
                    'lesson_name' => $lesson->lesson->name,
                    'lesson_description' => $lesson->lesson->description,
                    'study_date' => Carbon::parse($lesson->study_date)->format('d/m/Y'),
                    'subject_name' => $lesson->schedule->subject->name,
                    'classroom' => $lesson->schedule->classroom->code,
                    'room' => $lesson->schedule->room->name,
                    'shift' => $lesson->schedule->shift->name,
                ];
            });

            return response()->json(['data' => $formattedData], 200);
        } catch (ModelNotFoundException $e) {
            return response()->json([
                'error' => 'Không tìm thấy thông tin giảng viên, lịch dạy hoặc môn học. Vui lòng kiểm tra lại thông tin.',
                'message' => $e->getMessage()
            ], 404);
        } catch (Exception $e) {
            return response()->json([
                'error' => 'Đã xảy ra lỗi khi truy xuất danh sách lịch dạy bù.',
                'message' => $e->getMessage()
            ], 500);
        }
    }


    // public function getMaxDateSchedule()
    // {
    //     try {
    //         $maxEndDate = Schedule::join('semesters', 'schedules.semester_id', '=', 'semesters.id')
    //             ->whereRaw('NOW() BETWEEN semesters.start_date AND semesters.end_date')
    //             ->max('schedules.end_date');
    //         return response()->json($maxEndDate, 200);
    //     } catch (\Throwable $th) {
    //         return response()->json(['message' => 'error'], 500);
    //     }
    // }
    // public function handleChangeDate(Request $request)
    // {
    //     $user = Auth::user();
    //     try {

    //         $currentTime = now()->format('Y-m-d H:i');
    //         $teacher_id = Teacher::where('user_id', $user->id)->value('id');
    //         $teacher_name = DB::table('teachers')
    //             ->join('users', 'users.id', '=', 'teachers.user_id')
    //             ->where('users.id', $user->id)
    //             ->value('users.name');
    //         $scheduleData = [
    //             'schedule_id' => $request->input('schedule_id'),
    //             'old_date' => $request->input('old_date'),
    //             'new_date' => $request->input('new_date'),
    //             'time_request' => $currentTime,
    //             'subject_name' => $request->input('subject_name'),
    //             'requester_name' => $teacher_name,
    //         ];
    //         $redisAdminChangeSchedule = "schedule_manage_change";
    //         Redis::rpush($redisAdminChangeSchedule, json_encode($scheduleData));
    //         return response()->json($teacher_name, 200);
    //     } catch (\Throwable $th) {
    //         return response()->json(['message' => 'error'], 500);
    //     }
    // }
}

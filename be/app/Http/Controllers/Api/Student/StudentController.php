<?php

namespace App\Http\Controllers\Api\Student;

use App\Http\Controllers\Controller;
use App\Models\Course;
use App\Models\CourseSemester;
use App\Models\Major;
use App\Models\Schedule;
use App\Models\ScheduleLesson;
use App\Models\Semester;
use App\Models\Shift;
use App\Models\Student;
use App\Models\StudentClassroom;
use App\Models\StudentLesson;
use App\Models\StudentMajor;
use App\Models\StudentSchedule;
use App\Models\StudyDay;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class   StudentController extends Controller
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

                'status' => match ($student->status) {
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

            $currentCourseSemester = CourseSemester::where('course_id', $student->course_id)
                ->where('order', $student->current_semester)
                ->join('semesters', 'semesters.id', '=', 'course_semesters.semester_id')
                ->select('semesters.start_date', 'semesters.end_date')
                ->first();

            if (!$currentCourseSemester) {
                return response()->json(['error' => 'Không tìm thấy thông tin kỳ học.'], 404);
            }

            $startDate = Carbon::parse($currentCourseSemester->start_date);
            $registrationStart = $startDate->copy()->subDays(7);
            $registrationEnd = $registrationStart->copy()->addDays(3);
            $now = Carbon::now();

            if ($now->gt($startDate)) {
                return response()->json(['error' => 'Thời gian đăng ký chưa bắt đầu.
                Khoảng thời gian đăng kí mới sẽ từ ' . Carbon::parse($currentCourseSemester->end_date)->format('d/m/Y')], 403);
            }

            if ($now->gt($registrationEnd)) {
                return response()->json(['error' => 'Thời gian đăng ký đã kết thúc.'], 403);
            }

            $timeLeft = $now->diff($registrationEnd);
            $formattedTimeLeft = sprintf(
                "%d ngày, %d giờ, %d phút, %d giây",
                $timeLeft->d,
                $timeLeft->h,
                $timeLeft->i,
                $timeLeft->s
            );

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

            return response()->json([
                'message' => 'Bạn còn khoảng ' . $timeLeft->d . ' ngày để đăng ký.',
                'time_left' => $formattedTimeLeft,
                'subjects' => $listSubjects
            ], 200);
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
                    'days_of_week' => $schedule->days->sortBy('id')->map(fn($day) => ["Thứ" => $day->id])->values()->toArray(),
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
                'study_start' => $newSchedule->start_date,
                'study_end' => $newSchedule->end_date,
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
                'days_of_week' => $newSchedule->days->sortBy('id')->map(fn($day) => ["Thứ" => $day->id])->values()->toArray(),
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

    public function getStudentClassrooms()
    {
        $user = Auth::user();

        try {
            $student = Student::where('user_id', $user->id)->firstOrFail();

            $currentDateTime = Carbon::now();

            $classroomIds = StudentClassroom::where('student_id', $student->id)
                ->where('study_start', '<=', $currentDateTime)
                ->where('study_end', '>=', $currentDateTime)
                ->pluck('classroom_id');

            $schedules = StudentSchedule::where('student_id', $student->id)
                ->whereHas('schedule', function ($query) use ($classroomIds, $currentDateTime) {
                    $query->whereIn('classroom_id', $classroomIds)
                        ->where('end_date', '>=', $currentDateTime)
                        ->where('start_date', '<=', $currentDateTime);
                })
                ->with('schedule.days', 'schedule.shift', 'schedule.room', 'schedule.classroom', 'schedule.subject')
                ->get();

            if ($schedules->isEmpty()) {
                return response()->json(['message' => 'Sinh viên không có lịch học nào.'], 200);
            }

            $carbonDayOfWeek = $currentDateTime->dayOfWeek;
            $currentDayOfWeek = $carbonDayOfWeek === 0 ? 1 : $carbonDayOfWeek + 1;

            $data = $schedules->map(function ($schedule) use ($currentDateTime, $currentDayOfWeek) {
                $todayHasSchedule = $schedule->schedule->days->contains(fn($day) => $day->id === $currentDayOfWeek);

                $status = null;

                if ($todayHasSchedule) {
                    $shiftStart = Carbon::parse($schedule->schedule->shift->start_time);
                    $shiftEnd = Carbon::parse($schedule->schedule->shift->end_time);

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
                    'classroom' => $schedule->schedule->classroom->code,
                    'subject_name' => $schedule->schedule->subject->name,
                    'shift_name' => $schedule->schedule->shift->name,
                    'room_name' => $schedule->schedule->room->name,
                    'start_date' => Carbon::parse($schedule->schedule->start_date)->format('d/m/Y'),
                    'end_date' => Carbon::parse($schedule->schedule->end_date)->format('d/m/Y'),
                    'days_of_week' => $schedule->schedule->days->sortBy('id')->pluck('id')->map(fn($id) => "Thứ $id")->toArray(),
                    'schedule_status' => $status,
                ];
            });

            return response()->json(['data' => $data], 200);
        } catch (ModelNotFoundException $e) {
            return response()->json(['error' => 'Không tìm thấy thông tin cho sinh viên đã đăng nhập.'], 404);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Có lỗi xảy ra', 'message' => $e->getMessage()], 500);
        }
    }

    public function getTimetable()
    {
        $user = Auth::user();

        try {
            $student = Student::where('user_id', $user->id)->firstOrFail();

            $timetable = StudentSchedule::where('student_id', $student->id)->get();

            $data = $timetable->map(function ($tt) use ($student) {
                return [
                    'id' => $tt->schedule->id,
                    'subject_name' => $tt->schedule->subject->name,
                    'classroom_code' => $tt->schedule->classroom->code,
                    'teacher_name' => $tt->schedule->teacher->user->name,
                    'shift_name' => $tt->schedule->shift->name,
                    'room_name' => $tt->schedule->room->name ?? "Null",
                    'link' => $tt->schedule->link ?? "Null",
                    'start_date' => Carbon::parse($tt->schedule->start_date)->format('d/m/Y'),
                    'end_date' => Carbon::parse($tt->schedule->end_date)->format('d/m/Y'),
                    'schedule_lessons' => $tt->schedule->lessons->map(function ($lesson) use ($student, $tt) {
                        $lessonDateTime = Carbon::parse($lesson->pivot->study_date)
                            ->setTimeFrom(Carbon::parse($tt->schedule->shift->start_time));

                        $currentDateTime = now();

                        if ($currentDateTime < $lessonDateTime) {
                            $status = "Chưa rõ";
                        } else {
                            $studentLesson = StudentLesson::where('student_id', $student->id)
                                ->where('lesson_id', $lesson->pivot->lesson_id)
                                ->first();

                            if (!$studentLesson) {
                                $status = "Vắng";
                            } else {
                                $status = $studentLesson->status == 1 ? "Có mặt" : "Vắng";
                            }
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
            return response()->json(['error' => 'Không tìm thấy thông tin cho sinh viên đã đăng nhập.'], 404);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Không thể truy vấn tới bảng Schedule', 'message' => $e->getMessage()], 500);
        }
    }

    public function getSemester()
    { {
            $user = Auth::user();

            try {
                $student = Student::where('user_id', $user->id)->firstOrFail();

                $semesters = CourseSemester::where('course_id', $student->course_id)->get();

                $data = $semesters->map(function ($sm) {
                    return [
                        'id' => $sm->semester->id,
                        'name' => $sm->semester->name,
                        'order' => $sm->order,
                        'start_date' => Carbon::parse($sm->semester->start_date)->format('d/m/Y'),
                        'end_date' => Carbon::parse($sm->semester->end_date)->format('d/m/Y'),
                    ];
                });

                return response()->json(['data' => $data], 200);
            } catch (ModelNotFoundException $e) {
                return response()->json(['error' => 'Không tìm thấy thông tin cho sinh viên đã đăng nhập.'], 404);
            }
        }
    }
    public function getTimetableBySemester(string $semesterId)
    {
        $user = Auth::user();

        try {
            $student = Student::where('user_id', $user->id)->firstOrFail();

            $semester = Semester::findOrFail($semesterId);
            $semesterStartDate = Carbon::parse($semester->start_date);
            $semesterEndDate = Carbon::parse($semester->end_date);

            $timetable = StudentSchedule::where('student_id', $student->id)
                ->whereHas('schedule', function ($query) use ($semesterStartDate, $semesterEndDate) {
                    $query->whereBetween('start_date', [$semesterStartDate, $semesterEndDate])
                        ->whereBetween('end_date', [$semesterStartDate, $semesterEndDate]);
                })
                ->get();

            $data = $timetable->map(function ($tt) use ($student) {
                return [
                    'id' => $tt->schedule->id,
                    'subject_name' => $tt->schedule->subject->name,
                    'classroom_code' => $tt->schedule->classroom->code,
                    'teacher_name' => $tt->schedule->teacher->user->name,
                    'shift_name' => $tt->schedule->shift->name,
                    'room_name' => $tt->schedule->room->name ?? "Null",
                    'link' => $tt->schedule->link ?? "Null",
                    'start_date' => Carbon::parse($tt->schedule->start_date)->format('d/m/Y'),
                    'end_date' => Carbon::parse($tt->schedule->end_date)->format('d/m/Y'),
                    'schedule_lessons' => $tt->schedule->lessons->map(function ($lesson) use ($student, $tt) {
                        $lessonDateTime = Carbon::parse($lesson->pivot->study_date)
                            ->setTimeFrom(Carbon::parse($tt->schedule->shift->start_time));

                        $currentDateTime = now();

                        if ($currentDateTime < $lessonDateTime) {
                            $status = "Chưa rõ";
                        } else {
                            $studentLesson = StudentLesson::where('student_id', $student->id)
                                ->where('lesson_id', $lesson->pivot->lesson_id)
                                ->first();

                            if (!$studentLesson) {
                                $status = "Vắng";
                            } else {
                                $status = $studentLesson->status == 1 ? "Có mặt" : "Vắng";
                            }
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
            return response()->json(['error' => 'Không tìm thấy thông tin cho sinh viên đã đăng nhập hoặc kỳ học không tồn tại.'], 404);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Không thể truy vấn tới bảng Schedule', 'message' => $e->getMessage()], 500);
        }
    }
    public function getSubMajors()
    {
        $user = Auth::user();

        try {
            $student = Student::where('user_id', $user->id)->firstOrFail();

            if ($student->current_semester < 5) {
                return response()->json(['message' => 'Bạn chưa đủ điều kiện để được đăng ký chuyên ngành hẹp.'], 403);
            }

            $subMajorRegistered = StudentMajor::where('student_id', $student->id)
                ->where('status', 2)
                ->exists();

            if ($subMajorRegistered) {
                return response()->json(['message' => 'Bạn đã đăng ký chuyên ngành hẹp rồi.'], 403);
            }

            $mainMajor = StudentMajor::where('student_id', $student->id)
                ->where('status', 1)->firstOrFail();

            $subMajors = Major::where('major_id', $mainMajor->major_id)->get();

            $data = $subMajors->map(function ($sm) {
                return [
                    "id" => $sm->id,
                    'code' => $sm->code,
                    'name' => $sm->name,
                    'description' => $sm->description
                ];
            });

            return response()->json(['data' => $data], 200);
        } catch (ModelNotFoundException $e) {
            return response()->json(['error' => 'Không tìm thấy thông tin cho sinh viên đã đăng nhập.'], 404);
        }
    }
    public function registerSubMajor(string $subMajorId)
    {
        $user = Auth::user();

        try {
            $student = Student::where('user_id', $user->id)->firstOrFail();

            if ($student->current_semester < 5) {
                return response()->json(['message' => 'Sinh viên chưa đủ điều kiện đăng ký chuyên ngành hẹp.'], 403);
            }

            $subMajorRegistered = StudentMajor::where('student_id', $student->id)
                ->where('status', 2)
                ->exists();

            if ($subMajorRegistered) {
                return response()->json(['message' => 'Sinh viên đã đăng ký chuyên ngành hẹp.'], 403);
            }

            $mainMajor = StudentMajor::where('student_id', $student->id)
                ->where('status', 1)->firstOrFail();

            $validSubMajor = Major::where('major_id', $mainMajor->major_id)
                ->where('id', $subMajorId)
                ->exists();

            if (!$validSubMajor) {
                return response()->json(['message' => 'Chuyên ngành hẹp không hợp lệ.'], 400);
            }

            StudentMajor::create([
                'student_id' => $student->id,
                'major_id' => $subMajorId,
                'status' => 2
            ]);

            return response()->json(['message' => 'Đăng ký chuyên ngành hẹp thành công.'], 201);
        } catch (ModelNotFoundException $e) {
            return response()->json(['error' => 'Không tìm thấy thông tin sinh viên hoặc chuyên ngành.'], 404);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Đã xảy ra lỗi trong quá trình đăng ký.'], 500);
        }
    }
}

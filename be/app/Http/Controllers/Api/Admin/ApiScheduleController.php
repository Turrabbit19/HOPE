<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Classroom;
use App\Models\CourseSemester;
use App\Models\Major;
use App\Models\MajorSubject;
use App\Models\Schedule;
use App\Models\Student;
use App\Models\StudentClassroom;
use App\Models\StudentSchedule;
use App\Models\Subject;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Redis;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log;

class ApiScheduleController extends Controller
{
    public function getCoursesBySemester($semesterId)
    {
        try {
            $semesterOrder = CourseSemester::where('semester_id', $semesterId)
                ->orderBy('order')
                ->get();

            $data = $semesterOrder->map(function ($so) {
                return [
                    'id' => $so->course->id,
                    'course_name' => $so->course->name,
                    'order' => $so->order,
                ];
            });

            return response()->json(['courses' => $data], 200);
        } catch (ModelNotFoundException $e) {
            return response()->json(['error' => 'Không tìm thấy kỳ học với ID: ' . $semesterId], 404);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Không thể truy vấn tới bảng CourseSemester', 'message' => $e->getMessage()], 500);
        }
    }

    public function getMajorsByCourse($courseId)
    {
        try {
            $majors = Major::whereHas('students', function ($query) use ($courseId) {
                $query->where('course_id', $courseId);
            })
                ->where('id', '!=', 1)
                ->withCount('students')
                ->get();

            $data = $majors->map(function ($major) {
                return [
                    'id' => $major->id,
                    'name' => $major->name,
                    'credit' => $major->credit,
                    'student_count' => $major->students_count,
                ];
            });

            return response()->json(['majors' => $data], 200);
        } catch (ModelNotFoundException $e) {
            return response()->json(['error' => 'Không tìm thấy khóa học với ID: ' . $courseId], 404);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Không thể truy vấn tới bảng Majors', 'message' => $e->getMessage()], 500);
        }
    }

    public function getMajorsByCourseAndSemester($semesterId, $courseId)
    {
        try {
            $order = CourseSemester::where('course_id', $courseId)
                ->where('semester_id', $semesterId)
                ->value('order');

            $majors = Major::whereHas('students.course', function ($query) use ($courseId) {
                $query->where('id', $courseId);
            })
                ->whereHas('subjects', function ($query) use ($order) {
                    $query->where('subjects.order', $order);
                })
                ->withCount([
                    'students' => function ($query) use ($courseId) {
                        $query->where('course_id', $courseId);
                    }
                ])
                ->get();

            $data = $majors->map(function ($major) {
                return [
                    'id' => $major->id,
                    'name' => $major->name,
                    'student_count' => $major->students_count,
                ];
            });

            return response()->json(['majors' => $data], 200);
        } catch (ModelNotFoundException $e) {
            return response()->json(['error' => 'Không tìm thấy khóa học với ID: ' . $courseId], 404);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Không thể truy vấn tới bảng Majors', 'message' => $e->getMessage()], 500);
        }
    }

    public function getSubjects($semesterId, $courseId, $majorId)
    {
        try {
            $order = CourseSemester::where('course_id', $courseId)
                ->where('semester_id', $semesterId)
                ->value('order');

            if (!$order) {
                return response()->json(['error' => 'Không tìm thấy thông tin về order của khóa học trong học kỳ này'], 404);
            }

            $subjects = MajorSubject::where('major_id', $majorId)
                ->join('subjects', 'major_subjects.subject_id', '=', 'subjects.id')
                ->where('subjects.order', $order)
                ->get();

            $majors = Major::whereHas('students.course', function ($query) use ($courseId) {
                $query->where('id', $courseId);
            })
                ->whereHas('subjects', function ($query) use ($order) {
                    $query->where('subjects.order', $order);
                })
                ->withCount([
                    'students' => function ($query) use ($courseId) {
                        $query->where('course_id', $courseId);
                    }
                ])
                ->get();

            $data = $subjects->map(function ($subject) use ($courseId, $majors) {
                $studentCount = StudentSchedule::whereHas('schedule.subject', function ($query) use ($subject) {
                    $query->where('id', $subject->id);
                })
                    ->whereHas('student', function ($query) use ($courseId) {
                        $query->where('course_id', $courseId);
                    })
                    ->count();

                $major = $majors->firstWhere('id', $subject->major_id);
                $totalStudentCount = $major ? $major->students_count : 0;

                return [
                    "id" => $subject->id,
                    "name" => $subject->name,
                    "credit" => $subject->credit,
                    "student_count" => $studentCount,
                    "total_student_count" => $totalStudentCount
                ];
            });

            return response()->json(['subjects' => $data], 200);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Không thể truy vấn tới bảng MajorSubject', 'message' => $e->getMessage()], 500);
        }
    }

    public function index(Request $request)
    {
        try {
            $perPage = $request->input('perPage', 39);

            $schedules = Schedule::paginate($perPage);

            $data = collect($schedules->items())->map(function ($schedule) {
                return [
                    'id' => $schedule->id,
                    'course_name' => $schedule->course->name,
                    'semester_name' => $schedule->semester->name,
                    'major_name' => $schedule->major->name,
                    'subject_name' => $schedule->subject->name,
                    'teacher_name' => $schedule->teacher ? $schedule->teacher->user->name : "",
                    'shift_name' => $schedule->shift->name,
                    'room_name' => $schedule->room->name,
                    'link' => $schedule->link ? $schedule->link : "NULL",
                    'start_date' => Carbon::parse($schedule->start_date)->format('d/m/Y'),
                    'end_date' => Carbon::parse($schedule->end_date)->format('d/m/Y'),
                    'status' => $schedule->status ? "Đang diễn ra" : "Kết thúc",
                ];
            });

            return response()->json([
                'data' => $data,
                'pagination' => [
                    'total' => $schedules->total(),
                    'per_page' => $schedules->perPage(),
                    'current_page' => $schedules->currentPage(),
                    'last_page' => $schedules->lastPage(),
                ]
            ], 200);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Không thể truy vấn tới bảng Schedules', 'message' => $e->getMessage()], 500);
        }
    }

    public function getSchedules(Request $request)
    {
        $date = $request->input('date');
        $teacherCode = $request->input('teacher_code');

        try {
            $schedules = Schedule::with([
                'lessons' => function ($query) use ($date) {
                    $query->wherePivot('study_date', $date);
                },
                'shift',
                'teacher',
                'classroom',
                'subject'
            ]);

            if ($teacherCode) {
                $schedules->whereHas('teacher', function ($query) use ($teacherCode) {
                    $query->where('teacher_code', 'like', "%$teacherCode%");
                });
            }

            $schedules = $schedules->get();

            $filteredSchedules = $schedules->filter(function ($schedule) {
                return $schedule->lessons->isNotEmpty();
            });

            $now = Carbon::now();

            $data = $filteredSchedules->map(function ($schedule) use ($now, $date) {
                $shift = $schedule->shift;
                $studyDates = $schedule->lessons->pluck('pivot.study_date');

                $status = 'Chưa tới';

                foreach ($studyDates as $studyDate) {
                    $studyDate = Carbon::parse($studyDate);

                    if ($now->isSameDay($studyDate)) {
                        if ($now->lt($shift->start_time)) {
                            $status = 'Chưa tới';
                        } elseif ($now->gte($shift->start_time) && $now->lte($shift->end_time)) {
                            $status = 'Đang trong thời gian';
                        } else {
                            $status = 'Đã xong';
                        }
                        break;
                    }
                }

                return [
                    'room_id' => $schedule->room_id,
                    'shift_id' => $schedule->shift_id,
                    'teacher' => $schedule->teacher->teacher_code,
                    'class' => $schedule->classroom->code,
                    'subject' => $schedule->subject->code,
                    'status' => $status,
                ];
            });


            return response()->json(['data' => $data], 200);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Không thể truy vấn tới bảng Schedules',
                'message' => $e->getMessage(),
            ], 500);
        }
    }



    private function calculateEndDateLogic($startDate, $subjectId, $daysOfWeek)
    {
        $subject = Subject::findOrFail($subjectId);
        $lessonsCount = $subject->lessons()->count();

        $scheduleDates = [];
        $currentDate = new \DateTime($startDate);

        while (count($scheduleDates) < $lessonsCount) {
            $dayOfWeek = $currentDate->format('N') == 7 ? 1 : $currentDate->format('N') + 1;

            if (in_array($dayOfWeek, $daysOfWeek)) {
                $scheduleDates[] = $currentDate->format('Y-m-d');
            }
            $currentDate->modify('+1 day');
        }

        return end($scheduleDates);
    }
    public function calculateEndDate(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'start_date' => 'required|date',
            'subject_id' => 'required|exists:subjects,id',
            'days_of_week' => 'required|array',
            'days_of_week.*' => 'integer'
        ], [
            'start_date.required' => 'Ngày bắt đầu là bắt buộc.',
            'start_date.date' => 'Ngày bắt đầu phải là định dạng ngày hợp lệ.',
            'subject_id.required' => 'Mã môn học là bắt buộc.',
            'subject_id.exists' => 'Mã môn học không tồn tại.',
            'days_of_week.required' => 'Cần chọn ít nhất một ngày trong tuần.',
            'days_of_week.array' => 'Danh sách ngày trong tuần phải là một mảng.',
            'days_of_week.*.integer' => 'Các ngày trong tuần phải là kiểu số nguyên.'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 400);
        }

        try {
            $data = $validator->validated();

            $endDate = $this->calculateEndDateLogic(
                $data['start_date'],
                $data['subject_id'],
                $data['days_of_week']
            );
            return response()->json(['end_date' => $endDate], 200);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Tính toán thất bại', 'message' => $e->getMessage()], 500);
        }
    }

    private function validateLessonDate($startDate, $endDate, $daysOfWeek, $subjectId)
    {
        $endDateTime = new \DateTime($endDate);

        $lastScheduleDate = $this->calculateEndDateLogic($startDate, $subjectId, $daysOfWeek);
        $lastScheduleDateTime = new \DateTime($lastScheduleDate);

        if ($lastScheduleDateTime > $endDateTime) {
            $difference = $endDateTime->diff($lastScheduleDateTime)->days;
            throw new \Exception("Ngày kết thúc dự kiến tối thiểu cần thêm: " . $difference . " ngày.");
        }
        return true;
    }
    private function createLessonDate($schedule)
    {
        $startDate = new \DateTime($schedule->start_date);
        $endDate = new \DateTime($schedule->end_date);
        $daysOfWeek = $schedule->days()->pluck('id')->toArray();

        $lessons = $schedule->subject->lessons;
        $lessonsCount = $lessons->count();

        $currentDate = clone $startDate;
        $lessonIndex = 0;
        $scheduleDates = [];

        while ($currentDate <= $endDate) {
            $dayOfWeek = $currentDate->format('N') == 7 ? 1 : $currentDate->format('N') + 1;

            if (in_array($dayOfWeek, $daysOfWeek) && $lessonIndex < $lessonsCount) {
                $lesson = $lessons[$lessonIndex];
                $schedule->lessons()->syncWithoutDetaching([
                    $lesson->id => ['study_date' => $currentDate->format('Y-m-d')],
                ]);
                $scheduleDates[] = $lesson->name . ': ' . $currentDate->format('Y-m-d');
                $lessonIndex++;
            }

            $currentDate->modify('+1 day');
        }
        return $scheduleDates;
    }
    private function hasConflict(array $classroom, $start_date, $end_date, $days_of_week, $semesterId): bool
    {
        $start_date = Carbon::parse($start_date);
        $end_date = Carbon::parse($end_date);
        $shift_id = $classroom['shift_id'];
        $room_id = $classroom['room_id'];

        $conflictSchedules = Schedule::where('semester_id', $semesterId)
            ->where(function ($query) use ($start_date, $end_date) {
                $query->whereBetween('start_date', [$start_date, $end_date])
                    ->orWhereBetween('end_date', [$start_date, $end_date])
                    ->orWhere(function ($subQuery) use ($start_date, $end_date) {
                        $subQuery->where('start_date', '<=', $start_date)
                            ->where('end_date', '>=', $end_date);
                    });
            })
            ->whereHas('days', function ($query) use ($days_of_week) {
                $query->whereIn('days.id', $days_of_week);
            })
            ->where('shift_id', $shift_id)
            ->where('room_id', $room_id)
            ->exists();

        return $conflictSchedules;
    }
    public function addSchedules(Request $request, string $semesterId, $courseId, $majorId, $subjectId)
    {
        $validator = Validator::make(
            $request->all(),
            [
                'classrooms' => 'required|array',
                'classrooms.*.id' => 'required|exists:classrooms,id',
                'classrooms.*.shift_id' => 'required|exists:shifts,id',
                'classrooms.*.room_id' => 'nullable|exists:rooms,id',
                'classrooms.*.link' => 'nullable|sometimes|url',
                'classrooms.*.start_date' => 'required|date',
                'classrooms.*.end_date' => 'required|date|after_or_equal:classrooms.*.start_date',
                'classrooms.*.days_of_week' => 'required|array',
                'classrooms.*.days_of_week.*' => 'integer'
            ],
            [
                'start_date.required' => 'Ngày bắt đầu là bắt buộc.',
                'start_date.date' => 'Ngày bắt đầu phải là định dạng ngày hợp lệ.',
                'start_date.after_or_equal' => 'Ngày bắt đầu phải từ hôm nay trở đi.',
                'end_date.required' => 'Ngày kết thúc là bắt buộc.',
                'end_date.date' => 'Ngày kết thúc phải là định dạng ngày hợp lệ.',
                'end_date.after_or_equal' => 'Ngày kết thúc phải sau ngày bắt đầu.',

                'days_of_week.required' => 'Cần chọn ít nhất một ngày trong tuần.',
                'days_of_week.array' => 'Danh sách ngày trong tuần phải là một mảng.',
                'days_of_week.*.integer' => 'Các ngày trong tuần phải là kiểu số nguyên.',

                'classrooms.required' => 'Lớp học là bắt buộc.',
                'classrooms.array' => 'Lớp học phải là một mảng.',
                'classrooms.*.id.required' => 'Mã lớp học là bắt buộc.',
                'classrooms.*.id.exists' => 'Lớp học không tồn tại.',
                'classrooms.*.shift_id.required' => 'ID ca học là bắt buộc.',
                'classrooms.*.shift_id.exists' => 'Ca học không tồn tại trong hệ thống.',
                'classrooms.*.room_id.exists' => 'Phòng học không tồn tại trong hệ thống.',
                'classrooms.*.link.url' => 'Đường dẫn lớp học phải là một URL hợp lệ.',
            ]
        );

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 400);
        }

        try {
            $data = $validator->validated();
            $scheduleResponses = [];
            $conflictErrors = [];
            $conflictClassrooms = [];

            $temporarySchedules = [];

            foreach ($data['classrooms'] as $classroom) {
                $startDate = $classroom['start_date'];
                $endDate = $classroom['end_date'];
                $daysOfWeek = $classroom['days_of_week'];
                $shiftId = $classroom['shift_id'];
                $roomId = $classroom['room_id'];

                $classroomDetails = Classroom::find($classroom['id']);
                $classroomCode = $classroomDetails->code;

                foreach ($temporarySchedules as $tempSchedule) {
                    if (
                        $this->isDateOverlap($tempSchedule['start_date'], $tempSchedule['end_date'], $startDate, $endDate) &&
                        $this->hasCommonDays($tempSchedule['days_of_week'], $daysOfWeek) &&
                        $tempSchedule['shift_id'] === $shiftId &&
                        $tempSchedule['room_id'] === $roomId
                    ) {
                        $conflictClassrooms[] = $classroomCode;
                        break;
                    }
                }

                if ($this->hasConflict($classroom, $startDate, $endDate, $daysOfWeek, $semesterId)) {
                    $conflictClassrooms[] = $classroomCode;
                }

                $temporarySchedules[] = $classroom;
            }

            if (!empty($conflictClassrooms)) {
                $conflictCodes = implode(', ', $conflictClassrooms);
                $conflictErrors[] = "Các lớp {$conflictCodes} có trùng ca học hoặc ngày học đã được lên lịch.";
            }

            if (!empty($conflictErrors)) {
                return response()->json(['error' => $conflictErrors], 409);
            }

            foreach ($data['classrooms'] as $classroom) {
                $startDate = $classroom['start_date'];
                $endDate = $classroom['end_date'];

                $scheduleData = [
                    'course_id' => $courseId,
                    'semester_id' => $semesterId,
                    'major_id' => $majorId,
                    'subject_id' => $subjectId,
                    'classroom_id' => $classroom['id'],
                    'shift_id' => $classroom['shift_id'],
                    'room_id' => $classroom['room_id'],
                    'link' => $classroom['link'],
                    'start_date' => $startDate,
                    'end_date' => $endDate,
                ];

                $schedule = Schedule::create($scheduleData);

                $days = collect($classroom['days_of_week'])->mapWithKeys(fn($day) => [$day => []]);
                $schedule->days()->sync($days);

                $scheduleDates = $this->createLessonDate($schedule);

                $scheduleResponses[] = [
                    'data' => [
                        'schedule_id' => $schedule->id,
                        'subject_name' => $schedule->subject->name,
                        'classroom_id' => $schedule->classroom_id,
                        'shift_name' => $schedule->shift->name,
                        'room_name' => $schedule->room ? $schedule->room->name : 'NULL',
                        'link' => $schedule->link ? $schedule->link : "NULL",
                        'start_date' => Carbon::parse($schedule->start_date)->format('d/m/Y'),
                        'end_date' => Carbon::parse($schedule->end_date)->format('d/m/Y'),
                    ],
                    'scheduled_dates' => $scheduleDates
                ];
            }

            return response()->json([
                'message' => 'Tạo mới thành công và lịch học đã được tạo cho các lớp.',
                'schedules' => $scheduleResponses
            ], 201);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Tạo mới thất bại', 'message' => $e->getMessage()], 500);
        }
    }


    private function isDateOverlap($start1, $end1, $start2, $end2)
    {
        return !(Carbon::parse($end1)->lt(Carbon::parse($start2)) || Carbon::parse($start1)->gt(Carbon::parse($end2)));
    }

    private function hasCommonDays(array $days1, array $days2)
    {
        return count(array_intersect($days1, $days2)) > 0;
    }

    private function hasTeacherConflict($teacherId, $scheduleId)
    {
        $newSchedule = Schedule::with('days', 'shift')->findOrFail($scheduleId);
        $newScheduleDays = $newSchedule->days->pluck('id')->toArray();
        $newScheduleShift = $newSchedule->shift_id;

        $startDate = $newSchedule->start_date;
        $endDate = $newSchedule->end_date;

        $teacherSchedules = Schedule::where('teacher_id', $teacherId)
            ->where('start_date', [$startDate, $endDate])
            ->where('end_date', [$startDate, $endDate])
            ->get();

        foreach ($teacherSchedules as $existingSchedule) {
            $existingDays = $existingSchedule->days->pluck('id')->toArray();
            $existingShift = $existingSchedule->shift_id;

            if (
                !empty(array_intersect($newScheduleDays, $existingDays)) &&
                $newScheduleShift === $existingShift
            ) {
                return true;
            }
        }

        return false;
    }
    public function assignTeacherSchedules(Request $request)
    {
        Log::debug('Request data:', $request->all());

        $validator = Validator::make($request->all(), [
            'schedules' => 'required|array',
            'schedules.*.teacher_id' => 'required|exists:teachers,id',
            'schedules.*.schedule_id' => 'required|exists:schedules,id',
        ], [
            'schedules.required' => 'Danh sách lịch học là bắt buộc.',
            'schedules.array' => 'Danh sách lịch học phải là một mảng.',
            'schedules.*.teacher_id.required' => 'Mã giảng viên là bắt buộc.',
            'schedules.*.teacher_id.exists' => 'Giảng viên không tồn tại trong hệ thống.',
            'schedules.*.schedule_id.required' => 'Mã lịch học là bắt buộc.',
            'schedules.*.schedule_id.exists' => 'Lịch học không tồn tại trong hệ thống.',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 400);
        }

        try {
            $data = $validator->validated();

            if (!isset($data['schedules']) || !is_array($data['schedules']) || empty($data['schedules'])) {
                return response()->json(['error' => 'Dữ liệu lịch học không hợp lệ.'], 400);
            }

            $assignedSchedules = [];

            foreach ($data['schedules'] as $scheduleData) {
                $teacherId = $scheduleData['teacher_id'];
                $scheduleId = $scheduleData['schedule_id'];

                $conflict = $this->hasTeacherConflict($teacherId, $scheduleId);

                if ($conflict) {
                    return response()->json([
                        'error' => "Lịch bị trùng cho giảng viên có ID = {$teacherId} với lịch học có ID = {$scheduleId}."
                    ], 409);
                }

                $schedule = Schedule::findOrFail($scheduleId);
                $schedule->teacher_id = $teacherId;
                $schedule->save();

                $lessons = $schedule->lessons;
                foreach ($lessons as $lesson) {
                    $schedule->lessons()->updateExistingPivot($lesson->id, [
                        'teacher_id' => $teacherId,
                    ]);
                }

                $assignedSchedules[] = [
                    'teacher_id' => $teacherId,
                    'schedule_id' => $scheduleId,
                ];
            }

            return response()->json([
                'message' => 'Phân lịch thành công cho các giảng viên.',
                'assigned_schedules' => $assignedSchedules,
            ], 201);
        } catch (\Exception $e) {
            Log::error('Assign Teacher Schedules failed:', ['message' => $e->getMessage(), 'data' => $data]);
            return response()->json(['error' => 'Phân lịch thất bại', 'message' => $e->getMessage()], 500);
        }
    }

    public function show(string $id)
    {
        try {
            $schedule = Schedule::findOrFail($id);
            $data = [
                'id' => $schedule->id,
                'course_name' => $schedule->course->name,
                'semester_name' => $schedule->semester->name,
                'major_name' => $schedule->major->name,
                'subject_name' => $schedule->subject->name,
                'teacher_name' => $schedule->teacher ? $schedule->teacher->user->name : "",
                'shift_name' => $schedule->shift->name,
                'room_name' => $schedule->room->name,
                'link' => $schedule->link ? $schedule->link : "NULL",
                'start_date' => Carbon::parse($schedule->start_date)->format('d/m/Y'),
                'end_date' => Carbon::parse($schedule->end_date)->format('d/m/Y'),
                'days_of_week' => $schedule->days->map(function ($day) {
                    return [
                        "Thứ" => $day->id,
                    ];
                }),
                'status' => $schedule->status ? "Đang diễn ra" : "Kết thúc",
            ];

            return response()->json(['data' => $data], 200);
        } catch (ModelNotFoundException $e) {
            return response()->json(['error' => 'Không tìm thấy lịch học với ID: ' . $id], 404);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Không thể truy vấn tới lịch học', 'message' => $e->getMessage()], 500);
        }
    }

    public function destroyByClassroomId(string $id)
    {
        try {
            $schedule = Schedule::findOrFail($id);

            $schedule->delete();

            return response()->json(['message' => 'Xóa lịch học thành công'], 200);
        } catch (ModelNotFoundException $e) {
            return response()->json(['error' => 'Không tìm thấy lịch học với ID: ' . $id], 404);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Xóa thất bại', 'message' => $e->getMessage()], 500);
        }
    }

    public function getClassrooms(string $courseId, $subjectId)
    {
        try {
            $schedules = Schedule::where('course_id', $courseId)
                ->where('subject_id', $subjectId)
                ->with(['classroom.students', 'room', 'days'])
                ->get();

            $data = $schedules->map(function ($schedule) use ($courseId) {
                return [
                    'id' => $schedule->id,
                    'teacher' => $schedule->teacher->user->name,
                    'code' => $schedule->classroom->code,
                    'room' => $schedule->room->name ?? "NULL",
                    'link' => $schedule->link ?? "NULL",
                    'start_date' => Carbon::parse($schedule->start_date)->format('d/m/Y'),
                    'days_of_week' => $schedule->days->map(fn($day) => ["Thứ" => $day->id]),
                    'students' => $schedule->classroom->students
                        ->filter(fn($student) => $student->course_id == $courseId)
                        ->count(),
                    'max_students' => $schedule->classroom->max_students,
                ];
            });

            return response()->json(['data' => $data], 200);
        } catch (ModelNotFoundException $e) {
            return response()->json(['error' => 'Không tìm thấy môn học đó.'], 404);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Không thể truy vấn tới bảng Schedule', 'message' => $e->getMessage()], 500);
        }
    }

    public function getDetailSchedule(string $id)
    {
        try {
            $schedule = Schedule::with(['classroom', 'teacher.user', 'shift', 'room', 'lessons'])
                ->findOrFail($id);

            $status = $schedule->lessons->isNotEmpty() && Carbon::parse($schedule->lessons->first()->study_date)->lt(Carbon::now())
                ? "Đã học"
                : "Chưa học";

            $data = [
                'teacher_name' => $schedule->teacher->user->name,
                'shift_name' => $schedule->shift->name,
                'room_name' => $schedule->room->name ?? "NULL",
                'link' => $schedule->link ?? "NULL",
                'start_date' => Carbon::parse($schedule->start_date)->format('d/m/Y'),
                'end_date' => Carbon::parse($schedule->end_date)->format('d/m/Y'),
                'status' => $status,
                'schedule_lessons' => $schedule->lessons->map(function ($lesson) {
                    return [
                        'date' => Carbon::parse($lesson->pivot->study_date)->format('d/m/Y'),
                        'status' => Carbon::parse($lesson->pivot->study_date)->lt(Carbon::now()) ? "Đã học" : "Chưa học",
                    ];
                }),
            ];

            return response()->json(['data' => $data], 200);
        } catch (ModelNotFoundException $e) {
            return response()->json(['error' => 'Không tìm thấy lịch học với ID: ' . $id], 404);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Không thể truy vấn tới lịch học', 'message' => $e->getMessage()], 500);
        }
    }

    public function assignStudentsToSubject($semesterId, $courseId, $majorId, $subjectId)
    {
        try {
            $schedules = Schedule::with('days', 'shift', 'students', 'classroom')
                ->where('semester_id', $semesterId)
                ->where('course_id', $courseId)
                ->where('major_id', $majorId)
                ->where('subject_id', $subjectId)
                ->get();

            if ($schedules->isEmpty()) {
                return response()->json(['message' => 'Không tìm thấy lịch học cho môn học này'], 404);
            }

            $unregisteredStudents = Student::where('course_id', $courseId)
                ->whereHas('majors', function ($query) use ($majorId) {
                    $query->where('student_majors.major_id', $majorId);
                })
                ->whereDoesntHave('schedules', function ($query) use ($subjectId) {
                    $query->whereHas('subject', function ($q) use ($subjectId) {
                        $q->where('id', $subjectId);
                    });
                })
                ->get();

            if ($unregisteredStudents->isEmpty()) {
                return response()->json(['message' => 'Tất cả sinh viên đã đăng ký môn học này'], 200);
            }

            $assignedStudents = [];
            $conflictedStudents = [];
            $remainingStudents = $unregisteredStudents->count();

            $subject = Subject::find($subjectId);
            $maxStudentsPerClass = $subject->max_students;
            $minCapacity = ceil($maxStudentsPerClass * 0.7);

            if ($remainingStudents % $maxStudentsPerClass === 0) {
                // Trường hợp chia hết: Phân bổ đủ số lượng tối đa
                foreach ($schedules as $schedule) {
                    $currentCapacity = $schedule->students->count();
                    $studentsToAssign = min($maxStudentsPerClass - $currentCapacity, $remainingStudents);

                    for ($i = 0; $i < $studentsToAssign; $i++) {
                        if ($unregisteredStudents->isEmpty()) {
                            break;
                        }

                        $student = $unregisteredStudents->pop();

                        $hasConflict = $student->schedules->contains(function ($existingSchedule) use ($schedule) {
                            return $existingSchedule->shift_id === $schedule->shift_id &&
                                $existingSchedule->days->pluck('id')->intersect($schedule->days->pluck('id'))->isNotEmpty();
                        });

                        if ($hasConflict) {
                            $conflictedStudents[] = $student->id;
                            continue;
                        }

                        DB::transaction(function () use ($student, $schedule) {
                            StudentSchedule::create([
                                'student_id' => $student->id,
                                'schedule_id' => $schedule->id,
                            ]);

                            StudentClassroom::create([
                                'student_id' => $student->id,
                                'classroom_id' => $schedule->classroom_id,
                                'study_start' => $schedule->start_date,
                                'study_end' => $schedule->end_date,
                            ]);
                        });

                        $schedule->students->push($student);
                        $assignedStudents[] = $student->id;
                    }

                    $remainingStudents -= $studentsToAssign;

                    if ($remainingStudents <= 0) {
                        break;
                    }
                }
            } else {
                // Trường hợp không chia hết: Phân bổ trước theo min_capacity
                foreach ($schedules as $schedule) {
                    $currentCapacity = $schedule->students->count();
                    $studentsToAssign = min($minCapacity - $currentCapacity, $remainingStudents);

                    for ($i = 0; $i < $studentsToAssign; $i++) {
                        if ($unregisteredStudents->isEmpty()) {
                            break;
                        }

                        $student = $unregisteredStudents->pop();

                        $hasConflict = $student->schedules->contains(function ($existingSchedule) use ($schedule) {
                            return $existingSchedule->shift_id === $schedule->shift_id &&
                                $existingSchedule->days->pluck('id')->intersect($schedule->days->pluck('id'))->isNotEmpty();
                        });

                        if ($hasConflict) {
                            $conflictedStudents[] = $student->id;
                            continue;
                        }

                        DB::transaction(function () use ($student, $schedule) {
                            StudentSchedule::create([
                                'student_id' => $student->id,
                                'schedule_id' => $schedule->id,
                            ]);

                            StudentClassroom::create([
                                'student_id' => $student->id,
                                'classroom_id' => $schedule->classroom_id,
                                'study_start' => $schedule->start_date,
                                'study_end' => $schedule->end_date,
                            ]);
                        });

                        $schedule->students->push($student);
                        $assignedStudents[] = $student->id;
                    }

                    $remainingStudents -= $studentsToAssign;

                    if ($remainingStudents <= 0) {
                        break;
                    }
                }

                // Phân bổ số còn lại đủ max_students mỗi lớp
                foreach ($schedules as $schedule) {
                    if ($remainingStudents <= 0) {
                        break;
                    }

                    $currentCapacity = $schedule->students->count();
                    while ($remainingStudents > 0 && $currentCapacity < $maxStudentsPerClass) {
                        $student = $unregisteredStudents->pop();

                        $hasConflict = $student->schedules->contains(function ($existingSchedule) use ($schedule) {
                            return $existingSchedule->shift_id === $schedule->shift_id &&
                                $existingSchedule->days->pluck('id')->intersect($schedule->days->pluck('id'))->isNotEmpty();
                        });

                        if ($hasConflict) {
                            $conflictedStudents[] = $student->id;
                            continue;
                        }

                        DB::transaction(function () use ($student, $schedule) {
                            StudentSchedule::create([
                                'student_id' => $student->id,
                                'schedule_id' => $schedule->id,
                            ]);

                            StudentClassroom::create([
                                'student_id' => $student->id,
                                'classroom_id' => $schedule->classroom_id,
                                'study_start' => $schedule->start_date,
                                'study_end' => $schedule->end_date,
                            ]);
                        });

                        $schedule->students->push($student);
                        $assignedStudents[] = $student->id;

                        $currentCapacity++;
                        $remainingStudents--;
                    }
                }
            }

            $errorMessages = [];
            if (!empty($conflictedStudents)) {
                $errorMessages[] = 'Một số sinh viên không thể phân bổ vì trùng lịch học.';
            }

            if ($remainingStudents > 0) {
                $errorMessages[] = 'Không đủ chỗ để phân bổ tất cả sinh viên.';
            }

            return response()->json([
                'message' => empty($errorMessages) ? 'Phân bổ thành công' : 'Phân bổ chưa hoàn tất',
                'assigned_students_count' => count($assignedStudents),
                'remaining_students_count' => $remainingStudents,
                'conflicted_students' => $conflictedStudents,
                'details' => $assignedStudents,
                'errors' => $errorMessages,
            ], empty($errorMessages) ? 200 : 207);
        } catch (ModelNotFoundException $e) {
            return response()->json(['error' => 'Không tìm thấy thông tin yêu cầu.'], 404);
        } catch (\Exception $e) {
            Log::error('Error assigning students to subject', ['exception' => $e]);
            return response()->json([
                'error' => 'Không thể xử lý yêu cầu',
                'message' => $e->getMessage(),
            ], 500);
        }
    }


    public function removeStudentsFromClass($scheduleId)
    {
        try {
            $schedule = Schedule::findOrFail($scheduleId);

            DB::transaction(function () use ($schedule) {
                StudentClassroom::where('classroom_id', $schedule->classroom_id)->delete();

                StudentSchedule::where('schedule_id', $schedule->id)->delete();
            });

            return response()->json([
                'message' => 'Đã xóa tất cả sinh viên khỏi lớp thành công.'
            ], 200);
        } catch (ModelNotFoundException $e) {
            return response()->json(['error' => 'Không tìm thấy lịch học cho lớp này.'], 404);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Không thể xóa sinh viên khỏi lớp.',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    public function deleteEmptyClassrooms($semesterId, $courseId, $majorId, $subjectId)
    {
        try {
            $schedules = Schedule::with('students')
                ->where('semester_id', $semesterId)
                ->where('course_id', $courseId)
                ->where('major_id', $majorId)
                ->where('subject_id', $subjectId)
                ->get();

            foreach ($schedules as $schedule) {
                if ($schedule->students->count() == 0) {
                    $schedule->forceDelete();
                }
            }

            return response()->json(['message' => 'Đã xóa các lớp học không có sinh viên'], 200);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Không thể xử lý yêu cầu',
                'message' => $e->getMessage()
            ], 500);
        }
    }
    public function getChangeScheduleTeacher()
    {
        try {
            $redisAdminChangeSchedule = "schedule_manage_change";
            $length = Redis::llen($redisAdminChangeSchedule);
            if ($length != 0) {
                $list = Redis::lrange($redisAdminChangeSchedule, 0, -1);
                $decodedList = array_map(function ($item) {
                    return json_decode($item, true);
                }, $list);

                return response()->json([
                    'length' => $length,
                    'list' => $decodedList,
                ], 200);
            }
            return response()->json([
                'length' => 0,
                'message' => 'Danh sách rỗng'
            ], 200);
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 500);
        }
    }
    public function acceptHandleChangeSchedule(Request $request)
    {
        try {
            $redisAdminChangeSchedule = "schedule_manage_change";

            $index = $request->input('index');

            if ($index === null) {
                return response()->json(['message' => 'Index is required'], 400);
            }

            $item = Redis::lindex($redisAdminChangeSchedule, $index);

            if (!$item) {
                return response()->json(['message' => 'Item not found'], 404);
            }

            $decodedItem = json_decode($item, true);
            if ($decodedItem['old_date'] !== null) {
                $scheduleId = $decodedItem['schedule_id'] ?? null;
                $old_date = $decodedItem['old_date'] ?? null;
                $newDate = $decodedItem['new_date'] ?? null;
                $newDateFormatted = Carbon::createFromFormat('d/m/Y', $newDate)->format('Y/m/d');
                $oldDateFormatted = Carbon::createFromFormat('d/m/Y', $old_date)->format('Y/m/d');
                DB::table('schedule_lessons')
                    ->where('schedule_id', $scheduleId)
                    ->where('study_date', $oldDateFormatted)
                    ->update([
                        'study_date' => $newDateFormatted,
                        'updated_at' => now(),
                    ]);
                Redis::lrem($redisAdminChangeSchedule, 1, $item);
                return $this->getChangeScheduleTeacher();
            } else {
                $scheduleId = $decodedItem['schedule_id'] ?? null;
                $newTeacherId = $decodedItem['new_teacher_id'] ?? null;
                $date = $decodedItem['date'] ?? null;
                DB::table('schedule_lessons')
                    ->where('schedule_id', $scheduleId)
                    ->where('study_date', $date)
                    ->update([
                        'teacher_id' => $newTeacherId,
                        'updated_at' => now(),
                    ]);
                Redis::lrem($redisAdminChangeSchedule, 1, $item);
                return $this->getChangeScheduleTeacher();
            }
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 500);
        }
    }
    public function refuseHandleChangeSchedule(Request $request)
    {
        try {
            $redisAdminChangeSchedule = "schedule_manage_change";

            $index = $request->input('index');

            if ($index === null) {
                return response()->json(['message' => 'Index is required'], 400);
            }

            $item = Redis::lindex($redisAdminChangeSchedule, $index);

            Redis::lrem($redisAdminChangeSchedule, 1, $item);

            return $this->getChangeScheduleTeacher();
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 500);
        }
    }
}

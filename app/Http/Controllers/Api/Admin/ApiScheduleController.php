<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Course;
use App\Models\CourseSemester;
use App\Models\PlanSubject;
use App\Models\Schedule;
use App\Models\Subject;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ApiScheduleController extends Controller
{
    public function getSemestersByCourse($courseId)
    {
        try {
            $semesters = CourseSemester::where('course_id', $courseId)
                ->with('semester')
                ->get();

            return response()->json(["semesters" => $semesters], 200);
        } catch (ModelNotFoundException $e) {
            return response()->json(['error' => 'Không tìm thấy khóa học với ID: ' . $courseId], 404);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Không thể truy vấn tới bảng CourseSemester', 'message' => $e->getMessage()], 500);
        }
    }
    public function getMajorsByCourse($courseId)
    {
        try {
            $planId = Course::where('id', $courseId)->value('plan_id');

            $majors = PlanSubject::where('plan_id', $planId)
                ->get()
                ->pluck('majorSubject.major')
                ->unique('id')
                ->values();

            $data = $majors->map(function ($major) {
                return [
                    'id' => $major->id,
                    'name' => $major->name,
                ];
            });

            return response()->json(['majors' => $data], 200);
        } catch (ModelNotFoundException $e) {
            return response()->json(['error' => 'Không tìm thấy khóa học với ID: ' . $courseId], 404);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Không thể truy vấn tới bảng PlanSubject', 'message' => $e->getMessage()], 500);
        }
    }

    public function getSubjects($courseId, $semesterId, $majorId)
    {
        try {
            $courseSemester = CourseSemester::where('course_id', $courseId)
                ->where('semester_id', $semesterId)
                ->first();

            $subjects = PlanSubject::whereHas('majorSubject', function ($query) use ($majorId) {
                $query->where('major_id', $majorId);
            })
                ->where('semester_order', $courseSemester->order)
                ->with('majorSubject.subject')
                ->get();

            $data = $subjects->map(function ($subject) {
                return [
                    "id" => $subject->majorSubject->subject->id,
                    "name" => $subject->majorSubject->subject->name
                ];
            });

            return response()->json(['subjects' => $data], 200);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Không thể truy vấn tới bảng PlanSubject', 'message' => $e->getMessage()], 500);
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
                    'teacher_name' => $schedule->teacher->user->name,
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
            return response()->json(['error' => 'Không thể truy vấn tới bảng Classrooms', 'message' => $e->getMessage()], 500);
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
            'start_date' => 'required|date|after_or_equal:today',
            'subject_id' => 'required|exists:subjects,id',
            'days_of_week' => 'required|array',
            'days_of_week.*' => 'integer'
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
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'course_id' => 'required|exists:courses,id',
            'semester_id' => 'required|exists:semesters,id',
            'major_id' => 'required|exists:majors,id',
            'subject_id' => 'required|exists:subjects,id',
            'classroom_id' => 'required|exists:classrooms,id',
            'teacher_id' => 'required|exists:teachers,id',
            'shift_id' => 'required|exists:shifts,id',
            'room_id' => 'nullable|exists:rooms,id',
            'link' => 'nullable|sometimes|url',
            'start_date' => 'required|date|after_or_equal:today',
            'end_date' => 'required|date|after_or_equal:start_date',
            'days_of_week' => 'required|array',
            'days_of_week.*' => 'integer',
            'status' => 'boolean',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 400);
        }

        try {
            $data = $validator->validated();

            $this->validateLessonDate($data['start_date'], $data['end_date'], $data['days_of_week'], $data['subject_id']);

            $schedule = Schedule::create($data);

            $days = collect($data['days_of_week'])->mapWithKeys(fn($day) => [$day => []]);
            $schedule->days()->sync($days);

            $scheduleDates = $this->createLessonDate($schedule);

            return response()->json([
                'data' => [
                    'course_name' => $schedule->course->name,
                    'semester_name' => $schedule->semester->name,
                    'major_name' => $schedule->major->name,
                    'subject_name' => $schedule->subject->name,
                    'teacher_name' => $schedule->teacher->user->name,
                    'shift_name' => $schedule->shift->name,
                    'room_name' => $schedule->room->name,
                    'link' => $schedule->link ? $schedule->link : "NULL",
                    'start_date' => Carbon::parse($schedule->start_date)->format('d/m/Y'),
                    'end_date' => Carbon::parse($schedule->end_date)->format('d/m/Y'),
                ],
                'message' => 'Tạo mới thành công và lịch học đã được tạo thành công cho từng buổi học.',
                'scheduled_dates' => $scheduleDates
            ], 201);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Tạo mới thất bại', 'message' => $e->getMessage()], 500);
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
                'teacher_name' => $schedule->teacher->name,
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

    public function destroy(string $id)
    {
        try {
            $schedule = Schedule::findOrFail($id);
            $schedule->delete();

            return response()->json(['message' => 'Xóa thành công'], 200);
        } catch (ModelNotFoundException $e) {
            return response()->json(['error' => 'Không tìm thấy lịch học với ID: ' . $id], 404);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Xóa thất bại', 'message' => $e->getMessage()], 500);
        }
    }

    public function getAllSchedules()
    {
        try {
            $schedules = Schedule::with(['courseSemester', 'planSubject', 'classroom', 'teacher', 'shift', 'room'])
                ->get();

            $data = $schedules->map(function ($schedule) {
                return [
                    'id' => $schedule->id,
                    'course_semester_id' => $schedule->course_semester_id,
                    'plan_subject_id' => $schedule->plan_subject_id,
                    'classroom_id' => $schedule->classroom_id,
                    'teacher_id' => $schedule->teacher_id,
                    'shift_id' => $schedule->shift_id,
                    'room_id' => $schedule->room_id,
                    'link' => $schedule->link,
                    'start_date' => $schedule->start_date,
                    'end_date' => $schedule->end_date,
                    'status' => $schedule->status,
                    'created_at' => $schedule->created_at,
                    'updated_at' => $schedule->updated_at,
                ];
            });

            return response()->json(['data' => $data], 200);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Không thể truy vấn tới bảng Schedules', 'message' => $e->getMessage()], 500);
        }
    }

    // public function getDetailSchedule(string $id)
    // {
    //     try {
    //         $schedule = Schedule::with(['courseSemester', 'classroom', 'teacher', 'shift', 'room'])->findOrFail($id);

    //         $lessonDates = [];
    //         $startDate = Carbon::parse($schedule->start_date);
    //         $endDate = Carbon::parse($schedule->end_date);

    //         // Giả sử trường hợp nhà trường xếp lịch vào các ngày: Thứ Ba, Thứ Năm, Thứ Bảy
    //         $lessonDays = $schedule->getLessonDays();

    //         // Tạo các ngày học trong khoảng thời gian đã tạo
    //         for ($date = $startDate->copy(); $date->lte($endDate); $date->addDay()) {
    //             if (in_array($date->format('l'), $lessonDays)) {
    //                 $lessonDates[] = [
    //                     'date' => $date->format('d/m/Y'),
    //                     'status' => $date->lt(Carbon::now()) ? 'Đã học' : 'Chưa học',
    //                 ];
    //             }
    //         }

    //         $data = [
    //             'id' => $schedule->id,
    //             'course_name' => $schedule->courseSemester->course->name,
    //             'semester_name' => $schedule->courseSemester->semester->name,
    //             'teacher_name' => $schedule->teacher->user->name,
    //             'shift_name' => $schedule->shift->name,
    //             'room_name' => $schedule->room->name,
    //             'link' => $schedule->link ?? "NULL",
    //             'start_date' => $startDate->format('d/m/Y'),
    //             'end_date' => $endDate->format('d/m/Y'),
    //             'status' => $schedule->status ? "Đang diễn ra" : "Kết thúc",
    //             'lesson_dates' => $lessonDates,
    //         ];

    //         return response()->json(['data' => $data], 200);
    //     } catch (ModelNotFoundException $e) {
    //         return response()->json(['error' => 'Không tìm thấy lịch học với ID: ' . $id], 404);
    //     } catch (\Exception $e) {
    //         return response()->json(['error' => 'Không thể truy vấn tới lịch học', 'message' => $e->getMessage()], 500);
    //     }
    // }    
    public function getDetailSchedule(string $id)
    {
        try {
            $schedule = Schedule::with(['courseSemester', 'classroom', 'teacher', 'shift', 'room', 'lessons'])
                ->findOrFail($id);

            $data = [
                'id' => $schedule->id,
                'course_name' => $schedule->courseSemester->course->name,
                'semester_name' => $schedule->courseSemester->semester->name,
                'teacher_name' => $schedule->teacher->user->name,
                'shift_name' => $schedule->shift->name,
                'room_name' => $schedule->room->name,
                'link' => $schedule->link ?? "NULL",
                'start_date' => Carbon::parse($schedule->start_date)->format('d/m/Y'),
                'end_date' => Carbon::parse($schedule->end_date)->format('d/m/Y'),
                'status' => $schedule->lessons->isNotEmpty() && Carbon::parse($schedule->lessons->first()->date)->lt(Carbon::now()) ? "Đã học" : "Chưa học",
                'schedule_lessons' => $schedule->scheduleLessons->map(function ($lesson) {
                    return [
                        'date' => Carbon::parse($lesson->study_date)->format('d/m/Y'),
                        'status' => Carbon::parse($lesson->study_date)->lt(Carbon::now()) ? "Đã học" : "Chưa học",
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
}

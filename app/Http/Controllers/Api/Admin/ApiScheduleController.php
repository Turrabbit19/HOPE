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
    public function getMajorsByCourse($courseId)
    {
        try {
            $planId = Course::where('id', $courseId)->value('plan_id');

            $majors = PlanSubject::where('plan_id', $planId)
                                ->get()
                                ->pluck('majorSubject.major') 
                                ->unique('id') 
                                ->values(); 

            $data = $majors->map(function($major) {
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

            $data = $subjects->map(function($subject) {
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

            $data = collect($schedules->items())->map(function($schedule) {
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
            'classrooms' => 'required|array',
            'classrooms.*.id' => 'required|exists:classrooms,id',
            'classrooms.*.teacher_id' => 'required|exists:teachers,id',
            'classrooms.*.shift_id' => 'required|exists:shifts,id',
            'classrooms.*.room_id' => 'nullable|exists:rooms,id',
            'classrooms.*.link' => 'nullable|sometimes|url',
            'classrooms.*.start_date' => 'required|date|after_or_equal:today',
            'classrooms.*.end_date' => 'required|date|after_or_equal:classrooms.*.start_date',
            'classrooms.*.days_of_week' => 'required|array',
            'classrooms.*.days_of_week.*' => 'integer'
        ]);
    
        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 400);
        }
    
        try {
            $data = $validator->validated();
    
            $scheduleResponses = [];
    
            foreach ($data['classrooms'] as $classroom) {
                $this->validateLessonDate($classroom['start_date'], $classroom['end_date'], $classroom['days_of_week'], $data['subject_id']);
    
                $scheduleData = [
                    'course_id' => $data['course_id'],
                    'semester_id' => $data['semester_id'],
                    'major_id' => $data['major_id'],
                    'subject_id' => $data['subject_id'],
                    'classroom_id' => $classroom['id'],
                    'teacher_id' => $classroom['teacher_id'],
                    'shift_id' => $classroom['shift_id'],
                    'room_id' => $classroom['room_id'],
                    'link' => $classroom['link'],
                    'start_date' => $classroom['start_date'],
                    'end_date' => $classroom['end_date'],
                    'status' => $request->input('status', true)
                ];
    
                $schedule = Schedule::create($scheduleData);
    
                $days = collect($classroom['days_of_week'])->mapWithKeys(fn($day) => [$day => []]);
                $schedule->days()->sync($days);
    
                $scheduleDates = $this->createLessonDate($schedule);
    
                $scheduleResponses[] = [
                    'data' => [
                        'course_name' => $schedule->course->name,
                        'semester_name' => $schedule->semester->name,
                        'major_name' => $schedule->major->name,
                        'subject_name' => $schedule->subject->name,
                        'classroom_id' => $schedule->classroom_id,
                        'teacher_name' => $schedule->teacher->user->name,
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
                    'days_of_week' => $schedule->days->map(function($day) {
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

    public function update(Request $request, string $id)
    {
        $validator = Validator::make($request->all(), [
            'classrooms' => 'sometimes|array',
            'classrooms.*.id' => 'sometimes|exists:classrooms,id',
            'classrooms.*.teacher_id' => 'sometimes|exists:teachers,id',
            'classrooms.*.shift_id' => 'sometimes|exists:shifts,id',
            'classrooms.*.room_id' => 'nullable|sometimes|exists:rooms,id',
            'classrooms.*.link' => 'nullable|sometimes|url',
            'classrooms.*.start_date' => 'sometimes|date|after_or_equal:today',
            'classrooms.*.end_date' => 'sometimes|date|after_or_equal:classrooms.*.start_date',
            'classrooms.*.days_of_week' => 'sometimes|array',
            'classrooms.*.days_of_week.*' => 'integer'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 400);
        }

        try {
            $data = $validator->validated();

            $schedule = Schedule::findOrFail($id);

            $scheduleResponses = [];

            foreach ($data['classrooms'] as $classroom) {
                $this->validateLessonDate($classroom['start_date'], $classroom['end_date'], $classroom['days_of_week'], $schedule->subject_id);

                $scheduleData = [
                    'teacher_id' => $classroom['teacher_id'],
                    'shift_id' => $classroom['shift_id'],
                    'room_id' => $classroom['room_id'],
                    'link' => $classroom['link'],
                    'start_date' => $classroom['start_date'],
                    'end_date' => $classroom['end_date'],
                    'status' => $request->input('status', true)
                ];

                $scheduleClassroom = $schedule->classrooms()->updateOrCreate(['id' => $classroom['id']], $scheduleData);

                $days = collect($classroom['days_of_week'])->mapWithKeys(fn($day) => [$day => []]);
                $scheduleClassroom->days()->sync($days);

                $scheduleDates = $this->createLessonDate($scheduleClassroom);

                $scheduleResponses[] = [
                    'data' => [
                        'classroom_id' => $scheduleClassroom->classroom_id,
                        'teacher_name' => $scheduleClassroom->teacher->user->name,
                        'shift_name' => $scheduleClassroom->shift->name,
                        'room_name' => $scheduleClassroom->room ? $scheduleClassroom->room->name : 'NULL',
                        'link' => $scheduleClassroom->link ? $scheduleClassroom->link : "NULL",
                        'start_date' => Carbon::parse($scheduleClassroom->start_date)->format('d/m/Y'),
                        'end_date' => Carbon::parse($scheduleClassroom->end_date)->format('d/m/Y'),
                    ],
                    'scheduled_dates' => $scheduleDates
                ];
            }

            return response()->json([
                'message' => 'Cập nhật thành công và lịch học đã được cập nhật cho các lớp.',
                'schedules' => $scheduleResponses
            ], 200);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Cập nhật thất bại', 'message' => $e->getMessage()], 500);
        }
    }

    public function destroyByClassroomId(string $classroomId)
    {
        try {
            $schedule = Schedule::where('classroom_id', $classroomId)->firstOrFail();
            
            $schedule->delete();
    
            return response()->json(['message' => 'Xóa lịch học thành công'], 200);
        } catch (ModelNotFoundException $e) {
            return response()->json(['error' => 'Không tìm thấy lịch học cho lớp học này'], 404);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Xóa thất bại', 'message' => $e->getMessage()], 500);
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
                'id' => $schedule->id,
                'teacher_name' => $schedule->teacher->user->name ?? "Không có giáo viên",
                'shift_name' => $schedule->shift->name ?? "Không có ca học",
                'room_name' => $schedule->room->name ?? "Không có phòng học",
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

    public function getScheduledDates(string $scheduleId)
    {
        $schedule = Schedule::findOrFail($scheduleId);

        if (!$schedule) {
            return response()->json(['error' => 'Không tìm thấy lịch học với ID: ' . $scheduleId], 404);
        }

        $startDate = new \DateTime($schedule->start_date);
        $endDate = new \DateTime($schedule->end_date);
        
        $days = $schedule->days()->pluck('id')->toArray();

        if (empty($days)) {
            return response()->json(['error' => 'Không có ngày học được lưu cho lịch này'], 404);
        }

        $lessonsCount = $schedule->subject->lessons()->count();

        $scheduledDates = [];
        $currentDate = clone $startDate;

        while ($currentDate <= $endDate) {
            $dayOfWeek = $currentDate->format('N'); 
            $dayOfWeekAdjusted = ($dayOfWeek == 7) ? 1 : $dayOfWeek + 1;

            if (in_array($dayOfWeekAdjusted, $days)) {
                if (count($scheduledDates) < $lessonsCount) {
                    $lessonName = $schedule->subject->lessons()->pluck('name')->get(count($scheduledDates) % $lessonsCount);
                    $scheduledDates[] = $lessonName . ': ' . $currentDate->format('Y-m-d');
                } else {
                    break; 
                }
            }

            $currentDate->modify('+1 day');
        }

        return response()->json([
            'subject_name' => $schedule->subject->name,
            'scheduled_dates' => $scheduledDates,
            'total_lessons' => count($scheduledDates) 
        ], 200);
    }
}

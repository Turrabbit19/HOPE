<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Classroom;
use App\Models\CourseSemester;
use App\Models\Major;
use App\Models\MajorSubject;
use App\Models\Schedule;
use App\Models\Subject;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\Request;
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

    public function getMajorsByCourse($semesterId, $courseId)
    {
        try {
            $order = CourseSemester::where('course_id', $courseId)
                    ->where('semester_id', $semesterId)->value('order');

            $majors = Major::whereHas('students.course', fn($query) => $query->where('id', $courseId))
                    ->whereHas('subjects', fn($query) => $query->where('subjects.order', $order))
                    ->withCount('students')
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

            $subjects = MajorSubject::where('major_id', $majorId)
                ->join('subjects', 'major_subjects.subject_id', '=', 'subjects.id')
                ->where('subjects.order', $order)
                ->get();
            
            $data = $subjects->map(function($subject) {
                return [
                    "id" => $subject->id,
                    "name" => $subject->name,
                    "credit" => $subject->credit
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

            $data = collect($schedules->items())->map(function($schedule) {
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
    private function hasConflict(array $classroom, $start_date, $end_date, $days_of_week): bool
    {
        $start_date = Carbon::parse($start_date);
        $end_date = Carbon::parse($end_date);
        $shift_id = $classroom['shift_id'];
        $room_id = $classroom['room_id']; 
    
        $conflictSchedules = Schedule::where(function ($query) use ($start_date, $end_date) {
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
        $validator = Validator::make($request->all(), [
            'classrooms' => 'required|array',
            'classrooms.*.id' => 'required|exists:classrooms,id',
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
            $conflictErrors = [];
            $conflictClassrooms = []; 

            foreach ($data['classrooms'] as $classroom) {
                $startDate = $classroom['start_date'];
                $endDate = $classroom['end_date'];
                $daysOfWeek = $classroom['days_of_week'];
            
                $this->validateLessonDate($startDate, $endDate, $daysOfWeek, $subjectId);
            
                $classroomDetails = Classroom::find($classroom['id']);
                $classroomCode = $classroomDetails->code;
            
                if ($this->hasConflict($classroom, $startDate, $endDate, $daysOfWeek)) {
                    $conflictClassrooms[] = $classroomCode; 
                }
            }
            
            if (!empty($conflictClassrooms)) {
                $conflictCodes = implode(', ', $conflictClassrooms);
                $conflictErrors[] = "Các lớp {$conflictCodes} có trùng ca học hoặc ngày học đã được lên lịch.";
            }
            
            if (!empty($conflictErrors)) {
                return response()->json(['error' => $conflictErrors], 409);
            }         
    
            if (count($conflictErrors) > 0) {
                return response()->json([
                    'error' => $conflictErrors
                ], 409);
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
    
    private function hasTeacherConflict($teacherId, $scheduleId)
    {
        $newSchedule = Schedule::with('days', 'shift')->findOrFail($scheduleId);
    
        $newScheduleDays = $newSchedule->days->pluck('id')->toArray();
        $newScheduleShift = $newSchedule->shift_id;
    
        $teacherSchedules = Schedule::where('teacher_id', $teacherId)->get();
    
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

    public function updateByClassroomId(Request $request, string $id)
    {
        $validator = Validator::make($request->all(), [
            'start_date' => 'sometimes|date|after_or_equal:today',
            'end_date' => 'sometimes|date|after_or_equal:start_date',
            'days_of_week' => 'sometimes|array',
            'days_of_week.*' => 'integer',
            'shift_id' => 'sometimes|exists:shifts,id',
            'room_id' => 'nullable|exists:rooms,id',
            'link' => 'nullable|sometimes|url',
        ]);
    
        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 400);
        }
    
        try {
            $data = $validator->validated();
    
            $schedule = Schedule::findOrFail($id);
    
            $startDate = $data['start_date'] ?? $schedule->start_date;
            $endDate = $data['end_date'] ?? $schedule->end_date;
            $daysOfWeek = $data['days_of_week'] ?? $schedule->days()->pluck('id')->toArray();
            $subjectId = $schedule->subject_id;
    
            $this->validateLessonDate($startDate, $endDate, $daysOfWeek, $subjectId);
    
            $checkConflict = isset($data['start_date']) || isset($data['end_date']) ||
                             isset($data['days_of_week']) || isset($data['shift_id']) || isset($data['room_id']);
    
            if ($checkConflict && $this->hasConflict([
                'shift_id' => $data['shift_id'] ?? $schedule->shift_id,
                'room_id' => $data['room_id'] ?? $schedule->room_id,
            ], $startDate, $endDate, $daysOfWeek)) {
                return response()->json(['error' => "Lịch học có xung đột với các lịch hiện tại."], 409);
            }
    
            $resetLessonsDay = (
                ($startDate !== $schedule->start_date) ||
                ($endDate !== $schedule->end_date) ||
                ($daysOfWeek !== $schedule->days()->pluck('id')->sort()->values()->toArray())
            );
    
            $schedule->update([
                'start_date' => $startDate,
                'end_date' => $endDate,
                'shift_id' => $data['shift_id'] ?? $schedule->shift_id,
                'room_id' => $data['room_id'] ?? $schedule->room_id,
                'link' => $data['link'] ?? $schedule->link,
            ]);
    
            if (isset($data['days_of_week'])) {
                $days = collect($data['days_of_week'])->mapWithKeys(fn($day) => [$day => []]);
                $schedule->days()->sync($days);
            }
    
            $scheduleDates = [];
            if ($resetLessonsDay) {
                $schedule->lessons()->detach();
                $scheduleDates = $this->createLessonDate($schedule); 
            }
    
            return response()->json([
                'message' => 'Cập nhật lịch học thành công',
                'scheduled_dates' => $scheduleDates,
            ], 200);
        } catch (ModelNotFoundException $e) {
            return response()->json(['error' => 'Không tìm thấy lịch học với ID: ' . $id], 404);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Cập nhật thất bại', 'message' => $e->getMessage()], 500);
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

    public function getClassrooms(string $subjectid)
    {
        try {
            $schedules = Schedule::where('subject_id', $subjectid)
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
}

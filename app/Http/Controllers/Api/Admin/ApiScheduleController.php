<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
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

            if ($semesters->isEmpty()) {
                return response()->json(['error' => 'Không tìm thấy kỳ học nào cho khóa học với ID: ' . $courseId], 404);
            }

        return response()->json($semesters, 200);
        } catch (ModelNotFoundException $e) {
            return response()->json(['error' => 'Không tìm thấy khóa học với ID: ' . $courseId], 404);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Không thể truy vấn tới bảng CourseSemester', 'message' => $e->getMessage()], 500);
        }
    }
    public function getSubjects($courseId, $semesterId, $majorId)
{
    try {
        $courseSemester = CourseSemester::where('course_id', $courseId)
            ->where('semester_id', $semesterId)
            ->first();

        if (!$courseSemester) {
            return response()->json(['error' => 'Không tìm thấy kỳ học này trong khóa học'], 404);
        }

        $subjects = PlanSubject::whereHas('majorSubject', function ($query) use ($majorId) {
                $query->where('major_id', $majorId);
            })
            ->where('semester_order', $courseSemester->order) 
            ->with('majorSubject.subject')
            ->get();

        if ($subjects->isEmpty()) {
            return response()->json(['error' => 'Không tìm thấy môn học nào cho kỳ học này'], 404);
        }

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
                    'teacher_name' => $schedule->teacher->name,
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

        $scheduledDates = [];
        $currentDate = new \DateTime($startDate);

        while (count($scheduledDates) < $lessonsCount) {
            $dayOfWeek = $currentDate->format('N'); 
            $dayOfWeekAdjusted = ($dayOfWeek == 7) ? 1 : $dayOfWeek + 1;

            if (in_array($dayOfWeekAdjusted, $daysOfWeek)) {
                $scheduledDates[] = $currentDate->format('Y-m-d');
            }
            $currentDate->modify('+1 day');
        }

        return end($scheduledDates);
    }
    public function calculateEndDate(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'start_date' => 'required|date|after_or_equal:today',
            'subject_id' => 'required|exists:subjects,id',
            'days_of_week' => 'required|array',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 400);
        }

        try {
            $data = $validator->validated();

            $endDate = $this->calculateEndDateLogic($data['start_date'], $data['subject_id'], $data['days_of_week']);
            
            return response()->json(['end_date' => $endDate], 200);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Tính toán thất bại', 'message' => $e->getMessage()], 500);
        }
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'course_id' => 'required', 'exists:courses,id',
            'semester_id' => 'required', 'exists:semesters,id',
            'major_id' => 'required', 'exists:majors,id',
            'subject_id' => 'required', 'exists:subjects,id',
            'classroom_id' => 'required', 'exists:classrooms,id',
            'teacher_id' => 'required', 'exists:teachers,id',
            'shift_id' => 'required', 'exists:shifts,id',
            'room_id' => 'nullable', 'exists:rooms,id',
            'link' => 'nullable', 'sometimes', 'url',
            'start_date' => 'required', 'date', 'after_or_equal:today',
            'end_date' => 'required', 'date', 'after_or_equal:start_date',
            'days_of_week' => 'required', 'array',
            'status' => 'boolean',
        ]);
    
        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 400);
        }
    
        try {
            $data = $validator->validated();
            $schedule = Schedule::create($data);

            $days = collect($data['days_of_week'])->mapWithKeys(function ($day) {
                return [$day['id'] => []];
            });
            $schedule->days()->sync($days);
    
            return response()->json(['data' => $schedule, 'message' => 'Tạo mới thành công'], 201);
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
            'course_id' => 'sometimes|exists:courses,id',
            'semester_id' => 'sometimes|exists:semesters,id',
            'major_id' => 'sometimes|exists:majors,id',
            'subject_id' => 'sometimes|exists:subjects,id',
            'classroom_id' => 'sometimes|required|exists:classrooms,id',
            'teacher_id' => 'sometimes|required|exists:teachers,id',
            'shift_id' => 'sometimes|required|exists:shifts,id',
            'room_id' => 'nullable|required|exists:rooms,id',
            'link' => 'nullable|url',
            'start_date' => 'sometimes|required|date|after_or_equal:today',
            'end_date' => 'sometimes|required|date|after:start_date',
            'status' => 'boolean',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 400);
        }

        try {
            $schedule = Schedule::findOrFail($id);

            $data = $validator->validated();
            
            $schedule->update($data);

            if(isset($data['days_of_week'])) {
                $days = collect($data['days_of_week'])->mapWithKeys(function ($day) {
                    return [$day['id'] => []];
                });
                $schedule->days()->sync($days);
            }

            return response()->json(['data' => $schedule, 'message' => 'Cập nhật thành công'], 200);
        } catch (ModelNotFoundException $e) {
            return response()->json(['error' => 'Không tìm thấy lịch học với ID: ' . $id], 404);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Cập nhật thất bại', 'message' => $e->getMessage()], 500);
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

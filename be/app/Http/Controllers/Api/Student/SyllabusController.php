<?php

namespace App\Http\Controllers\Api\Student;

use App\Http\Controllers\Controller;

use App\Models\MajorSubject;
use App\Models\Schedule;
use App\Models\Semester;
use App\Models\Student;
use App\Models\StudentClassroom;
use App\Models\StudentLesson;
use App\Models\Subject;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Redis;

class SyllabusController extends Controller
{
    public function getSyllabus()
    {
        $user = Auth::user();

        try {
            $student = Student::where('user_id', $user->id)->firstOrFail();

            $majors = $student->majors;

            $cacheKey = "syllabus_" . implode('_', $majors->pluck('id')->toArray());

            $cachedSubjects = Redis::get($cacheKey);

            if ($cachedSubjects) {
                $subjects = json_decode($cachedSubjects, true);
            } else {
                $subjects = MajorSubject::whereIn('major_id', $majors->pluck('id'))
                    ->join('subjects', 'major_subjects.subject_id', '=', 'subjects.id')
                    ->select('subjects.id', 'subjects.name', 'subjects.credit', 'subjects.order', 'subjects.form')
                    ->orderBy('subjects.order')
                    ->get()
                    ->groupBy('order')
                    ->map(function ($subjects, $order) {
                        return [
                            'order' => $order,
                            'subjects' => $subjects->map(function ($subject) {
                                return [
                                    'id' => $subject->id,
                                    'name' => $subject->name,
                                    'credit' => $subject->credit,
                                    'form' => $subject->form ? "ONL" : "OFF"
                                ];
                            })->values()
                        ];
                    })
                    ->values();

                if ($subjects->isEmpty()) {
                    return response()->json(['error' => 'Không tìm thấy môn học cho sinh viên.'], 404);
                }

                Redis::setex($cacheKey, 31536000, json_encode($subjects));
            }

            return response()->json(['data' => $subjects], 200);
        } catch (ModelNotFoundException $e) {
            return response()->json(['error' => 'Không tìm thấy thông tin cho sinh viên đã đăng nhập.'], 404);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Không thể truy vấn dữ liệu.', 'message' => $e->getMessage()], 500);
        }
    }

    protected function getLessonAttendanceStatus($studentId, $lesson, $schedule)
    {
        $lessonDateTime = Carbon::parse($lesson->pivot->study_date)
            ->setTimeFrom(Carbon::parse($schedule->shift->start_time));

        $currentDateTime = now();

        if ($currentDateTime < $lessonDateTime) {
            return "Chưa rõ";
        }

        $studentLesson = StudentLesson::where('student_id', $studentId)
            ->where('lesson_id', $lesson->pivot->lesson_id)
            ->first();

        if (!$studentLesson) {
            return "Vắng";
        }

        return $studentLesson->status == 1 ? "Có mặt" : "Vắng";
    }
    public function getDetailClassroom($subjectId)
    {
        $user = Auth::user();

        try {
            $student = Student::where('user_id', $user->id)->firstOrFail();
            $detailSubject = Subject::findOrFail($subjectId);

            $detailClassroom = StudentClassroom::where('student_id', $student->id)
                ->whereHas('classroom', function ($query) use ($subjectId) {
                    $query->where('subject_id', $subjectId);
                })
                ->with('classroom.subject')
                ->first();

            $attendedLessons = 0;
            $totalLessons = 0;

            if ($detailClassroom) {
                $schedules = Schedule::where('classroom_id', $detailClassroom->classroom->id)
                    ->with([
                        'teacher.user',
                        'shift',
                        'room',
                        'lessons' => function ($query) {
                            $query->withPivot('study_date');
                        }
                    ])
                    ->get();

                if (!$schedules->isEmpty()) {
                    $schedulesData = $schedules->map(function ($schedule) use ($student, &$attendedLessons, &$totalLessons) {
                        $lessons = $schedule->lessons->map(function ($lesson) use ($student, $schedule, &$attendedLessons) {
                            $status = $this->getLessonAttendanceStatus($student->id, $lesson, $schedule);
                            if ($status === "Có mặt") {
                                $attendedLessons++;
                            }

                            return [
                                'name' => $lesson->name,
                                'date' => Carbon::parse($lesson->pivot->study_date)->format('d/m/Y'),
                                'status' => $status,
                            ];
                        });

                        $totalLessons += $schedule->lessons->count();

                        return [
                            'schedule_id' => $schedule->id,
                            'start_date' => Carbon::parse($schedule->start_date)->format('d/m/Y'),
                            'end_date' => Carbon::parse($schedule->end_date)->format('d/m/Y'),
                            'shift' => $schedule->shift->name,
                            'days_of_week' => $schedule->days->sortBy('id')->map(fn($day) => ["Thứ" => $day->id])->values()->toArray(),
                            'teacher_name' => $schedule->teacher->user->name,
                            'room' => $schedule->room->name ?? "Null",
                            'link' => $schedule->link ?? "Null",
                            'shift_name' => $schedule->shift->name,
                            'lessons' => $lessons,
                        ];
                    });

                    $data = [
                        'classroom' => [
                            'code' => $detailClassroom->classroom->code,
                        ],
                        'subject' => [
                            'name' => $detailSubject->name,
                            'credit' => $detailSubject->credit,
                            'description' => $detailSubject->description,
                            'form' => $detailSubject->form ? "Trực tuyến" : "Trực tiếp",
                        ],
                        'schedule' => $schedulesData,
                        'statistics' => [
                            'total_lessons' => $totalLessons,
                            'attended_lessons' => $attendedLessons,
                            'attendance_rate' => $totalLessons > 0 ? round(($attendedLessons / $totalLessons) * 100, 2) . "%" : "0%",
                        ],
                    ];
                } else {
                    $data = [
                        'subject' => [
                            'name' => $detailSubject->name,
                            'credit' => $detailSubject->credit,
                            'description' => $detailSubject->description,
                            'form' => $detailSubject->form ? "Trực tuyến" : "Trực tiếp",
                        ],
                        'message' => 'Không tìm thấy lịch học cho lớp này.',
                    ];
                }
            } else {
                $data = [
                    'subject' => [
                        'name' => $detailSubject->name,
                        'credit' => $detailSubject->credit,
                        'description' => $detailSubject->description,
                        'form' => $detailSubject->form ? "Trực tuyến" : "Trực tiếp",
                    ],
                    'message' => 'Sinh viên chưa tham gia lớp học nào cho môn này.',
                ];
            }

            return response()->json(['data' => $data], 200);
        } catch (ModelNotFoundException $e) {
            return response()->json(['error' => 'Không tìm thấy thông tin. Vui lòng kiểm tra lại dữ liệu.'], 404);
        } catch (\Exception $e) {
            Log::error("Lỗi khi lấy chi tiết lớp học: " . $e->getMessage());
            return response()->json(['error' => 'Không thể truy vấn dữ liệu.', 'message' => $e->getMessage()], 500);
        }
    }

    public function getStatisticsBySubject($semesterId)
    {
        $user = Auth::user();

        try {
            $student = Student::where('user_id', $user->id)->firstOrFail();

            $semester = Semester::findOrFail($semesterId);
            $semesterStartDate = Carbon::parse($semester->start_date);
            $semesterEndDate = Carbon::parse($semester->end_date);

            $classrooms = StudentClassroom::where('student_id', $student->id)
                ->whereHas('classroom.schedules', function ($query) use ($semesterStartDate, $semesterEndDate) {
                    $query->whereBetween('start_date', [$semesterStartDate, $semesterEndDate])
                        ->whereBetween('end_date', [$semesterStartDate, $semesterEndDate]);
                })
                ->with([
                    'classroom.subject',
                    'classroom.schedules.lessons' => function ($query) {
                        $query->withPivot('study_date');
                    }
                ])
                ->get();

            if ($classrooms->isEmpty()) {
                return response()->json(['error' => 'Không tìm thấy lớp học trong kỳ học này.'], 404);
            }

            $statistics = $classrooms->map(function ($studentClassroom) use ($student) {
                $subject = $studentClassroom->classroom->subject;
                $schedules = $studentClassroom->classroom->schedules;

                $totalLessons = 0;
                $attendedLessons = 0;
                $missedLessons = 0;
                $remainingLessons = 0;

                foreach ($schedules as $schedule) {
                    foreach ($schedule->lessons as $lesson) {
                        $totalLessons++;

                        $lessonDateTime = Carbon::parse($lesson->pivot->study_date)
                            ->setTimeFrom(Carbon::parse($schedule->shift->start_time));

                        $currentDateTime = now();

                        if ($currentDateTime < $lessonDateTime) {
                            $status = "Chưa rõ";
                        } else {
                            $studentLesson = StudentLesson::where('student_id', $student->id)
                                ->where('lesson_id', $lesson->pivot->lesson_id)
                                ->first();

                            if (!$studentLesson) {
                                $status = "Vắng";
                                $missedLessons++;
                            } else {
                                $status = $studentLesson->status == 1 ? "Có mặt" : "Vắng";
                                if ($status === "Có mặt") {
                                    $attendedLessons++;
                                }
                            }
                        }
                    }
                }

                $remainingLessons = $totalLessons - $attendedLessons - $missedLessons;

                return [
                    'subject_name' => $subject->name,
                    'subject_credit' => $subject->credit,
                    'subject_description' => $subject->description,
                    'total_lessons' => $totalLessons,
                    'attended_lessons' => $attendedLessons,
                    'missed_lessons' => $missedLessons,
                    'remaining_lessons' => $remainingLessons,
                    'attendance_rate' => $totalLessons > 0 ? round(($attendedLessons / $totalLessons) * 100, 2) . "%" : "0%",
                ];
            });

            return response()->json(['data' => $statistics], 200);
        } catch (ModelNotFoundException $e) {
            return response()->json(['error' => 'Không tìm thấy thông tin cho sinh viên hoặc kỳ học.'], 404);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Không thể truy vấn dữ liệu.', 'message' => $e->getMessage()], 500);
        }
    }
}

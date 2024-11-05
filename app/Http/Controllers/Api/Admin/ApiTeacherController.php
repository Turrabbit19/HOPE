<?php

namespace App\Http\Controllers\Api\Admin;

use Exception;
use Carbon\Carbon;
use App\Models\Teacher;
use App\Models\Schedule;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Database\Eloquent\ModelNotFoundException;

class ApiTeacherController extends Controller
{
    public function GetInfoTeacher() {
        try {
            $teachers = Teacher::get();
            $data = $teachers->map(function ($teacher) {
                return [
                    'id' => $teacher->id,
                    'user_id'=>$teacher->user->name,
                    'major_id'=>$teacher->major->name,
                    'teacher_code'=>$teacher->teacher_code,
                    'status'=>$teacher->status ? "Đang dạy" : "Đã nghỉ",
                ];
            });
            return response()->json(['data' => $data], 200);
        } catch (Exception $e) {
            return response()->json(['error' => 'Không thể truy vấn tới bảng Students', 'message' => $e->getMessage()], 500);
        }
    }

    public function TeachingSchedule(string $teacherId) {
        try {
            $schedules = Schedule::with(['courseSemester', 'classroom', 'teacher', 'shift', 'room', 'lessons'])
                ->where('teacher_id', $teacherId)
                ->get();
    
            $data = $schedules->map(function ($schedule) {
                return [
                    'id' => $schedule->id,
                    'Môn học' => $schedule->courseSemester->course->name,
                    'Kỳ học' => $schedule->courseSemester->semester->name,
                    'Tên giảng viên' => $schedule->teacher->user->name,
                    'Ca dạy' => $schedule->shift->name,
                    'Phòng' => $schedule->room->name,
                    'link meet' => $schedule->link ?? "NULL",
                    'Ngày bắt đầu' => Carbon::parse($schedule->start_date)->format('d/m/Y'),
                    'Ngày kết thúc' => Carbon::parse($schedule->end_date)->format('d/m/Y'),
                    'Trạng thái' => $schedule->lessons->isNotEmpty() && Carbon::parse($schedule->lessons->first()->date)->lt(Carbon::now()) ? "Đang dạy" : "Kết thúc",
                    'Lịch dạy' => $schedule->scheduleLessons->map(function ($lesson) {
                        return [
                            'Ngày' => Carbon::parse($lesson->study_date)->format('d/m/Y'),
                            'Trạng thái' => Carbon::parse($lesson->study_date)->lt(Carbon::now()) ? "Đã dạy" : "Chưa dạy",
                        ];
                    }),
                ];
            });
    
            return response()->json(['data' => $data], 200);
        } catch (ModelNotFoundException $e) {
            return response()->json(['error' => 'Không tìm thấy lịch dạy của giảng viên với ID: ' . $teacherId], 404);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Không thể truy vấn tới lịch học', 'message' => $e->getMessage()], 500);
        }
    }    
}

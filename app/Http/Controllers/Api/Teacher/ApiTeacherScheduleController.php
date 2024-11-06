<?php

namespace App\Http\Controllers\Api\Teacher;

use Exception;
use Carbon\Carbon;
use App\Models\Teacher;
use App\Models\Schedule;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use Illuminate\Database\Eloquent\ModelNotFoundException;

class ApiTeacherScheduleController extends Controller
{
    public function GetInfoTeacher()
    {
        try {
            $teacher = Auth::user()->teacher;
            if (!$teacher) {
                return response()->json(['error' => 'Không tìm thấy thông tin giảng viên'], 404);
            }
            $data = [
                'id' => $teacher->id,
                'user_id' => $teacher->user->name, 
                'major_id' => $teacher->major->name, 
                'teacher_code' => $teacher->teacher_code, 
                'status' => $teacher->status ? "Đang dạy" : "Đã nghỉ", 
            ];
    
            return response()->json(['data' => $data], 200);
        } catch (Exception $e) {
            return response()->json(['error' => 'Không thể truy vấn tới thông tin giảng viên', 'message' => $e->getMessage()], 500);
        }
    }
    

    public function TeachingSchedule()
    {
        $user = Auth::user();
        $teacher = Teacher::where('user_id', $user->id)->first();
        if (!$teacher) {
            return response()->json(['message' => 'Không tìm thấy giảng viên với user này'], 404);
        }
        try {
            $schedules = Schedule::with(['courseSemester', 'classroom', 'teacher', 'shift', 'room', 'lessons','user'])
                ->where('teacher_id', $teacher->id)->get();
            if ($schedules->isEmpty()) {
                return response()->json(['message' => 'Không tìm thấy lịch dạy cho giảng viên này'], 404);
            }
            $data = $schedules->map(function ($schedule) {
                return [
                    'id' => $schedule->id,
                    'name'=> $schedule->teacher->user->name,
                    'Subject' => $schedule->subject->name,
                    'major_code'=> $schedule->major->code,
                    'shift' => $schedule->shift->name,
                    'room' => $schedule->room->name,
                    'link' => $schedule->link ?? "NULL",
                    'start_date' => Carbon::parse($schedule->start_date)->format('d/m/Y'),
                    'end_date' => Carbon::parse($schedule->end_date)->format('d/m/Y'),
                    'Teaching schedule' => $schedule->lessons->map(function ($lesson) {
                        return [
                            'date' => Carbon::parse($lesson->pivot->study_date)->format('d/m/Y'),
                            'status' => Carbon::parse($lesson->pivot->study_date)->lt(Carbon::now()) ? "Đã dạy" : "Chưa dạy",
                        ];
                    }),
                ];
            });
            return response()->json(['data' => $data], 200);
        } catch (ModelNotFoundException $e) {
            return response()->json(['error' => 'Không tìm thấy lịch dạy của giảng viên'], 404);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Không thể truy vấn tới lịch dạy', 'message' => $e->getMessage()], 500);
        }
    }
}
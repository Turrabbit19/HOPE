<?php

namespace App\Http\Controllers\Api\Student;

use App\Http\Controllers\Controller;
use App\Models\NotificationCourse;
use App\Models\Student;
use App\Models\StudentNotification;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Support\Facades\Auth;

class ApiClientController extends Controller
{
    public function getStudentDetail()
    {
        $user = Auth::user();

        try {
            $student = Student::with(['user', 'course', 'major'])->where('user_id', $user->id)->firstOrFail();
            
            $data = [
                'id' => $student->id,
                'avatar' => $student->user->avatar,
                'name' => $student->user->name,
                'email' => $student->user->email,
                'phone' => $student->user->phone,
                'dob' => Carbon::parse($student->user->dob)->format('d/m/Y'),
                'gender' => $student->user->gender ? "Nam" : "Nữ",
                'ethnicity' => $student->user->ethnicity,
                'address' => $student->user->address,
                
                'student_code' => $student->student_code,
                'course_name' => $student->course->name,
                'major_name' => $student->major->name,
                'current_semester' => $student->current_semester,
                'status' => match($student->status) {
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

    public function getStudentNotifications()
    {
        $user = Auth::user();

        try {
            $student = Student::where('user_id', $user->id)->firstOrFail();

            $studentNotifications = StudentNotification::where('student_id', $student->id)
                ->with('notification') 
                ->paginate(9);

            $data = collect($studentNotifications->items())->map(function ($notificationCourse) {
                return [
                    'id' => $notificationCourse->notification->id,
                    'notification' => $notificationCourse->notification->name,
                    'description' => $notificationCourse->notification->description,
                    'status' => $notificationCourse->status ? "Đã xem" : "Chưa xem", 
                ];
            });

            return response()->json([
                'data' => $data,
                'pagination' => [
                    'total' => $studentNotifications->total(),
                    'per_page' => $studentNotifications->perPage(),
                    'current_page' => $studentNotifications->currentPage(),
                    'last_page' => $studentNotifications->lastPage(),
                ]
            ], 200);
        } catch (ModelNotFoundException $e) {
            return response()->json(['error' => 'Không tìm thấy thông tin sinh viên'], 404);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Không thể truy vấn tới bảng Notification_Courses', 'message' => $e->getMessage()], 500);
        }
    }

    public function getSchedule()
    {
        $user = Auth::user();

        try {
            $student = Student::where('user_id', $user->id)->firstOrFail();
            
            $schedules = $student->schedules->map(function ($schedule) {
                return [
                   'id' => $schedule->id,
                    'course_name' => $schedule->course->name,
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

            return response()->json(['data' => $schedules], 200);
        } catch (ModelNotFoundException $e) {
            return response()->json(['error' => 'Không tìm thấy thông tin cho sinh viên đã đăng nhập.'], 404);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Không thể truy vấn tới bảng Schedule', 'message' => $e->getMessage()], 500);
        }
    }
}

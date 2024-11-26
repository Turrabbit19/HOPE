<?php

namespace App\Http\Controllers\Api\Student;

use App\Http\Controllers\Controller;
use App\Models\Student;
use App\Models\StudentNotification;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Support\Facades\Auth;

class StudentNoticeController extends Controller
{
    private function getStudent()
    {
        $user = Auth::user();
        return Student::where('user_id', $user->id)->firstOrFail();
    }

    private function getNotificationsByStatus($studentId, $status = null)
    {
        $query = StudentNotification::where('student_id', $studentId)->with('notification');

        if (!is_null($status)) {
            $query->where('status', $status);
        }

        return $query->paginate(9);
    }

    private function formatNotifications($notifications)
    {
        return collect($notifications->items())->map(function ($notification) {
            return [
                'id' => $notification->notification->id,
                'notification' => $notification->notification->name,
                'description' => $notification->notification->description,
                'status' => $notification->status ? "Đã xem" : "Chưa xem",
            ];
        });
    }

    private function jsonResponse($notifications)
    {
        return response()->json([
            'data' => $this->formatNotifications($notifications),
            'pagination' => [
                'total' => $notifications->total(),
                'per_page' => $notifications->perPage(),
                'current_page' => $notifications->currentPage(),
                'last_page' => $notifications->lastPage(),
            ]
        ], 200);
    }

    public function getStudentNotifications()
    {
        try {
            $student = $this->getStudent();
            $notifications = $this->getNotificationsByStatus($student->id);

            return $this->jsonResponse($notifications);
        } catch (ModelNotFoundException $e) {
            return response()->json(['error' => 'Không tìm thấy thông tin sinh viên'], 404);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Không thể truy vấn tới bảng Student_Notifications', 'message' => $e->getMessage()], 500);
        }
    }

    public function getUnreadNotifications()
    {
        try {
            $student = $this->getStudent();
            $notifications = $this->getNotificationsByStatus($student->id, 0);

            return $this->jsonResponse($notifications);
        } catch (ModelNotFoundException $e) {
            return response()->json(['error' => 'Không tìm thấy thông tin sinh viên'], 404);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Không thể truy vấn tới bảng Student_Notifications', 'message' => $e->getMessage()], 500);
        }
    }

    public function getReadNotifications()
    {
        try {
            $student = $this->getStudent();
            $notifications = $this->getStudentNotificationsByStatus($student->id, 1);

            return $this->jsonResponse($notifications);
        } catch (ModelNotFoundException $e) {
            return response()->json(['error' => 'Không tìm thấy thông tin sinh viên'], 404);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Không thể truy vấn tới bảng Student_Notifications', 'message' => $e->getMessage()], 500);
        }
    }

    public function detailNotification($id)
    {
        try {
            $student = $this->getStudent();
            
            $notification = StudentNotification::where('student_id', $student->id)
                ->where('notification_id', $id)
                ->firstOrFail();

            if ($notification->status == 0) { 
                $notification->status = 1;
                $notification->save(); 
            }

            $data = [
                'id' => $notification->notification->id,
                'notification' => $notification->notification->name,
                'description' => $notification->notification->description,
                'status' => $notification->status ? "Đã xem" : "Chưa xem",
            ];

            return response()->json(['notification' => $data], 200);
        } catch (ModelNotFoundException $e) {
            return response()->json(['error' => 'Không tìm thấy thông tin sinh viên'], 404);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Không thể truy vấn tới bảng Student_Notifications', 'message' => $e->getMessage()], 500);
        }
    }
}

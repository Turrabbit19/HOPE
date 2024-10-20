<?php

namespace App\Http\Controllers\Api\Student;

use Illuminate\Http\Request;
use App\Models\StudentNotification;
use Illuminate\Support\Facades\Validator;
use App\Http\Controllers\Controller;
use Illuminate\Database\Eloquent\ModelNotFoundException;

class ApiStudentNotificationController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        try {
            $StudentNotifications = StudentNotification::paginate(9);

            $data = collect($StudentNotifications->items())->map(function ($StudentNotification) {
                return [
                    'id' => $StudentNotification->id,
                    'student_code' => $StudentNotification->student->student_code, 
                    'notification' => $StudentNotification->notification->name, 
                    'status' => $StudentNotification->status ? "đã xem" : "chưa xem",
                ];
            });
    
            return response()->json([
                'data' => $data,
                'pagination' => [
                    'total' => $StudentNotifications->total(),
                    'per_page' => $StudentNotifications->perPage(),
                    'current_page' => $StudentNotifications->currentPage(),
                    'last_page' => $StudentNotifications->lastPage(),
                ]
            ], 200);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Không thể truy vấn tới bảng Student_Notifications', 'message' => $e->getMessage()], 500);
        }
    }
    

    /**
     * Store a newly created resource in storage.
     */
    //  public function store(Request $request)
    // {
    //     
    // }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        try {
            $StudentNotifications = StudentNotification::findOrFail($id);
            $data = [
                'id' => $StudentNotifications->id,
                'student_code' => $StudentNotifications->student->student_code, 
                'notification' => $StudentNotifications->notification->name, 
                'status' => $StudentNotifications->status ? "đã xem" : "chưa xem",
            ];

            return response()->json(['data' => $data], 200);
        } catch (ModelNotFoundException $e) {
            return response()->json(['error' => 'Không tìm thấy thông báo với ID: ' . $id], 404);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Không thể truy vấn tới bảng Notifications', 'message' => $e->getMessage()], 500);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    // public function update(Request $request, string $id)
    // {
    //     
    // }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        try {
            $notification = StudentNotification::findOrFail($id);
            $notification->delete();
            return response()->json(['message' => 'Xóa mềm thành công'], 200);
        } catch (ModelNotFoundException $e) {
            return response()->json(['error' => 'Không tìm thấy thông báo với ID: ' . $id], 404);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Xóa mềm thất bại', 'message' => $e->getMessage()], 500);
        }
    }

    public function getUnreadStudents()
    {
        try {
            $notifications = StudentNotification::where('status', 0)->get();
            return response()->json($notifications, 200);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Không thể truy vấn tới bảng Student_Notifications', 'message' => $e->getMessage()], 500);
        }
    }
    
      public function getReadStudents()
    {
        try {
            $notifications = StudentNotification::where('status', 1)->get();
            return response()->json($notifications, 200);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Không thể truy vấn tới bảng Student_Notifications', 'message' => $e->getMessage()], 500);
        }
    }
}

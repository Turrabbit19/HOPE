<?php

namespace App\Http\Controllers\Api\Admin;

use App\Events\NotificationEvent;
use App\Http\Controllers\Controller;
use App\Models\Notification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\ModelNotFoundException;

class ApiNotificationController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        try {
            $notifications = Notification::select('id', 'section_id', 'description', 'time')->paginate(9);
            return response()->json(['data' => $notifications], 200);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Không thể truy vấn tới bảng Notifications', 'message' => $e->getMessage()], 500);
        }
    }

    public function getAll()
    {
        try {
            $notifications = Notification::select('id', 'section_id', 'description', 'time')->get();
            return response()->json(['data' => $notifications], 200);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Không thể truy vấn tới bảng Notifications', 'message' => $e->getMessage()], 500);
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'section_id' => 'required|exists:sections,id',   
            'name' => 'required|string|max:255|unique:notifications',   
            'description' => 'required|string',  
            'time' => 'required|date_format:Y-m-d H:i:s',
            'notification_courses' => 'required|array',
            'notification_courses.*.id' => 'required|exists:notification_courses,id',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 400);
        }

        try {
            $data = $validator->validated();
            $notifications = Notification::create($data);

            $notification_courses = collect($data['notification_courses'])->mapWithKeys(function ($notification_courses) {
                return [$notification_courses['id'] => []];
            });
            
            $notifications->notifications()->sync($notification_courses);
            
            broadcast(new NotificationEvent($notifications));

            return response()->json(['data' => $notifications, 'message' => 'Tạo mới thành công'], 201);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Tạo mới thất bại', 'message' => $e->getMessage()], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        try {
            $notification = Notification::findOrFail($id);
            return response()->json(['data' => $notification], 200);
        } catch (ModelNotFoundException $e) {
            return response()->json(['error' => 'Không tìm thấy id'], 404);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Không thể truy vấn tới bảng Notifications', 'message' => $e->getMessage()], 500);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $validator = Validator::make($request->all(), [
            'section_id' => 'sometimes|exists:sections,id',   
            'name' => 'sometimes|string|max:255|unique:notifications,name,' . $id,   
            'description' => 'sometimes|string',  
            'time' => 'sometimes|date_format:Y-m-d H:i:s',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 400);
        }

        try {
            $notification = Notification::findOrFail($id);
            
            $data = $validator->validated();
            $data['updated_at'] = Carbon::now();
            $notification->update($data);

            return response()->json(['data' => $notification, 'message' => 'Cập nhật thành công'], 200);
        } catch (ModelNotFoundException $e) {
            return response()->json(['error' => 'Không tìm thấy id'], 404);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Cập nhật thất bại', 'message' => $e->getMessage()], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        try {
            $notification = Notification::findOrFail($id);
            $notification->delete();
            return response()->json(['message' => 'Xóa mềm thành công'], 200);
        } catch (ModelNotFoundException $e) {
            return response()->json(['error' => 'Không tìm thấy id'], 404);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Xóa mềm thất bại', 'message' => $e->getMessage()], 500);
        }
    }
}
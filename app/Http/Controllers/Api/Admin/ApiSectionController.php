<?php

namespace App\Http\Controllers\Api\Admin;

use Carbon\Carbon;
use App\Models\Section;
use App\Models\Notification;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Validator;
use Illuminate\Database\Eloquent\ModelNotFoundException;

class ApiSectionController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        try {
            $sections = Section::get();
            $data = $sections->map(function ($section) {
               return[
                    'id' => $section->id,
                    'name' => $section->name,
               ]; 
            });
            return response()->json(['data' => $data], 200);
        } catch (\Exception $e) {
            return response()->json(['error'=>'Không thể truy vấn tới bảng Sections', 'message' => $e->getMessage()], 500);
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:100|unique:sections',   
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 400);
        }

        try {
            $data = $validator->validated();
            $section = Section::create($data);
            
            return response()->json(['data' => $section, 'message' => 'Tạo mới thành công'], 201);
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
            $section = Section::findOrFail($id);
            $data = [
                    'id' => $section->id,
                    'name' => $section->name,
                ];

            return response()->json(['data' => $data], 200);
        } catch (ModelNotFoundException $e) {
            return response()->json(['error' => 'Không tìm thấy phần mục với ID: ' . $id], 404);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Không thể truy vấn tới bảng Sections', 'message' => $e->getMessage()], 500);
        }
    }

    public function update(Request $request, string $id)
    {
         $validator = Validator::make($request->all(), [
            'name' => 'sometimes|string|max:100|unique:sections,name,' . $id,   
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 400);
        }

        try {
            $section = Section::findOrFail($id);
            
            $data = $validator->validated();
            $section->update($data);

            return response()->json(['data' => $section, 'message' => 'Cập nhật thành công'], 200);
        } catch (ModelNotFoundException $e) {
            return response()->json(['error' => 'Không tìm thấy phần mục với ID: ' . $id], 404);
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
            $section = Section::findOrFail($id);
            $section->delete();
            return response()->json(['message' => 'Xóa mềm thành công'], 200);
        } catch (ModelNotFoundException $e) {
            return response()->json(['error' => 'Không tìm thấy phần mục với ID: ' . $id], 404);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Xóa mềm thất bại', 'message' => $e->getMessage()], 500);
        }
    }

    public function getNotificationsBySection(string $sectionId)
{
    try {
        // Truy vấn notifications dựa trên section_id và load quan hệ 'sections'
        $notifications = Notification::where('section_id', $sectionId)->with('sections')->get();
        
        // Lọc và định dạng dữ liệu
        $data = $notifications->map(function ($notification) {
            return [
                'id' => $notification->id,
                'name' => $notification->name,
                'description' => $notification->description,
                'time' => $notification->time ? $notification->time->format('Y-m-d H:i:s') : null,
                'section' => $notification->sections ? $notification->sections->name : null, // Lấy tên của section liên quan
            ];
        });

        // Trả về kết quả JSON
        return response()->json(['data' => $data], 200);
    } catch (ModelNotFoundException $e) {
        return response()->json(['error' => 'Không tìm thấy danh mục với ID: ' . $sectionId], 404);
    } catch (\Exception $e) {
        return response()->json(['error' => 'Không thể truy vấn tới bảng Notifications', 'message' => $e->getMessage()], 500);
    }
}

    
}
<?php

namespace App\Http\Controllers\Api\Admin;

use App\Models\Shift;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use App\Http\Controllers\Controller;
use Carbon\Carbon;

class ApiShiftController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        try {
            $shifts = Shift::select('id', 'name', 'start_time', 'end_time')->get();
            return response()->json(['data' => $shifts], 200);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Không thể truy vấn tới bảng Shifts', 'message' => $e->getMessage()], 500);
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:100|unique:shifts', 
            'start_time' => 'required|date_format:H:i:s',
            'end_time' =>  'required|date_format:H:i:s|after_or_equal:start_time', 
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 400);
        }

        try {
            $data = $validator->validated();
            $shift = Shift::create($data);
            
            return response()->json(['data' => $shift, 'message' => 'Tạo mới thành công'], 201);
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
            $shift = Shift::findOrFail($id);
            return response()->json(['data' => $shift], 200);
        } catch (ModelNotFoundException $e) {
            return response()->json(['error' => 'Không tìm thấy id'], 404);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Không thể truy vấn tới bảng Shifts', 'message' => $e->getMessage()], 500);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'sometimes|string|max:100|unique:shifts,name,' . $id,
            'start_time' => 'sometimes|date_format:H:i:s',
            'end_time' =>  'sometimes|date_format:H:i:s|after_or_equal:start_time', 
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 400);
        }

        try {
            $shift = Shift::findOrFail($id);
            
            $data = $validator->validated();
            $data['updated_at'] = Carbon::now();
            $shift->update($data);

            return response()->json(['data' => $shift, 'message' => 'Cập nhật thành công'], 200);
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
            $shift = Shift::findOrFail($id);
            $shift->delete();
            return response()->json(['message' => 'Xóa mềm thành công'], 200);
        } catch (ModelNotFoundException $e) {
            return response()->json(['error' => 'Không tìm thấy id'], 404);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Xóa mềm thất bại', 'message' => $e->getMessage()], 500);
        }
    }
}
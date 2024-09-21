<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Teacher;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Support\Facades\Validator;
use Illuminate\Http\Request;

class ApiTeacherController extends Controller
{
    public function index()
    {
        try {
            $teachers = Teacher::select('id', 'user_id', 'major_id', 'teacher_code')->paginate(9);
            return response()->json(['data' => $teachers], 200);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Không thể truy vấn tới bảng Teachers', 'message' => $e->getMessage()], 500);
        }
    }

    public function getAll()
    {
        try {
            $teachers = Teacher::select('id', 'user_id', 'major_id', 'teacher_code')->get();
            return response()->json(['data' => $teachers], 200);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Không thể truy vấn tới bảng Teachers', 'message' => $e->getMessage()], 500);
        }
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'user_id' => 'required|exists:users,id',
            'major_id' => 'required|exists:majors,id',
            'teacher_code' => 'required|string|max:19|unique:teachers',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 400);
        }

        try {
            $data = $validator->validated();
            $teacher = Teacher::create($data);
            
            return response()->json(['data' => $teacher, 'message' => 'Tạo mới thành công'], 201);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Tạo mới thất bại', 'message' => $e->getMessage()], 500);
        }
    }

    public function show(string $id)
    {
        try {
           $teacher = Teacher::findOrFail($id);
            return response()->json(['data' =>$teacher], 200);
        } catch (ModelNotFoundException $e) {
            return response()->json(['error' => 'Không tìm thấy id'], 404);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Không thể truy vấn tới bảng Teachers', 'message' => $e->getMessage()], 500);
        }
    }

    public function update(Request $request, string $id)
    {
        $validator = Validator::make($request->all(), [
            'user_id' => 'required|exists:users,id',
            'major_id' => 'required|exists:majors,id',
            'teacher_code' => 'required|string|max:19|unique:teachers,teacher_code,' . $id
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 400);
        }

        try {
            $teacher = Teacher::findOrFail($id);
            
            $data = $request->all();
            $data['updated_at'] = Carbon::now();
            $teacher->update($data);

            return response()->json(['data' => $teacher, 'message' => 'Cập nhật thành công'], 200);
        } catch (ModelNotFoundException $e) {
            return response()->json(['error' => 'Không tìm thấy id'], 404);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Cập nhật thất bại', 'message' => $e->getMessage()], 500);
        }
    }

    public function destroy(string $id)
    {
        try {
            $teacher = Teacher::findOrFail($id);
            $teacher->delete();
            return response()->json(['message' => 'Xóa mềm thành công'], 200);
        } catch (ModelNotFoundException $e) {
            return response()->json(['error' => 'Không tìm thấy id'], 404);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Xóa mềm thất bại', 'message' => $e->getMessage()], 500);
        }
    }
}
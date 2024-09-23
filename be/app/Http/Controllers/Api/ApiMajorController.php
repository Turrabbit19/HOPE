<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Major;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ApiMajorController extends Controller
{
    public function index()
    {
        try {
            // $majors = Major::all();
            // $majorsName = $majors->pluck('name');
            // return response()->json(['name' => $majorsName], 200);
            $majors = Major::all();
            $majorsData = $majors->map(function ($major) {
                return [
                    'name' => $major->name,
                    'status' => $major->status,
                    'id' => $major->id
                ];
            });
            return response()->json(['majors' => $majorsData], 200);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Không thể truy vấn tới bảng Majors', 'message' => $e->getMessage()], 500);
        }
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:50|unique:majors'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 400);
        }

        try {
            $data = $validator->validated();
            $major = Major::create($data);

            return response()->json(['data' => $major, 'message' => 'Tạo mới thành công'], 201);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Tạo mới thất bại', 'message' => $e->getMessage()], 500);
        }
    }

    private function generateCodeFromName($name){
        $words = explode(" ", $name);
        $initial = "";
        foreach($words as $word){
            $initial .= strtoupper(substr($word, 0, 1));
        }
        // $randomNumber = rand(100, 999)
        return $initial;
    }

    public function show(string $id)
    {
        try {
            $major = Major::findOrFail($id);
            return response()->json(['data' => $major], 200);
        } catch (ModelNotFoundException $e) {
            return response()->json(['error' => 'Không tìm thấy id'], 404);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Không thể truy vấn tới bảng Majors', 'message' => $e->getMessage()], 500);
        }
    }

    public function update(Request $request, string $name)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:50|unique:majors'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 400);
        }

        try {
            $major = Major::where('name', $name)->firstOrfail();

            $data = $request->all();
            $data['updated_at'] = Carbon::now();
            $major->update($data);

            return response()->json(['data' => $major, 'message' => 'Cập nhật thành công'], 200);
        } catch (ModelNotFoundException $e) {
            return response()->json(['error' => 'Không tìm thấy tên'], 404);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Cập nhật thất bại', 'message' => $e->getMessage()], 500);
        }
    }

    public function destroy(string $name)
    {
        try {
            $major = Major::findOrFail($name);
            $major->delete();
            return response()->json(['message' => 'Xóa mềm thành công'], 200);
        } catch (ModelNotFoundException $e) {
            return response()->json(['error' => 'Không tìm thấy id'], 404);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Xóa mềm thất bại', 'message' => $e->getMessage()], 500);
        }
    }
}

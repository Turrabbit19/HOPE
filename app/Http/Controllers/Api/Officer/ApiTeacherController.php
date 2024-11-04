<?php

namespace App\Http\Controllers\Api\Officer;

use App\Http\Controllers\Controller;
use App\Models\Teacher;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class ApiTeacherController extends Controller
{
    public function index(Request $request)
    {
        try {
            $perPage = $request->input('per_page', 9);

            $teachers = Teacher::paginate($perPage);

            $data = collect($teachers->items())->map(function ($teacher) {
                return [
                    "id" => $teacher->id,
                    "avatar" => $teacher->user->avatar,
                    "code" => $teacher->teacher_code,
                    "name" => $teacher->user->name,
                    "email" => $teacher->user->email,
                    "phone" => $teacher->user->phone,

                    'major_name' => $teacher->major->name,
                    'status' => match($teacher->status) {
                        "0" => "Đang dạy",
                        "1" => "Tạm dừng",
                        "2" => "Kết thúc",
                        default => "Không xác định"
                    },
                ];
            });

            return response()->json([
                'data' => $data,
                'pagination' => [
                        'total' => $teachers->total(),
                        'per_page' => $teachers->perPage(),
                        'current_page' => $teachers->currentPage(),
                        'last_page' => $teachers->lastPage(),
                    ],
            ], 200);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Không thể truy vấn tới bảng Teachers', 'message' => $e->getMessage()], 500);
        }
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'avatar' => 'nullable|string', 
            'name' => 'required|string|max:50',
            'email' => 'required|string|email|max:255|unique:users',
            'phone' => 'required|string|max:10|unique:users',
            'dob' => 'required|date|before:today',
            'gender' => 'required|boolean',
            'ethnicity' => 'required|string|max:50',
            'address' => 'required|string|max:255',

            'teacher_major_id' => 'required|exists:majors,id',

            'teacher_code' => 'required|unique:teachers,teacher_code',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 400);
        }

        try {
            $data = $validator->validated();

            $user = User::create([
                'avatar' => $data['avatar'],
                'name' => $data['name'],
                'email' => $data['email'],
                'phone' => $data['phone'],
                'dob' => $data['dob'],
                'gender' => $data['gender'],
                'ethnicity' => $data['ethnicity'],
                'address' => $data['address'],
                'password' => Hash::make("123456789"),
                'role_id' => 3,
            ]);

            $teacher = Teacher::create([
                'user_id' => $user->id,
                'major_id' => $data['teacher_major_id'],
                'teacher_code' => $data['teacher_code'],
            ]);    

            $teacherData = [
                'avatar' => $user->avatar,
                'name' => $user->name,
                'email' => $user->email,
                'phone' => $user->phone,
                'dob' => Carbon::parse($user->dob)->format('d/m/Y'),
                'gender' => $user->gender ? "Nam" : "Nữ",
                'ethnicity' => $user->ethnicity,
                'address' => $user->address,

                'teacher_code' => $teacher->teacher_code,
                'major_name' => $teacher->major->name,
            ];

            return response()->json(['data' => $teacherData, 'message' => 'Tạo mới thành công'], 201);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Tạo mới thất bại', 'message' => $e->getMessage()], 500);
        }
    }

    public function show(string $id)
    {
        try {
            $teacher = Teacher::findOrFail($id);
            
            $data = [
                'id' => $teacher->id,
                'avatar' => $teacher->user->avatar,
                'name' => $teacher->user->name,
                'email' => $teacher->user->email,
                'phone' => $teacher->user->phone,
                'dob' => Carbon::parse($teacher->user->dob)->format('d/m/Y'),
                'gender' => $teacher->user->gender ? "Nam" : "Nữ",
                'ethnicity' => $teacher->user->ethnicity,
                'address' => $teacher->user->address,

                'teacher_code' => $teacher->teacher_code,
                'major_name' => $teacher->major->name,
                'status' => match($teacher->status) {
                    "0" => "Đang dạy",
                    "1" => "Tạm dừng",
                    "2" => "Kết thúc",
                    default => "Không xác định"
                },
            ];
    
            return response()->json(['data' => $data], 200);
        } catch (ModelNotFoundException $e) {
            return response()->json(['error' => 'Không tìm thấy giảng viên với ID: ' . $id], 404);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Không thể truy vấn tới bảng Teachers', 'message' => $e->getMessage()], 500);
        }
    }

    public function update(Request $request, string $id)
    {
        $validator = Validator::make($request->all(), [
            'avatar' => 'nullable|string', 
            'name' => 'sometimes|string|max:50',
            'email' => 'sometimes|string|email|max:255|unique:users,email,' . $id,
            'phone' => 'sometimes|string|max:10|unique:users,phone,' . $id,
            'dob' => 'sometimes|date|before:today',
            'gender' => 'sometimes|boolean',
            'ethnicity' => 'sometimes|string|max:50',
            'address' => 'sometimes|string|max:255',

            'teacher_major_id' => 'sometimes|exists:majors,id',

            'teacher_code' => 'sometimes|unique:teachers,teacher_code,' . $id,
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 400);
        }

        try {
            $data = $validator->validated();

            $teacher = Teacher::findOrFail($id);
            $user = $teacher->user;
            
            $user->update(array_filter(array_merge($data)));

            $teacher->update(array_filter([
                'major_id' => $data['teacher_major_id'] ?? $teacher->major_id,
                'teacher_code' => $data['teacher_code'] ?? $teacher->teacher_code,
            ]));
            
            $teacherData = [
                'avatar' => $user->avatar,
                'name' => $user->name,
                'email' => $user->email,
                'phone' => $user->phone,
                'dob' => Carbon::parse($user->dob)->format('d/m/Y'),
                'gender' => $user->gender ? "Nam" : "Nữ",
                'ethnicity' => $user->ethnicity,
                'address' => $user->address,

                'teacher_code' => $teacher->teacher_code,
                'major_name' => $teacher->major->name,
            ];

            return response()->json(['data' => $teacherData, 'message' => 'Cập nhật thành công'], 200);
        } catch (ModelNotFoundException $e) {
            return response()->json(['error' => 'Không tìm thấy giảng viên với ID: ' . $id], 404);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Cập nhật thất bại', 'message' => $e->getMessage()], 500);
        }
    }

    public function destroy(string $id)
    {
        try {
            $teacher = Teacher::findOrFail($id);
            $user = $teacher->user;

            if ($user->avatar) {
                Storage::disk('public')->delete($user->avatar);
            }
            $user->delete();

            return response()->json(['message' => 'Xóa thành công'], 200);
        } catch (ModelNotFoundException $e) {
            return response()->json(['error' => 'Không tìm thấy giảng viên với ID: ' . $id], 404);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Xóa mềm thất bại', 'message' => $e->getMessage()], 500);
        }
    }
}

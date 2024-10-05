<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Student;
use App\Models\Teacher;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class ApiUserController extends Controller
{
    public function index()
    {
        try {
            $users = User::with('role')->paginate(9);
            $data = collect($users->items())->map(function ($user) {
                return [
                    'id' => $user->id,
                    'avatar' => $user->avatar,
                    'name' => $user->name,
                    'email' => $user->email,
                    'phone' => $user->phone,
                    'dob' =>  Carbon::parse($user->dob)->format('d/m/Y'),
                    'gender' => $user->gender ? "Nam" : "Nữ",
                    'ethnicity' => $user->ethnicity,
                    'address' => $user->address,
                    'role' => $user->role->name,
                ];
            });

            return response()->json([
                'data' => $data,
                'pagination' => [
                    'total' => $users->total(),
                    'per_page' => $users->perPage(),
                    'current_page' => $users->currentPage(),
                    'last_page' => $users->lastPage(),
                ]
            ], 200);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Không thể truy vấn tới bảng Users', 'message' => $e->getMessage()], 500);
        }
    }

    public function getAll()
    {
        try {
            $users = User::with('role')->get();
            $data = $users->map(function ($user) {
                return [
                    'id' => $user->id,
                    'avatar' => $user->avatar,
                    'name' => $user->name,
                    'email' => $user->email,
                    'phone' => $user->phone,
                    'dob' =>  Carbon::parse($user->dob)->format('d/m/Y'),
                    'gender' => $user->gender,
                    'ethnicity' => $user->ethnicity,
                    'address' => $user->address,
                    'role' => $user->role->name,
                ];
            });

            return response()->json(['data' => $data], 200);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Không thể truy vấn tới bảng Users', 'message' => $e->getMessage()], 500);
        }
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'avatar' => 'nullable|file|mimes:jpeg,png,jpg|max:5120', 
            'name' => 'required|string|max:100',
            'email' => 'required|string|email|max:255|unique:users',
            'phone' => 'required|string|max:10|unique:users',
            'dob' => 'required|date|before:today',
            'gender' => 'required|boolean',
            'ethnicity' => 'required|string|max:100',
            'address' => 'required|string|max:255',
            'password' => 'required|string|min:8',
            'role_id' => 'required|exists:roles,id',

            'course_id' => 'required_if:role_id,2|exists:courses,id',
            'student_major_id' => 'required_if:role_id,2|exists:majors,id',
            'current_semester' => 'required_if:role_id,2|integer|min:1', 
            'student_code' => 'required_if:role_id,2|unique:students,student_code',
            'status' => 'required_if:role_id,2|integer',

            'teacher_major_id' => 'required_if:role_id,3|exists:majors,id',
            'teacher_code' => 'required_if:role_id,3|unique:teachers,teacher_code',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 400);
        }

        try {
            $data = $validator->validated();
            
            $avatarPath = null;
            if ($request->hasFile('avatar')) {
                $avatarPath = $request->file('avatar')->store('avatars', 'public');
            }

            $user = User::create([
                'avatar' => $avatarPath,
                'name' => $data['name'],
                'email' => $data['email'],
                'phone' => $data['phone'],
                'dob' => $data['dob'],
                'gender' => $data['gender'],
                'ethnicity' => $data['ethnicity'],
                'address' => $data['address'],
                'password' => Hash::make($data['password']),
                'role_id' => $data['role_id'],
            ]);

            if ($data['role_id'] == 2) {
                Student::create([
                    'user_id' => $user->id,
                    'course_id' => $data['course_id'],
                    'major_id' => $data['student_major_id'],
                    'current_semester' => $data['current_semester'],
                    'student_code' => $data['student_code'],
                    'status' => $data['status'],
                ]);
            }

            if ($data['role_id'] == 3) {
                Teacher::create([
                    'user_id' => $user->id,
                    'major_id' => $data['teacher_major_id'],
                    'teacher_code' => $data['teacher_code'],
                ]);
            }

            
            return response()->json(['data' => $user, 'message' => 'Tạo mới thành công'], 201);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Tạo mới thất bại', 'message' => $e->getMessage()], 500);
        }
    }

    public function show(string $id)
    {
        try {
            $user = User::with('role')->findOrFail($id);
            return response()->json(['data' => $user], 200);
        } catch (ModelNotFoundException $e) {
            return response()->json(['error' => 'Không tìm thấy id'], 404);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Không thể truy vấn tới bảng Users', 'message' => $e->getMessage()], 500);
        }
    }

    public function update(Request $request, string $id)
    {
        $validator = Validator::make($request->all(), [
            'avatar' => 'nullable|file|mimes:jpeg,png,jpg|max:5120', 
            'name' => 'sometimes|string|max:100',
            'email' => 'sometimes|string|email|max:255|unique:users,email,' . $id,
            'phone' => 'sometimes|string|max:10|unique:users,phone,' . $id,
            'dob' => 'sometimes|date|before:today',
            'gender' => 'sometimes|boolean',
            'ethnicity' => 'sometimes|string|max:100',
            'address' => 'sometimes|string|max:255',
            'password' => 'sometimes|string|min:8',
            'role_id' => 'sometimes|exists:roles,id',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 400);
        }

        try {
            $user = User::findOrFail($id);
            
            $data = $validator->validated();
            $user->update($data);

            return response()->json(['data' => $user, 'message' => 'Cập nhật thành công'], 200);
        } catch (ModelNotFoundException $e) {
            return response()->json(['error' => 'Không tìm thấy id'], 404);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Cập nhật thất bại', 'message' => $e->getMessage()], 500);
        }
    }

    public function destroy(string $id)
    {
        try {
            $user = User::findOrFail($id);
            $user->delete();
            return response()->json(['message' => 'Xóa mềm thành công'], 200);
        } catch (ModelNotFoundException $e) {
            return response()->json(['error' => 'Không tìm thấy id'], 404);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Xóa mềm thất bại', 'message' => $e->getMessage()], 500);
        }
    }
}
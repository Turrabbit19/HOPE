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
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class ApiAdminController extends Controller
{
    public function index(Request $request)
    {
        try {
            $users = User::with('role')->whereIn('role_id', [1, 2])->get();

            $groupUsers = $users->groupBy('role_id');

            $roles = [
                1 => 'Quản trị viên',
                2 => 'Cán bộ'
            ];

            $responseData = [];

            foreach ($roles as $roleId => $roleKey) {
                $roleUsers = $groupUsers->get($roleId, collect());

                $responseData[$roleKey] = [
                    'data' => $roleUsers->map(function ($user) {
                        return [
                            'id' => $user->id,
                            'avatar' => $user->avatar,
                            'name' => $user->name,
                            'email' => $user->email,
                            'phone' => $user->phone,
                        ];
                    }),
                ];
            }

            return response()->json($responseData, 200);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Không thể truy vấn tới bảng Users', 'message' => $e->getMessage()], 500);
        }
    }
    
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'avatar' => 'nullable|string', 
            'name' => 'required|string|max:100',
            'email' => 'required|string|email|max:255|unique:users',
            'phone' => 'required|string|max:10|unique:users',
            'dob' => 'required|date|before:today',
            'gender' => 'required|boolean',
            'ethnicity' => 'required|string|max:100',
            'address' => 'required|string|max:255',
            'password' => 'required|string|min:8',
            'role_id' => 'required|exists:roles,id',
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
                'role_id' => $data['role_id'],
            ]);

            return response()->json(['data' => $user, 'message' => 'Tạo mới thành công'], 201);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Tạo mới thất bại', 'message' => $e->getMessage()], 500);
        }
    }
    public function show(string $id)
    {
        try {
            $user = User::with('role')->findOrFail($id);
            
            $data = [
                'id' => $user->id,
                'avatar' => $user->avatar,
                'name' => $user->name,
                'email' => $user->email,
                'phone' => $user->phone,
                'dob' => Carbon::parse($user->dob)->format('d/m/Y'),
                'gender' => $user->gender ? "Nam" : "Nữ",
                'ethnicity' => $user->ethnicity,
                'address' => $user->address,
                'role' => $user->role->name,
            ];
    
            return response()->json(['data' => $data], 200);
        } catch (ModelNotFoundException $e) {
            return response()->json(['error' => 'Không tìm thấy tài khoản với ID: ' . $id], 404);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Không thể truy vấn tới bảng Users', 'message' => $e->getMessage()], 500);
        }
    }
    public function update(Request $request, string $id)
    {
        $validator = Validator::make($request->all(), [
            'avatar' => 'nullable|string', 
            'name' => 'sometimes|string|max:100',
            'email' => 'sometimes|string|email|max:255|unique:users,email,' . $id,
            'phone' => 'sometimes|string|max:10|unique:users,phone,' . $id,
            'dob' => 'sometimes|date|before:today',
            'gender' => 'sometimes|boolean',
            'ethnicity' => 'sometimes|string|max:100',
            'address' => 'sometimes|string|max:255',
            'password' => 'sometimes|string|min:8',
            'role_id' => 'sometimes|exists:roles,id|',
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
            return response()->json(['error' => 'Không tìm thấy tài khoản với ID: ' . $id], 404);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Cập nhật thất bại', 'message' => $e->getMessage()], 500);
        }
    }
    public function destroy(string $id)
    {
        try {
            $user = User::findOrFail($id);

            if ($user->avatar) {
                Storage::disk('public')->delete($user->avatar);
            }
            $user->delete();

            return response()->json(['message' => 'Xóa thành công'], 200);
        } catch (ModelNotFoundException $e) {
            return response()->json(['error' => 'Không tìm thấy tài khoản với ID: ' . $id], 404);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Xóa mềm thất bại', 'message' => $e->getMessage()], 500);
        }
    }
}
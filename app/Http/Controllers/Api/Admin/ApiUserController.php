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

class ApiUserController extends Controller
{
    public function index(Request $request)
    {
        try {
            $perPage = [
                'Quản trị viên' => $request->input('perPageAdmin', 9),
                'Cán bộ' => $request->input('perPageOfficer', 9),
                'Sinh viên' => $request->input('perPageStudent', 9),
                'Giảng viên' => $request->input('perPageTeacher', 9),
            ];

            $users = User::with('role')->whereIn('role_id', [1, 2, 3, 4])->get();

            $groupUsers = $users->groupBy('role_id');

            $roles = [
                1 => 'Quản trị viên',
                2 => 'Cán bộ',
                3 => 'Sinh viên',
                4 => 'Giảng viên',
            ];

            $responseData = [];
            
            foreach ($roles as $roleId => $roleKey) {
                $roleUsers = $groupUsers->get($roleId, collect());
                $pageUsers = new \Illuminate\Pagination\LengthAwarePaginator(
                    $roleUsers->forPage($request->input("page_{$roleKey}", 1), $perPage[$roleKey]),
                    $roleUsers->count(),
                    $perPage[$roleKey],
                    $request->input("page_{$roleKey}", 1),
                    ['path' => $request->url(), 'query' => $request->query()]
                );

                $responseData[$roleKey] = [
                    'data' => $pageUsers->map(function ($user) {
                        return [
                            'id' => $user->id,
                            'avatar' => $user->avatar,
                            'name' => $user->name,
                            'email' => $user->email,
                            'phone' => $user->phone,
                            'role' => $user->role->name,
                        ];
                    }),
                    'pagination' => [
                        'total' => $pageUsers->total(),
                        'per_page' => $pageUsers->perPage(),
                        'current_page' => $pageUsers->currentPage(),
                        'last_page' => $pageUsers->lastPage(),
                    ],
                ];
            }

            return response()->json($responseData, 200);
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

            'student_course_id' => 'required_if:role_id,3|exists:courses,id',
            'student_major_id' => 'required_if:role_id,3|exists:majors,id',
            'student_current_semester' => 'required_if:role_id,3|integer|min:1', 
            'student_code' => 'required_if:role_id,3|unique:students,student_code',
            'student_status' => 'integer|in:0,1,2',

            'teacher_major_id' => 'required_if:role_id,4|exists:majors,id',
            'teacher_code' => 'required_if:role_id,4|unique:teachers,teacher_code',
            'teacher_status' => 'integer|in:0,1,2',
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
                'password' => Hash::make("123456789"),
                'role_id' => $data['role_id'],
            ]);

            if ($data['role_id'] == 3) {
                Student::create([
                    'user_id' => $user->id,
                    'course_id' => $data['student_course_id'],
                    'major_id' => $data['student_major_id'],
                    'current_semester' => $data['student_current_semester'],
                    'student_code' => $data['student_code'],
                    'status' => $data['student_status'],
                ]);
            }

            if ($data['role_id'] == 4) {
                Teacher::create([
                    'user_id' => $user->id,
                    'major_id' => $data['teacher_major_id'],
                    'teacher_code' => $data['teacher_code'],
                    'status' => $data['teacher_status'],
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
    
            if ($user->role_id == 3) {
                $student = Student::with('course', 'major')->where('user_id', $user->id)->first();
                $data['student'] = [
                    'course_name' => $student->course->name,
                    'major_name' => $student->major->name,
                    'current_semester' => $student->current_semester,
                    'student_code' => $student->student_code,
                    'status' => match($student->status) {
                        '0' => "Đang học",
                        '1' => "Bảo lưu",
                        '2' => "Hoàn thành",
                        default => "Không xác định",
                    },
                ];
            }
    
            if ($user->role_id == 4) {
                $teacher = Teacher::where('user_id', $user->id)->first();
                $data['teacher'] = [
                    'major_id' => $teacher->major->name,
                    'teacher_code' => $teacher->teacher_code,
                    'status' => match($teacher->status) {
                        '0' => "Đang dạy",
                        '1' => "Tạm dừng",
                        '2' => "Kết thúc",
                        default => "Không xác định",
                    },
                ];
            }
    
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
            'avatar' => 'nullable|file|mimes:jpeg,png,jpg|max:5120', 
            'name' => 'sometimes|string|max:100',
            'email' => 'sometimes|string|email|max:255|unique:users,email,' . $id,
            'phone' => 'sometimes|string|max:10|unique:users,phone,' . $id,
            'dob' => 'sometimes|date|before:today',
            'gender' => 'sometimes|boolean',
            'ethnicity' => 'sometimes|string|max:100',
            'address' => 'sometimes|string|max:255',
            'password' => 'sometimes|string|min:8',
            'role_id' => 'sometimes|exists:roles,id|',

            'student_course_id' => 'required_if:role_id,3|exists:courses,id',
            'student_major_id' => 'required_if:role_id,3|exists:majors,id',
            'student_current_semester' => 'required_if:role_id,3|integer|min:1', 
            'student_code' => 'required_if:role_id,3|unique:students,student_code,' . $id . ',user_id', 
            'student_status' => 'required_if:role_id,3|integer||in:0,1,2',

            'teacher_major_id' => 'required_if:role_id,4|exists:majors,id',
            'teacher_code' => 'required_if:role_id,4|unique:teachers,teacher_code,' . $id . ',user_id', 
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 400);
        }

        try {
            $user = User::findOrFail($id);
            
            $data = $validator->validated();

            if ($request->hasFile('avatar')) {
                if ($user->avatar) {
                    Storage::disk('public')->delete($user->avatar);
                }
                $avatarPath = $request->file('avatar')->store('avatars', 'public');
                $data['avatar'] = $avatarPath;
            }
            
            $user->update($data);

            if (isset($data['role_id']) && $data['role_id'] == 3) {
                $student = Student::where('user_id', $user->id)->first();
                if ($student) {
                    $student->update([
                        'course_id' => $data['student_course_id'],
                        'major_id' => $data['student_major_id'],
                        'current_semester' => $data['student_current_semester'],
                        'student_code' => $data['student_code'],
                        'status' => $data['student_status'],
                    ]);
                } else {
                    Student::create([
                        'user_id' => $user->id,
                        'course_id' => $data['student_course_id'],
                        'major_id' => $data['student_major_id'],
                        'current_semester' => $data['student_current_semester'],
                        'student_code' => $data['student_code'],
                        'status' => $data['student_status'],
                    ]);
                }
            }
            
            if (isset($data['role_id']) && $data['role_id'] == 4) {
                $teacher = Teacher::where('user_id', $user->id)->first();
                if ($teacher) {
                    $teacher->update([
                        'major_id' => $data['teacher_major_id'],
                        'teacher_code' => $data['teacher_code'],
                    ]);
                } else {
                    Teacher::create([
                        'user_id' => $user->id,
                        'major_id' => $data['teacher_major_id'],
                        'teacher_code' => $data['teacher_code'],
                    ]);
                }
            }

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

            return response()->json(['message' => 'Xóa mềm thành công'], 200);
        } catch (ModelNotFoundException $e) {
            return response()->json(['error' => 'Không tìm thấy tài khoản với ID: ' . $id], 404);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Xóa mềm thất bại', 'message' => $e->getMessage()], 500);
        }
    }
}
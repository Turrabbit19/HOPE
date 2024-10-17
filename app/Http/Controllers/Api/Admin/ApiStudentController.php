<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Student;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class ApiStudentController extends Controller
{
    public function index(Request $request)
    {
        try {
            $perPage = $request->input('per_page', 9);

            $students = Student::paginate($perPage);

            $data = collect($students->items())->map(function ($student) {
                return [
                    "avatar" => $student->user->avatar,
                    "code" => $student->student_code,
                    "name" => $student->user->name,
                    "email" => $student->user->email,
                    "phone" => $student->user->phone,
                ];
            });

            return response()->json([
                'data' => $data,
                'pagination' => [
                        'total' => $students->total(),
                        'per_page' => $students->perPage(),
                        'current_page' => $students->currentPage(),
                        'last_page' => $students->lastPage(),
                    ],
            ], 200);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Không thể truy vấn tới bảng Students', 'message' => $e->getMessage()], 500);
        }
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'avatar' => 'nullable|file|mimes:jpeg,png,jpg|max:5120', 
            'name' => 'required|string|max:50',
            'email' => 'required|string|email|max:255|unique:users',
            'phone' => 'required|string|max:10|unique:users',
            'dob' => 'required|date|before:today',
            'gender' => 'required|boolean',
            'ethnicity' => 'required|string|max:50',
            'address' => 'required|string|max:255',

            'student_course_id' => 'required|exists:courses,id',
            'student_major_id' => 'required|exists:majors,id',

            'student_code' => 'required|unique:students,student_code',
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
                'role_id' => 3,
            ]);

            $student = Student::create([
                'user_id' => $user->id,
                'course_id' => $data['student_course_id'],
                'major_id' => $data['student_major_id'],
                'current_semester' => 1,
                'student_code' => $data['student_code'],
            ]);    

            $data = [
                'avatar' => $avatarPath,
                'name' => $user->name,
                'email' => $user->email,
                'phone' => $user->phone,
                'dob' => Carbon::parse($user->dob)->format('d/m/Y'),
                'gender' => $user->gender ? "Nam" : "Nữ",
                'ethnicity' => $user->ethnicity,
                'address' => $user->address,

                'student_code' => $student->student_code,
                'course_name' => $student->course->name,
                'major_name' => $student->major->name,
                'current_semester' => $student->current_semester,
            ];

            return response()->json(['data' => $data, 'message' => 'Tạo mới thành công'], 201);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Tạo mới thất bại', 'message' => $e->getMessage()], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}

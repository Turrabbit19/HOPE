<?php

namespace App\Http\Controllers\Api\Admin;

use App\Excel\Export\StudentExport;
use App\Excel\Import\StudentImport;
use App\Http\Controllers\Controller;
use App\Models\Student;
use App\Models\StudentMajor;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Maatwebsite\Excel\Facades\Excel;

class ApiStudentController extends Controller
{
    public function index(Request $request)
    {
        try {
            $perPage = $request->input('per_page', 40);    
            $students = Student::with(['user', 'course'])->paginate($perPage);
        
            $majors = StudentMajor::with('major')
                ->where('status', 1)
                ->get()
                ->groupBy('student_id'); 
    
            $data = collect($students->items())->map(function ($student) use ($majors) {
                $studentMajor = $majors[$student->id]->first() ?? null; 
                return [
                    "id" => $student->id,
                    "avatar" => $student->user->avatar ?? null,
                    "student_code" => $student->student_code,
                    "name" => $student->user->name,
                    "email" => $student->user->email,
                    "phone" => $student->user->phone,

                    'course_name' => $student->course->name,
                    'major_name' => $studentMajor->major->name,
                    'current_semester' => $student->current_semester,
                    'status' => match ($student->status) {
                        '0' => "Đang học",
                        '1' => "Bảo lưu",
                        '2' => "Hoàn thành",
                        default => "Không xác định"
                    },
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
            return response()->json([
                'error' => 'Không thể truy vấn tới bảng Students',
                'message' => $e->getMessage(),
            ], 500);
        }
    }
    
    
    public function exportStudent(){
        try {
            return Excel::download(new StudentExport, 'students.xlsx');
        
        } catch (\Exception $e) {
            return response()->json(['error' => 'Export thất bại', 'message' => $e->getMessage()], 500);
        }
    }
    public function importStudent(Request $request){
        try {
            Excel::import(new StudentImport, $request->file('file'));
        
            return response()->json(['message' => 'Dữ liệu được thêm thành công'], 200);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Import thất bại', 'message' => $e->getMessage()], 500);
        }
    }

    public function getStudentsByCourse($courseId){
        try {
            $students = Student::with('user', 'course')->where('course_id', $courseId)->get();
            
            $majors = StudentMajor::with('major')->where('status', 1)
                    ->get()->groupBy('student_id');

            $data = $students->map(function ($student) use ($majors) {
                $studentMajor = $majors[$student->id]->first() ?? null; 
                return [
                    'id' => $student->id,
                    'avatar' => $student->user->avatar,
                    'student_code' => $student->student_code,
                    'name' => $student->user->name,
                    'email' => $student->user->email,
                    'phone' => $student->user->phone,

                    'course_name' => $student->course->name,
                    'major_name' => $studentMajor->major->name,
                    'current_semester' => $student->current_semester,
                    'status' => match($student->status) {
                        "0" => "Đang học",
                        "1" => "Bảo lưu",
                        "2" => "Hoàn thành",
                        default => "Không xác định"
                    }
                ];
            });
    
            return response()->json(['data' => $data], 200);
        } catch (ModelNotFoundException $e) {
            return response()->json(['error' => 'Không tìm thấy khóa học với ID: ' . $courseId], 404);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Không thể truy vấn tới bảng Students', 'message' => $e->getMessage()], 500);
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
    
            'student_course_id' => 'required|exists:courses,id',
            'student_major_id' => 'required|exists:majors,id',
    
            'student_code' => 'required|unique:students,student_code',
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
    
            $student = Student::create([
                'user_id' => $user->id,
                'course_id' => $data['student_course_id'],
                'current_semester' => 1,
                'student_code' => $data['student_code'],
            ]);
    
            StudentMajor::create([
                'student_id' => $student->id,
                'major_id' => 1, 
                'status' => 0,  
            ]);
    
            StudentMajor::create([
                'student_id' => $student->id,
                'major_id' => $data['student_major_id'],
                'status' => 1, 
            ]);
    
            $mainMajor = StudentMajor::where('student_id', $student->id)
                                      ->where('status', 1)
                                      ->with('major')
                                      ->first();
    
            $studentData = [
                'avatar' => $user->avatar,
                'name' => $user->name,
                'email' => $user->email,
                'phone' => $user->phone,
                'dob' => Carbon::parse($user->dob)->format('d/m/Y'),
                'gender' => $user->gender ? "Nam" : "Nữ",
                'ethnicity' => $user->ethnicity,
                'address' => $user->address,
    
                'student_code' => $student->student_code,
                'course_name' => $student->course->name,
                'major_name' => $mainMajor->major->name
            ];
    
            return response()->json(['data' => $studentData, 'message' => 'Tạo mới thành công'], 201);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Tạo mới thất bại', 'message' => $e->getMessage()], 500);
        }
    }    

    public function show(string $id)
    {
        try {
            $student = Student::findOrFail($id);
            
            $majorMain = StudentMajor::with('major')
            ->where('student_id', $id)
            ->where('status', 1)
            ->firstOr();
            
            $data = [
                'id' => $student->id,
                'avatar' => $student->user->avatar,
                'name' => $student->user->name,
                'email' => $student->user->email,
                'phone' => $student->user->phone,
                'dob' => Carbon::parse($student->user->dob)->format('d/m/Y'),
                'gender' => $student->user->gender ? "Nam" : "Nữ",
                'ethnicity' => $student->user->ethnicity,
                'address' => $student->user->address,

                'student_code' => $student->student_code,
                'course_name' => $student->course->name,
                'major_name' => $majorMain->major->name,
                'current_semester' => $student->current_semester,
                'status' => match($student->status) {
                    "0" => "Đang học",
                    "1" => "Bảo lưu",
                    "2" => "Hoàn thành",
                    default => "Không xác định"
                },
            ];
    
            return response()->json(['data' => $data], 200);
        } catch (ModelNotFoundException $e) {
            return response()->json(['error' => 'Không tìm thấy sinh viên với ID: ' . $id], 404);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Không thể truy vấn tới bảng Students', 'message' => $e->getMessage()], 500);
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

            'student_course_id' => 'sometimes|exists:courses,id',
            'student_major_id' => 'sometimes|exists:majors,id',

            'student_code' => 'sometimes|unique:students,student_code,' . $id,
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 400);
        }

        try {
            $data = $validator->validated();

            $student = Student::findOrFail($id);
            $user = $student->user;
            
            $user->update(array_filter(array_merge($data)));

            $student->update(array_filter([
                'course_id' => $data['student_course_id'] ?? $student->course_id,
                'major_id' => $data['student_major_id'] ?? $student->major_id,
                'student_code' => $data['student_code'] ?? $student->student_code,
            ]));

            $mainMajor = StudentMajor::where('student_id', $student->id)
            ->where('status', 1)
            ->with('major')
            ->first();

            $studentData = [
                'avatar' => $user->avatar,
                'name' => $user->name,
                'email' => $user->email,
                'phone' => $user->phone,
                'dob' => Carbon::parse($user->dob)->format('d/m/Y'),
                'gender' => $user->gender ? "Nam" : "Nữ",
                'ethnicity' => $user->ethnicity,
                'address' => $user->address,

                'student_code' => $student->student_code,
                'course_name' => $student->course->name,
                'major_name' => $mainMajor->major->name,
                'current_semester' => $student->current_semester,
            ];

            return response()->json(['data' => $studentData, 'message' => 'Cập nhật thành công'], 200);
        } catch (ModelNotFoundException $e) {
            return response()->json(['error' => 'Không tìm thấy sinh viên với ID: ' . $id], 404);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Cập nhật thất bại', 'message' => $e->getMessage()], 500);
        }
    }
    public function destroy(string $id)
    {
        try {
            $student = Student::findOrFail($id);
            $user = $student->user;

            if ($user->avatar) {
                Storage::disk('public')->delete($user->avatar);
            }
            $user->delete();

            return response()->json(['message' => 'Xóa thành công'], 200);
        } catch (ModelNotFoundException $e) {
            return response()->json(['error' => 'Không tìm thấy sinh viên với ID: ' . $id], 404);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Xóa mềm thất bại', 'message' => $e->getMessage()], 500);
        }
    }

    public function getStudentsByMajorAndCourse(string $majorId, $courseId){
        try {
            $students = Student::with('user', 'course', 'majors')
                ->where('course_id', $courseId)
                ->whereHas('majors', function($q) use ($majorId) {
                    $q->where('major_id', $majorId);
                })
                ->get();
    
            $data = $students->map(function ($student) {
                return [
                    'id' => $student->id,
                    'avatar' => $student->user->avatar,
                    'student_code' => $student->student_code,
                    'name' => $student->user->name,
                    'email' => $student->user->email,
                    'phone' => $student->user->phone,
                    'course_name' => $student->course->name,
                    'current_semester' => $student->current_semester,
                    'status' => match($student->status) {
                        "0" => "Đang học",
                        "1" => "Bảo lưu",
                        "2" => "Hoàn thành",
                        default => "Không xác định"
                    }
                ];
            });
    
            return response()->json(['data' => $data], 200);
        } catch (ModelNotFoundException $e) {
            return response()->json(['error' => 'Không tìm thấy dữ liệu cho course hoặc major'], 404);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Không thể truy vấn tới bảng Students', 'message' => $e->getMessage()], 500);
        }
    }    
}

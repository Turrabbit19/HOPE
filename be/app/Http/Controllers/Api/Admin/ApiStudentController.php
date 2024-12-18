<?php

namespace App\Http\Controllers\Api\Admin;

use App\Excel\Export\StudentExport;
use App\Excel\Import\StudentImport;
use App\Http\Controllers\Controller;
use App\Models\Course;
use App\Models\CourseSemester;
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
    public function index()
    {
        try {
            $students = Student::with(['user', 'course'])->get();

            $majors = StudentMajor::with('major')
                ->where('status', 1)
                ->get()
                ->groupBy('student_id');

            $data = $students->map(function ($student) use ($majors) {
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
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Không thể truy vấn tới bảng Students',
                'message' => $e->getMessage(),
            ], 500);
        }
    }

    public function filters(Request $request){
        try{
            $majorId = $request->input('major_id');
            $course_id = $request->input('course_id');
            $status = $request->input('status');
    
            $query = Student::with('majors', 'course'); 
            
            $majors = StudentMajor::with('major')
            ->where('status', 1)
            ->get()
            ->groupBy('student_id');

            if (!empty($majorId)) {
                $query->whereHas('majors', function ($q) use ($majorId) {
                    $q->where('majors.id', $majorId);
                });
            }
    
            if (!empty($course_id)) {
                $query->where('course_id', $course_id);
            }
    
            if (!empty($status)) {
                $query->where('status', $status);
            }
            
            $students = $query->get();

            if ($students->isEmpty()) {
                return response()->json([
                    'message' => 'Không có sinh viên nào.',
                ], 404);
            }

            $data = $students->map(function ($student) use ($majors) {
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

    
            return response()->json($data);
        }catch (\Exception $e){
            return response()->json([
                'error' => 'Không thể truy vấn tới bảng Students',
                'message' => $e->getMessage(),
            ], 500);
        }
    } 

    public function exportStudent()
    {
        try {
            return Excel::download(new StudentExport, 'students.xlsx');
        } catch (\Exception $e) {
            return response()->json(['error' => 'Export thất bại', 'message' => $e->getMessage()], 500);
        }
    }
    public function importStudent(Request $request)
    {
        try {
            Excel::import(new StudentImport, $request->file('file'));

            return response()->json(['message' => 'Dữ liệu được thêm thành công'], 200);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Import thất bại', 'message' => $e->getMessage()], 500);
        }
    }

    public function getStudentsByCourse($courseId)
    {
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
                    'status' => match ($student->status) {
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
        ], [
            'avatar.string' => 'Ảnh đại diện phải là chuỗi.',
            'name.required' => 'Tên là bắt buộc.',
            'name.string' => 'Tên phải là chuỗi.',
            'name.max' => 'Tên không được vượt quá 50 ký tự.',
            'email.required' => 'Email là bắt buộc.',
            'email.string' => 'Email phải là chuỗi.',
            'email.email' => 'Email phải có định dạng hợp lệ.',
            'email.max' => 'Email không được vượt quá 255 ký tự.',
            'email.unique' => 'Email này đã được sử dụng.',
            'phone.required' => 'Số điện thoại là bắt buộc.',
            'phone.string' => 'Số điện thoại phải là chuỗi.',
            'phone.max' => 'Số điện thoại không được vượt quá 10 ký tự.',
            'phone.unique' => 'Số điện thoại này đã được sử dụng.',
            'dob.required' => 'Ngày sinh là bắt buộc.',
            'dob.date' => 'Ngày sinh phải có định dạng hợp lệ.',
            'dob.before' => 'Ngày sinh phải trước hôm nay.',
            'gender.required' => 'Giới tính là bắt buộc.',
            'gender.boolean' => 'Giới tính phải là true hoặc false.',
            'ethnicity.required' => 'Dân tộc là bắt buộc.',
            'ethnicity.string' => 'Dân tộc phải là chuỗi.',
            'ethnicity.max' => 'Dân tộc không được vượt quá 50 ký tự.',
            'address.required' => 'Địa chỉ là bắt buộc.',
            'address.string' => 'Địa chỉ phải là chuỗi.',
            'address.max' => 'Địa chỉ không được vượt quá 255 ký tự.',
            'student_course_id.required' => 'Khóa học là bắt buộc.',
            'student_course_id.exists' => 'Khóa học không tồn tại.',
            'student_major_id.required' => 'Chuyên ngành là bắt buộc.',
            'student_major_id.exists' => 'Chuyên ngành không tồn tại.',
            'student_code.required' => 'Mã sinh viên là bắt buộc.',
            'student_code.unique' => 'Mã sinh viên này đã được sử dụng.',
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
                'status' => match ($student->status) {
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

    public function getStudentsByMajorAndCourse(string $courseId, $majorId)
    {
        try {
            $students = Student::with('user', 'majors', 'course')
                ->where('course_id', $courseId)
                ->whereHas('majors', function ($q) use ($majorId) {
                    $q->where('majors.id', $majorId);
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
                    'status' => match ($student->status) {
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

    public function incrementSemester($studentId)
    {
        try {
            $student = Student::findOrFail($studentId);

            if ($student->current_semester < 9) {
                $student->current_semester += 1;

                if ($student->current_semester === 9) {
                    $student->status = 2;
                }

                $student->save();

                return response()->json([
                    'message' => 'Tăng học kỳ thành công',
                    'data' => [
                        'id' => $student->id,
                        'current_semester' => $student->current_semester,
                        'status' => $student->status,
                    ],
                ], 200);
            } else {
                return response()->json([
                    'message' => 'Học kỳ hiện tại đã đạt tối đa',
                ], 400);
            }
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Không thể tăng học kỳ',
                'message' => $e->getMessage(),
            ], 500);
        }
    }

    public function decrementStudentsSemester()
    {
        try {
            $now = Carbon::now();

            $courses = Course::where('start_date', '<=', $now)
                ->where('end_date', '>=', $now)
                ->get();

            if ($courses->isEmpty()) {
                return response()->json([
                    'message' => 'Không có khóa học nào đang diễn ra trong thời gian này.',
                ], 404);
            }

            $updatedStudents = [];

            foreach ($courses as $course) {
                $students = $course->students;

                foreach ($students as $student) {
                    if ($student->current_semester > 1) {
                        $student->current_semester -= 1;
                        $student->save();

                        $updatedStudents[] = [
                            'student_id' => $student->id,
                            'current_semester' => $student->current_semester,
                        ];
                    }
                }
            }

            if (count($updatedStudents) > 0) {
                return response()->json([
                    'message' => 'Giảm học kỳ thành công cho các sinh viên.',
                    'data' => $updatedStudents,
                ], 200);
            } else {
                return response()->json([
                    'message' => 'Không có sinh viên nào cần giảm học kỳ.',
                ], 400);
            }
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Đã xảy ra lỗi khi giảm học kỳ cho sinh viên.',
                'message' => $e->getMessage(),
            ], 500);
        }
    }
}

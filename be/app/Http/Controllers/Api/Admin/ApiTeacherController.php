<?php

namespace App\Http\Controllers\Api\Admin;

use App\Excel\Export\TeacherExport;
use App\Excel\Import\TeacherImport;
use App\Http\Controllers\Controller;
use App\Models\Teacher;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Maatwebsite\Excel\Facades\Excel;

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

    public function getTeachers(Request $request)
    {
        try {
            // Lấy dữ liệu từ request
            $majorId = $request->input('major_id');
            $status = $request->input('status');
    
            // Khởi tạo truy vấn với các quan hệ user và major
            $query = Teacher::with(['user', 'major']); 
    
            // Lọc theo major_id nếu có
            if (!empty($majorId)) {
                $query->where('major_id', $majorId);
            }
    
            // Lọc theo status nếu có
            if (!empty($status)) {
                $query->where('status', $status);
            }
    
            // Lấy danh sách giảng viên sau khi đã áp dụng bộ lọc
            $teachers = $query->get();
    
            // Kiểm tra nếu không có giảng viên nào phù hợp
            if ($teachers->isEmpty()) {
                return response()->json([
                    'message' => 'Không tìm thấy giảng viên nào.',
                ], 404);
            }
    
            // Xử lý dữ liệu trả về
            $data = $teachers->map(function ($teacher) {
                return [
                    "id" => $teacher->id,
                    "name" => $teacher->user ? $teacher->user->name : 'null',
                    "major" => $teacher->major ? $teacher->major->name : 'null',
                    "teacher_code" => $teacher->teacher_code,
                    "status" => $teacher->status == 0 ? 'Đang dạy' : 'Nghỉ'
                ];
            });
    
            // Trả về dữ liệu đã xử lý
            return response()->json(['teachers' => $data]);
    
        } catch (\Exception $e) {
            // Trả về lỗi nếu có vấn đề trong quá trình truy vấn
            return response()->json([
                'error' => 'Không thể truy vấn tới bảng Teachers',
                'message' => $e->getMessage(),
            ], 500);
        }
    }

    public function exportTeacher(){
        try {
            return Excel::download(new TeacherExport, 'teachers.xlsx');
        
        } catch (\Exception $e) {
            return response()->json(['error' => 'Export thất bại', 'message' => $e->getMessage()], 500);
        }
    }
    public function importTeacher(Request $request){
        try {
            Excel::import(new TeacherImport, $request->file('file'));
        
            return response()->json(['message' => 'Dữ liệu được thêm thành công'], 200);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Import thất bại', 'message' => $e->getMessage()], 500);
        }
    }

    public function filterTeachersByMajor(string $majorId) {
        try {
            $listTeachers = Teacher::with('user')->where('major_id', $majorId)->get();

            $data = $listTeachers->map(function ($teacher) {
                return [
                    'id' => $teacher->id,
                    'name' => $teacher->user->name
                ];
            });

            return response()->json(['listTeachers' => $data], 200);
        } catch (ModelNotFoundException $e) {
            return response()->json(['error' => 'Không tìm thấy ngành học với ID: ' . $majorId], 404);
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
        ], [
            'avatar.string' => 'Ảnh đại diện phải là chuỗi ký tự.',
            
            'name.required' => 'Tên là bắt buộc.',
            'name.string' => 'Tên phải là chuỗi ký tự.',
            'name.max' => 'Tên không được vượt quá 50 ký tự.',
            
            'email.required' => 'Email là bắt buộc.',
            'email.string' => 'Email phải là chuỗi ký tự.',
            'email.email' => 'Email không hợp lệ.',
            'email.max' => 'Email không được vượt quá 255 ký tự.',
            'email.unique' => 'Email đã tồn tại trong hệ thống.',
            
            'phone.required' => 'Số điện thoại là bắt buộc.',
            'phone.string' => 'Số điện thoại phải là chuỗi ký tự.',
            'phone.max' => 'Số điện thoại không được vượt quá 10 ký tự.',
            'phone.unique' => 'Số điện thoại đã tồn tại trong hệ thống.',
            
            'dob.required' => 'Ngày sinh là bắt buộc.',
            'dob.date' => 'Ngày sinh phải là ngày hợp lệ.',
            'dob.before' => 'Ngày sinh phải trước ngày hôm nay.',
            
            'gender.required' => 'Giới tính là bắt buộc.',
            'gender.boolean' => 'Giới tính phải là giá trị boolean true hoặc false.',
            
            'ethnicity.required' => 'Dân tộc là bắt buộc.',
            'ethnicity.string' => 'Dân tộc phải là chuỗi ký tự.',
            'ethnicity.max' => 'Dân tộc không được vượt quá 50 ký tự.',
            
            'address.required' => 'Địa chỉ là bắt buộc.',
            'address.string' => 'Địa chỉ phải là chuỗi ký tự.',
            'address.max' => 'Địa chỉ không được vượt quá 255 ký tự.',
            
            'teacher_major_id.required' => 'Chuyên ngành là bắt buộc.',
            'teacher_major_id.exists' => 'Chuyên ngành không tồn tại trong hệ thống.',
            
            'teacher_code.required' => 'Mã giáo viên là bắt buộc.',
            'teacher_code.unique' => 'Mã giáo viên đã tồn tại trong hệ thống.',
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
                'role_id' => 4,
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
        ], [
            'avatar.string' => 'Ảnh đại diện phải là chuỗi ký tự.',
            
            'name.sometimes' => 'Tên là không bắt buộc nhưng nếu có phải là chuỗi và không quá 50 ký tự.',
            'name.string' => 'Tên phải là chuỗi ký tự.',
            'name.max' => 'Tên không được vượt quá 50 ký tự.',
            
            'email.sometimes' => 'Email là không bắt buộc nhưng nếu có phải là chuỗi và không quá 255 ký tự.',
            'email.string' => 'Email phải là chuỗi ký tự.',
            'email.email' => 'Email không hợp lệ.',
            'email.max' => 'Email không được vượt quá 255 ký tự.',
            'email.unique' => 'Email đã tồn tại trong hệ thống.',
            
            'phone.sometimes' => 'Số điện thoại là không bắt buộc nhưng nếu có phải là chuỗi và không quá 10 ký tự.',
            'phone.string' => 'Số điện thoại phải là chuỗi ký tự.',
            'phone.max' => 'Số điện thoại không được vượt quá 10 ký tự.',
            'phone.unique' => 'Số điện thoại đã tồn tại trong hệ thống.',
            
            'dob.sometimes' => 'Ngày sinh là không bắt buộc nhưng nếu có phải là ngày hợp lệ.',
            'dob.date' => 'Ngày sinh phải là ngày hợp lệ.',
            'dob.before' => 'Ngày sinh phải trước ngày hôm nay.',
            
            'gender.sometimes' => 'Giới tính là không bắt buộc nhưng nếu có phải là giá trị boolean.',
            'gender.boolean' => 'Giới tính phải là giá trị true hoặc false.',
            
            'ethnicity.sometimes' => 'Dân tộc là không bắt buộc nhưng nếu có phải là chuỗi và không quá 50 ký tự.',
            'ethnicity.string' => 'Dân tộc phải là chuỗi ký tự.',
            'ethnicity.max' => 'Dân tộc không được vượt quá 50 ký tự.',
            
            'address.sometimes' => 'Địa chỉ là không bắt buộc nhưng nếu có phải là chuỗi và không quá 255 ký tự.',
            'address.string' => 'Địa chỉ phải là chuỗi ký tự.',
            'address.max' => 'Địa chỉ không được vượt quá 255 ký tự.',
            
            'teacher_major_id.sometimes' => 'Chuyên ngành là không bắt buộc nhưng nếu có phải tồn tại trong bảng majors.',
            'teacher_major_id.exists' => 'Chuyên ngành không tồn tại trong hệ thống.',
            
            'teacher_code.sometimes' => 'Mã giáo viên là không bắt buộc nhưng nếu có phải là duy nhất.',
            'teacher_code.unique' => 'Mã giáo viên đã tồn tại trong hệ thống.',
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

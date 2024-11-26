<?php 

namespace App\Http\Controllers\Api\Auth;

use App\Http\Controllers\Controller;
use App\Models\Student;
use App\Models\Teacher;
use Illuminate\Http\Request;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Facades\Validator;

class ApiAuthController extends Controller
{
    public function login(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|string|email|max:255',
            'password' => 'required|string|min:8',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 400);
        }

        $key = $request->ip(); 
        if (RateLimiter::tooManyAttempts($key, 5)) {
            return response()->json(['error' => 'Quá nhiều lần thử đăng nhập. Vui lòng thử lại sau.'], 429);
        }

        try {
            $user = User::where('email', $request->email)->first();

            if (!$user || !Hash::check($request->password, $user->password)) {
                RateLimiter::hit($key); 
                throw ValidationException::withMessages([
                    'email' => ['Thông tin đăng nhập không chính xác.'],
                ]);
            }

            $user->tokens()->delete();

            $token = $user->createToken('token-name')->plainTextToken;

            return response()->json([
                'token' => $token, 
                'user' => $this->formatUserData($user)
            ]);
        } catch (ValidationException $e) {
            return response()->json(['errors' => $e->errors()], 401);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Đã xảy ra lỗi trong quá trình đăng nhập', 'message' => $e->getMessage()], 500);
        }
    }

    public function user(Request $request)
    {
        try {
            $user = $request->user();
            return response()->json(['data' => $this->formatUserData($user)], 200);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Không thể truy vấn tới bảng Users', 'message' => $e->getMessage()], 500);
        }
    }

    public function logout(Request $request)
    {
        try {
            $request->user()->currentAccessToken()->delete();
            return response()->json(['message' => 'Đăng xuất thành công']);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Không thể thực hiện đăng xuất', 'message' => $e->getMessage()], 500);
        }
    }

    private function formatUserData(User $user)
    {
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
            $student = Student::with('course')->where('user_id', $user->id)->first();
            if ($student) {
                $data['student'] = [
                    'course_id' => $student->course->name,
                    'current_semester' => $student->current_semester,
                    'student_code' => $student->student_code,
                    'status' => $this->getStudentStatus($student->status),
                ];
            }
        }

        if ($user->role_id == 4) {
            $teacher = Teacher::where('user_id', $user->id)->first();
            if ($teacher) {
                $data['teacher'] = [
                    'major_id' => $teacher->major_id,
                    'teacher_code' => $teacher->teacher_code,
                    'status' => $this->getTeacherStatus($teacher->status),
                ];
            }
        }

        return $data;
    }

    private function getStudentStatus($status)
    {
        return match ($status) {
            '0' => "Đang học",
            '1' => "Bảo lưu",
            '2' => "Hoàn thành",
            default => "Không xác định",
        };
    }

    private function getTeacherStatus($status)
    {
        return match ($status) {
            '0' => "Đang dạy",
            '1' => "Tạm dừng",
            '2' => "Kết thúc",
            default => "Không xác định",
        };
    }
}

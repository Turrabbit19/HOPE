<?php

namespace App\Http\Controllers\Auth;

use App\Models\Student;
use App\Models\Teacher;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redis;
use Laravel\Socialite\Facades\Socialite;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Google\Client as GoogleClient;
class GoogleController extends Controller
{
    public function redirectToGoogle()
    {
        print_r(Socialite::driver('google'));
        return Socialite::driver('google')->redirect()->stateless()->redirect()->getTargetUrl();
    }



    public function handleGoogleCallback(Request $request)
    {
        $code = $request->input('token');

        if (!$code) {
            return response()->json(['error' => 'Thiếu mã ủy quyền'], 400);
        }
        try {
            $googleUser = Socialite::driver('google')->stateless()->userFromToken($code);
            response()->json([$googleUser => 'Thiếu mã ủy quyền'], 200);
            $user = User::firstOrCreate(
                ['email' => $googleUser->getEmail()],
                ['name' => $googleUser->getName()]
            );

            Auth::login($user, true);

            return response()->json([
                'user' => $user,
                'token' => $user->createToken('YourAppName')->accessToken,
            ]);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Lỗi khi đăng nhập Google: ' . $e->getMessage()], 400);
        }
    }
    public function googleLogin(Request $request)
{
    $credential = $request->input('credential');

    if (!$credential) {
        return response()->json(['error' => 'Missing ID Token'], 400);
    }

    $client = new GoogleClient(['client_id' => env('GOOGLE_CLIENT_ID')]);

    try {
        $payload = $client->verifyIdToken($credential);

        if ($payload) {
            $user = User::where('email', $payload['email'])->first();

            if (!$user) {
                return response()->json(['message' => 'User not found with this email'], 404);
            }

            $cacheKey = 'user:' . $user->id . ':refresh_token';

            $cachedToken = Redis::get($cacheKey);

            if ($cachedToken) {
                return response()->json([
                    'token' => $cachedToken,
                    'user' => $this->formatUserData($user),
                ], 200);
            }

            $token = $user->createToken('auth_token')->plainTextToken;

            Redis::setex($cacheKey, 604800, $token);

            return response()->json([
                'token' => $token,
                'user' => $this->formatUserData($user),
            ], 200);
        } else {
            return response()->json(['error' => 'Invalid ID Token'], 401);
        }
    } catch (\Exception $e) {
        return response()->json(['error' => 'Google Verification Failed', 'details' => $e->getMessage()], 500);
    }
}

    public function formatUserData(User $user)
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
                    'course_name' => $student->course->name,
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

                    'major_name' => $teacher->major->name,

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

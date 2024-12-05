<?php

namespace App\Http\Controllers\Auth;

use App\Models\User;
use Illuminate\Http\Request;
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

                $token = $user->createToken('auth_token')->plainTextToken;

                return response()->json(['token' => $token], 200);
            } else {
                return response()->json(['error' => 'Invalid ID Token'], 401);
            }
        } catch (\Exception $e) {
            return response()->json(['error' => 'Google Verification Failed', 'details' => $e->getMessage()], 500);
        }
    }
}

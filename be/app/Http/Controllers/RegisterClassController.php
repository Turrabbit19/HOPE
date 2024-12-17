<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use App\Jobs\RegisterClassJob;

class RegisterClassController extends Controller
{
    public function registerClass(Request $request)
    {
        $userId = $request->input('userId');
        $classId = 'default-class';

        $registeredCount = Cache::get("class_{$classId}_count", 0);

        if ($registeredCount >= 300) {
            return response()->json(['error' => 'FULL_CAPACITY'], 400);
        }

        RegisterClassJob::dispatch($classId, $userId);

        Cache::increment("class_{$classId}_count");

        return response()->json(['success' => true, 'message' => 'Đăng ký thành công!']);
    }
}

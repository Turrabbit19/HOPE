<?php

use App\Http\Controllers\Api\ApiCourseController;
use App\Http\Controllers\Api\ApiLessonController;
use App\Http\Controllers\Api\ApiMajorController;
use App\Http\Controllers\Api\ApiNotificationController;
use App\Http\Controllers\Api\ApiPlanController;
use App\Http\Controllers\Api\ApiRoleController;
use App\Http\Controllers\Api\ApiRoomController;
use App\Http\Controllers\Api\ApiSectionController;
use App\Http\Controllers\Api\ApiSemesterController;
use App\Http\Controllers\Api\ApiShiftController;
use App\Http\Controllers\Api\ApiStudentController;
use App\Http\Controllers\Api\ApiSubjectController;
use App\Http\Controllers\Api\ApiTeacherController;
use App\Http\Controllers\Api\ApiUserController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});


Route::prefix('admin')->group(function() {
    Route::apiResource('roles', ApiRoleController::class);
    Route::apiResource('users', ApiUserController::class);
    Route::apiResource('students', ApiStudentController::class);
    Route::apiResource('teachers', ApiTeacherController::class);
    Route::apiResource('courses', ApiCourseController::class);
    Route::apiResource('semesters', ApiSemesterController::class);
    Route::apiResource('majors', ApiMajorController::class);
    Route::apiResource('plans', ApiPlanController::class);
    Route::apiResource('subjects', ApiSubjectController::class);
    Route::apiResource('rooms', ApiRoomController::class);
    Route::apiResource('lessons', ApiLessonController::class);
    Route::apiResource('sections', ApiSectionController::class);
    Route::apiResource('notifications', ApiNotificationController::class);
    Route::apiResource('shifts', ApiShiftController::class);
});

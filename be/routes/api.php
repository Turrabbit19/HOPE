<?php

use App\Http\Controllers\Api\Admin\ApiClassroomController;
use App\Http\Controllers\Api\Admin\ApiCourseController;
use App\Http\Controllers\Api\Admin\ApiLessonController;
use App\Http\Controllers\Api\Admin\ApiMajorController;
use App\Http\Controllers\Api\Admin\ApiNotificationController;
use App\Http\Controllers\Api\Admin\ApiPlanController;
use App\Http\Controllers\Api\Admin\ApiRoleController;
use App\Http\Controllers\Api\Admin\ApiRoomController;
use App\Http\Controllers\Api\Admin\ApiScheduleController;
use App\Http\Controllers\Api\Admin\ApiSectionController;
use App\Http\Controllers\Api\Admin\ApiSemesterController;
use App\Http\Controllers\Api\Admin\ApiShiftController;
use App\Http\Controllers\Api\Admin\ApiStudentController;
use App\Http\Controllers\Api\Admin\ApiSubjectController;
use App\Http\Controllers\Api\Admin\ApiTeacherController;
use App\Http\Controllers\Api\Admin\ApiUserController;
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
    Route::apiResource('semesters', ApiSemesterController::class);

    Route::apiResource('plans', ApiPlanController::class);
    Route::apiResource('subjects', ApiSubjectController::class);
    Route::apiResource('rooms', ApiRoomController::class);
    Route::apiResource('lessons', ApiLessonController::class);
    Route::apiResource('sections', ApiSectionController::class);
    Route::apiResource('notifications', ApiNotificationController::class);
    Route::apiResource('shifts', ApiShiftController::class);
    Route::apiResource('schedules', ApiScheduleController::class);


    Route::apiResource('classrooms', ApiClassroomController::class);
    Route::post('/classrooms/{id}/restore', [ApiClassroomController::class, 'restore']);


    Route::apiResource('majors', ApiMajorController::class);
    Route::get('majors/check-unique/{name}', [ApiMajorController::class, 'checkNameUnique']);
    Route::post('/majors/{id}/restore', [ApiMajorController::class, 'restore']);



    Route::apiResource('courses', ApiCourseController::class);
    Route::get('count/courses', [ApiCourseController::class, 'getCount']);
    Route::post('/courses/{id}/restore', [ApiCourseController::class, 'restore']);

});

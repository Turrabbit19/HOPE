<?php

use App\Http\Controllers\Api\Admin\ApiAdminController;
use App\Http\Controllers\Api\Admin\ApiClassroomController;
use App\Http\Controllers\Api\Admin\ApiCourseController;
use App\Http\Controllers\Api\Admin\ApiLessonController;
use App\Http\Controllers\Api\Admin\ApiMajorController;
use App\Http\Controllers\Api\Admin\ApiNotificationController;
use App\Http\Controllers\Api\Admin\ApiOfficerController;
use App\Http\Controllers\Api\Admin\ApiPlanController;
use App\Http\Controllers\Api\Admin\ApiRoleController;
use App\Http\Controllers\Api\Admin\ApiRoomController;
use App\Http\Controllers\Api\Admin\ApiScheduleController;
use App\Http\Controllers\Api\Admin\ApiSectionController;
use App\Http\Controllers\Api\Admin\ApiSemesterController;
use App\Http\Controllers\Api\Admin\ApiShiftController;
use App\Http\Controllers\Api\Admin\ApiStudentController;
use App\Http\Controllers\Api\Client\Student\ApiStudentController as ApiClientStudent;
use App\Http\Controllers\Api\Admin\ApiSubjectController;
use App\Http\Controllers\Api\Admin\ApiTeacherController;
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


// Route::middleware(['auth:sanctum', 'role:admin'])->group(function () {
    Route::prefix('admin')->group(function () {
        Route::apiResource('roles', ApiRoleController::class);
        Route::apiResource('officers', ApiOfficerController::class);
        Route::apiResource('students', ApiStudentController::class);
        Route::apiResource('teachers', ApiTeacherController::class);

        Route::apiResource('courses', ApiCourseController::class);
        Route::apiResource('semesters', ApiSemesterController::class);

        Route::apiResource('majors', ApiMajorController::class);
        Route::get('major/{id}/subjects', [ApiMajorController::class, 'getAllSubjects']);

        Route::apiResource('plans', ApiPlanController::class);
        Route::get('major/{id}/subjects/selected', [ApiPlanController::class, 'getSubjectsByMajor']);

        Route::apiResource('subjects', ApiSubjectController::class);
        Route::get('subject/{id}/lessons', [ApiSubjectController::class, 'getAllLessons']);
        Route::post('subject/{id}/lessons/add', [ApiSubjectController::class, 'addLessons']);

        Route::get('subject/{id}/classrooms', [ApiSubjectController::class, 'getAllClassrooms']);
        Route::post('subject/{id}/classrooms/add', [ApiSubjectController::class, 'addClassrooms']);

        Route::apiResource('rooms', ApiRoomController::class);
        Route::apiResource('lessons', ApiLessonController::class);

        Route::apiResource('sections', ApiSectionController::class);
        Route::get('section/{id}/notifications', [ApiSectionController::class, 'getNotifications']);
        Route::post('section/{id}/addNotice', [ApiSectionController::class, 'addNotification']);

        Route::apiResource('notifications', ApiNotificationController::class);
        Route::apiResource('shifts', ApiShiftController::class);
        Route::apiResource('classrooms', ApiClassroomController::class);

        Route::apiResource('schedules', ApiScheduleController::class);
        Route::get('calculate-end-date', [ApiScheduleController::class, 'calculateEndDate']);
        Route::get('course/{courseId}/semester/{semesterId}/major/{majorId}/subjects', [ApiScheduleController::class, 'getSubjects']);
        Route::get('schedule/{id}/dates', [ApiScheduleController::class, 'getScheduledDates']);
    });

    // test api export file excel students + teachers
    Route::get('export-students', [ApiUserController::class, 'exportStudent']);
    Route::get('export-teachers', [ApiUserController::class, 'exportTeacher']);

    // test api import file excel students + teachers
    Route::post('import-students', [ApiUserController::class, 'importStudent']);
    Route::post('import-teachers', [ApiUserController::class, 'importTeacher']);

    // test api detail-student
    Route::get('detail-student/{id}', [ApiClientStudent::class, 'detailStudent']);

// });
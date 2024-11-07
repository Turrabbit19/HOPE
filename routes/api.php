<?php

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
use App\Http\Controllers\Api\Admin\ApiSubjectController;
use App\Http\Controllers\Api\Admin\ApiTeacherController;

use App\Http\Controllers\Api\Auth\ApiAuthController;

use App\Http\Controllers\Api\Student\StudentController;
use App\Http\Controllers\Api\Student\StudentNoticeController;
use App\Http\Controllers\Api\Teacher\TeacherController;
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

Route::post('login', [ApiAuthController::class, 'login']);
Route::post('logout', [ApiAuthController::class, 'logout'])->middleware('auth:sanctum');
Route::get('user', [ApiAuthController::class, 'user'])->middleware('auth:sanctum');

    Route::middleware(['auth:sanctum', 'role:Quản trị viên'])->prefix('admin')
        ->group(function () {
        Route::apiResource('roles', ApiRoleController::class);
        
        Route::apiResource('officers', ApiOfficerController::class);
        Route::apiResource('students', ApiStudentController::class);
        Route::get('export-student', [ApiStudentController::class, 'exportStudent']);
        Route::post('import-student', [ApiStudentController::class, 'importStudent']);

        Route::apiResource('teachers', ApiTeacherController::class);
        Route::get('export-teacher', [ApiTeacherController::class, 'exportTeacher']);
        Route::post('import-teacher', [ApiTeacherController::class, 'importTeacher']);

        Route::apiResource('courses', ApiCourseController::class);
        Route::get('course/{courseId}/semesters', [ApiCourseController::class, 'getSemestersByCourse']);
        Route::get('course/{courseId}/students', [ApiStudentController::class, 'getStudentsByCourse']);

        Route::apiResource('semesters', ApiSemesterController::class);

        Route::apiResource('majors', ApiMajorController::class);
        Route::get('major/{id}/subjects', [ApiMajorController::class, 'getAllSubjects']);

        Route::apiResource('plans', ApiPlanController::class);
        Route::get('major/{id}/subjects/selected', [ApiPlanController::class, 'getSubjectsByMajor']);
        Route::get('plan/{planId}/major/{majorId}/subjects', [ApiMajorController::class, 'filterMajorsByOrder']);

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
        Route::get('course/{courseId}/majors', [ApiScheduleController::class, 'getMajorsByCourse']);
        Route::get('course/{courseId}/semester/{semesterId}/major/{majorId}/subjects', [ApiScheduleController::class, 'getSubjects']);
        Route::get('schedule/{id}/dates', [ApiScheduleController::class, 'getScheduledDates']);

        Route::get('schedule/{id}/detail', [ApiScheduleController::class, 'getDetailSchedule']);
        Route::delete('schedule/{classroomId}/destroy', [ApiScheduleController::class, 'destroyByClassroomId']);

    });

    Route::middleware(['auth:sanctum', 'role:Cán bộ'])->prefix('officer')
    ->group(function () {
        Route::apiResource('students', ApiStudentController::class);
        Route::apiResource('teachers', ApiTeacherController::class);

        Route::apiResource('courses', ApiCourseController::class);
        Route::get('course/{courseId}/semesters', [ApiCourseController::class, 'getSemestersByCourse']);
        Route::get('course/{courseId}/students', [ApiStudentController::class, 'getStudentsByCourse']);

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

        Route::apiResource('rooms', ApiClassroomController::class);

        Route::apiResource('sections', ApiSectionController::class);
        Route::get('section/{id}/notifications', [ApiSectionController::class, 'getNotifications']);
        Route::post('section/{id}/addNotice', [ApiSectionController::class, 'addNotification']);

        Route::apiResource('notifications', ApiNotificationController::class);
        Route::apiResource('classrooms', ApiClassroomController::class);

        Route::apiResource('schedules', ApiScheduleController::class);
        Route::get('calculate-end-date', [ApiScheduleController::class, 'calculateEndDate']);
        Route::get('course/{courseId}/majors', [ApiScheduleController::class, 'getMajorsByCourse']);
        Route::get('course/{courseId}/semester/{semesterId}/major/{majorId}/subjects', [ApiScheduleController::class, 'getSubjects']);
        Route::get('schedule/{id}/dates', [ApiScheduleController::class, 'getScheduledDates']);
    });

    Route::middleware(['auth:sanctum', 'role:Sinh viên'])->prefix('student')
    ->group(function () {
        Route::get('/', [StudentController::class, 'getStudentDetail']);
        Route::get('subjects', [StudentController::class, 'getSubjects']);
        Route::get('subject/{subjectid}/shift/{shiftId}/classrooms', [StudentController::class, 'getClassrooms']);
        Route::post('schedule/{id}/register', [StudentController::class, 'registerSchedule']);

        Route::get('timetable', [StudentController::class, 'getTimetable']);

        Route::get('notifications', [StudentNoticeController::class, 'getStudentNotifications']);
        Route::get('notification/{id}', [StudentNoticeController::class, 'detailNotification']);

        Route::get('notifications/unread', [StudentNoticeController::class, 'getUnreadNotifications']);
        Route::get('notification/unread/{id}', [StudentNoticeController::class, 'detailNotification']);

        Route::get('notifications/read', [StudentNoticeController::class, 'getReadNotifications']);
        Route::get('notification/read/{id}', [StudentNoticeController::class, 'detailNotification']);
    });

    Route::middleware(['auth:sanctum', 'role:Giảng viên'])->prefix('teacher')
    ->group(function () {
        Route::get('/', [TeacherController::class, 'getTeacherDetail']);
        Route::get('schedules', [TeacherController::class, 'getSchedules']);
        Route::get('schedule/{scheduleId}/detail', [TeacherController::class, 'getDetailSchedule']);
        Route::get('schedule/{scheduleId}/students', [TeacherController::class, 'getDetailClassroom']);
    });

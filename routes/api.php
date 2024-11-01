<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\Admin\ApiPlanController;
use App\Http\Controllers\Api\Admin\ApiRoleController;
use App\Http\Controllers\Api\Admin\ApiRoomController;
use App\Http\Controllers\Api\Admin\ApiUserController;
use App\Http\Controllers\Api\Admin\ApiMajorController;
use App\Http\Controllers\Api\Admin\ApiShiftController;
use App\Http\Controllers\Api\Admin\ApiCourseController;
use App\Http\Controllers\Api\Admin\ApiLessonController;
use App\Http\Controllers\Api\Admin\ApiSectionController;
use App\Http\Controllers\Api\Admin\ApiStudentController;
use App\Http\Controllers\Api\Admin\ApiSubjectController;
use App\Http\Controllers\Api\Admin\ApiTeacherController;
use App\Http\Controllers\Api\Admin\ApiScheduleController;
use App\Http\Controllers\Api\Admin\ApiSemesterController;
use App\Http\Controllers\Api\Admin\ApiClassroomController;
use App\Http\Controllers\Api\Admin\ApiNotificationController;
use App\Http\Controllers\Api\Admin\ApiNotificationCoursesController;
use App\Http\Controllers\Api\Student\ApiStudentNotificationController;

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
    Route::apiResource('users', ApiUserController::class);
    // Route::apiResource('students', ApiStudentController::class);
    // Route::apiResource('teachers', ApiTeacherController::class);
    Route::apiResource('courses', ApiCourseController::class);
    Route::apiResource('semesters', ApiSemesterController::class);
    Route::apiResource('majors', ApiMajorController::class);
    Route::apiResource('plans', ApiPlanController::class);
    Route::apiResource('rooms', ApiRoomController::class);
    Route::apiResource('lessons', ApiLessonController::class);
    Route::apiResource('sections', ApiSectionController::class);
    Route::apiResource('notifications', ApiNotificationController::class);
    Route::apiResource('shifts', ApiShiftController::class);
    Route::apiResource('classrooms', ApiClassroomController::class);
    Route::apiResource('schedules', ApiScheduleController::class);
        Route::get('major/{id}/subjects', [ApiPlanController::class, 'getSubjectsByMajor']);
        Route::apiResource('subjects', ApiSubjectController::class);
        Route::get('subject/{id}/lessons', [ApiSubjectController::class, 'getAllLessons']);
        Route::post('subject/{id}/lessons/add', [ApiSubjectController::class, 'addLessons']);
        Route::get('subject/{id}/classrooms', [ApiSubjectController::class, 'getAllClassrooms']);
        Route::post('subject/{id}/classrooms/add', [ApiSubjectController::class, 'addClassrooms']);
        Route::apiResource('notificationcourses', ApiNotificationCoursesController::class);
        Route::apiResource('shifts', ApiShiftController::class);
    // });
});
Route::get('/major/subjects/{id}', [ApiMajorController::class, 'getSubjectsByMajor']);
Route::get('/section/notifications/{id}', [ApiSectionController::class, 'getNotificationsBySection']);

    // test api subject (lesson + classroom)
    Route::get('/subject/lessons/{id}', [ApiSubjectController::class, 'getAllLesson']);
    Route::post('/subject/lessons/add/{id}', [ApiSubjectController::class, 'addLesson']); // Thêm nhiều bản ghi
    Route::get('/subject/classrooms/{id}', [ApiSubjectController::class, 'getAllClassroom']);
    Route::post('/subject/classrooms/add/{id}', [ApiSubjectController::class, 'addClassroom']); // Thêm nhiều bản ghi

    // test api export file excel students + teachers
    Route::get('export-students', [ApiUserController::class, 'exportStudent']);
    Route::get('export-teachers', [ApiUserController::class, 'exportTeacher']);




    Route::apiResource('student_notifications', ApiStudentNotificationController::class);
    // Route để lấy tất cả học sinh chưa đọc thông báo
    Route::get('/unread-students', [ApiStudentNotificationController::class, 'getUnreadStudents']);
    // Route để lấy tất cả học sinh đã đọc thông báo
    Route::get('/read-students', [ApiStudentNotificationController::class, 'getReadStudents']);
    // });
// });
    Route::get('course/{courseId}/majors', [ApiCourseController::class, 'getMajorsByCourse']);
    Route::get('/schedule/{id}/detail', [ApiScheduleController::class, 'getDetailSchedule']);
    Route::get('course/{courseId}/major/{majorId}/students', [ApiStudentController::class, 'getStudentByMajorAndSemester']);

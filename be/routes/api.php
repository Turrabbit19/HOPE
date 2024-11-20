<?php

use App\Http\Controllers\Api\Admin\ApiClassroomController;
use App\Http\Controllers\Api\Admin\ApiCourseController;
use App\Http\Controllers\Api\Admin\ApiLessonController;
use App\Http\Controllers\Api\Admin\ApiMajorController;
use App\Http\Controllers\Api\Admin\ApiNotificationController;
use App\Http\Controllers\Api\Admin\ApiOfficerController;
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

use App\Http\Controllers\Api\Client\ApiClientController;

use App\Http\Controllers\Auth\GoogleController;

use App\Http\Controllers\Api\Student\StudentController;
use App\Http\Controllers\Api\Student\StudentNoticeController;
use App\Http\Controllers\Api\Teacher\TeacherController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Laravel\Socialite\Facades\Socialite;

// Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
//     return $request->user();
// });

// Route::post('login', [ApiAuthController::class, 'login']);
// Route::post('logout', [ApiAuthController::class, 'logout'])->middleware('auth:sanctum');
// Route::get('user', [ApiAuthController::class, 'user'])->middleware('auth:sanctum');

Route::post('google-login', [GoogleController::class, 'googleLogin']);

Route::get('auth/google', [GoogleController::class, 'redirectToGoogle']);

Route::get('auth/google/callback', [GoogleController::class, 'handleGoogleCallback']);
    Route::
    // middleware(['auth:sanctum', 'role:Quản trị viên'])->
    prefix('admin')

        ->group(function () {
        Route::apiResource('roles', ApiRoleController::class);

        Route::apiResource('officers', ApiOfficerController::class);

        Route::apiResource('students', ApiStudentController::class);
        Route::get('export-student', [ApiStudentController::class, 'exportStudent']);
        Route::post('import-student', [ApiStudentController::class, 'importStudent']);

        Route::apiResource('teachers', ApiTeacherController::class);
        Route::get('major/{majorId}/teachers', [ApiTeacherController::class, 'filterTeachersByMajor']);
        Route::get('export-teacher', [ApiTeacherController::class, 'exportTeacher']);
        Route::post('import-teacher', [ApiTeacherController::class, 'importTeacher']);

        Route::apiResource('courses', ApiCourseController::class);
        Route::get('course/{id}/restore', [ApiCourseController::class, 'restore']);
        Route::get('course/{courseId}/semesters', [ApiCourseController::class, 'getSemestersByCourse']);
        Route::get('course/{courseId}/students', [ApiStudentController::class, 'getStudentsByCourse']);

        Route::apiResource('semesters', ApiSemesterController::class);
        Route::get('semester/{id}/restore', [ApiSemesterController::class, 'restore']);

        Route::apiResource('majors', ApiMajorController::class);
        Route::get('main/majors', [ApiMajorController::class, 'getMainMajors']);
        Route::get('sub/{id?}/majors', [ApiMajorController::class, 'getSubMajors']);
        Route::get('sub/majors', [ApiMajorController::class, 'getAllSubMajors']);
        Route::post('major/{id}/restore', [ApiMajorController::class, 'restore']);
        Route::get('major/{id}/subjects', [ApiMajorController::class, 'getAllSubjects']);

        Route::apiResource('subjects', ApiSubjectController::class);
        Route::get('filter/subjects', [ApiSubjectController::class, 'filterSubjectsByMajor']);
        Route::post('subject/{id}/restore', [ApiSubjectController::class, 'restore']);
        Route::post('subjects/{majorId}/add', [ApiSubjectController::class, 'addSubjects']);

        Route::get('subject/{id}/lessons', [ApiSubjectController::class, 'getAllLessons']);
        Route::post('subject/{id}/lessons/add', [ApiSubjectController::class, 'addLessons']);

        Route::get('subject/{id}/classrooms', [ApiSubjectController::class, 'getAllClassrooms']);
        Route::get('subject/{subjectId}/majors', [ApiSubjectController::class, 'getMajorsBySubject']);
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
        Route::post('calculate-end-date', [ApiScheduleController::class, 'calculateEndDate']);
        Route::get('semester/{semesterId}/courses', [ApiScheduleController::class, 'getCoursesBySemester']);
        Route::get('course/{courseId}/majors', [ApiScheduleController::class, 'getMajorsByCourse']);
        Route::get('semester/{semesterId}/course/{courseId}/major/{majorId}/subjects', [ApiScheduleController::class, 'getSubjects']);
        Route::post('schedules/{semesterId}/{courseId}/{majorId}/{subjectId}/add', [ApiScheduleController::class, 'addSchedules']);
        Route::get('schedule/{subjectId}/classrooms', [ApiScheduleController::class, 'getClassrooms']);
        Route::post('schedules/assign', [ApiScheduleController::class, 'assignTeacherSchedules']);

        Route::get('schedule/{id}/detail', [ApiScheduleController::class, 'getDetailSchedule']);
        Route::delete('schedule/{classroomId}/destroy', [ApiScheduleController::class, 'destroyByClassroomId']);

    });

    Route::middleware(['auth:sanctum', 'role:Cán bộ'])->prefix('officer')
        ->group(function () {
        Route::apiResource('students', ApiStudentController::class);
        Route::get('export-student', [ApiStudentController::class, 'exportStudent']);
        Route::post('import-student', [ApiStudentController::class, 'importStudent']);

        Route::apiResource('teachers', ApiTeacherController::class);
        Route::get('export-teacher', [ApiTeacherController::class, 'exportTeacher']);
        Route::post('import-teacher', [ApiTeacherController::class, 'importTeacher']);

        Route::apiResource('courses', ApiCourseController::class);
        Route::get('course/{id}/restore', [ApiCourseController::class, 'restore']);
        Route::get('course/{courseId}/semesters', [ApiCourseController::class, 'getSemestersByCourse']);
        Route::get('course/{courseId}/students', [ApiStudentController::class, 'getStudentsByCourse']);

        Route::apiResource('semesters', ApiSemesterController::class);
        Route::get('semester/{id}/restore', [ApiSemesterController::class, 'restore']);

        Route::apiResource('majors', ApiMajorController::class);
        Route::get('main/majors', [ApiMajorController::class, 'getMainMajors']);
        Route::get('sub/{id}/majors', [ApiMajorController::class, 'getSubMajors']);
        Route::post('major/{id}/restore', [ApiMajorController::class, 'restore']);
        Route::get('major/{id}/subjects', [ApiMajorController::class, 'getAllSubjects']);

        Route::apiResource('subjects', ApiSubjectController::class);
        Route::get('filter/subjects', [ApiSubjectController::class, 'filterSubjectsByMajor']);
        Route::post('subject/{id}/restore', [ApiSubjectController::class, 'restore']);
        Route::post('subjects/{majorId}/add', [ApiSubjectController::class, 'addSubjects']);

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
        Route::get('semester/{semesterId}/courses', [ApiScheduleController::class, 'getCoursesBySemester']);
        Route::get('course/{courseId}/majors', [ApiScheduleController::class, 'getMajorsByCourse']);
        Route::get('semester/{semesterId}/course/{courseId}/major/{majorId}/subjects', [ApiScheduleController::class, 'getSubjects']);
        Route::post('schedules/{semesterId}/{courseId}/{majorId}/{subjectId}/add', [ApiScheduleController::class, 'addSchedules']);
        Route::get('schedule/{subjectId}/classrooms', [ApiScheduleController::class, 'getClassrooms']);

        Route::get('schedule/{id}/detail', [ApiScheduleController::class, 'getDetailSchedule']);
        Route::delete('schedule/{classroomId}/destroy', [ApiScheduleController::class, 'destroyByClassroomId']);
    });

    Route::middleware(['auth:sanctum', 'role:Sinh viên'])->prefix('student')
    ->group(function () {
        Route::get('/', [StudentController::class, 'getStudentDetail']);
        Route::get('subjects', [StudentController::class, 'getSubjects']);
        Route::get('shifts', [StudentController::class, 'getShifts']);
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

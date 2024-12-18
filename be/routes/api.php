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
use App\Http\Controllers\Api\Admin\ApiSyllabusController;
use App\Http\Controllers\Api\Admin\ApiTeacherController;
use App\Http\Controllers\api\admin\StatisticsController;
use App\Http\Controllers\Api\Auth\ApiAuthController;

use App\Http\Controllers\Api\Student\StudentController;
use App\Http\Controllers\Api\Student\StudentNoticeController;
use App\Http\Controllers\Api\Student\SyllabusController;
use App\Http\Controllers\Api\Teacher\TeacherController;
use App\Http\Controllers\PayPalController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

Route::post('login', [ApiAuthController::class, 'login']);
Route::post('logout', [ApiAuthController::class, 'logout'])->middleware('auth:sanctum');
Route::get('user', [ApiAuthController::class, 'user'])->middleware('auth:sanctum');

Route::prefix('admin')
    ->group(function () {
        Route::apiResource('roles', ApiRoleController::class);

        Route::apiResource('officers', ApiOfficerController::class);

        Route::apiResource('students', ApiStudentController::class);
        Route::get('export-student', [ApiStudentController::class, 'exportStudent']);
        Route::post('import-student', [ApiStudentController::class, 'importStudent']);
        Route::get('{courseId}/{majorId}/students', [ApiStudentController::class, 'getStudentsByMajorAndCourse']);
        Route::post('decrement-semester', [ApiStudentController::class, 'decrementStudentsSemester']);
        Route::post('students/filter', [ApiStudentController::class, 'filters']);


        Route::apiResource('teachers', ApiTeacherController::class);
        Route::get('teachersfilter', [ApiTeacherController::class, 'getTeachers']);
        Route::get('teachers/by-status/{status}', [ApiTeacherController::class, 'getTeachersByStatus']);
        Route::get('export-teacher', [ApiTeacherController::class, 'exportTeacher']);
        Route::post('import-teacher', [ApiTeacherController::class, 'importTeacher']);

        Route::apiResource('courses', ApiCourseController::class);
        Route::get('course/{id}/restore', [ApiCourseController::class, 'restore']);
        Route::get('course/{courseId}/semesters', [ApiCourseController::class, 'getSemestersByCourse']);
        Route::get('course/{courseId}/students', [ApiStudentController::class, 'getStudentsByCourse']);
        Route::get('course/{courseId}/majors', [ApiScheduleController::class, 'getMajorsByCourse']);

        Route::apiResource('semesters', ApiSemesterController::class);
        Route::get('all/semesters', [ApiSemesterController::class, 'getAll']);
        Route::get('semester/{id}/restore', [ApiSemesterController::class, 'restore']);
        Route::get('filter-by-year/semesters', [ApiSemesterController::class, 'filterByYear']);

        Route::apiResource('majors', ApiMajorController::class);
        Route::get('main/majors', [ApiMajorController::class, 'getMainMajors']);
        Route::get('sub/majors', [ApiMajorController::class, 'getAllSubMajors']);
        Route::get('sub/{majorId}/majors', [ApiMajorController::class, 'getSubMajors']);
        Route::post('major/{id}/restore', [ApiMajorController::class, 'restore']);
        Route::get('major/{id}/subjects', [ApiMajorController::class, 'getAllSubjects']);
        Route::get('major/{majorId}/teachers', [ApiMajorController::class, 'getTeachersByMajor']);

        Route::apiResource('subjects', ApiSubjectController::class);
        Route::get('all/subjects', [ApiSubjectController::class, 'getAll']);
        Route::get('subject/{subjectId}/majors', [ApiSubjectController::class, 'getMajorsBySubject']);
        Route::get('filter-by-major/{majorId}/subjects', [ApiSubjectController::class, 'filterSubjectsByMajor']);
        Route::post('subject/{id}/restore', [ApiSubjectController::class, 'restore']);

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
        Route::get('{subjectId}/classrooms/without-schedule', [ApiClassroomController::class, 'getClassroomsWithoutSchedule']);

        Route::apiResource('schedules', ApiScheduleController::class);
        Route::get('calculate-end-date', [ApiScheduleController::class, 'calculateEndDate']);
        Route::get('semester/{semesterId}/courses', [ApiScheduleController::class, 'getCoursesBySemester']);
        Route::get('semester/{semesterId}/{courseId}/majors', [ApiScheduleController::class, 'getMajorsByCourseAndSemester']);
        Route::get('semester/{semesterId}/course/{courseId}/major/{majorId}/subjects', [ApiScheduleController::class, 'getSubjects']);
        Route::post('schedules/{semesterId}/{courseId}/{majorId}/{subjectId}/add', [ApiScheduleController::class, 'addSchedules']);
        Route::post('schedules/{semesterId}/{courseId}/{majorId}/{subjectId}/random', [ApiScheduleController::class, 'assignStudentsToSubject']);
        Route::delete('schedules/{semesterId}/{courseId}/{majorId}/{subjectId}/delete', [ApiScheduleController::class, 'deleteEmptyClassrooms']);
        Route::delete('schedule/{scheduleId}/delete', [ApiScheduleController::class, 'removeStudentsFromClass']);
        Route::get('schedules/{courseId}/{subjectId}/classrooms', [ApiScheduleController::class, 'getClassrooms']);
        Route::post('schedules/assign', [ApiScheduleController::class, 'assignTeacherSchedules']);

        Route::get('schedule/{id}/detail', [ApiScheduleController::class, 'getDetailSchedule']);
        Route::post('schedule/{id}/update', [ApiScheduleController::class, 'updateByClassroomId']);
        Route::delete('schedule/{id}/destroy', [ApiScheduleController::class, 'destroyByClassroomId']);

        Route::get('syllabus/{majorId}/all', [ApiSyllabusController::class, 'getSubjectsFromOrder']);
        Route::get('syllabus/{majorId}/{subMajorId}/all', [ApiSyllabusController::class, 'getSubjectsFromOrderWSubMajor']);
        Route::get('syllabus/{majorId}/all-subjects', [ApiSyllabusController::class, 'getAllSubjects']);
        Route::get('major/{majorId}/courses', [ApiSyllabusController::class, 'getCoursesByMajor']);
        Route::get('getMajorAndSubMajor', [ApiSyllabusController::class, 'getMajorAndSubMajor']);

        Route::get('statistics/studentByCourse', [StatisticsController::class, "getStudentStatistics"]);
        Route::get('statistics/{id}/studentByMajor', [StatisticsController::class, "getStudentCountByMajorInCourse"]);
        Route::get('statistics/studentAndTeacherByMajor', [StatisticsController::class, "getStudentandTeacherCountByMajorInCourse"]);
        Route::get('statistics/statisticSubMajors/{majorId}', [StatisticsController::class, "statisticSubMajors"]);
        Route::get('statistics/majorsByCourse/{courseId}', [StatisticsController::class, 'getMajorsByCourse']);
        Route::get('statistics/classrooms', [StatisticsController::class, 'getClassrooms']);

        Route::apiResource('paypal', PayPalController::class);
        Route::post('paypal/getTransactionsByCourse', [PayPalController::class, 'getTransactionsByCourse']);
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
        Route::post('major/{id}/restore', [ApiMajorController::class, 'restore']);
        Route::get('major/{id}/subjects', [ApiMajorController::class, 'getAllSubjects']);

        Route::apiResource('subjects', ApiSubjectController::class);
        Route::get('subject/{subjectId}/majors', [ApiSubjectController::class, 'getMajorsBySubject']);
        Route::get('filter/{majorId}/subjects', [ApiSubjectController::class, 'filterSubjectsByMajor']);
        Route::post('subject/{id}/restore', [ApiSubjectController::class, 'restore']);

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

        Route::get('classrooms', [StudentController::class, 'getStudentClassrooms']);
        Route::get('statistics/{semesterId}', [SyllabusController::class, 'getStatisticsBySubject']);

        Route::get('syllabus', [SyllabusController::class, 'getSyllabus']);
        Route::get('syllabus/{subjectId}', [SyllabusController::class, 'getDetailClassroom']);

        Route::get('timetable', [StudentController::class, 'getTimetable']);

        Route::get('semesters', [StudentController::class, 'getSemester']);
        Route::get('{semesterId}/timetable', [StudentController::class, 'getTimetableBySemester']);

        Route::get('sub-majors', [StudentController::class, 'getSubMajors']);

        Route::get('getFeeBySemester', [PayPalController::class, 'getFeeBySemester']);
        Route::apiResource('paypal', PayPalController::class);
        Route::post('sub-majors/{subMajorId}/register', [StudentController::class, 'registerSubMajor']);

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

        Route::get('timetable', [TeacherController::class, 'getTimetable']);

        Route::get('semesters', [TeacherController::class, 'getSemesterForTeacher']);
        Route::get('{semesterId}/timetable', [TeacherController::class, 'getTimetableBySemesterForTeacher']);

        Route::get('schedule/{scheduleId}/detail', [TeacherController::class, 'getDetailSchedule']);
        Route::get('schedule/{scheduleId}/students', [TeacherController::class, 'getDetailsClassroom']);
        Route::get('schedule/{scheduleId}/{lesson_id}/students', [TeacherController::class, 'getDetailClassroom']);
        Route::post('attendance/{schedule_id}/{lesson_id}/mark', [TeacherController::class, 'markAttendance']);
    });

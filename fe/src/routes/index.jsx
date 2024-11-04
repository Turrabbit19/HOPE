import { createBrowserRouter } from "react-router-dom";
import { lazy, Suspense } from "react";
import LandingPage from "../components/landingPage";
import NotFound from "../components/NotFound";
import Loading from "../components/loading";
import ScrollToTopButton from "../components/scrollToTopButton";
import BreadCrumb from "./breadcrumb";
import MajorManagement from "../pages/admin/major";
import Role from "../pages/admin/roles";
import UserManager from "../pages/admin/userManager";
import CoursesManager from "../pages/admin/courses";
import SemesterManage from "../pages/admin/semesters";
import SubjectManager from "../pages/admin/subjects";
import SectionManage from "../pages/admin/sections";
import NotificationManage from "../pages/admin/notification";
import StudentManager from "../pages/admin/userManager/student";
const LayoutStudent = lazy(() => import("../components/layout/layoutStudent"));
const StudentInformation = lazy(() => import("../pages/student/information"));
// Lazy loading for components
const LayoutAdmin = lazy(() => import("../components/layout/layoutAdmin"));
// const Schedule = lazy(() => import("../pages/student/schedul"));
const List = lazy(() => import("../pages/admin/list"));

const Teach = lazy(() => import("../pages/admin/teaching/page"));
const TeachAdd = lazy(() => import("../pages/admin/teaching/add/page"));

import { ClassStudent } from "../pages/admin/classStudent/ClassStudent";
import { AddClassStudent } from "../pages/admin/classStudent/AddClassStudent";
import { ClassDetailLayout } from "../components/layout/ClassDetailLayout";
import { ClassStudentDetail } from "../pages/admin/classStudent/ClassStudentDetail";
import { AddScheduleManual } from "../pages/admin/classStudent/schedule/AddScheduleManual";
import { AddScheduleSeries } from "../pages/admin/classStudent/schedule/AddScheduleSeries";
import { AccountManage } from "../pages/admin/classStudent/account-manage/AccountManage";
import { Resource } from "../pages/admin/classStudent/resource/Resource";
import Testing from "../pages/test/page";
import ListSemester from "../pages/admin/semesters/list/page";
import ListSubjects from "../pages/admin/subjects/list/page";
import ClassRoom from "../pages/admin/classroom/page";
import ListRooms from "../pages/admin/rooms/page";
import SyllabusAdd from "../pages/admin/syllabus/add/page";
import SyllabusList from "../pages/admin/syllabus/page";
import SyllabusEdit from "../pages/admin/syllabus/edit/page";
import ListCourse from "../pages/admin/courses/list/page";
import AllStudent from "../pages/admin/userManager/all-student";
import AllUser from "../pages/admin/userManager/all-user";
import AllTeacher from "../pages/admin/userManager/all-teacher";
import ScheduleAdd from "../pages/admin/schedule/add/page";
import Schedule from "../pages/admin/schedule/page";
import EditSchedule from "../pages/admin/schedule/edit/page";
import MajorSubject from "../pages/admin/teaching/subject/page";
import CourseDetail from "../pages/admin/courses/detail/page";
import MajorDetailSubject from "../pages/admin/teaching/subjectdetail/page";

const Router = createBrowserRouter([
    {
        path: "",
        element: <LandingPage />,
    },
    {
        path: "admin",
        element: (
            <Suspense fallback={<Loading />}>
                <LayoutAdmin />
                <ScrollToTopButton />
            </Suspense>
        ),
        children: [
            {
                path: "",
                element: (
                    <>
                        <BreadCrumb />
                        <NotificationManage />
                    </>
                ),
            },
            {
                path: "test",
                element: <Testing />,
            },
            {
                path: "list-syllabus",
                element: <SyllabusList />,
            },
            {
                path: "list-syllabus/add",
                element: <SyllabusAdd />,
            },
            {
                path: "list-syllabus/edit/:id",
                element: <SyllabusEdit />,
            },
            {
                path: "list",
                element: (
                    <Suspense fallback={<Loading />}>
                        <List />
                    </Suspense>
                ),
            },
            {
                path: "list-rooms",
                element: (
                    <Suspense fallback={<Loading />}>
                        <ListRooms />
                    </Suspense>
                ),
            },
            {
                path: "majors",
                element: (
                    <>
                        <Teach />
                    </>
                ),
            },
            {
                path: "majors/:id/subjects",
                element: (
                    <>
                        <MajorSubject />
                    </>
                ),
            },
            {
                path: "majors/:majorId/subjects/detail/:subjectId",
                element: (
                    <>
                        <MajorDetailSubject />
                    </>
                ),
            },
            {
                path: "teaching/add",
                element: (
                    <>
                        <BreadCrumb />
                        <TeachAdd />
                    </>
                ),
            },
            {
                path: "teaching/list",
                element: (
                    <>
                        <ListCourse />
                    </>
                ),
            },
            {
                path: "Schedule",
                element: (<>
                    <Schedule/>
                </>)
            },
            {
                path: "schedule/add",
                element: (
                    <>
                        <ScheduleAdd />
                    </>
                ),

            },
            {
                path: "schedule/edit/:id",
                element: (
                    <>
                        <EditSchedule />
                    </>
                ),

            },
            {
                path: "class-student",
                element: <ClassStudent />,
            },
            {
                path: "class-student/add",
                element: <AddClassStudent />,
            },
            {
                path: "class-student/:classId",
                element: <ClassDetailLayout />,
                children: [
                    {
                        path: "",
                        element: <ClassStudentDetail />,
                    },
                    {
                        path: "schedule/add-manual",
                        element: <AddScheduleManual />,
                    },
                    {
                        path: "schedule/add-series",
                        element: <AddScheduleSeries />,
                    },
                    {
                        path: "account-manage",
                        element: <AccountManage />,
                    },
                    {
                        path: "resource",
                        element: <Resource />,
                    },
                ],
            },

            {
                path: "majors",
                element: (
                    <>
                        <BreadCrumb />
                        <MajorManagement />
                    </>
                ),
            },
            {
                path: "roles",
                element: (
                    <>
                        <BreadCrumb />
                        <Role />
                    </>
                ),
            },
            {
                path: "user-manager",
                element: (
                    <>
                        <BreadCrumb />
                        <UserManager />
                    </>
                ),
            },

            // giao diện list môn học
            {
                path: "list-subject",
                element: (
                    <>
                        <ListSubjects />
                    </>
                ),
            },
            //
            {
                path: "courses",
                element: (
                    <>
                        <BreadCrumb />
                        <CoursesManager />
                    </>
                ),
            },

            //
            {
                path: "semesters",
                element: (
                    <>
                        <BreadCrumb />
                        <SemesterManage />
                    </>
                ),
            },
            // Giao diện list semester
            {
                path: "list-semesters",
                element: (
                    <>
                        <ListSemester />
                    </>
                ),
            },
            //

            // giao diện list khóa học
            {
                path: "list-subject",
                element: (
                    <>
                        <BreadCrumb />
                        <ListSubjects />
                    </>
                ),
            },

            {
                path: "subjects",
                element: (
                    <>
                        <BreadCrumb />
                        <SubjectManager />
                    </>
                ),
            },
            {
                path: "list-course",
                element: (
                    <>
                        <ListCourse />
                    </>
                ),
            },
            {
                path: "list-course/:courseId/detail",
                element: (
                    <>
                        <CourseDetail />
                    </>
                ),
            },
            {
                path: "sections",
                element: (
                    <>
                        <BreadCrumb />
                        <SectionManage />
                    </>
                ),
            },
            {
                path: "student_manager",
                element: (
                    <>
                        <BreadCrumb />
                        <StudentManager />
                    </>
                ),
            },

            {
                path: "all-student",
                element: (
                    <>
                        <BreadCrumb />
                        <AllStudent />
                    </>
                ),
            },
            {
                path: "all-user",
                element: (
                    <>
                        <BreadCrumb />
                        <AllUser />
                    </>
                ),
            },
            {
                path: "teacher-manager",
                element: (
                    <>
                        <BreadCrumb />
                        <AllTeacher />
                    </>
                ),
            },

            {
                path: "classrooms",
                element: (
                    <>
                        <ClassRoom />
                    </>
                ),
            },
        ],
    },
    {
        path: "student",
        element: (
            <Suspense fallback={<Loading />}>
                <LayoutStudent />
                <ScrollToTopButton />
            </Suspense>
        ),
        children: [
            {
                path: "information",
                element: (
                    <Suspense fallback={<Loading />}>
                        <StudentInformation />
                    </Suspense>
                ),
            },
            // {
            //     path: "schedule",
            //     element: (
            //         <Suspense fallback={<Loading />}>
            //             <Schedule />
            //         </Suspense>
            //     ),
            // },
        ],
    },
    {
        path: "*",
        element: <NotFound />,
    },
]);

export default Router;

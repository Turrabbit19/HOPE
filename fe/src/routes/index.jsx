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
import SectionManage from "../pages/admin/sections";
import NotificationManage from "../pages/admin/notification";
import StudentManager from "../pages/admin/userManager/student";
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

import SyllabusList from "../pages/admin/syllabus/list/page";

import ListCourse from "../pages/admin/courses/list/page";
import ScheduleAdd from "../pages/admin/schedule/add/page";
import Schedule from "../pages/admin/schedule/page";
import EditSchedule from "../pages/admin/schedule/edit/page";
import MajorSubject from "../pages/admin/teaching/subject/page";
import CourseDetail from "../pages/admin/courses/detail/page";
import MajorDetailSubject from "../pages/admin/teaching/subjectdetail/page";
import ScheduleList from "../pages/admin/schedule/list/page";
import ScheduleDetail from "../pages/admin/schedule/detail/page";
import ListSections from "../pages/admin/section/list/page";
import SubMajors from "../pages/admin/teaching/submajors/page";
import DetailSubject from "../pages/admin/subjects/detail/page";

import TeacherManager from "../pages/admin/userManager/teacher";
import AdminManager from "../pages/admin/userManager/admin";
import UserAdd from "../pages/admin/userManager/add/page";
import ListUser from "../pages/admin/userManager/list/page";
import UserEdit from "../pages/admin/userManager/edit/page";
import Curriculum from "../pages/admin/curriculum/list/page";
import StatisticalReport from "../pages/admin/statisticalReport/page";
import StatisticalMajorReport from "../pages/admin/statisticalReport/major/page";
import StatisticalTeacherStudent from "../pages/admin/statisticalReport/teacher/page";

import CurriculumDetail from "../pages/admin/syllabus/detail/page";

import DashboardActions from "../pages/student/schedule/page";
import LayoutStudent from "../components/layout/layoutStudent";
import ScheduleRegistration from "../pages/student/classRegitration/page";
import StudentDashboard from "../pages/student/studentDashboard/page";
import NotificationPage from "../pages/student/notification/page";
import SchoolLogin from "../pages/student/login/page";
import LayoutClient from "../components/layout/layoutStudent";
import LayoutTeacher from "../components/layout/layoutTeacher";
import TeacherInfo from "../pages/teacher/teacherDashboard/page";
import ClassLessonTable from "../pages/teacher/listClassLesson/page";
import TeacherTimetable from "../pages/teacher/teacherTimetable/page";

const Router = createBrowserRouter([
  {
    path: "/",
    element: <SchoolLogin />,
  },
  {
    path: "login",
    element: <SchoolLogin />,
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
        path: "list-syllabus/detail/:majorId",
        element: <CurriculumDetail />,
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
        path: "majors/:id/submajors",
        element: (
          <>
            <SubMajors />
          </>
        ),
      },
      {
        path: "majors/:id/submajors/:subId/subjects",
        element: (
          <>
            <MajorSubject />
          </>
        ),
      },
      {
        path: "majors/:id/submajors/:subId/subjects/detail/:subjectId",
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
        path: "major/list",
        element: (
          <>
            <ListCourse />
          </>
        ),
      },
      {
        path: "Schedule",
        element: (
          <>
            <Schedule />
          </>
        ),
      },
      {
        path: "list-schedule",
        element: <ScheduleList />,
      },
      {
        path: "list-schedule/add",
        element: (
          <>
            <ScheduleAdd />
          </>
        ),
      },
      {
        path: "list-schedule/details/:id",
        element: <ScheduleDetail />,
      },
      {
        path: "list-schedule/details/:id/edit",
        element: (
          <>
            <EditSchedule />
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
            <StudentManager />
          </>
        ),
      },
      {
        path: "teacher-manager",
        element: (
          <>
            <BreadCrumb />
            <TeacherManager />
          </>
        ),
      },
      {
        path: "admin-manager",
        element: (
          <>
            <BreadCrumb />
            <AdminManager />
          </>
        ),
      },

      {
        path: "list-users",
        element: <ListUser />,
      },
      {
        path: "list-users/add",
        element: <UserAdd />,
      },
      {
        path: "list-users/edit/:id",
        element: <UserEdit />,
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
        path: "statistical-report",
        element: <StatisticalReport />,
      },

      {
        path: "statistical-report/teacher-student",
        element: <StatisticalTeacherStudent />,
      },

      {
        path: "statistical-report/:id/major",
        element: <StatisticalMajorReport />,
      },

      {
        path: "list-schedule",
        element: <ScheduleList />,
      },

      {
        path: "list-schedule/add",
        element: <ScheduleAdd />,
      },
      // {
      //     path: "list-schedule/details/:id/edit",
      //     element: <ScheduleEdit />,
      // },
      {
        path: "list-schedule/details/:id",
        element: <ScheduleDetail />,
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

      {
        path: "list-subject/detail/:subjectId",
        element: (
          <>
            <DetailSubject />
          </>
        ),
      },

      {
        path: "list-sections",
        element: (
          <>
            <ListSections />
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
        path: "classrooms",
        element: (
          <>
            <ClassRoom />
          </>
        ),
      },

      // Curriculum
      {
        path: "list-curriculum",
        element: (
          <>
            <Curriculum />
          </>
        ),
      },
    ],
  },
  {
    path: "teacher",
    element: <LayoutTeacher />,
    children: [
      {
        path: "home",
        element: <TeacherInfo />,
      },
      {
        path: "listclasslesson",
        element: <ClassLessonTable />,
      },
      {
        path: "timetable",
        element: <TeacherTimetable />,
      },
    ],
  },
  {
    path: "student",
    element: <LayoutClient />,
    children: [
      {
        path: "schedule",
        element: <DashboardActions />,
      },
      {
        path: "class-registration",
        element: <ScheduleRegistration />,
      },
      {
        path: "home",
        element: <StudentDashboard />,
      },
      {
        path: "notification",
        element: <NotificationPage />,
      },
    ],
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);

export default Router;

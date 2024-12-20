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
const Schedule = lazy(() => import("../pages/student/schedul"));
const List = lazy(() => import("../pages/admin/list"));

const Teach = lazy(() => import("../pages/admin/teaching/page"));
const TeachAdd = lazy(() => import("../pages/admin/teaching/add/page"));
const ListCourse = lazy(() =>
  import("../pages/admin/teaching/listCourse/page")
);

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
import ListCourseAll from "../pages/admin/courses/list/page";
import ListSubjects from "../pages/admin/subjects/list/page";
import ClassRoom from "../pages/admin/classroom/page";
import AllStudent from "../pages/admin/userManager/all-student";
import AllTeacher from "../pages/admin/userManager/all-teacher";
import AllUser from "../pages/admin/userManager/all-user";

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
        path: "list",
        element: (
          <Suspense fallback={<Loading />}>
            <List />
          </Suspense>
        ),
      },
      {
        path: "teaching",
        element: (
          <>
            <Teach />
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
            <BreadCrumb />
            <ListCourseAll />
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
            <BreadCrumb />
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
        path: "list-courses",
        element: (
          <>
            <BreadCrumb />
            <ListSubjects />
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
            <BreadCrumb />
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
      {
        path: "schedule",
        element: (
          <Suspense fallback={<Loading />}>
            <Schedule />
          </Suspense>
        ),
      },
    ],
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);

export default Router;

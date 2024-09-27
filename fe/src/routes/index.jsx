import { createBrowserRouter } from "react-router-dom";
import { lazy, Suspense } from "react";
import LandingPage from "../components/landingPage";
import NotFound from "../components/NotFound";
// import LayoutAdmin from "../components/layout/layoutAdmin";
// import List from "../pages/admin/list";
// import Schedule from "../pages/admin/schedul";
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
// import LayoutStudent from "../components/layout/layoutStudent";

const LayoutAdmin = lazy(() => import("../components/layout/layoutAdmin"));
const Schedule = lazy(() => import("../pages/student/schedul"));
const List = lazy(() => import("../pages/admin/list"));
const LayoutStudent = lazy(() => import("../components/layout/layoutStudent"));
const StudentInformation = lazy(() => import("../pages/student/information"));

const Router = createBrowserRouter([
  {
    // index,
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
      // <BreadCrumb />,{}
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
        path: "list",
        element: (
          <Suspense fallback={<Loading />}>
            <List />
          </Suspense>
        ),
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
      {
        path: "courses",
        element: (
          <>
            <BreadCrumb />
            <CoursesManager />
          </>
        ),
      },
      {
        path: "semesters",
        element: (
          <>
            <BreadCrumb />
            <SemesterManage />
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
            <StudentManager/>
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

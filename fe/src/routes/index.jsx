import { createBrowserRouter } from "react-router-dom";
import { lazy, Suspense } from "react";
import LandingPage from "../components/landingPage";
import NotFound from "../components/NotFound";
// import LayoutAdmin from "../components/layout/layoutAdmin";
// import List from "../pages/admin/list";
// import Schedule from "../pages/admin/schedul";
import AddSt from "../pages/admin/addSt";
import Loading from "../components/loading";
import ScrollToTopButton from "../components/scrollToTopButton";
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
        <ScrollToTopButton/>
      </Suspense>
    ),

    children: [
      {
        path: "list",
        element: (
          <Suspense fallback={<Loading />}>
            <List />
          </Suspense>
        ),
      },
      
      {
        path: "add-student",
        element: <AddSt />,
      },
    ],
  },
  {
    path: "student",
    element: (
      <Suspense fallback={<Loading />}>
        <LayoutStudent />
        <ScrollToTopButton/>
      </Suspense>
    ),
    children: [
      {
        path: "information",
        element: (
          <Suspense fallback={<Loading/>}>
            <StudentInformation />
          </Suspense>
        )
      },
      {
        path: "schedule",
        element: (
          <Suspense fallback={<Loading />}>
            <Schedule />
          </Suspense>
        ),
      },
    ]
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);

export default Router;

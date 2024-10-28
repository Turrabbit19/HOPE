import { createBrowserRouter } from "react-router-dom"
import Testing from "../test/page"
import DashboardActions from "../pages/schedule/page"
import LayoutClient from "../components/layout/layoutClient"
import ScheduleRegistration from "../pages/classRegitration/page"
import StudentDashboard from "../pages/studentDashboard/page"
import NotificationPage from "../pages/notification/page"
import SchoolLogin from "../pages/login/page"

const Router = createBrowserRouter([
    {
        path: "",
        element: <LayoutClient />,

        children: [

            {
                path: "",
                element: <DashboardActions />
            },

            {
                path: "schedule",
                element: <DashboardActions />
            },
            {
                path: "class-registration",
                element: <ScheduleRegistration />,
            },
            {
                path: "home",
                element: <StudentDashboard />
            },
            {
                path: "notification",
                element: <NotificationPage />
            }
        ]

    },
    {
        path: "login",
        element: <SchoolLogin />
    }


    // không đường dẫn

    // {
    //     path: "",
    //     element: <LayoutAdmin/>,

    //     children : [
    //         {
    //          path: "",
    //          element: <DashboardActions/>
    //         },
    //     ]
    // }




])
export default Router
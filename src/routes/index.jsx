    import { createBrowserRouter } from "react-router-dom"
    import Testing from "../test/page"
    import DashboardActions from "../pages/schedule/page"
    import LayoutClient from "../components/layout/layoutClient"
    import ScheduleRegistration from "../pages/classRegitration/page"
    import StudentDashboard from "../pages/studentDashboard/page"
    import InfoStudent from "../pages/studentDashboard/infoStudnent/page"
import NotificationPage from "../pages/notification/page"

    const Router = createBrowserRouter([
        {
            path: "",
            element: <LayoutClient/>,

            children: [

                {
                    path: "",
                    element: <DashboardActions/>
                },

                {
                    path: "schedule",
                    element: <DashboardActions/>
                },
                {
                    path: "class-registration",
                    element: <ScheduleRegistration/>,
                },
                {
                    path: "home",
                    element: <StudentDashboard/>
                },
                {
                    path: "info-student",
                    element: <InfoStudent />
                },
                {
                    path: "notification",
                    element: <NotificationPage />
                }
            ]
            
        },


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
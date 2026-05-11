import { createBrowserRouter } from "react-router";
import Login from "./features/auth/pages/Login";
import Register from "./features/auth/pages/Register";
import Protected from "./features/auth/components/Protected";
import Home from "./features/interview/pages/Home";
import Interview from "./features/interview/pages/Interview";
import LiveSession from "./features/interview/pages/LiveSession";
import AnalyticsReport from "./features/interview/pages/AnalyticsReport";


export const router = createBrowserRouter([
    {
        path: "/login",
        element: <Login />
    },
    {
        path: "/register",
        element: <Register />
    },
    {
        path: "/",
        element: <Protected><Home /></Protected>
    },
    {
        path:"/interview/:interviewId",
        element: <Protected><Interview /></Protected>
    },
    {
        path:"/interview/:interviewId/live",
        element: <Protected><LiveSession /></Protected>
    },
    {
        path:"/interview/:interviewId/analytics/:sessionId",
        element: <Protected><AnalyticsReport /></Protected>
    }
])
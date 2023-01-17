import {lazy} from "react";

const IndexRoutes = [
    // PAGES
    {
        path: "/dashboard",
        component: lazy(() => import("../../view/pages/dashboard")),
        layout: "VerticalLayout",
    },
    {
        path: "/case",
        component: lazy(() => import("../../view/pages/ticket")),
        layout: "VerticalLayout",
    },
    {
        path: "/customer",
        component: lazy(() => import("../../view/pages/customer")),
        layout: "VerticalLayout",
    },
    {
        path: "/log",
        component: lazy(() => import("../../view/pages/log")),
        layout: "VerticalLayout",
    },
    {
        path: "/user",
        component: lazy(() => import("../../view/pages/user")),
        layout: "VerticalLayout",
    },
    {
        path: "/report",
        component: lazy(() => import("../../view/pages/report")),
        layout: "VerticalLayout",
    },
];

export default IndexRoutes;
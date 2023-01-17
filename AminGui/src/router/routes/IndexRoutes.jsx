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
];

export default IndexRoutes;
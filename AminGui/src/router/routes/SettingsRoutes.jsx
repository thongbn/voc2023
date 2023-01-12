import {lazy} from "react";

const SettingsRoutes = [
    // PAGES
    {
        path: "/settings",
        component: lazy(() => import("../../view/pages/blank")),
        layout: "VerticalLayout",
    },
];

export default SettingsRoutes;
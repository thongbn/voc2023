import {lazy} from "react";

const SettingsRoutes = [
    // PAGES
    {
        path: "/settings/faq",
        component: lazy(() => import("../../view/pages/setting/faq")),
        layout: "VerticalLayout",
    },
    {
        path: "/settings/tag",
        component: lazy(() => import("../../view/pages/setting/tag")),
        layout: "VerticalLayout",
    },
    {
        path: "/settings/auto-answer",
        component: lazy(() => import("../../view/pages/setting/auto-answer")),
        layout: "VerticalLayout",
    },
    {
        path: "/settings/auto-bot",
        component: lazy(() => import("../../view/pages/setting/bot")),
        layout: "VerticalLayout",
    },
    {
        path: "/settings/template",
        component: lazy(() => import("../../view/pages/setting/template")),
        layout: "VerticalLayout",
    },
    {
        path: "/settings/other",
        component: lazy(() => import("../../view/pages/setting/other")),
        layout: "VerticalLayout",
    },
];

export default SettingsRoutes;
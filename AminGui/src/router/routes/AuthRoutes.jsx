import { lazy } from "react";

const AuthRoutes = [
    // PAGES
    {
        path: "/auth/login",
        component: lazy(() => import("../../view/pages/authentication/login")),
        layout: "FullLayout",
        redirectIfAuth: true
    },
    {
        path: "/auth/register",
        component: lazy(() => import("../../view/pages/authentication/register")),
        layout: "FullLayout",
        redirectIfAuth: true
    },
    {
        path: "/auth/forgot-password",
        component: lazy(() => import("../../view/pages/authentication/recover-password")),
        layout: "FullLayout",
        redirectIfAuth: true
    },
    {
        path: "/auth/reset-password",
        component: lazy(() => import("../../view/pages/authentication/reset-password")),
        layout: "FullLayout",
        redirectIfAuth: true
    },
];

export default AuthRoutes;
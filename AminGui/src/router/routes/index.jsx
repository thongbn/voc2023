// Routes Imports
import AuthRoutes from "./AuthRoutes";
import IndexRoutes from "./IndexRoutes";

// Merge Routes
const Routes = {
    publicRoutes: [
        ...AuthRoutes,
    ],
    privateRoutes: [
        ...IndexRoutes,
    ]
};

export {Routes};
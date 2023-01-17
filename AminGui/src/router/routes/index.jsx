// Routes Imports
import AuthRoutes from "./AuthRoutes";
import IndexRoutes from "./IndexRoutes";
import SettingsRoutes from "./SettingsRoutes";

// Merge Routes
const Routes = {
    publicRoutes: [
        ...AuthRoutes,
    ],
    privateRoutes: [
        ...IndexRoutes,
        ...SettingsRoutes
    ]
};

export {Routes};
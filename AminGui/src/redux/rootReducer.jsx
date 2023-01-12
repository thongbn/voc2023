import {combineReducers} from "redux";

import customiseReducer from "./customise/customiseReducer";
import authReducer from "./auth";

const rootReducer = combineReducers({
    customise: customiseReducer,
    auth: authReducer,
});

export default rootReducer;
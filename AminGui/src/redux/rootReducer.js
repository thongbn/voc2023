import {combineReducers} from "redux";

import customiseReducer from "./customise/customiseReducer";
import authReducer from "./auth";
import tagReducer from "./tags";

const rootReducer = combineReducers({
    customise: customiseReducer,
    auth: authReducer,
    tag: tagReducer,
});

export default rootReducer;
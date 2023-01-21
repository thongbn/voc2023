import {combineReducers} from "redux";

import customiseReducer from "./customise/customiseReducer";
import authReducer from "./auth";
import tagReducer from "./tags";
import ticketReducer from "./ticket";

const rootReducer = combineReducers({
    customise: customiseReducer,
    auth: authReducer,
    tag: tagReducer,
    ticket: ticketReducer,
});

export default rootReducer;
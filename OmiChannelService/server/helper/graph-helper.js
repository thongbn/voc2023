import {getFbLLTToken, getFbMessToken, getIgMessToken} from "../services/ConfigService";
import axios from "axios";
import createError from "http-errors";

const getBaseUrl = () => {
    return process.env.GRAPH_API_URL;
};

export const graphApiGet = async (path, queryObj, messTokenType = "fb") => {
    let messToken = "";
    switch (messTokenType) {
        case "ig":
            messToken = await getIgMessToken();
            break;
        case "page":
            messToken = await getFbLLTToken();
            break;
        default:
            messToken = await getFbMessToken();
            break;
    }
    try {
        const res = await axios.get(`${getBaseUrl()}${path}`, {
            ...queryObj,
            access_token: messToken
        });
        console.log(res.data);
        return res.data;
    } catch (e) {
        console.error(path, messToken, queryObj, e);
        return null;
    }
};

export const graphApiPost = async (path, data, messTokenType = "page", queryObj= {}) => {
    let messToken = "";
    switch (messTokenType) {
        case "ig":
            messToken = await getIgMessToken();
            break;
        case "page":
            messToken = await getFbLLTToken();
            break;
        default:
            messToken = await getFbMessToken();
            break;
    }
    try {
        const res = await axios.post(`${getBaseUrl()}${path}`, data, {
            params: {
                access_token: messToken,
                ...queryObj
            }
        });
        console.log(res.data);
        return res.data;
    } catch (e) {
        console.error(path, messToken, data, queryObj, e.message, e.response.data);
        throw createError(400, e.message);
    }
};
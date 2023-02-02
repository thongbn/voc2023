import {getFbLLTToken, getFbMessToken} from "../services/ConfigService";
import axios from "axios";

const getBaseUrl = () => {
    return process.env.GRAPH_API_URL;
};

export const graphApiGet = async (path, queryObj, isMessToken = true) => {
    const messToken = isMessToken ? await getFbMessToken() : await getFbLLTToken();
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

export const graphApiPost = async (path, data, isMessToken = true) => {
    const messToken = isMessToken ? await getFbMessToken() : await getFbLLTToken();
    try {
        const res = await axios.post(`${getBaseUrl()}${path}`, data, {
            params: {
                access_token: messToken
            }
        });
        console.log(res.data);
        return res.data;
    } catch (e) {
        console.error(path, messToken, data, e.message);
        throw e;
    }
};
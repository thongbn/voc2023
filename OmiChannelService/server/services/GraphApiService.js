import {getFbMessToken} from "./ConfigService";

const baseApi = process.env.FB_GRAPH_API || "https://graph.facebook.com";


export const graphGetRequest = async (path, params) => {
    const getToken = await getFbMessToken();
    const url = `${baseApi}${path}`;
    try {
        const res = await axios.get(url, {
            params: {
                "access_token": getToken,
                ...params,
            }
        });
        console.log("getRequestRequest", JSON.stringify(res.data));
        return res.data;
    } catch (e) {
        console.error(url, e.response.data);
        throw new Error(`Graph post request: ${e.message}`);
    }
};

export const graphPostRequest = async (path, data, params) => {
    const getToken = await getFbMessToken();
    const url = `${baseApi}${path}`;
    try {
        const res = await axios.post(url, data, {
            params: {
                "access_token": getToken,
                ...params,
            }
        });
        console.log("postRequest", JSON.stringify(res.data));
        return res.data;
    } catch (e) {
        console.error(url, e.response.data);
        throw new Error(`Graph post request: ${e.message}`);
    }
};
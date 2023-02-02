import {getFbMessToken} from "./ConfigService";
import axios from "axios";

const baseApi = "https://graph.facebook.com";

export const getCustomerInfoViaPsId = async (psid) => {
    const getToken = await getFbMessToken();
    const url = `${baseApi}/${psid}`
        + `?access_token=${getToken}`;
    try {
        const res = await axios.get(url);
        console.log("getCustomerInfoViaPsId", JSON.stringify(res.data));
        return res.data;
    } catch (e) {
        console.error(url, e);
        return null;
    }
};

export const getCommentDetail = async (commentId) => {
    const getToken = await getFbMessToken();
    const url = `${baseApi}/${commentId}`;
    try{
        const res = await axios.get(url, {
            params: {
                "access_token": getToken,
                "fields": "message,attachment"
            }
        });
        console.log("getCommentDetail", JSON.stringify(res.data));
        return res.data;
    }catch (e) {
        console.error(url, e);
    }
};
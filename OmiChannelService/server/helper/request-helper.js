import NodeCache from "node-cache";
import qs from "qs";
import md5 from 'md5';
import axios from "axios";

const getBaseUrl = () => {
    return process.env.SMILEUP_API_URL;
};

const appCache = new NodeCache();
const axiosInstance = axios.create({
    baseURL: getBaseUrl(),
    headers: {'Sdb-Token': process.env.SMILEUP_TOKEN}
});

const getCacheKey = (text) => {
    const ret = md5(text);
    return ret;
};

export const callGet = async (urlPath, queryObj, cache = false) => {
    try {
        const query = qs.stringify({
            ...queryObj
        }, {
            encodeValuesOnly: true,
            skipNulls: true,
        });

        const url = `${urlPath}?${query}`;

        let data = null;
        let isCached = false;
        const canProcessCache = cache && process?.env?.CACHED_ENABLED === "true";
        if (canProcessCache) {
            const cacheData = appCache.get(getCacheKey(url));
            if (cacheData) {
                data = cacheData;
                isCached = true;
            }
        }

        if (!isCached) {
            if (process.env && process.env.NODE_ENV === "development") {
                console.log(url, queryObj);
            }
            const res = await axiosInstance.get(url);
            if (process.env && process.env.NODE_ENV === "development") {
                console.log(res.data);
            }
            data = res.data;
            if (canProcessCache) {
                appCache.set(getCacheKey(url),
                    data,
                    process?.env?.CACHED_ENABLED ? process.env.CACHED_TTL : 3600);
            }
        }
        return data;
    } catch (e) {
        console.error(e);
        throw e;
    }
};
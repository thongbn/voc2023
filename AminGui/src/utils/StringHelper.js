import numeral from 'numeral';
import moment from "moment";
import qs from "qs";

export const formatNumber = (value, format = '0,0') => {
    return numeral(value).format(format);
};

export const formatDate = (value, format = 'DD/MM/YYYY hh:ss') => {
    return moment(value).format(format);
};

export const parseUrlParams = (locationSearch) => {
    let query = {};
    if (locationSearch) {
        query = qs.parse(locationSearch, {ignoreQueryPrefix: true});
    }
    console.log(query);
    return query;
};

export const removeEmptyProperties = (obj) => {
    for (const key of Object.keys(obj)) {
        if (obj[key] === "") {
            delete obj[key];
        }
    }
    return obj;
};
import React from 'react';
import {useDispatch, useSelector} from "react-redux";
import axios from "axios";
import {message} from "antd";
import {logout, renewToken} from "../redux/auth";
import store from "../redux/store";

const defaultHeaders = () => {
    return {
        'Content-Type': "application/json",
        'Accept': 'application/json',
    }
};

export const errorCatch = (errResponse, form) => {
    console.error("errorCatch", errResponse);
    if (errResponse.response && errResponse.response.data) {
        const data = errResponse.response.data;
        if (data.errors) {
            try {
                let fields = [];
                data.errors.map(item => {
                    const idx = fields.findIndex(i => i.name === item.param);
                    let errField = {name: item.param, errors: [], value: item.value};
                    if (idx >= 0) {
                        errField = fields[idx];
                    } else {
                        fields.push(errField);
                    }
                    errField.errors.push(item.msg);
                });
                form?.setFields(fields);
                return;
            } catch (e) {
                console.error(e);
            }
        } else if (data.message) {
            message.error(data.message);
            return;
        }
    }
    message.error(errResponse.message);
};

const ApiHelper = () => {
    const {token, refreshToken} = store.getState().auth;

    const axiosApiInstance = axios.create({
        baseURL: process.env.REACT_APP_BASE_API_URL,
        headers: {
            ...defaultHeaders(),
            'Authorization': `Bearer ${token}`,
        }
    });


    const getNewToken = async () => {
        try {
            const res = await ApiHelper().post("/auth/request-token", {
                rfToken: refreshToken,
            });
            return res.data.token;
        } catch (e) {
            throw new Error("Token hết hạn xin vui lòng đăng nhập lại");
        }
    };

    axiosApiInstance.interceptors.request.use(
        async config => {
            return config;
        },
        error => {
            return Promise.reject(error)
        });

    axiosApiInstance.interceptors.response.use((response) => {
        return response
    }, async function (error) {
        const originalRequest = error.config;
        if (error.response.status === 403 && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                //Call get refresh token
                console.log("Call refresh");
                const newToken = await getNewToken();
                console.log("Renew token", newToken, originalRequest.headers, axios.defaults.headers.common);
                originalRequest.headers['Authorization'] = 'Bearer ' + newToken;
                store.dispatch(renewToken({token: newToken}));
            } catch (e) {
                message.error(e.message);
                store.dispatch(logout());
                console.log("Call logout");
                return;
            }
            console.log("Call again");
            return axiosApiInstance(originalRequest);
        }
        console.log("Rejected");
        return Promise.reject(error);
    });

    return axiosApiInstance;
};

export default ApiHelper;
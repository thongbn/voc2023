import {createSlice} from "@reduxjs/toolkit";

const RF_TOKEN_KEY = "rfToken";
const APP_TOKEN_KEY = "token";
const USER_TOKEN_KEY = "user";

const initialState = () => {
    try {
        const user = JSON.parse(localStorage.getItem(USER_TOKEN_KEY));
        return {
            refreshToken: localStorage.getItem(RF_TOKEN_KEY),
            token: localStorage.getItem(APP_TOKEN_KEY),
            user
        }
    } catch (e) {
        return {
            refreshToken: null,
            token: null,
            user: null,
        }
    }
};

const authSlice = createSlice({
    name: "auth",
    initialState: initialState(),
    reducers: {
        loginSuccess(state, action) {
            const {refreshToken, token, user} = action.payload;
            state.user = user;
            state.token = token;
            state.refreshToken = refreshToken;
            localStorage.setItem(RF_TOKEN_KEY, refreshToken);
            localStorage.setItem(APP_TOKEN_KEY, token);
            localStorage.setItem(USER_TOKEN_KEY, JSON.stringify(user));
        },
        logout(state, action) {
            state.user = null;
            state.token = null;
            state.refreshToken = null;
            localStorage.removeItem(RF_TOKEN_KEY);
            localStorage.removeItem(APP_TOKEN_KEY);
            localStorage.removeItem(USER_TOKEN_KEY);
        },
        renewToken(state,action){
            state.token = action.payload.token;
            localStorage.setItem(APP_TOKEN_KEY, state.token);
        }
    }
});

const {actions, reducer} = authSlice;
export const {loginSuccess, logout, renewToken} = actions;
export default reducer;
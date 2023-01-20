import {createSlice} from "@reduxjs/toolkit";

const initialState = () => {
    return {
        tagCategories: [],
        loadingTagCategories: true,
    }
};

const tagSlice = createSlice({
    name: "tag",
    initialState: initialState(),
    reducers: {
        getTagsSuccess(state, action) {
            state.tagCategories = action.payload;
            state.loadingTagCategories = false;
        }
    }
});

const {actions, reducer} = tagSlice;
export const {getTagsSuccess} = actions;
export default reducer;

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
        setLoadingTagCategory(state, action){
            state.loadingTagCategories = action.payload;
        },
        getTagsSuccess(state, action) {
            state.tagCategories = action.payload;
            state.loadingTagCategories = false;
        }
    }
});

const {actions, reducer} = tagSlice;
export const {getTagsSuccess, setLoadingTagCategory} = actions;
export default reducer;

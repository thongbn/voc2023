import {createSlice} from "@reduxjs/toolkit";

const initialState = () => {
    return {
        ticket: null,
        ticketNotes: [],
        ticketStatus: null,
        isLoading: false,
    }
};

const tagSlice = createSlice({
    name: "ticket",
    initialState: initialState(),
    reducers: {
        updateTicket(state, action) {
            state.ticket = action.payload;
            if (state.ticket.userNote) {
                state.ticketNotes = JSON.parse(state.ticket.userNote);
            }
            state.ticketStatus = state.ticket.caseStatus;
        },
        updateNotes(state, action) {
            state.ticketNotes = action.payload;
        },
        updateStatus(state, action) {
            state.ticketStatus = action.payload;
        }
    }
});

const {actions, reducer} = tagSlice;
export const {updateTicket, updateNotes, updateStatus} = actions;
export default reducer;

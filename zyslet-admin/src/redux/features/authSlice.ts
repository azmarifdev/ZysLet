import {createSlice} from "@reduxjs/toolkit";

interface UserState {
    user: any;
}

const initialState: UserState = {
    user: {},
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setUser: (state, action) => {
            state.user = action.payload;
        },
        logout: (state) => {
            state.user = {};
        },
    },
});

export const {logout, setUser} = authSlice.actions;

export default authSlice.reducer;

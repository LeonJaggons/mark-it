import { createSlice } from "@reduxjs/toolkit";

export interface AppState {
    appName: String;
    showLogin: boolean;
}

const initialState: AppState = {
    appName: "MarkIt",
    showLogin: false,
};
const appSlice = createSlice({
    name: "app",
    initialState,
    reducers: {
        toggleShowLogin: (state) => {
            state.showLogin = !state.showLogin;
        },
    },
});

export const { toggleShowLogin } = appSlice.actions;
export default appSlice.reducer;

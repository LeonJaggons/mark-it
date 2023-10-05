import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Location } from "./itemSlice";

export interface AppState {
    appName: String;
    showLogin: boolean;
    appLocation?: Location;
}

const initialState: AppState = {
    appName: "MarkIt",
    showLogin: false,
    appLocation: null,
};
const appSlice = createSlice({
    name: "app",
    initialState,
    reducers: {
        toggleShowLogin: (state) => {
            state.showLogin = !state.showLogin;
        },
        setAppLocation: (state, action: PayloadAction<Location>) => {
            state.appLocation = action.payload;
        },
    },
});

export const { toggleShowLogin, setAppLocation } = appSlice.actions;
export default appSlice.reducer;

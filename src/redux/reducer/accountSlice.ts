import { PayloadAction, createSlice } from "@reduxjs/toolkit";

export type LoginCreds = {
    email: string;
    password: string;
};
export interface AccountState {
    loggedIn: boolean;
    user: any;
    loginCreds: LoginCreds;
}

const initialState: AccountState = {
    loggedIn: false,
    user: null,
    loginCreds: {} as LoginCreds,
};

const accountSlice = createSlice({
    name: "account",
    initialState,
    reducers: {
        setUser: (state, action: PayloadAction<any>) => {
            state.user = action.payload;
        },
        setLoggedIn: (state, action: PayloadAction<boolean>) => {
            state.loggedIn = action.payload;
        },
        setLoginUsername: (state, action: PayloadAction<string>) => {
            state.loginCreds = {
                ...state.loginCreds,
                email: action.payload,
            } as LoginCreds;
        },
        setLoginPassword: (state, action: PayloadAction<string>) => {
            state.loginCreds = {
                ...state.loginCreds,
                password: action.payload,
            } as LoginCreds;
        },
    },
});

export const { setUser, setLoginUsername, setLoginPassword, setLoggedIn } =
    accountSlice.actions;
export default accountSlice.reducer;

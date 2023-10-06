import { PayloadAction, createSlice } from "@reduxjs/toolkit";

export type LoginCreds = {
    email: string;
    password: string;
};
export type NewUserCreds = {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
};
export interface AccountState {
    loggedIn: boolean;
    user: any;
    loginCreds: LoginCreds;
    newUserCreds: NewUserCreds;
}

const initialState: AccountState = {
    loggedIn: false,
    user: null,
    loginCreds: {} as LoginCreds,
    newUserCreds: {} as NewUserCreds,
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
        setNewUserEmail: (state, action: PayloadAction<string>) => {
            state.newUserCreds = {
                ...state.newUserCreds,
                email: action.payload,
            } as NewUserCreds;
        },
        setNewUserPassword: (state, action: PayloadAction<string>) => {
            state.newUserCreds = {
                ...state.newUserCreds,
                password: action.payload,
            } as NewUserCreds;
        },
        setNewUserFirstName: (state, action: PayloadAction<string>) => {
            state.newUserCreds = {
                ...state.newUserCreds,
                firstName: action.payload,
            } as NewUserCreds;
        },
        setNewUserLastName: (state, action: PayloadAction<string>) => {
            state.newUserCreds = {
                ...state.newUserCreds,
                lastName: action.payload,
            } as NewUserCreds;
        },
        signOut: (state) => {
            state.loginCreds = {} as LoginCreds;
            state.user = null;
            state.loggedIn = false;
        },
    },
});

export const {
    setUser,
    setLoginUsername,
    setLoginPassword,
    setLoggedIn,
    signOut,
    setNewUserEmail,
    setNewUserPassword,
    setNewUserFirstName,
    setNewUserLastName,
} = accountSlice.actions;
export default accountSlice.reducer;

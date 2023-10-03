import { configureStore } from "@reduxjs/toolkit";
import appReducer from "./reducer/appSlice";
import accountReducer from "./reducer/accountSlice";
import itemReducer from "./reducer/itemSlice";

export const store = configureStore({
    reducer: {
        app: appReducer,
        account: accountReducer,
        item: itemReducer,
    },
});
export type RootState = ReturnType<typeof store.getState>;

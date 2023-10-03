import { PayloadAction, createSlice } from "@reduxjs/toolkit";

export type Location = {
    latitude: number;
    longitude: number;
};
export type MarkItItem = {
    title?: string;
    price?: number;
    images?: any[];
    condition?: string;
    category?: string;
    location?: Location;
    description?: string;
    sku?: string;
};

export const EmptyItem: MarkItItem = {
    title: undefined,
    price: undefined,
    images: [],
    condition: undefined,
    category: undefined,
    location: undefined,
    description: undefined,
    sku: undefined,
};
export interface ItemState {
    postItem: MarkItItem;
}

const initialState: ItemState = {
    postItem: EmptyItem,
};

const itemSlice = createSlice({
    name: "item",
    initialState,
    reducers: {
        setPostItem: (state, action: PayloadAction<MarkItItem>) => {
            state.postItem = action.payload;
        },
    },
});

export const { setPostItem } = itemSlice.actions;
export default itemSlice.reducer;

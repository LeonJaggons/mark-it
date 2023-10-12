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
    focusedMessage: any;
    selectedCategory?: string;
    filters: any;
}

const EmptyFilters = {
    minPrice: 0,
    maxPrice: 0,
    category: "",
    deliveryMethod: "",
    conditions: "",
};

const initialState: ItemState = {
    postItem: EmptyItem,
    focusedMessage: null,
    selectedCategory: null,
    filters: EmptyFilters,
};

const itemSlice = createSlice({
    name: "item",
    initialState,
    reducers: {
        setPostItem: (state, action: PayloadAction<MarkItItem>) => {
            state.postItem = action.payload;
        },
        setFocusedMessage: (state, action: PayloadAction<any>) => {
            state.focusedMessage = action.payload;
        },
        setSelectedCategory: (state, action: PayloadAction<string>) => {
            state.selectedCategory = action.payload;
        },
        setFilterMinPrice: (state, action: PayloadAction<number>) => {
            state.filters = {
                ...state.filters,
                minPrice: action.payload,
            };
        },
        setFilterMaxPrice: (state, action: PayloadAction<number>) => {
            state.filters = {
                ...state.filters,
                maxPrice: action.payload,
            };
        },
        setFilterCategory: (state, action: PayloadAction<string>) => {
            state.filters = {
                ...state.filters,
                category: action.payload,
            };
        },
        setFilterDeliveryMethod: (state, action: PayloadAction<string>) => {
            state.filters = {
                ...state.filters,
                category: action.payload,
            };
        },
    },
});

export const { setPostItem, setFocusedMessage, setSelectedCategory } =
    itemSlice.actions;
export default itemSlice.reducer;

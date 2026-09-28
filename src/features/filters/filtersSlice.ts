import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

const initialState = {
  search: "",
  make: "all",
  transmission: "all",
  reserve: "all",
  sort: "endingSoon",
};

const filtersSlice = createSlice({
  name: "filters",
  initialState,
  reducers: {
    setSearch(state, action: PayloadAction<string>) {
      state.search = action.payload;
    },

    setMake(state, action: PayloadAction<string>) {
      state.make = action.payload;
    },

    setTransmission(state, action: PayloadAction<string>) {
      state.transmission = action.payload;
    },

    setReserve(state, action: PayloadAction<string>) {
      state.reserve = action.payload;
    },

    setSort(state, action: PayloadAction<string>) {
      state.sort = action.payload;
    },

    resetFilters() {
      return initialState;
    },
  },
});

export const {
  setSearch,
  setMake,
  setTransmission,
  setReserve,
  setSort,
  resetFilters,
} = filtersSlice.actions;

export default filtersSlice.reducer;
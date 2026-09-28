import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { readWatchlist } from "../../lib/watchlistStorage";

const initialState = {
  ids: readWatchlist(),
};

const watchlistSlice = createSlice({
  name: "watchlist",
  initialState,
  reducers: {
    toggleWatchlist(state, action: PayloadAction<string>) {
      const id = action.payload;

      if (state.ids.includes(id)) {
        state.ids = state.ids.filter((item) => item !== id);
      } else {
        state.ids.push(id);
      }
    },
  },
});
export const { toggleWatchlist } = watchlistSlice.actions;
export default watchlistSlice.reducer
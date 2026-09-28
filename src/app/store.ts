import { configureStore } from "@reduxjs/toolkit"

import { writeWatchlist } from "../lib/watchlistStorage"
import watchlistReducer from "../features/watchlist/watchlistSlice"
import filtersReducer from "../features/filters/filtersSlice"

export const store = configureStore({
  reducer: {
    watchlist: watchlistReducer,
    filters: filtersReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

let lastWatchlist = store.getState().watchlist.ids

store.subscribe(() => {
  const ids = store.getState().watchlist.ids

  if (ids !== lastWatchlist) {
    lastWatchlist = ids
    writeWatchlist(ids)
  }
})
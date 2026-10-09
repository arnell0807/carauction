import {
  resetFilters,
  setMake,
  setReserve,
  setSearch,
  setSort,
  setTransmission,
} from "../features/filters/filtersSlice";
import { SearchIcon } from "./Icons";
import { useAppDispatch, useAppSelector } from "../app/hooks";

export default function FilterBar({ makes }: { makes: string[] }) {
  const dispatch = useAppDispatch();
  const filters = useAppSelector((state) => state.filters);

  const selectClass =
    "h-11 rounded-lg border border-stone-200 bg-white px-3 text-sm font-semibold text-stone-700 outline-none transition focus:border-stone-500";

  return (
    <div className="rounded-lg border border-stone-200 bg-white p-4 shadow-sm">
      <div className="grid gap-3 lg:grid-cols-[minmax(230px,1.5fr)_repeat(4,minmax(130px,1fr))_auto]">
        <label className="relative">
          <span className="sr-only">Search auctions</span>
          <SearchIcon className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-stone-400" />
          <input
            value={filters.search}
            onChange={(e) => dispatch(setSearch(e.target.value))}
            placeholder="Search make or model"
            className="h-11 w-full rounded-lg border border-stone-200 bg-white pl-9 pr-3 text-sm outline-none transition placeholder:text-stone-400 focus:border-stone-500"
          />
        </label>

        <select
          value={filters.make}
          onChange={(e) => dispatch(setMake(e.target.value))}
          className={selectClass}
        >
          <option value="all">All makes</option>
          {makes.map((make) => (
            <option key={make} value={make}>
              {make}
            </option>
          ))}
        </select>

        <select
          value={filters.transmission}
          onChange={(e) => dispatch(setTransmission(e.target.value))}
          className={selectClass}
        >
          <option value="all">Any gearbox</option>
          <option value="Manual">Manual</option>
          <option value="Automatic">Automatic</option>
        </select>

        <select
          value={filters.reserve}
          onChange={(e) => dispatch(setReserve(e.target.value))}
          className={selectClass}
        >
          <option value="all">Reserve status</option>
          <option value="no-reserve">No reserve</option>
          <option value="reserve">Reserve</option>
        </select>

        <select
          value={filters.sort}
          onChange={(e) => dispatch(setSort(e.target.value))}
          className={selectClass}
        >
          <option value="endingSoon">Ending soon</option>
          <option value="newest">Newest year</option>
          <option value="priceLow">Bid: low to high</option>
          <option value="priceHigh">Bid: high to low</option>
          <option value="mostBids">Most bids</option>
        </select>

        <button
          type="button"
          onClick={() => dispatch(resetFilters())}
          className="h-11 rounded-lg px-4 text-sm font-bold text-stone-500 transition hover:bg-stone-100 hover:text-stone-950"
        >
          Reset
        </button>
      </div>
    </div>
  );
}
import AuctionCard from "../components/AuctionCard";
import FilterBar from "../components/FilterBar";
import LoadingCards from "../components/LoadingCards";
import { sortByEndingSoon } from "../lib/sortAuctions";
import useAuctions from "../hooks/useAuctions";
import { useAppSelector } from "../app/hooks";
import type { AuctionSummary } from "../lib/auctionApi";
import type { RootState } from "../app/store";

function applyFilters(
  auctions: AuctionSummary[],
  filters: RootState["filters"],
) {
  const search = filters.search.trim().toLowerCase();

  const filtered = auctions.filter((auction) => {
    const haystack = [
      auction.year,
      auction.make,
      auction.model,
      auction.trim,
    ]
      .join(" ")
      .toLowerCase();

    if (search && !haystack.includes(search)) return false;
    if (filters.make !== "all" && auction.make !== filters.make) return false;

    if (
      filters.transmission !== "all" &&
      auction.transmission !== filters.transmission
    )
      return false;

    if (filters.reserve === "no-reserve" && auction.reserve) return false;
    if (filters.reserve === "reserve" && !auction.reserve) return false;

    return true;
  });

  return filtered.sort((a, b) => {
    if (filters.sort === "newest") return b.year - a.year;
    if (filters.sort === "priceLow") return a.currentBid - b.currentBid;
    if (filters.sort === "priceHigh") return b.currentBid - a.currentBid;
    if (filters.sort === "mostBids") return b.bidCount - a.bidCount;

    return sortByEndingSoon(a, b);
  });
}

export default function AuctionsPage() {
  const filters = useAppSelector((state) => state.filters);
  const { auctions, isLoading, isError } = useAuctions();

  const makes = [...new Set(auctions.map((item) => item.make))].sort();

  const visible = applyFilters(auctions, filters);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-7">
        <p className="text-xs font-black uppercase tracking-[0.2em] text-amber-700">
          Marketplace
        </p>

        <div className="mt-1 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="text-4xl font-black tracking-[-0.045em]">
              Live auctions
            </h1>

            <p className="mt-2 text-stone-500">
              Find the car, follow the auction, make your move.
            </p>
          </div>

          {!isLoading && (
            <p className="text-sm font-bold text-stone-500">
              {visible.length} of {auctions.length} listings
            </p>
          )}
        </div>
      </div>

      <FilterBar makes={makes} />

      {isError ? (
        <div className="mt-8 rounded-2xl border border-red-200 bg-red-50 p-5 font-semibold text-red-800">
          Couldn't load auctions
        </div>
      ) : isLoading ? (
        <LoadingCards count={6} />
      ) : visible.length === 0 ? (
        <div className="mt-7 rounded-3xl border border-dashed border-stone-300 bg-white px-6 py-16 text-center">
          <h2 className="text-xl font-black">No auctions match that.</h2>

          <p className="mt-2 text-stone-500">
            Try clearing a filter or searching for something broader.
          </p>
        </div>
      ) : (
        <div className="mt-7 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {visible.map((auction) => (
            <AuctionCard key={auction.id} auction={auction} />
          ))}
        </div>
      )}
    </div>
  );
}
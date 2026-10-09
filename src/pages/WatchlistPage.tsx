
import { Link } from "react-router-dom";
import AuctionCard from "../components/AuctionCard";
import LoadingCards from "../components/LoadingCards";
import useAuctions from "../hooks/useAuctions";
import { useAppSelector } from "../app/hooks";


export default function WatchlistPage() {
  const ids = useAppSelector((state) => state.watchlist.ids);
  const { auctions, isLoading, isError } = useAuctions();

 

  const watched = auctions.filter((auction) => ids.includes(auction.id));
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <p className="text-xs font-bold uppercase tracking-wider text-amber-700">
        Saved
      </p>
      <h1 className="mt-1 text-4xl font-black tracking-tight">
        Your watchlist
      </h1>
      <p className="mt-2 text-stone-500">
        Keep the auctions you're interested in together.
      </p>

      {isError ? (
        <div className="mt-8 rounded-lg border border-red-200 bg-red-50 p-5 font-semibold text-red-800">
          Couldn't load auctions
        </div>
      ) : isLoading ? (
        <LoadingCards count={3} />
      ) : watched.length === 0 ? (
        <div className="mt-8 rounded-xl border border-dashed border-stone-300 bg-white px-6 py-16 text-center">
          <h2 className="text-xl font-black">Nothing here yet.</h2>
          <p className="mt-2 text-stone-500">
            Hit the heart on any auction to keep it here.
          </p>
          <Link
            to="/auctions"
            className="mt-5 inline-block rounded-lg bg-stone-950 px-4 py-2.5 text-sm font-black text-white"
          >
            Browse auctions
          </Link>
        </div>
      ) : (
        <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {watched.map((auction) => (
            <AuctionCard key={auction.id} auction={auction} />
          ))}
        </div>
      )}
    </div>
  );
}

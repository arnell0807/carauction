import { Link } from "react-router-dom";
import AuctionCard from "../components/AuctionCard";
import { ArrowIcon } from "../components/Icons";
import LoadingCards from "../components/LoadingCards";
import { sortByEndingSoon } from "../lib/sortAuctions";
import { hasEnded } from "../lib/auctionApi";
import useAuctions from "../hooks/useAuctions";

export default function HomePage() {
  const { auctions, isLoading, isError } = useAuctions();

  const featured = auctions
    .filter((auction) => !hasEnded(auction))
    .sort(sortByEndingSoon)
    .slice(0, 3);

  return (
    <>
      <section className="relative overflow-hidden border-b border-stone-200 bg-stone-950 text-white">
        <img
          src="https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?auto=format&fit=crop&w=2000&q=80"
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-linear-to-r from-stone-950 via-stone-950/85 to-stone-950/30" />

        <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 md:py-28 lg:px-8">
          <div className="max-w-3xl">
            <p className="mb-5 text-xs font-bold uppercase tracking-wider text-amber-300">
              Enthusiast car auctions
            </p>

            <h1 className="text-5xl font-black tracking-tight sm:text-6xl lg:text-7xl">
              Cars worth bidding for.
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-stone-300">
              Browse interesting cars, follow the ones you care about, and place
              bids in a marketplace built around the auction itself.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/auctions"
                className="inline-flex items-center gap-2 rounded-lg bg-amber-300 px-5 py-3 font-black text-stone-950 transition hover:bg-amber-200"
              >
                Browse auctions <ArrowIcon />
              </Link>

              <Link
                to="/sell"
                className="rounded-lg border border-stone-700 px-5 py-3 font-bold text-white transition hover:border-stone-500 hover:bg-stone-900"
              >
                List your car
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="mb-7 flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-amber-700">
              Ending soon
            </p>

            <h2 className="mt-1 text-3xl font-black tracking-tight">
              Auctions to watch
            </h2>
          </div>

          <Link
            to="/auctions"
            className="hidden items-center gap-2 text-sm font-black text-stone-700 hover:text-stone-950 sm:flex"
          >
            View all <ArrowIcon className="size-4" />
          </Link>
        </div>

        {isError ? (
          <div className="rounded-lg border border-red-200 bg-red-50 p-5 font-semibold text-red-800">
            Couldn't load auctions
          </div>
        ) : isLoading ? (
          <LoadingCards count={3} />
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {featured.map((auction) => (
              <AuctionCard key={auction.id} auction={auction} />
            ))}
          </div>
        )}
      </section>

      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-4 rounded-xl bg-amber-300 p-7 sm:p-10 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-amber-900">
              Have something interesting?
            </p>

            <h2 className="mt-2 text-3xl font-black tracking-tight text-stone-950">
              Create an auction in a couple of minutes.
            </h2>

            <p className="mt-2 max-w-2xl text-stone-700">
              Add the details, set a starting bid and your listing goes live
              straight away.
            </p>
          </div>

          <Link
            to="/sell"
            className="mt-3 rounded-lg bg-stone-950 px-5 py-3 text-center font-black text-white transition hover:bg-stone-800 lg:mt-0"
          >
            Start a listing
          </Link>
        </div>
      </section>
    </>
  );
}

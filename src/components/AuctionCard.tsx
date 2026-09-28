import { Link } from "react-router-dom";

import { toggleWatchlist } from "../features/watchlist/watchlistSlice";
import { formatMileage, formatMoney } from "../lib/format";
import type { AuctionSummary } from "../lib/auctionApi";
import Countdown from "./Countdown";
import { HeartIcon } from "./Icons";
import { useAppDispatch, useAppSelector } from "../app/hooks";

export default function AuctionCard({ auction }: { auction: AuctionSummary }) {
  const dispatch = useAppDispatch();

  const watched = useAppSelector((state) =>
    state.watchlist.ids.includes(auction.id),
  );

  return (
    <article className="group overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg">
      <div className="relative aspect-16/10 overflow-hidden bg-stone-200">
        <Link
          to={`/auctions/${auction.id}`}
          aria-label={`View ${auction.year} ${auction.make} ${auction.model}`}
        >
          <img
            src={auction.image}
            alt={`${auction.year} ${auction.make} ${auction.model}`}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
          />
        </Link>

        <button
          type="button"
          onClick={() => dispatch(toggleWatchlist(auction.id))}
          className={`absolute right-3 top-3 grid size-10 place-items-center rounded-full border backdrop-blur transition ${
            watched
              ? "border-amber-300 bg-amber-300 text-stone-950"
              : "border-white/50 bg-black/40 text-white hover:bg-black/60"
          }`}
          aria-label={watched ? "Remove from watchlist" : "Add to watchlist"}
        >
          <HeartIcon filled={watched} />
        </button>

        <div className="absolute bottom-3 left-3 rounded-full bg-black/75 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur">
          <Countdown endsAt={auction.endsAt} /> left
        </div>
      </div>

      <div className="p-5">
        <div className="mb-1 flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-stone-500">
              {auction.year} · {auction.location}
            </p>

            <Link
              to={`/auctions/${auction.id}`}
              className="mt-1 block text-xl font-black tracking-tight text-stone-950 hover:underline"
            >
              {auction.make} {auction.model}
            </Link>
          </div>

          {!auction.reserve && (
            <span className="shrink-0 rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-emerald-700">
              No reserve
            </span>
          )}
        </div>

        <p className="mt-2 text-sm text-stone-500">
          {formatMileage(auction.mileage)} · {auction.transmission} ·{" "}
          {auction.drivetrain}
        </p>

        <div className="mt-5 flex items-end justify-between border-t border-stone-100 pt-4">
          <div>
            <p className="text-xs font-medium text-stone-500">Current bid</p>
            <p className="text-2xl font-black tracking-tight text-stone-950">
              {formatMoney(auction.currentBid)}
            </p>
          </div>

          <p className="text-sm font-semibold text-stone-500">
            {auction.bidCount} bids
          </p>
        </div>
      </div>
    </article>
  );
}
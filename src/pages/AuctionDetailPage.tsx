import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  getAuction,
  hasEnded,
  MIN_BID_INCREMENT,
  placeBid,
} from "../lib/auctionApi";
import { toggleWatchlist } from "../features/watchlist/watchlistSlice";
import { formatDateTime, formatMileage, formatMoney } from "../lib/format";
import Countdown from "../components/Countdown";
import { HeartIcon } from "../components/Icons";
import { useAppDispatch, useAppSelector } from "../app/hooks";

type BidFormValues = {
  bidder: string;
  amount: number;
};

export default function AuctionDetailPage() {
  const { auctionId } = useParams<{ auctionId: string }>();
  const queryClient = useQueryClient();
  const dispatch = useAppDispatch();

  const watched = useAppSelector((state) =>
    auctionId ? state.watchlist.ids.includes(auctionId) : false,
  );

  const {
    data: auction,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["auction", auctionId],
    queryFn: () => (auctionId ? getAuction(auctionId) : null),
  });

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<BidFormValues>({
    defaultValues: {
      bidder: "",
    },
  });

  useEffect(() => {
    if (auction) {
      setValue("amount", auction.currentBid + MIN_BID_INCREMENT);
    }
  }, [auction, setValue]);

  const bidMutation = useMutation({
    mutationFn: placeBid,

    onSuccess: (updated, values) => {
      queryClient.setQueryData(["auction", auctionId], updated);
      queryClient.invalidateQueries({ queryKey: ["auctions"] });

      reset({
        bidder: values.bidder,
        amount: updated.currentBid + MIN_BID_INCREMENT,
      });
    },
  });

  if (isLoading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="h-155 animate-pulse rounded-3xl bg-stone-200" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-24 text-center">
        <h1 className="text-3xl font-black">Couldn't load this auction.</h1>

        <p className="mt-3 text-stone-500">
          Check your connection and try again.
        </p>

        <button
          type="button"
          onClick={() => refetch()}
          className="mt-6 rounded-xl bg-stone-950 px-5 py-3 text-sm font-black text-white transition hover:bg-stone-800"
        >
          Try again
        </button>
      </div>
    );
  }

  if (!auction) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-24 text-center">
        <h1 className="text-3xl font-black">Auction not found.</h1>

        <Link
          to="/auctions"
          className="mt-5 inline-block font-bold text-amber-700 hover:underline"
        >
          Back to auctions
        </Link>
      </div>
    );
  }
  const minimumBid = auction.currentBid + MIN_BID_INCREMENT;
  const ended = hasEnded(auction);

  const onBid = (values: BidFormValues) =>
    bidMutation.mutate({ auctionId: auction.id, ...values });

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-5 flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.2em] text-amber-700">
            {auction.location} · {auction.sellerType}
          </p>

          <h1 className="mt-1 text-4xl font-black tracking-tighter sm:text-5xl">
            {auction.year} {auction.make} {auction.model}
          </h1>

          <p className="mt-2 font-semibold text-stone-500">
            {auction.trim} · {formatMileage(auction.mileage)} ·{" "}
            {auction.transmission} · {auction.drivetrain}
          </p>
        </div>

        <button
          type="button"
          onClick={() => dispatch(toggleWatchlist(auction.id))}
          className={`inline-flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-black transition ${
            watched
              ? "border-amber-300 bg-amber-300 text-stone-950"
              : "border-stone-300 bg-white text-stone-700 hover:border-stone-500"
          }`}
        >
          <HeartIcon filled={watched} />
          {watched ? "Watching" : "Watch auction"}
        </button>
      </div>

      <div className="overflow-hidden rounded-3xl bg-stone-200">
        <img
          src={auction.image}
          alt={`${auction.year} ${auction.make} ${auction.model}`}
          className="aspect-16/8 w-full object-cover"
        />
      </div>

      <div className="mt-7 grid gap-7 lg:grid-cols-[minmax(0,1fr)_380px]">
        <div className="space-y-7">
          <section className="rounded-3xl border border-stone-200 bg-white p-6 sm:p-8">
            <h2 className="text-2xl font-black tracking-tight">
              About this car
            </h2>

            <p className="mt-4 leading-7 text-stone-600">
              {auction.description}
            </p>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {auction.highlights.map((highlight) => (
                <div
                  key={highlight}
                  className="rounded-xl bg-stone-100 px-4 py-3 text-sm font-bold text-stone-700"
                >
                  {highlight}
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-3xl border border-stone-200 bg-white p-6 sm:p-8">
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.18em] text-stone-400">
                  History
                </p>

                <h2 className="mt-1 text-2xl font-black tracking-tight">
                  Bid activity
                </h2>
              </div>

              <p className="text-sm font-bold text-stone-500">
                {auction.bidCount} bids
              </p>
            </div>

            <div className="mt-5 divide-y divide-stone-100">
              {auction.bids.length === 0 ? (
                <p className="py-6 text-stone-500">
                  No bids yet. Be the first.
                </p>
              ) : (
                auction.bids.map((bid) => (
                  <div
                    key={bid.id}
                    className="flex items-center justify-between gap-4 py-4"
                  >
                    <div>
                      <p className="font-black text-stone-900">{bid.bidder}</p>

                      <p className="mt-0.5 text-xs font-medium text-stone-400">
                        {formatDateTime(bid.at)}
                      </p>
                    </div>

                    <p className="font-black tabular-nums">
                      {formatMoney(bid.amount)}
                    </p>
                  </div>
                ))
              )}
            </div>
          </section>
        </div>

        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-3xl bg-stone-950 p-6 text-white shadow-xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-stone-400">
                  Current bid
                </p>

                <p className="mt-1 text-4xl font-black tracking-tight">
                  {formatMoney(auction.currentBid)}
                </p>
              </div>

              {!auction.reserve && (
                <span className="rounded-full bg-emerald-400/15 px-3 py-1 text-xs font-black text-emerald-300">
                  No reserve
                </span>
              )}
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3 border-y border-stone-800 py-4">
              <div>
                <p className="text-xs font-semibold text-stone-500">
                  Time left
                </p>

                <p className="mt-1 text-lg font-black">
                  <Countdown endsAt={auction.endsAt} />
                </p>
              </div>

              <div>
                <p className="text-xs font-semibold text-stone-500">Ends</p>

                <p className="mt-1 text-sm font-bold text-stone-200">
                  {formatDateTime(auction.endsAt)}
                </p>
              </div>
            </div>

            {ended ? (
              <p className="mt-5 rounded-xl bg-stone-900 px-4 py-3.5 text-center font-black text-stone-300">
                Auction ended ·{" "}
                {auction.bidCount > 0
                  ? `final bid ${formatMoney(auction.currentBid)}`
                  : "no bids"}
              </p>
            ) : (
            <form onSubmit={handleSubmit(onBid)} className="mt-5 space-y-4">
              <div>
                <label
                  className="text-xs font-bold text-stone-400"
                  htmlFor="bidder"
                >
                  Bidder name
                </label>

                <input
                  id="bidder"
                  placeholder="Your name"
                  {...register("bidder", {
                    required: "Enter a bidder name",
                    minLength: {
                      value: 2,
                      message: "Use at least 2 characters",
                    },
                  })}
                  className="mt-1.5 h-11 w-full rounded-xl border border-stone-700 bg-stone-900 px-3 text-white outline-none placeholder:text-stone-500 focus:border-amber-300"
                />

                {errors.bidder && (
                  <p className="mt-1 text-xs font-semibold text-red-300">
                    {errors.bidder.message}
                  </p>
                )}
              </div>

              <div>
                <label
                  className="text-xs font-bold text-stone-400"
                  htmlFor="amount"
                >
                  Your bid
                </label>

                <div className="relative mt-1.5">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-stone-500">
                    £
                  </span>

                  <input
                    id="amount"
                    type="number"
                    step="250"
                    {...register("amount", {
                      required: "Enter a bid",
                      valueAsNumber: true,
                      validate: (value) =>
                        value >= minimumBid ||
                        `Minimum bid is ${formatMoney(minimumBid)}`,
                    })}
                    className="h-12 w-full rounded-xl border border-stone-700 bg-stone-900 pl-8 pr-3 text-lg font-black text-white outline-none focus:border-amber-300"
                  />
                </div>

                {errors.amount && (
                  <p className="mt-1 text-xs font-semibold text-red-300">
                    {errors.amount.message}
                  </p>
                )}
              </div>

              {bidMutation.isError && (
                <p className="rounded-xl bg-red-500/10 px-3 py-2 text-sm font-semibold text-red-300">
                  {bidMutation.error.message}
                </p>
              )}

              {bidMutation.isSuccess && (
                <p className="rounded-xl bg-emerald-500/10 px-3 py-2 text-sm font-semibold text-emerald-300">
                  Bid placed. You’re currently highest.
                </p>
              )}

              <button
                type="submit"
                disabled={bidMutation.isPending}
                className="w-full rounded-xl bg-amber-300 px-4 py-3.5 font-black text-stone-950 transition hover:bg-amber-200 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {bidMutation.isPending
                  ? "Placing bid..."
                  : `Place bid · min ${formatMoney(minimumBid)}`}
              </button>
            </form>
            )}
          </div>

          <div className="mt-4 rounded-2xl border border-stone-200 bg-white p-5">
            <p className="text-xs font-black uppercase tracking-[0.15em] text-stone-400">
              Seller
            </p>

            <p className="mt-1 font-black">{auction.seller}</p>

            <p className="text-sm text-stone-500">
              {auction.sellerType} · {auction.location}
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}

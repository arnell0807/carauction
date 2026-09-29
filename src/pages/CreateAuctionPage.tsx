import { useForm, type FieldError as RHFFieldError } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { createAuction, type AuctionFormValues } from "../lib/auctionApi";

function defaultEndDate() {
  const date = new Date();
  date.setDate(date.getDate() + 5);
  date.setHours(19, 0, 0, 0);
  const offset = date.getTimezoneOffset();
  const local = new Date(date.getTime() - offset * 60_000);
  return local.toISOString().slice(0, 16);
}

function validateEndDate(value: string) {
  return (
    new Date(value).getTime() > Date.now() + 60 * 60 * 1000 ||
    "End time must be at least an hour from now"
  );
}

const fieldClass =
  "mt-1.5 h-11 w-full rounded-xl border border-stone-200 bg-white px-3 text-sm font-semibold text-stone-900 outline-none transition placeholder:font-normal placeholder:text-stone-400 focus:border-stone-500 focus:ring-4 focus:ring-stone-100";
const labelClass = "text-sm font-black text-stone-800";
const errorClass = "mt-1 text-xs font-semibold text-red-600";

function FieldError({ error }: { error?: RHFFieldError }) {
  return error ? <p className={errorClass}>{error.message}</p> : null;
}

export default function CreateAuctionPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const maxYear = new Date().getFullYear() + 1;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AuctionFormValues>({
    defaultValues: {
      sellerType: "Private",
      transmission: "Automatic",
      drivetrain: "RWD",
      reserve: "yes",
      endsAt: defaultEndDate(),
    },
  });

  const createAuctionMutation = useMutation({
    mutationFn: createAuction,
    onSuccess: (auction) => {
      queryClient.invalidateQueries({ queryKey: ["auctions"] });
      queryClient.setQueryData(["auction", auction.id], auction);
      navigate(`/auctions/${auction.id}`);
    },
  });

  function onSubmit(values: AuctionFormValues) {
    createAuctionMutation.mutate(values);
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="max-w-2xl">
        <p className="text-xs font-black uppercase tracking-[0.2em] text-amber-700">
          Create listing
        </p>

        <h1 className="mt-1 text-4xl font-black tracking-[-0.045em]">
          Sell your car
        </h1>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-6">
        <section className="rounded-3xl border border-stone-200 bg-white p-6 sm:p-8">
          <div className="mb-6">
            <p className="text-xs font-black uppercase tracking-[0.16em] text-stone-400">
              01
            </p>

            <h2 className="mt-1 text-2xl font-black tracking-tight">
              Vehicle
            </h2>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            <label>
              <span className={labelClass}>Year</span>

              <input
                type="number"
                className={fieldClass}
                {...register("year", {
                  required: "Year is required",
                  valueAsNumber: true,
                  min: { value: 1900, message: "Use 1900 or newer" },
                  max: {
                    value: maxYear,
                    message: `Use ${maxYear} or older`,
                  },
                })}
              />

              <FieldError error={errors.year} />
            </label>

            <label>
              <span className={labelClass}>Make</span>

              <input
                placeholder="Porsche"
                className={fieldClass}
                {...register("make", {
                  required: "Make is required",
                  minLength: { value: 2, message: "Too short" },
                })}
              />

              <FieldError error={errors.make} />
            </label>

            <label>
              <span className={labelClass}>Model</span>

              <input
                placeholder="911 Carrera S"
                className={fieldClass}
                {...register("model", {
                  required: "Model is required",
                  minLength: { value: 1, message: "Model is required" },
                })}
              />

              <FieldError error={errors.model} />
            </label>

            <label>
              <span className={labelClass}>Trim / generation</span>

              <input
                placeholder="992"
                className={fieldClass}
                {...register("trim")}
              />
            </label>

            <label>
              <span className={labelClass}>Mileage</span>

              <input
                type="number"
                placeholder="24000"
                className={fieldClass}
                {...register("mileage", {
                  required: "Mileage is required",
                  valueAsNumber: true,
                  min: {
                    value: 0,
                    message: "Mileage cannot be negative",
                  },
                  max: {
                    value: 1000000,
                    message: "Check the mileage",
                  },
                })}
              />

              <FieldError error={errors.mileage} />
            </label>

            <label>
              <span className={labelClass}>Location</span>

              <input
                placeholder="London"
                className={fieldClass}
                {...register("location", {
                  required: "Location is required",
                })}
              />

              <FieldError error={errors.location} />
            </label>

            <label>
              <span className={labelClass}>Transmission</span>

              <select
                className={fieldClass}
                {...register("transmission", {
                  required: true,
                })}
              >
                <option>Automatic</option>
                <option>Manual</option>
              </select>
            </label>

            <label>
              <span className={labelClass}>Drivetrain</span>

              <select
                className={fieldClass}
                {...register("drivetrain", {
                  required: true,
                })}
              >
                <option>RWD</option>
                <option>FWD</option>
                <option>AWD</option>
                <option>4WD</option>
              </select>
            </label>
          </div>
        </section>

        <section className="rounded-3xl border border-stone-200 bg-white p-6 sm:p-8">
          <div className="mb-6">
            <p className="text-xs font-black uppercase tracking-[0.16em] text-stone-400">
              02
            </p>

            <h2 className="mt-1 text-2xl font-black tracking-tight">
              Auction setup
            </h2>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <label>
              <span className={labelClass}>Starting bid (£)</span>

              <input
                type="number"
                step="250"
                placeholder="25000"
                className={fieldClass}
                {...register("startingBid", {
                  required: "Starting bid is required",
                  valueAsNumber: true,
                  min: {
                    value: 250,
                    message: "Minimum starting bid is £250",
                  },
                })}
              />

              <FieldError error={errors.startingBid} />
            </label>

            <label>
              <span className={labelClass}>Auction ends </span>

              <input
                type="datetime-local"
                className={fieldClass}
                {...register("endsAt", {
                  required: "End date is required",
                  validate: validateEndDate,
                })}
              />

              <FieldError error={errors.endsAt} />
            </label>

            <label>
              <span className={labelClass}>Reserve</span>

              <select
                className={fieldClass}
                {...register("reserve", {
                  required: true,
                })}
              >
                <option value="yes">Reserve auction</option>
                <option value="no">No reserve</option>
              </select>
            </label>

            <label>
              <span className={labelClass}>Seller type</span>

              <select
                className={fieldClass}
                {...register("sellerType", { required: true })}
              >
                <option>Private</option>
                <option>Dealer</option>
              </select>
            </label>

            <label className="sm:col-span-2">
              <span className={labelClass}>Seller display name</span>

              <input
                placeholder="Jamie R."
                className={fieldClass}
                {...register("seller", {
                  required: "Seller name is required",
                  minLength: {
                    value: 2,
                    message: "Use at least 2 characters",
                  },
                })}
              />

              <FieldError error={errors.seller} />
            </label>
          </div>
        </section>

        <section className="rounded-3xl border border-stone-200 bg-white p-6 sm:p-8">
          <div className="mb-6">
            <p className="text-xs font-black uppercase tracking-[0.16em] text-stone-400">
              03
            </p>

            <h2 className="mt-1 text-2xl font-black tracking-tight">
              Presentation
            </h2>
          </div>

          <div className="space-y-5">
            <label className="block">
              <span className={labelClass}>Main image URL</span>

              <input
                type="url"
                placeholder="https://"
                className={fieldClass}
                {...register("image", {
                  required: "Image URL is required",
                  pattern: {
                    value: /^https?:\/\/.+/i,
                    message: "Enter a valid http(s) URL",
                  },
                })}
              />

              <FieldError error={errors.image} />
            </label>

            <label className="block">
              <span className={labelClass}>Description</span>

              <textarea
                rows={6}
                placeholder="Describe the car honestly: condition, ownership, history, modifications, faults…"
                className="mt-1.5 w-full rounded-xl border border-stone-200 bg-white px-3 py-3 text-sm leading-6 outline-none transition placeholder:text-stone-400 focus:border-stone-500 focus:ring-4 focus:ring-stone-100"
                {...register("description", {
                  required: "Description is required",
                  minLength: {
                    value: 60,
                    message:
                      "Give buyers at least 60 characters of useful detail",
                  },
                  maxLength: {
                    value: 2000,
                    message: "Keep it under 2,000 characters",
                  },
                })}
              />

              <FieldError error={errors.description} />
            </label>

            <label className="block">
              <span className={labelClass}>
                Highlights{" "}
                <span className="font-medium text-stone-400">
                  — one per line
                </span>
              </span>

              <textarea
                rows={5}
                placeholder={"Full service history\nTwo keys\nNew tyres"}
                className="mt-1.5 w-full rounded-xl border border-stone-200 bg-white px-3 py-3 text-sm leading-6 outline-none transition placeholder:text-stone-400 focus:border-stone-500 focus:ring-4 focus:ring-stone-100"
                {...register("highlights", {
                  required: "Add at least one highlight",
                  validate: (value) =>
                    value
                      .split("\n")
                      .filter((item) => item.trim()).length <= 6 ||
                    "Use no more than 6 highlights",
                })}
              />

              <FieldError error={errors.highlights} />
            </label>
          </div>
        </section>

        {createAuctionMutation.isError && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700">
            {createAuctionMutation.error.message}
          </div>
        )}

        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
          <button
            type="submit"
            disabled={createAuctionMutation.isPending}
            className="rounded-xl bg-stone-950 px-6 py-3.5 font-black text-white transition hover:bg-stone-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {createAuctionMutation.isPending ? "Creating auction..." : "Create auction"}
          </button>
        </div>
      </form>
    </div>
  );
}
import { getSupabase } from "./supabase";

export const MIN_BID_INCREMENT = 250;

export type Bid = {
  id: string;
  amount: number;
  bidder: string;
  at: string;
};

export type AuctionSummary = {
  id: string;
  year: number;
  make: string;
  model: string;
  trim: string;
  mileage: number;
  transmission: string;
  drivetrain: string;
  location: string;
  reserve: boolean;
  currentBid: number;
  bidCount: number;
  seller: string;
  sellerType: string;
  endsAt: string;
  image: string;
  description: string;
  highlights: string[];
};

export type Auction = AuctionSummary & {
  bids: Bid[];
};

export type AuctionFormValues = {
  year: number;
  make: string;
  model: string;
  trim: string;
  mileage: number;
  transmission: string;
  drivetrain: string;
  location: string;
  reserve: "yes" | "no";
  startingBid: number;
  seller: string;
  sellerType: string;
  endsAt: string;
  image: string;
  description: string;
  highlights: string;
};

const AUCTION_COLUMNS =
  "id, year, make, model, trim:trim_level, mileage, transmission, drivetrain, location, reserve, currentBid:current_bid, bidCount:bid_count, seller, sellerType:seller_type, endsAt:ends_at, image, description, highlights";

export function hasEnded(auction: { endsAt: string }) {
  return new Date(auction.endsAt).getTime() <= Date.now();
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export async function getAuctions() {
  const { data, error } = await getSupabase()
    .from("auctions")
    .select(AUCTION_COLUMNS)
    .order("ends_at", { ascending: true });

  if (error) throw new Error(error.message);

  return data as AuctionSummary[];
}

export async function getAuction(id: string) {
  const { data, error } = await getSupabase()
    .from("auctions")
    .select(`${AUCTION_COLUMNS}, bids (id, amount, bidder, at)`)
    .eq("id", id)
    .order("at", { referencedTable: "bids", ascending: false })
    .maybeSingle();

  if (error) throw new Error(error.message);

  return data as Auction | null;
}

export async function createAuction(values: AuctionFormValues) {
  const { data, error } = await getSupabase()
    .from("auctions")
    .insert({
      id: `${slugify(`${values.year}-${values.make}-${values.model}`)}-${Date.now()}`,
      year: values.year,
      make: values.make.trim(),
      model: values.model.trim(),
      trim_level: values.trim.trim() || "—",
      mileage: values.mileage,
      transmission: values.transmission,
      drivetrain: values.drivetrain,
      location: values.location.trim(),
      reserve: values.reserve === "yes",
      current_bid: values.startingBid,
      bid_count: 0,
      seller: values.seller.trim(),
      seller_type: values.sellerType,
      ends_at: new Date(values.endsAt).toISOString(),
      image: values.image.trim(),
      description: values.description.trim(),
      highlights: values.highlights
        .split("\n")
        .map((item) => item.trim())
        .filter(Boolean)
        .slice(0, 6),
    })
    .select(AUCTION_COLUMNS)
    .single();

  if (error) throw new Error(error.message);

  return { ...(data as AuctionSummary), bids: [] as Bid[] };
}

export async function placeBid(values: {
  auctionId: string;
  amount: number;
  bidder: string;
}) {
  const { error } = await getSupabase().rpc("place_bid", {
    p_auction_id: values.auctionId,
    p_amount: values.amount,
    p_bidder: values.bidder,
  });

  if (error) throw new Error(error.message);

  const auction = await getAuction(values.auctionId);
  if (!auction) throw new Error("Auction not found");

  return auction;
}

import type { Auction } from "./auctionApi";

// Mirrors supabase/seed.sql. Used when the database can't be reached so the
// showcase still renders something useful.

const minutesFromNow = (minutes: number) =>
  new Date(Date.now() + minutes * 60_000).toISOString();

type DemoBid = { amount: number; bidder: string; minutesAgo: number };

type DemoAuction = Omit<Auction, "endsAt" | "bids" | "bidCount"> & {
  endsInMinutes: number;
  bids: DemoBid[];
};

const DEMO_AUCTIONS: DemoAuction[] = [
  {
    id: "911-gt3-2022",
    year: 2022,
    make: "Porsche",
    model: "911 GT3",
    trim: "992",
    mileage: 11800,
    transmission: "Automatic",
    drivetrain: "RWD",
    location: "London",
    reserve: true,
    currentBid: 146500,
    seller: "Northline Motors",
    sellerType: "Dealer",
    endsInMinutes: 4530,
    image:
      "https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?auto=format&fit=crop&w=1600&q=85",
    description:
      "A sharp, driver-focused 992 GT3 with documented service history, front-axle lift and a clean interior.",
    highlights: [
      "4.0L flat-six",
      "Front-axle lift",
      "Full service history",
      "Ceramic brakes",
    ],
    bids: [
      { amount: 146500, bidder: "TrackDay89", minutesAgo: 76 },
      { amount: 145000, bidder: "FlatSix", minutesAgo: 231 },
      { amount: 142500, bidder: "ApexDriver", minutesAgo: 1183 },
    ],
  },
  {
    id: "m3-competition-2021",
    year: 2021,
    make: "BMW",
    model: "M3 Competition",
    trim: "G80",
    mileage: 26300,
    transmission: "Automatic",
    drivetrain: "RWD",
    location: "Manchester",
    reserve: false,
    currentBid: 48250,
    seller: "Oliver R.",
    sellerType: "Private",
    endsInMinutes: 3120,
    image:
      "https://images.unsplash.com/photo-1553440569-bcc63803a83d?auto=format&fit=crop&w=1600&q=85",
    description:
      "Well-specced M3 Competition with tasteful factory options and no-reserve bidding.",
    highlights: [
      "No reserve",
      "Harman Kardon",
      "Adaptive suspension",
      "Recent tyres",
    ],
    bids: [
      { amount: 48250, bidder: "MPowered", minutesAgo: 169 },
      { amount: 47750, bidder: "SaloonFan", minutesAgo: 387 },
    ],
  },
  {
    id: "defender-110-2023",
    year: 2023,
    make: "Land Rover",
    model: "Defender 110",
    trim: "D300 X-Dynamic",
    mileage: 9400,
    transmission: "Automatic",
    drivetrain: "4WD",
    location: "Edinburgh",
    reserve: true,
    currentBid: 61750,
    seller: "Caledonia Cars",
    sellerType: "Dealer",
    endsInMinutes: 5880,
    image:
      "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1600&q=85",
    description:
      "Low-mileage Defender 110 with practical options, strong specification and remaining manufacturer warranty.",
    highlights: ["D300 diesel", "Panoramic roof", "Tow pack", "360° camera"],
    bids: [{ amount: 61750, bidder: "GreenLane", minutesAgo: 296 }],
  },
  {
    id: "mustang-gt-1967",
    year: 1967,
    make: "Ford",
    model: "Mustang GT",
    trim: "Fastback",
    mileage: 73800,
    transmission: "Manual",
    drivetrain: "RWD",
    location: "Bristol",
    reserve: true,
    currentBid: 38900,
    seller: "Heritage Works",
    sellerType: "Dealer",
    endsInMinutes: 7395,
    image:
      "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?auto=format&fit=crop&w=1600&q=85",
    description:
      "Classic fastback presented as a usable weekend car, with a manual gearbox and recent mechanical refresh.",
    highlights: [
      "289 V8",
      "4-speed manual",
      "Recent suspension refresh",
      "Period-style interior",
    ],
    bids: [
      { amount: 38900, bidder: "BlueOval", minutesAgo: 309 },
      { amount: 38100, bidder: "OldSchoolGT", minutesAgo: 1037 },
    ],
  },
  {
    id: "golf-r-2020",
    year: 2020,
    make: "Volkswagen",
    model: "Golf R",
    trim: "Mk7.5",
    mileage: 41200,
    transmission: "Automatic",
    drivetrain: "AWD",
    location: "Leeds",
    reserve: false,
    currentBid: 21400,
    seller: "Sam K.",
    sellerType: "Private",
    endsInMinutes: 1710,
    image:
      "https://images.unsplash.com/photo-1542362567-b07e54358753?auto=format&fit=crop&w=1600&q=85",
    description:
      "A clean daily-driver Golf R with sensible mileage and no-reserve bidding.",
    highlights: ["No reserve", "DSG", "Digital cockpit", "Apple CarPlay"],
    bids: [
      { amount: 21400, bidder: "BoostedBen", minutesAgo: 59 },
      { amount: 20900, bidder: "HotHatch", minutesAgo: 94 },
    ],
  },
  {
    id: "c63-s-2019",
    year: 2019,
    make: "Mercedes-AMG",
    model: "C63 S",
    trim: "Premium Plus",
    mileage: 35100,
    transmission: "Automatic",
    drivetrain: "RWD",
    location: "Birmingham",
    reserve: true,
    currentBid: 41750,
    seller: "Midlands Performance",
    sellerType: "Dealer",
    endsInMinutes: 8820,
    image:
      "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=1600&q=85",
    description:
      "V8-powered C63 S with a strong options list and recent service.",
    highlights: [
      "4.0L twin-turbo V8",
      "Performance exhaust",
      "Panoramic roof",
      "Burmester audio",
    ],
    bids: [{ amount: 41750, bidder: "V8Only", minutesAgo: 193 }],
  },
];

export function getDemoAuctions(): Auction[] {
  return DEMO_AUCTIONS.map(({ endsInMinutes, bids, ...auction }) => ({
    ...auction,
    endsAt: minutesFromNow(endsInMinutes),
    bidCount: bids.length,
    bids: bids.map((bid, index) => ({
      id: `${auction.id}-bid-${index}`,
      amount: bid.amount,
      bidder: bid.bidder,
      at: minutesFromNow(-bid.minutesAgo),
    })),
  }));
}

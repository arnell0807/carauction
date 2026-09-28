import { Outlet, Link } from "react-router-dom";
import Header from "./Header";

export default function Layout() {
  return (
    <div className="min-h-screen bg-[#f5f5f4] text-stone-950">
      <Header />
      <main>
        <Outlet />
      </main>
      <footer className="mt-20 border-t border-stone-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-8 text-sm text-stone-500 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
          <p>
            <span className="font-black text-stone-900">RevBid</span> — car
            auction marketplace.
          </p>
          <div className="flex gap-5 font-semibold">
            <Link to="/auctions" className="hover:text-stone-950">
              Browse
            </Link>
            <Link to="/sell" className="hover:text-stone-950">
              Sell
            </Link>
            <Link to="/watchlist" className="hover:text-stone-950">
              Watchlist
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

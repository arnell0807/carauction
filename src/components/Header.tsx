import { NavLink, Link, type NavLinkRenderProps } from "react-router-dom";

import { useAppSelector } from "../app/hooks";

const navClass = ({ isActive }: NavLinkRenderProps) =>
  `text-sm font-bold transition ${isActive ? "text-stone-950" : "text-stone-500 hover:text-stone-950"}`;

export default function Header() {
  const watchCount = useAppSelector((state) => state.watchlist.ids.length);

  const navLinks = (
    <>
      <NavLink to="/auctions" className={navClass}>
        Auctions
      </NavLink>
      <NavLink to="/watchlist" className={navClass}>
        Watchlist
        {watchCount > 0 && (
          <span className="ml-1 rounded-full bg-stone-200 px-2 py-0.5 text-xs text-stone-700">
            {watchCount}
          </span>
        )}
      </NavLink>
    </>
  );

  return (
    <header className="sticky top-0 z-40 border-b border-stone-200/80 bg-[#f5f5f4]/90 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-6 px-4 sm:px-6 lg:px-8">
        <Link
          to="/"
          className="flex items-center gap-2.5"
          aria-label="RevBid home"
        >
          <span className="grid size-9 place-items-center rounded-xl bg-stone-950 text-sm font-black text-amber-300">
            R
          </span>
          <span className="text-xl font-black tracking-[-0.04em] text-stone-950">
            RevBid
          </span>
        </Link>

        <nav className="hidden items-center gap-7 md:flex">{navLinks}</nav>

        <Link
          to="/sell"
          className="rounded-xl bg-stone-950 px-4 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-stone-800"
        >
          Sell a car
        </Link>
      </div>

      <nav className="flex h-11 items-center gap-6 border-t border-stone-200/80 px-4 sm:px-6 md:hidden">
        {navLinks}
      </nav>
    </header>
  );
}

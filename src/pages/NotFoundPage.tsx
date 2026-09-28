import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-28 text-center">
      <p className="text-xs font-black uppercase tracking-[0.2em] text-amber-700">
        404
      </p>
      <h1 className="mt-2 text-4xl font-black tracking-tight">
        That road goes nowhere
      </h1>
      <p className="mt-3 text-stone-500">
        The page you're looking for doesn't exist.
      </p>
      <Link
        to="/"
        className="mt-6 inline-block rounded-xl bg-stone-950 px-5 py-3 text-sm font-black text-white"
      >
        Back home
      </Link>
    </div>
  );
}

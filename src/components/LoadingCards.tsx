
export default function LoadingCards({ count = 3 }: { count?: number }) {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="h-102.5 animate-pulse rounded-lg bg-stone-200"
        />
      ))}
    </div>
  );
}
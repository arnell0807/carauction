import { Heart, Search, ArrowRight } from "lucide-react";

type IconProps = {
  className?: string;
};

export function HeartIcon({
  filled = false,
  className = "size-5",
}: IconProps & { filled?: boolean }) {
  return (
    <Heart
      className={className}
      fill={filled ? "currentColor" : "none"}
      strokeWidth={1.8}
      aria-hidden="true"
    />
  );
}

export function SearchIcon({ className = "size-5" }: IconProps) {
  return (
    <Search
      className={className}
      strokeWidth={1.8}
      aria-hidden="true"
    />
  );
}

export function ArrowIcon({ className = "size-5" }: IconProps) {
  return (
    <ArrowRight
      className={className}
      strokeWidth={1.8}
      aria-hidden="true"
    />
  );
}

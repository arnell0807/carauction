import { useQuery } from "@tanstack/react-query";
import { getAuctions } from "../lib/auctionApi";

export default function useAuctions() {
  const {
    data: auctions = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["auctions"],
    queryFn: getAuctions,
  });

  return { auctions, isLoading, isError };
}

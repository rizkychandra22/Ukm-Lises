import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { getStats, type AppStats } from "../lib/api/stats";

interface ApiErrorResponse {
  message?: string;
}

export function useStats() {
  const query = useQuery<AppStats, AxiosError<ApiErrorResponse>>({
    queryKey: ["app-stats"],
    queryFn: getStats,
    staleTime: 5 * 60 * 1000, 
    retry: 2,
  });

  return {
    ...query,
    stats: query.data ?? { total_members: 0, total_batches: 0, total_events: 0 },
  };
}

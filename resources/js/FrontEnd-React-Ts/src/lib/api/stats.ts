import apiClient from "../api-client";

export interface AppStats {
  total_members: number;
  total_batches: number;
  total_events: number;
}

export const getStats = async (): Promise<AppStats> => {
  const response = await apiClient.get("/stats");
  return response.data;
};

import apiClient from "../api-client";

export interface EventSession {
  id: number;
  event_id: number;
  name_id: string;
  name_en: string | null;
  start_time: string;
  end_time: string;
  ticket_allocation: number;
  remaining_tickets: number;
}

export interface EventItem {
  id: number;
  title_id: string;
  title_en: string | null;
  slug: string;
  image: string | null;
  summary_id: string | null;
  summary_en: string | null;
  type: "Exclusive" | "Non-Exclusive";
  date: string;
  location_id: string;
  location_en: string | null;
  price: number | null;
  ticket: number | null;
  remaining_tickets: number | null;
  status: "draft" | "published" | "cancelled" | "completed";
  sessions?: EventSession[];
}

export const getEvents = async (): Promise<EventItem[]> => {
  const response = await apiClient.get("/events");
  return response.data;
};

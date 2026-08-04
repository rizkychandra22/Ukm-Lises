import apiClient from '../api-client';

export interface EventItem {
  id: number;
  title_id: string;
  title_en: string | null;
  slug: string;
  image: string | null;
  summary_id: string | null;
  summary_en: string | null;
  type: 'Exclusive' | 'Non-Exclusive';
  date: string;
  location_id: string;
  location_en: string | null;
  price: number | null;
  ticket: number | null;
  remaining_tickets: number | null;
status: 'draft' | 'published' | 'cancelled' | 'completed';
}

export const getEvents = async (): Promise<EventItem[]> => {
  try {
    const response = await apiClient.get('/events');
    return response.data;
  } catch (error) {
    console.error('Error fetching events:', error);
    return [];
  }
};

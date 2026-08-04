import apiClient from "../api-client";

export interface News {
  id: number;
  type: string;
  date: string;
  title_id: string;
  title_en: string | null;
  slug: string;
  summary_id: string;
  summary_en: string | null;
  description_id: string;
  description_en: string | null;
  image: string;
  uploaded_by: string;
}

export const getNews = async (): Promise<News[]> => {
  try {
    const response = await apiClient.get("/news");
    return response.data;
  } catch (error) {
    console.error("Error fetching news:", error);
    return [];
  }
};

export const getNewsDetail = async (slug: string): Promise<News | null> => {
  try {
    const response = await apiClient.get(`/news/${slug}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching news ${slug}:`, error);
    return null;
  }
};

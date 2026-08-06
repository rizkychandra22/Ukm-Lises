export interface NewsItem {
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
  user?: {
    id: number;
    name: string;
    roles: string[];
  };
}

export interface NewsPageProps {
  news: {
    data: NewsItem[];
    current_page: number;
    last_page: number;
    prev_page_url: string | null;
    next_page_url: string | null;
    links: any[];
  };
}

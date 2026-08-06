export interface GalleryItem {
  id: number;
  title_id: string;
  title_en: string;
  desc_id: string | null;
  desc_en: string | null;
  image: string;
  is_index: boolean;
  user?: {
    id: number;
    name: string;
    roles: string[];
  };
}

export interface GalleryFormData {
  title_id: string;
  desc_id: string;
  image: File | null;
  is_index: boolean;
}

export interface GalleryPageProps {
  galleries: {
    data: GalleryItem[];
    current_page: number;
    last_page: number;
    prev_page_url: string | null;
    next_page_url: string | null;
    links: any[];
  };
}

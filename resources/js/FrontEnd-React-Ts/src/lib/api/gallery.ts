import axios from 'axios';

export interface Gallery {
    id: number;
    title_id: string;
    title_en: string;
    desc_id: string | null;
    desc_en: string | null;
    image: string;
    is_active: boolean;
    is_index: boolean;
    user: {
        id: number;
        name: string;
        roles: string[];
    };
}

export const getGalleries = async (): Promise<Gallery[]> => {
    try {
        const response = await axios.get('/galleries');
        return response.data;
    } catch (error) {
        console.error('Error fetching galleries:', error);
        return [];
    }
};

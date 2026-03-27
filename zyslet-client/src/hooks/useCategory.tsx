import { useState, useEffect } from 'react';
import axios from 'axios';
import { config } from '@/config/env';

interface Category {
    id: string;
    title: string;
}

const useCategory = () => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const fetchCategories = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get(`${config.BASE_URL}/api/v1/categories`); // Replace with your API endpoint
            setCategories(response.data?.data || []);
        } catch (err: any) {
            setError(err.message || 'Failed to fetch categories');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []); // Run only once on component mount

    return { categories, loading, error, refetch: fetchCategories };
};

export default useCategory;

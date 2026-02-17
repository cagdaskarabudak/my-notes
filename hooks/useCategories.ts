import * as Storage from '@/services/storage';
import { Category } from '@/types';
import { useCallback, useEffect, useState } from 'react';

export function useCategories() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);

    const loadCategories = useCallback(async () => {
        setLoading(true);
        try {
            const data = await Storage.getCategories();
            setCategories(data);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadCategories();
    }, [loadCategories]);

    const addCategory = useCallback(
        async (category: Partial<Category> & { name: string; color: string }) => {
            const saved = await Storage.saveCategory(category);
            setCategories((prev) => [...prev, saved]);
            return saved;
        },
        []
    );

    const updateCategory = useCallback(
        async (category: Partial<Category> & { id: string; name: string; color: string }) => {
            const saved = await Storage.saveCategory(category);
            setCategories((prev) => prev.map((c) => (c.id === saved.id ? saved : c)));
            return saved;
        },
        []
    );

    const removeCategory = useCallback(async (id: string) => {
        await Storage.deleteCategory(id);
        setCategories((prev) => prev.filter((c) => c.id !== id));
    }, []);

    return { categories, loading, loadCategories, addCategory, updateCategory, removeCategory };
}

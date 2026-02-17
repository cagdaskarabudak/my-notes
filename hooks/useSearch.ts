import * as Storage from '@/services/storage';
import { Note } from '@/types';
import { useCallback, useRef, useState } from 'react';

export function useSearch() {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<Note[]>([]);
    const [searching, setSearching] = useState(false);
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const search = useCallback((text: string) => {
        setQuery(text);

        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }

        if (!text.trim()) {
            setResults([]);
            setSearching(false);
            return;
        }

        setSearching(true);
        timeoutRef.current = setTimeout(async () => {
            const data = await Storage.searchNotes(text);
            setResults(data);
            setSearching(false);
        }, 300);
    }, []);

    const clearSearch = useCallback(() => {
        setQuery('');
        setResults([]);
        setSearching(false);
    }, []);

    return { query, results, searching, search, clearSearch };
}

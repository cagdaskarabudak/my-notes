import * as Storage from '@/services/storage';
import { Note } from '@/types';
import { useCallback, useEffect, useState } from 'react';

export function useNotes() {
    const [notes, setNotes] = useState<Note[]>([]);
    const [loading, setLoading] = useState(true);

    const loadNotes = useCallback(async () => {
        setLoading(true);
        try {
            const data = await Storage.getNotes();
            setNotes(data);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadNotes();
    }, [loadNotes]);

    const addNote = useCallback(async (note: Partial<Note> & { title: string }) => {
        const saved = await Storage.saveNote(note);
        setNotes((prev) => [saved, ...prev]);
        return saved;
    }, []);

    const updateNote = useCallback(async (note: Partial<Note> & { id: string; title: string }) => {
        const saved = await Storage.saveNote(note);
        setNotes((prev) => prev.map((n) => (n.id === saved.id ? saved : n)));
        return saved;
    }, []);

    const removeNote = useCallback(async (id: string) => {
        await Storage.deleteNote(id);
        setNotes((prev) => prev.filter((n) => n.id !== id));
    }, []);

    const getNote = useCallback(async (id: string) => {
        return Storage.getNoteById(id);
    }, []);

    return { notes, loading, loadNotes, addNote, updateNote, removeNote, getNote };
}

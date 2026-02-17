import { AppSettings, Category, DEFAULT_SETTINGS, Note } from '@/types';
import AsyncStorage from '@react-native-async-storage/async-storage';

function generateId(): string {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substring(2, 10);
    return `${timestamp}-${random}`;
}

const KEYS = {
    NOTES: '@mynotes_notes',
    CATEGORIES: '@mynotes_categories',
    SETTINGS: '@mynotes_settings',
};

// ─── Notes ──────────────────────────────────────────────

export async function getNotes(): Promise<Note[]> {
    try {
        const data = await AsyncStorage.getItem(KEYS.NOTES);
        return data ? JSON.parse(data) : [];
    } catch {
        return [];
    }
}

export async function getNoteById(id: string): Promise<Note | null> {
    const notes = await getNotes();
    return notes.find((n) => n.id === id) ?? null;
}

export async function saveNote(note: Partial<Note> & { title: string }): Promise<Note> {
    const notes = await getNotes();
    const now = new Date().toISOString();

    if (note.id) {
        // Update existing
        const index = notes.findIndex((n) => n.id === note.id);
        if (index !== -1) {
            notes[index] = {
                ...notes[index],
                ...note,
                updatedAt: now,
            };
            await AsyncStorage.setItem(KEYS.NOTES, JSON.stringify(notes));
            return notes[index];
        }
    }

    // Create new
    const newNote: Note = {
        id: generateId(),
        title: note.title,
        content: note.content ?? '',
        categoryId: note.categoryId ?? null,
        tags: note.tags ?? [],
        isPinProtected: note.isPinProtected ?? false,
        color: note.color ?? '#1a1a2e',
        createdAt: now,
        updatedAt: now,
    };

    notes.unshift(newNote);
    await AsyncStorage.setItem(KEYS.NOTES, JSON.stringify(notes));
    return newNote;
}

export async function deleteNote(id: string): Promise<void> {
    const notes = await getNotes();
    const filtered = notes.filter((n) => n.id !== id);
    await AsyncStorage.setItem(KEYS.NOTES, JSON.stringify(filtered));
}

export async function searchNotes(query: string): Promise<Note[]> {
    const notes = await getNotes();
    const q = query.toLowerCase().trim();
    if (!q) return notes;

    return notes.filter((n) => {
        // PIN korumalı notlarda sadece başlıkta arama yap (içerik gizli kalır)
        if (n.isPinProtected) {
            return n.title.toLowerCase().includes(q);
        }
        return (
            n.title.toLowerCase().includes(q) ||
            n.content.toLowerCase().includes(q) ||
            n.tags.some((t) => t.toLowerCase().includes(q))
        );
    });
}

// ─── Categories ─────────────────────────────────────────

export async function getCategories(): Promise<Category[]> {
    try {
        const data = await AsyncStorage.getItem(KEYS.CATEGORIES);
        return data ? JSON.parse(data) : [];
    } catch {
        return [];
    }
}

export async function getCategoryById(id: string): Promise<Category | null> {
    const categories = await getCategories();
    return categories.find((c) => c.id === id) ?? null;
}

export async function saveCategory(
    category: Partial<Category> & { name: string; color: string }
): Promise<Category> {
    const categories = await getCategories();
    const now = new Date().toISOString();

    if (category.id) {
        const index = categories.findIndex((c) => c.id === category.id);
        if (index !== -1) {
            categories[index] = { ...categories[index], ...category };
            await AsyncStorage.setItem(KEYS.CATEGORIES, JSON.stringify(categories));
            return categories[index];
        }
    }

    const newCategory: Category = {
        id: generateId(),
        name: category.name,
        color: category.color,
        icon: category.icon ?? '📁',
        createdAt: now,
    };

    categories.push(newCategory);
    await AsyncStorage.setItem(KEYS.CATEGORIES, JSON.stringify(categories));
    return newCategory;
}

export async function deleteCategory(id: string): Promise<void> {
    const categories = await getCategories();
    const filtered = categories.filter((c) => c.id !== id);
    await AsyncStorage.setItem(KEYS.CATEGORIES, JSON.stringify(filtered));

    // Remove categoryId from notes that used this category
    const notes = await getNotes();
    const updatedNotes = notes.map((n) =>
        n.categoryId === id ? { ...n, categoryId: null } : n
    );
    await AsyncStorage.setItem(KEYS.NOTES, JSON.stringify(updatedNotes));
}

// ─── Settings ───────────────────────────────────────────

export async function getSettings(): Promise<AppSettings> {
    try {
        const data = await AsyncStorage.getItem(KEYS.SETTINGS);
        return data ? { ...DEFAULT_SETTINGS, ...JSON.parse(data) } : DEFAULT_SETTINGS;
    } catch {
        return DEFAULT_SETTINGS;
    }
}

export async function saveSettings(settings: Partial<AppSettings>): Promise<AppSettings> {
    const current = await getSettings();
    const updated = { ...current, ...settings };
    await AsyncStorage.setItem(KEYS.SETTINGS, JSON.stringify(updated));
    return updated;
}

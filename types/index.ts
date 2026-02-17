export interface Note {
    id: string;
    title: string;
    content: string; // Markdown content
    categoryId: string | null;
    tags: string[];
    isPinProtected: boolean;
    color: string;
    createdAt: string; // ISO string
    updatedAt: string; // ISO string
}

export interface Category {
    id: string;
    name: string;
    color: string;
    icon: string;
    createdAt: string;
}

export interface AppSettings {
    theme: 'light' | 'dark' | 'system';
    hasPin: boolean;
    sortBy: 'updatedAt' | 'createdAt' | 'title';
    sortOrder: 'asc' | 'desc';
}

export const NOTE_COLORS = [
    '#1a1a2e', // Default dark
    '#e74c3c', // Red
    '#e67e22', // Orange
    '#f1c40f', // Yellow
    '#2ecc71', // Green
    '#1abc9c', // Teal
    '#3498db', // Blue
    '#9b59b6', // Purple
    '#e91e63', // Pink
    '#795548', // Brown
];

export const CATEGORY_COLORS = [
    '#FF6B6B',
    '#FFA36C',
    '#FFD93D',
    '#6BCB77',
    '#4D96FF',
    '#9B72CF',
    '#FF6EB4',
    '#00D2D3',
    '#FF9FF3',
    '#54A0FF',
    '#5F27CD',
    '#01A3A4',
];

export const DEFAULT_SETTINGS: AppSettings = {
    theme: 'system',
    hasPin: false,
    sortBy: 'updatedAt',
    sortOrder: 'desc',
};

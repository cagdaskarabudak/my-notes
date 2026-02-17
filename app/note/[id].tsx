import TagChip from '@/components/TagChip';
import { BorderRadius, Spacing, Typography } from '@/constants/theme';
import { useThemeColors } from '@/hooks/useThemeColors';
import { deleteNote, getCategoryById, getNoteById } from '@/services/storage';
import { Category, Note } from '@/types';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useCallback, useState } from 'react';
import {
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import Markdown from 'react-native-markdown-display';

export default function NoteDetailScreen() {
    const colors = useThemeColors();
    const router = useRouter();
    const { id } = useLocalSearchParams<{ id: string }>();
    const [note, setNote] = useState<Note | null>(null);
    const [category, setCategory] = useState<Category | null>(null);

    useFocusEffect(
        useCallback(() => {
            loadNote();
        }, [id])
    );

    const loadNote = async () => {
        if (!id) return;
        const data = await getNoteById(id);
        setNote(data);
        if (data?.categoryId) {
            const cat = await getCategoryById(data.categoryId);
            setCategory(cat);
        }
    };

    const handleDelete = () => {
        if (!note) return;
        Alert.alert(
            'Notu Sil',
            `"${note.title}" notunu silmek istediğinize emin misiniz?`,
            [
                { text: 'İptal', style: 'cancel' },
                {
                    text: 'Sil',
                    style: 'destructive',
                    onPress: async () => {
                        await deleteNote(note.id);
                        router.back();
                    },
                },
            ]
        );
    };

    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString('tr-TR', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    if (!note) {
        return (
            <View style={[styles.container, { backgroundColor: colors.background }]}>
                <Text style={[styles.loadingText, { color: colors.textSecondary }]}>Yükleniyor...</Text>
            </View>
        );
    }

    const mdStyles = {
        body: { color: colors.text, ...Typography.body, lineHeight: 26 },
        heading1: { color: colors.text, ...Typography.title1, marginTop: 24, marginBottom: 12 },
        heading2: { color: colors.text, ...Typography.title2, marginTop: 20, marginBottom: 10 },
        heading3: { color: colors.text, ...Typography.title3, marginTop: 16, marginBottom: 8 },
        paragraph: { marginBottom: 12 },
        strong: { fontWeight: '700' as const },
        em: { fontStyle: 'italic' as const },
        blockquote: {
            borderLeftWidth: 4,
            borderLeftColor: colors.primary,
            paddingLeft: 16,
            marginLeft: 0,
            backgroundColor: colors.primary + '08',
            paddingVertical: 8,
            borderRadius: 4,
        },
        code_inline: {
            backgroundColor: colors.surfaceElevated,
            color: colors.secondary,
            paddingHorizontal: 6,
            paddingVertical: 2,
            borderRadius: 4,
            fontSize: 14,
            fontFamily: 'monospace' as const,
        },
        code_block: {
            backgroundColor: colors.surfaceElevated,
            padding: 16,
            borderRadius: 12,
            fontSize: 14,
            fontFamily: 'monospace' as const,
            color: colors.text,
        },
        fence: {
            backgroundColor: colors.surfaceElevated,
            padding: 16,
            borderRadius: 12,
            fontSize: 14,
            fontFamily: 'monospace' as const,
            color: colors.text,
        },
        list_item: { marginBottom: 4 },
        bullet_list: { marginBottom: 12 },
        ordered_list: { marginBottom: 12 },
        hr: { backgroundColor: colors.border, height: 1, marginVertical: 20 },
        link: { color: colors.primary },
    };

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            {/* Action bar */}
            <View style={[styles.actionBar, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
                <TouchableOpacity
                    onPress={() =>
                        router.push({
                            pathname: '/note/editor',
                            params: { noteId: note.id },
                        })
                    }
                    style={[styles.actionBtn, { backgroundColor: colors.primary + '15' }]}
                >
                    <Ionicons name="pencil" size={18} color={colors.primary} />
                    <Text style={[styles.actionText, { color: colors.primary }]}>Düzenle</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={handleDelete}
                    style={[styles.actionBtn, { backgroundColor: colors.danger + '15' }]}
                >
                    <Ionicons name="trash" size={18} color={colors.danger} />
                    <Text style={[styles.actionText, { color: colors.danger }]}>Sil</Text>
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                {/* Color header */}
                <View style={[styles.colorHeader, { backgroundColor: note.color !== '#1a1a2e' ? note.color + '15' : colors.primary + '08' }]}>
                    <Text style={[styles.title, { color: colors.text }]}>{note.title}</Text>

                    {/* Category & Tags */}
                    <View style={styles.metaRow}>
                        {category && (
                            <View style={[styles.categoryBadge, { backgroundColor: category.color + '25' }]}>
                                <Text style={[styles.categoryText, { color: category.color }]}>
                                    {category.icon} {category.name}
                                </Text>
                            </View>
                        )}
                    </View>

                    {note.tags.length > 0 && (
                        <View style={styles.tagsRow}>
                            {note.tags.map((tag) => (
                                <TagChip key={tag} tag={tag} />
                            ))}
                        </View>
                    )}

                    <Text style={[styles.date, { color: colors.textTertiary }]}>
                        Son güncelleme: {formatDate(note.updatedAt)}
                    </Text>
                </View>

                {/* Markdown content */}
                <View style={styles.markdownContainer}>
                    <Markdown style={mdStyles as any}>
                        {note.content || '_Henüz içerik yok_'}
                    </Markdown>
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    loadingText: {
        ...Typography.body,
        textAlign: 'center',
        marginTop: 100,
    },
    actionBar: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        gap: Spacing.sm,
        paddingHorizontal: Spacing.lg,
        paddingVertical: Spacing.sm,
        borderBottomWidth: 1,
    },
    actionBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.xs,
        paddingHorizontal: Spacing.md,
        paddingVertical: Spacing.sm,
        borderRadius: BorderRadius.sm,
    },
    actionText: {
        ...Typography.footnote,
        fontWeight: '600',
    },
    scrollContent: {
        paddingBottom: Spacing.xxxxl,
    },
    colorHeader: {
        padding: Spacing.xxl,
        paddingTop: Spacing.lg,
    },
    title: {
        ...Typography.title1,
        marginBottom: Spacing.md,
    },
    metaRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.sm,
        marginBottom: Spacing.sm,
    },
    categoryBadge: {
        paddingHorizontal: Spacing.md,
        paddingVertical: Spacing.xs,
        borderRadius: BorderRadius.sm,
    },
    categoryText: {
        ...Typography.caption1,
        fontWeight: '600',
    },
    tagsRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginBottom: Spacing.sm,
    },
    date: {
        ...Typography.caption1,
    },
    markdownContainer: {
        paddingHorizontal: Spacing.xxl,
        paddingTop: Spacing.lg,
    },
});

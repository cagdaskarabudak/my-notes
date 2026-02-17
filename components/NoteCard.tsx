import { BorderRadius, Shadows, Spacing, Typography } from '@/constants/theme';
import { useThemeColors } from '@/hooks/useThemeColors';
import { Category, Note } from '@/types';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

interface NoteCardProps {
    note: Note;
    category?: Category | null;
    onPress: () => void;
    onLongPress?: () => void;
}

export default function NoteCard({ note, category, onPress, onLongPress }: NoteCardProps) {
    const colors = useThemeColors();

    const previewContent = note.content
        .replace(/[#*_~`>\-\[\]()!]/g, '')
        .substring(0, 120)
        .trim();

    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        const now = new Date();
        const diff = now.getTime() - date.getTime();
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);
        const days = Math.floor(diff / 86400000);

        if (minutes < 1) return 'Az önce';
        if (minutes < 60) return `${minutes}dk önce`;
        if (hours < 24) return `${hours}sa önce`;
        if (days < 7) return `${days}g önce`;
        return date.toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' });
    };

    return (
        <TouchableOpacity
            onPress={onPress}
            onLongPress={onLongPress}
            activeOpacity={0.7}
            style={[
                styles.container,
                {
                    backgroundColor: colors.card,
                    borderColor: colors.border,
                    ...Shadows.md,
                    shadowColor: colors.shadow,
                },
            ]}
        >
            {/* Color accent strip */}
            <View style={[styles.colorStrip, { backgroundColor: note.color !== '#1a1a2e' ? note.color : colors.primary }]} />

            <View style={styles.content}>
                {/* Header */}
                <View style={styles.header}>
                    <Text
                        style={[styles.title, { color: colors.text }]}
                        numberOfLines={1}
                    >
                        {note.title}
                    </Text>
                    {note.isPinProtected && (
                        <Ionicons name="lock-closed" size={14} color={colors.textTertiary} />
                    )}
                </View>

                {/* Preview */}
                {previewContent ? (
                    <Text
                        style={[styles.preview, { color: colors.textSecondary }]}
                        numberOfLines={2}
                    >
                        {note.isPinProtected ? '🔒 Bu not korumalıdır' : previewContent}
                    </Text>
                ) : null}

                {/* Footer */}
                <View style={styles.footer}>
                    <View style={styles.footerLeft}>
                        {category && (
                            <View style={[styles.categoryBadge, { backgroundColor: category.color + '20' }]}>
                                <Text style={[styles.categoryText, { color: category.color }]}>
                                    {category.icon} {category.name}
                                </Text>
                            </View>
                        )}
                        {note.tags.length > 0 && (
                            <View style={styles.tagsRow}>
                                {note.tags.slice(0, 2).map((tag) => (
                                    <View key={tag} style={[styles.tag, { backgroundColor: colors.primaryLight + '15' }]}>
                                        <Text style={[styles.tagText, { color: colors.primary }]}>#{tag}</Text>
                                    </View>
                                ))}
                                {note.tags.length > 2 && (
                                    <Text style={[styles.moreTag, { color: colors.textTertiary }]}>
                                        +{note.tags.length - 2}
                                    </Text>
                                )}
                            </View>
                        )}
                    </View>
                    <Text style={[styles.date, { color: colors.textTertiary }]}>
                        {formatDate(note.updatedAt)}
                    </Text>
                </View>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        borderRadius: BorderRadius.lg,
        marginHorizontal: Spacing.lg,
        marginBottom: Spacing.md,
        borderWidth: 1,
        overflow: 'hidden',
    },
    colorStrip: {
        width: 4,
    },
    content: {
        flex: 1,
        padding: Spacing.lg,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: Spacing.xs,
    },
    title: {
        ...Typography.headline,
        flex: 1,
        marginRight: Spacing.sm,
    },
    preview: {
        ...Typography.subheadline,
        marginBottom: Spacing.md,
    },
    footer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    footerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        gap: Spacing.sm,
    },
    categoryBadge: {
        paddingHorizontal: Spacing.sm,
        paddingVertical: 2,
        borderRadius: BorderRadius.sm,
    },
    categoryText: {
        ...Typography.caption1,
        fontWeight: '600',
    },
    tagsRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.xs,
    },
    tag: {
        paddingHorizontal: Spacing.sm,
        paddingVertical: 2,
        borderRadius: BorderRadius.sm,
    },
    tagText: {
        ...Typography.caption2,
        fontWeight: '500',
    },
    moreTag: {
        ...Typography.caption2,
    },
    date: {
        ...Typography.caption1,
    },
});

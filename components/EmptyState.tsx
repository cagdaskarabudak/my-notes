import { Spacing, Typography } from '@/constants/theme';
import { useThemeColors } from '@/hooks/useThemeColors';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface EmptyStateProps {
    icon?: keyof typeof Ionicons.glyphMap;
    title: string;
    subtitle?: string;
}

export default function EmptyState({
    icon = 'document-text-outline',
    title,
    subtitle,
}: EmptyStateProps) {
    const colors = useThemeColors();

    return (
        <View style={styles.container}>
            <View style={[styles.iconContainer, { backgroundColor: colors.primary + '12' }]}>
                <Ionicons name={icon} size={48} color={colors.primary} />
            </View>
            <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
            {subtitle && (
                <Text style={[styles.subtitle, { color: colors.textSecondary }]}>{subtitle}</Text>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: Spacing.xxxxl,
        paddingVertical: Spacing.xxxxl,
    },
    iconContainer: {
        width: 96,
        height: 96,
        borderRadius: 48,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: Spacing.xxl,
    },
    title: {
        ...Typography.title3,
        textAlign: 'center',
        marginBottom: Spacing.sm,
    },
    subtitle: {
        ...Typography.subheadline,
        textAlign: 'center',
        lineHeight: 22,
    },
});

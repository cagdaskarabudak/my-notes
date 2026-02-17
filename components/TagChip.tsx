import { BorderRadius, Spacing, Typography } from '@/constants/theme';
import { useThemeColors } from '@/hooks/useThemeColors';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';

interface TagChipProps {
    tag: string;
    onRemove?: () => void;
    onPress?: () => void;
    selected?: boolean;
}

export default function TagChip({ tag, onRemove, onPress, selected }: TagChipProps) {
    const colors = useThemeColors();

    return (
        <TouchableOpacity
            onPress={onPress}
            activeOpacity={onPress ? 0.7 : 1}
            style={[
                styles.chip,
                {
                    backgroundColor: selected ? colors.primary + '25' : colors.surfaceElevated,
                    borderColor: selected ? colors.primary + '50' : colors.border,
                },
            ]}
        >
            <Text
                style={[
                    styles.text,
                    { color: selected ? colors.primary : colors.textSecondary },
                ]}
            >
                #{tag}
            </Text>
            {onRemove && (
                <TouchableOpacity onPress={onRemove} hitSlop={{ top: 8, bottom: 8, left: 4, right: 8 }}>
                    <Ionicons name="close-circle" size={16} color={colors.textTertiary} />
                </TouchableOpacity>
            )}
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    chip: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.xs,
        paddingHorizontal: Spacing.md,
        paddingVertical: Spacing.xs + 2,
        borderRadius: BorderRadius.full,
        borderWidth: 1,
        marginRight: Spacing.sm,
        marginBottom: Spacing.sm,
    },
    text: {
        ...Typography.caption1,
        fontWeight: '500',
    },
});

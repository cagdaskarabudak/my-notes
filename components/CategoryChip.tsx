import { BorderRadius, Spacing, Typography } from '@/constants/theme';
import { Category } from '@/types';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';

interface CategoryChipProps {
    category: Category;
    selected?: boolean;
    onPress?: () => void;
    size?: 'small' | 'medium';
}

export default function CategoryChip({ category, selected, onPress, size = 'medium' }: CategoryChipProps) {
    const isSmall = size === 'small';

    return (
        <TouchableOpacity
            onPress={onPress}
            activeOpacity={0.7}
            style={[
                styles.chip,
                isSmall && styles.chipSmall,
                {
                    backgroundColor: selected ? category.color : category.color + '18',
                    borderColor: category.color + '40',
                    borderWidth: selected ? 0 : 1,
                },
            ]}
        >
            <Text
                style={[
                    isSmall ? styles.textSmall : styles.text,
                    { color: selected ? '#FFF' : category.color },
                ]}
            >
                {category.icon} {category.name}
            </Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    chip: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: Spacing.md,
        paddingVertical: Spacing.sm,
        borderRadius: BorderRadius.full,
        marginRight: Spacing.sm,
    },
    chipSmall: {
        paddingHorizontal: Spacing.sm,
        paddingVertical: Spacing.xs,
    },
    text: {
        ...Typography.footnote,
        fontWeight: '600',
    },
    textSmall: {
        ...Typography.caption1,
        fontWeight: '600',
    },
});

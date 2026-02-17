import { BorderRadius, Spacing, Typography } from '@/constants/theme';
import { useThemeColors } from '@/hooks/useThemeColors';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';

interface SearchBarProps {
    value: string;
    onChangeText: (text: string) => void;
    onClear: () => void;
    placeholder?: string;
    autoFocus?: boolean;
}

export default function SearchBar({
    value,
    onChangeText,
    onClear,
    placeholder = 'Notlarda ara...',
    autoFocus = false,
}: SearchBarProps) {
    const colors = useThemeColors();

    return (
        <View style={[styles.container, { backgroundColor: colors.surfaceElevated, borderColor: colors.border }]}>
            <Ionicons name="search" size={20} color={colors.textTertiary} />
            <TextInput
                style={[styles.input, { color: colors.text }]}
                value={value}
                onChangeText={onChangeText}
                placeholder={placeholder}
                placeholderTextColor={colors.textTertiary}
                autoFocus={autoFocus}
                autoCapitalize="none"
                autoCorrect={false}
            />
            {value.length > 0 && (
                <TouchableOpacity onPress={onClear} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                    <Ionicons name="close-circle" size={20} color={colors.textTertiary} />
                </TouchableOpacity>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: Spacing.md,
        paddingVertical: Spacing.sm,
        borderRadius: BorderRadius.lg,
        borderWidth: 1,
        marginHorizontal: Spacing.lg,
        gap: Spacing.sm,
    },
    input: {
        flex: 1,
        ...Typography.body,
        paddingVertical: Spacing.xs,
    },
});

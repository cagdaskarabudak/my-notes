import { Spacing } from '@/constants/theme';
import { useThemeColors } from '@/hooks/useThemeColors';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

interface ColorPickerProps {
    colors: string[];
    selectedColor: string;
    onSelect: (color: string) => void;
}

export default function ColorPicker({ colors: colorOptions, selectedColor, onSelect }: ColorPickerProps) {
    const themeColors = useThemeColors();

    return (
        <View style={styles.container}>
            {colorOptions.map((color) => (
                <TouchableOpacity
                    key={color}
                    onPress={() => onSelect(color)}
                    style={[
                        styles.colorCircle,
                        { backgroundColor: color },
                        selectedColor === color && [
                            styles.selected,
                            { borderColor: themeColors.primary },
                        ],
                    ]}
                    activeOpacity={0.7}
                >
                    {selectedColor === color && (
                        <Ionicons name="checkmark" size={18} color="#FFF" />
                    )}
                </TouchableOpacity>
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: Spacing.md,
        paddingVertical: Spacing.sm,
    },
    colorCircle: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    selected: {
        borderWidth: 3,
    },
});

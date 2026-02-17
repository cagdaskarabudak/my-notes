import { BorderRadius, Spacing } from '@/constants/theme';
import { useThemeColors } from '@/hooks/useThemeColors';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';

interface MarkdownToolbarProps {
    onAction: (prefix: string, suffix?: string) => void;
}

const TOOLS: { icon: keyof typeof Ionicons.glyphMap; prefix: string; suffix?: string; label: string }[] = [
    { icon: 'text', prefix: '# ', label: 'Başlık' },
    { icon: 'text-outline', prefix: '**', suffix: '**', label: 'Kalın' },
    { icon: 'logo-markdown', prefix: '_', suffix: '_', label: 'İtalik' },
    { icon: 'remove-outline', prefix: '~~', suffix: '~~', label: 'Üstü çizili' },
    { icon: 'list', prefix: '- ', label: 'Liste' },
    { icon: 'checkbox-outline', prefix: '- [ ] ', label: 'Yapılacak' },
    { icon: 'code-slash', prefix: '`', suffix: '`', label: 'Kod' },
    { icon: 'code-working', prefix: '```\n', suffix: '\n```', label: 'Kod bloğu' },
    { icon: 'link', prefix: '[', suffix: '](url)', label: 'Link' },
    { icon: 'remove', prefix: '\n---\n', label: 'Çizgi' },
    { icon: 'chatbox-ellipses', prefix: '> ', label: 'Alıntı' },
];

export default function MarkdownToolbar({ onAction }: MarkdownToolbarProps) {
    const colors = useThemeColors();

    return (
        <View style={[styles.container, { backgroundColor: colors.surface, borderTopColor: colors.border }]}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scroll}>
                {TOOLS.map((tool) => (
                    <TouchableOpacity
                        key={tool.icon}
                        onPress={() => onAction(tool.prefix, tool.suffix)}
                        style={[styles.button, { backgroundColor: colors.surfaceElevated }]}
                        activeOpacity={0.6}
                    >
                        <Ionicons name={tool.icon} size={20} color={colors.textSecondary} />
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        borderTopWidth: 1,
        paddingVertical: Spacing.sm,
    },
    scroll: {
        paddingHorizontal: Spacing.lg,
        gap: Spacing.sm,
    },
    button: {
        width: 40,
        height: 40,
        borderRadius: BorderRadius.sm,
        alignItems: 'center',
        justifyContent: 'center',
    },
});

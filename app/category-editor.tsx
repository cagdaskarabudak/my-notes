import ColorPicker from '@/components/ColorPicker';
import { BorderRadius, Spacing, Typography } from '@/constants/theme';
import { useThemeColors } from '@/hooks/useThemeColors';
import { getCategoryById, saveCategory } from '@/services/storage';
import { CATEGORY_COLORS } from '@/types';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useNavigation, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

const EMOJI_OPTIONS = ['📁', '📝', '💼', '🎓', '🏠', '💡', '📚', '🎨', '🔬', '💰', '🏋️', '🎵', '🍕', '✈️', '❤️', '⭐'];

export default function CategoryEditorScreen() {
    const colors = useThemeColors();
    const router = useRouter();
    const navigation = useNavigation();
    const { categoryId } = useLocalSearchParams<{ categoryId?: string }>();

    const [name, setName] = useState('');
    const [color, setColor] = useState(CATEGORY_COLORS[0]);
    const [icon, setIcon] = useState('📁');

    useEffect(() => {
        if (categoryId) {
            loadCategory();
        }
        navigation.setOptions({
            title: categoryId ? 'Kategoriyi Düzenle' : 'Yeni Kategori',
        });
    }, [categoryId]);

    const loadCategory = async () => {
        if (!categoryId) return;
        const cat = await getCategoryById(categoryId);
        if (cat) {
            setName(cat.name);
            setColor(cat.color);
            setIcon(cat.icon);
        }
    };

    const handleSave = async () => {
        if (!name.trim()) {
            Alert.alert('Uyarı', 'Lütfen kategori adı girin.');
            return;
        }

        await saveCategory({
            id: categoryId || undefined,
            name: name.trim(),
            color,
            icon,
        });

        router.back();
    };

    return (
        <ScrollView
            style={[styles.container, { backgroundColor: colors.background }]}
            contentContainerStyle={styles.content}
            keyboardShouldPersistTaps="handled"
        >
            {/* Preview */}
            <View style={[styles.preview, { backgroundColor: color + '15', borderColor: color + '30' }]}>
                <Text style={styles.previewIcon}>{icon}</Text>
                <Text style={[styles.previewName, { color: colors.text }]}>
                    {name || 'Kategori Adı'}
                </Text>
            </View>

            {/* Name */}
            <Text style={[styles.label, { color: colors.textSecondary }]}>KATEGORİ ADI</Text>
            <TextInput
                style={[styles.input, { color: colors.text, backgroundColor: colors.surface, borderColor: colors.border }]}
                value={name}
                onChangeText={setName}
                placeholder="Örn: İş, Kişisel, Fikirler..."
                placeholderTextColor={colors.textTertiary}
                autoFocus={!categoryId}
            />

            {/* Icon */}
            <Text style={[styles.label, { color: colors.textSecondary }]}>EMOJI</Text>
            <View style={styles.emojiGrid}>
                {EMOJI_OPTIONS.map((emoji) => (
                    <TouchableOpacity
                        key={emoji}
                        onPress={() => setIcon(emoji)}
                        style={[
                            styles.emojiBtn,
                            {
                                backgroundColor: icon === emoji ? colors.primary + '20' : colors.surface,
                                borderColor: icon === emoji ? colors.primary : colors.border,
                            },
                        ]}
                    >
                        <Text style={styles.emojiText}>{emoji}</Text>
                    </TouchableOpacity>
                ))}
            </View>

            {/* Color */}
            <Text style={[styles.label, { color: colors.textSecondary }]}>RENK</Text>
            <ColorPicker colors={CATEGORY_COLORS} selectedColor={color} onSelect={setColor} />

            {/* Save button */}
            <TouchableOpacity
                onPress={handleSave}
                style={[styles.saveBtn, { backgroundColor: colors.primary }]}
                activeOpacity={0.8}
            >
                <Ionicons name="checkmark" size={22} color="#FFF" />
                <Text style={styles.saveBtnText}>Kaydet</Text>
            </TouchableOpacity>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        padding: Spacing.xxl,
        paddingBottom: Spacing.xxxxl,
    },
    preview: {
        alignItems: 'center',
        padding: Spacing.xxl,
        borderRadius: BorderRadius.xl,
        marginBottom: Spacing.xxl,
        borderWidth: 1,
    },
    previewIcon: {
        fontSize: 48,
        marginBottom: Spacing.sm,
    },
    previewName: {
        ...Typography.title3,
    },
    label: {
        ...Typography.caption1,
        fontWeight: '600',
        letterSpacing: 0.5,
        marginBottom: Spacing.sm,
        marginTop: Spacing.lg,
    },
    input: {
        ...Typography.body,
        paddingHorizontal: Spacing.lg,
        paddingVertical: Spacing.md,
        borderRadius: BorderRadius.md,
        borderWidth: 1,
    },
    emojiGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: Spacing.sm,
    },
    emojiBtn: {
        width: 48,
        height: 48,
        borderRadius: BorderRadius.md,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
    },
    emojiText: {
        fontSize: 24,
    },
    saveBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: Spacing.sm,
        paddingVertical: Spacing.lg,
        borderRadius: BorderRadius.lg,
        marginTop: Spacing.xxxl,
    },
    saveBtnText: {
        ...Typography.headline,
        color: '#FFF',
    },
});

import CategoryChip from '@/components/CategoryChip';
import ColorPicker from '@/components/ColorPicker';
import MarkdownToolbar from '@/components/MarkdownToolbar';
import TagChip from '@/components/TagChip';
import { BorderRadius, Spacing, Typography } from '@/constants/theme';
import { useThemeColors } from '@/hooks/useThemeColors';
import * as PinService from '@/services/pin-service';
import { getCategories, getNoteById, saveNote } from '@/services/storage';
import { Category, NOTE_COLORS } from '@/types';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useLocalSearchParams, useNavigation, useRouter } from 'expo-router';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
    Alert,
    Keyboard,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

export default function NoteEditorScreen() {
    const colors = useThemeColors();
    const router = useRouter();
    const navigation = useNavigation();
    const { noteId } = useLocalSearchParams<{ noteId?: string }>();

    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [categoryId, setCategoryId] = useState<string | null>(null);
    const [tags, setTags] = useState<string[]>([]);
    const [newTag, setNewTag] = useState('');
    const [color, setColor] = useState('#1a1a2e');
    const [isPinProtected, setIsPinProtected] = useState(false);
    const [categories, setCategories] = useState<Category[]>([]);
    const [showOptions, setShowOptions] = useState(false);

    const contentRef = useRef<TextInput>(null);
    const selectionRef = useRef({ start: 0, end: 0 });

    useEffect(() => {
        loadData();
    }, [noteId]);

    // PIN doğrulama ekranından dönünce koruma durumunu güncelle
    useFocusEffect(
        useCallback(() => {
            if (noteId) {
                getNoteById(noteId).then((note) => {
                    if (note) {
                        setIsPinProtected(note.isPinProtected);
                    }
                });
            }
        }, [noteId])
    );

    useEffect(() => {
        navigation.setOptions({
            title: noteId ? 'Notu Düzenle' : 'Yeni Not',
            headerRight: () => (
                <TouchableOpacity onPress={handleSave} style={styles.headerBtn}>
                    <Ionicons name="checkmark" size={24} color={colors.primary} />
                </TouchableOpacity>
            ),
        });
    }, [title, content, categoryId, tags, color, isPinProtected, navigation, colors]);

    const loadData = async () => {
        const cats = await getCategories();
        setCategories(cats);

        if (noteId) {
            const note = await getNoteById(noteId);
            if (note) {
                setTitle(note.title);
                setContent(note.content);
                setCategoryId(note.categoryId);
                setTags(note.tags);
                setColor(note.color);
                setIsPinProtected(note.isPinProtected);
            }
        }
    };

    const handleSave = useCallback(async () => {
        if (!title.trim()) {
            Alert.alert('Uyarı', 'Lütfen bir başlık girin.');
            return;
        }

        await saveNote({
            id: noteId || undefined,
            title: title.trim(),
            content,
            categoryId,
            tags,
            color,
            isPinProtected,
        });

        router.back();
    }, [title, content, categoryId, tags, color, isPinProtected, noteId, router]);

    const handleMarkdownAction = (prefix: string, suffix?: string) => {
        const { start, end } = selectionRef.current;
        const selectedText = content.substring(start, end);
        const newText =
            content.substring(0, start) +
            prefix +
            (selectedText || '') +
            (suffix || '') +
            content.substring(end);
        setContent(newText);
    };

    const addTag = () => {
        const tag = newTag.trim().toLowerCase();
        if (tag && !tags.includes(tag)) {
            setTags([...tags, tag]);
        }
        setNewTag('');
    };

    const removeTag = (tag: string) => {
        setTags(tags.filter((t) => t !== tag));
    };
    const [keyboardHeight, setKeyboardHeight] = useState(0);

    useEffect(() => {
        const showEvent = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
        const hideEvent = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';

        const showSub = Keyboard.addListener(showEvent, (e) => {
            setKeyboardHeight(e.endCoordinates.height);
        });
        const hideSub = Keyboard.addListener(hideEvent, () => {
            setKeyboardHeight(0);
        });

        return () => {
            showSub.remove();
            hideSub.remove();
        };
    }, []);

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                keyboardShouldPersistTaps="handled"
            >
                {/* Title */}
                <TextInput
                    style={[styles.titleInput, { color: colors.text, borderBottomColor: colors.border }]}
                    value={title}
                    onChangeText={setTitle}
                    placeholder="Not Başlığı"
                    placeholderTextColor={colors.textTertiary}
                    autoFocus={!noteId}
                    returnKeyType="next"
                    onSubmitEditing={() => contentRef.current?.focus()}
                />

                {/* Options toggle */}
                <TouchableOpacity
                    onPress={() => setShowOptions(!showOptions)}
                    style={[styles.optionsToggle, { backgroundColor: colors.surfaceElevated }]}
                    activeOpacity={0.7}
                >
                    <Ionicons
                        name={showOptions ? 'options' : 'options-outline'}
                        size={20}
                        color={colors.textSecondary}
                    />
                    <Text style={[styles.optionsToggleText, { color: colors.textSecondary }]}>
                        Seçenekler
                    </Text>
                    <Ionicons
                        name={showOptions ? 'chevron-up' : 'chevron-down'}
                        size={16}
                        color={colors.textTertiary}
                    />
                </TouchableOpacity>

                {/* Options panel */}
                {showOptions && (
                    <View style={[styles.optionsPanel, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                        {/* Category selector */}
                        <Text style={[styles.optionLabel, { color: colors.textSecondary }]}>Kategori</Text>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll}>
                            <CategoryChip
                                category={{ id: 'none', name: 'Yok', color: colors.textTertiary, icon: '❌', createdAt: '' }}
                                selected={categoryId === null}
                                onPress={() => setCategoryId(null)}
                                size="small"
                            />
                            {categories.map((cat) => (
                                <CategoryChip
                                    key={cat.id}
                                    category={cat}
                                    selected={categoryId === cat.id}
                                    onPress={() => setCategoryId(categoryId === cat.id ? null : cat.id)}
                                    size="small"
                                />
                            ))}
                        </ScrollView>

                        {/* Tags */}
                        <Text style={[styles.optionLabel, { color: colors.textSecondary }]}>Etiketler</Text>
                        <View style={styles.tagsContainer}>
                            {tags.map((tag) => (
                                <TagChip key={tag} tag={tag} onRemove={() => removeTag(tag)} />
                            ))}
                        </View>
                        <View style={styles.tagInputRow}>
                            <TextInput
                                style={[styles.tagInput, { color: colors.text, backgroundColor: colors.surfaceElevated, borderColor: colors.border }]}
                                value={newTag}
                                onChangeText={setNewTag}
                                placeholder="Etiket ekle..."
                                placeholderTextColor={colors.textTertiary}
                                onSubmitEditing={addTag}
                                returnKeyType="done"
                                autoCapitalize="none"
                            />
                            <TouchableOpacity
                                onPress={addTag}
                                style={[styles.addTagBtn, { backgroundColor: colors.primary }]}
                            >
                                <Ionicons name="add" size={20} color="#FFF" />
                            </TouchableOpacity>
                        </View>

                        {/* Color */}
                        <Text style={[styles.optionLabel, { color: colors.textSecondary }]}>Renk</Text>
                        <ColorPicker colors={NOTE_COLORS} selectedColor={color} onSelect={setColor} />

                        {/* PIN protection */}
                        <TouchableOpacity
                            onPress={async () => {
                                if (isPinProtected) {
                                    // Korumayı kaldırmadan önce PIN doğrulaması gerekli
                                    const hasPinSet = await PinService.hasPin();
                                    if (hasPinSet) {
                                        Alert.alert(
                                            'PIN Doğrulama',
                                            'Korumayı kaldırmak için PIN girmeniz gerekmektedir.',
                                            [
                                                { text: 'İptal', style: 'cancel' },
                                                {
                                                    text: 'Doğrula',
                                                    onPress: () => {
                                                        router.push({
                                                            pathname: '/pin-lock',
                                                            params: { mode: 'verify-unprotect', noteId: noteId || '' },
                                                        });
                                                    },
                                                },
                                            ]
                                        );
                                    } else {
                                        setIsPinProtected(false);
                                    }
                                } else {
                                    setIsPinProtected(true);
                                }
                            }}
                            style={[styles.pinToggle, { backgroundColor: isPinProtected ? colors.primary + '15' : colors.surfaceElevated }]}
                            activeOpacity={0.7}
                        >
                            <Ionicons
                                name={isPinProtected ? 'lock-closed' : 'lock-open'}
                                size={20}
                                color={isPinProtected ? colors.primary : colors.textTertiary}
                            />
                            <Text style={[styles.pinToggleText, { color: isPinProtected ? colors.primary : colors.textSecondary }]}>
                                {isPinProtected ? 'PIN Korumalı' : 'PIN Koruması Yok'}
                            </Text>
                        </TouchableOpacity>
                    </View>
                )}

                {/* Content editor */}
                <TextInput
                    ref={contentRef}
                    style={[styles.contentInput, { color: colors.text }]}
                    value={content}
                    onChangeText={setContent}
                    placeholder="Markdown ile yazın..."
                    placeholderTextColor={colors.textTertiary}
                    multiline
                    textAlignVertical="top"
                    onSelectionChange={(e) => {
                        selectionRef.current = e.nativeEvent.selection;
                    }}
                />
            </ScrollView>

            {/* Markdown toolbar */}
            <View style={{ paddingBottom: keyboardHeight }}>
                <MarkdownToolbar onAction={handleMarkdownAction} />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    headerBtn: {
        paddingHorizontal: Spacing.md,
        paddingVertical: Spacing.sm,
    },
    scrollContent: {
        paddingBottom: Spacing.xxxxl,
    },
    titleInput: {
        ...Typography.title2,
        paddingHorizontal: Spacing.xxl,
        paddingVertical: Spacing.lg,
        borderBottomWidth: 1,
    },
    optionsToggle: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.sm,
        marginHorizontal: Spacing.lg,
        marginTop: Spacing.md,
        paddingHorizontal: Spacing.md,
        paddingVertical: Spacing.sm,
        borderRadius: BorderRadius.sm,
    },
    optionsToggleText: {
        ...Typography.footnote,
        fontWeight: '500',
        flex: 1,
    },
    optionsPanel: {
        marginHorizontal: Spacing.lg,
        marginTop: Spacing.sm,
        padding: Spacing.lg,
        borderRadius: BorderRadius.lg,
        borderWidth: 1,
    },
    optionLabel: {
        ...Typography.caption1,
        fontWeight: '600',
        letterSpacing: 0.5,
        marginBottom: Spacing.sm,
        marginTop: Spacing.md,
    },
    categoryScroll: {
        marginBottom: Spacing.sm,
    },
    tagsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    tagInputRow: {
        flexDirection: 'row',
        gap: Spacing.sm,
        marginBottom: Spacing.sm,
    },
    tagInput: {
        flex: 1,
        ...Typography.footnote,
        paddingHorizontal: Spacing.md,
        paddingVertical: Spacing.sm,
        borderRadius: BorderRadius.sm,
        borderWidth: 1,
    },
    addTagBtn: {
        width: 36,
        height: 36,
        borderRadius: 18,
        alignItems: 'center',
        justifyContent: 'center',
    },
    pinToggle: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.sm,
        paddingHorizontal: Spacing.md,
        paddingVertical: Spacing.md,
        borderRadius: BorderRadius.sm,
        marginTop: Spacing.md,
    },
    pinToggleText: {
        ...Typography.subheadline,
        fontWeight: '500',
    },
    contentInput: {
        ...Typography.body,
        paddingHorizontal: Spacing.xxl,
        paddingTop: Spacing.lg,
        minHeight: 300,
        lineHeight: 26,
    },
});

import EmptyState from '@/components/EmptyState';
import FAB from '@/components/FAB';
import { BorderRadius, Shadows, Spacing, Typography } from '@/constants/theme';
import { useCategories } from '@/hooks/useCategories';
import { useNotes } from '@/hooks/useNotes';
import { useThemeColors } from '@/hooks/useThemeColors';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useRouter } from 'expo-router';
import React, { useCallback } from 'react';
import {
    Alert,
    FlatList,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

export default function CategoriesScreen() {
    const colors = useThemeColors();
    const router = useRouter();
    const { categories, loading, loadCategories, removeCategory } = useCategories();
    const { notes, loadNotes } = useNotes();

    useFocusEffect(
        useCallback(() => {
            loadCategories();
            loadNotes();
        }, [loadCategories, loadNotes])
    );

    const getNoteCount = (categoryId: string) => {
        return notes.filter((n) => n.categoryId === categoryId).length;
    };

    const handleDelete = (id: string, name: string) => {
        Alert.alert(
            'Kategoriyi Sil',
            `"${name}" kategorisini silmek istediğinize emin misiniz? Bu kategoriye ait notlar silinmeyecek.`,
            [
                { text: 'İptal', style: 'cancel' },
                {
                    text: 'Sil',
                    style: 'destructive',
                    onPress: () => removeCategory(id),
                },
            ]
        );
    };

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <FlatList
                data={categories}
                keyExtractor={(item) => item.id}
                numColumns={2}
                columnWrapperStyle={styles.row}
                renderItem={({ item }) => {
                    const noteCount = getNoteCount(item.id);
                    return (
                        <TouchableOpacity
                            style={[
                                styles.card,
                                {
                                    backgroundColor: colors.card,
                                    borderColor: colors.border,
                                    ...Shadows.sm,
                                },
                            ]}
                            onPress={() => {
                                router.push({
                                    pathname: '/(tabs)',
                                    params: { categoryFilter: item.id },
                                });
                            }}
                            onLongPress={() => handleDelete(item.id, item.name)}
                            activeOpacity={0.7}
                        >
                            {/* Color bar */}
                            <View style={[styles.colorBar, { backgroundColor: item.color }]} />

                            <View style={styles.cardContent}>
                                <Text style={styles.icon}>{item.icon}</Text>
                                <Text
                                    style={[styles.name, { color: colors.text }]}
                                    numberOfLines={1}
                                >
                                    {item.name}
                                </Text>
                                <Text style={[styles.count, { color: colors.textSecondary }]}>
                                    {noteCount} not
                                </Text>
                            </View>

                            {/* Edit button */}
                            <TouchableOpacity
                                style={[styles.editBtn, { backgroundColor: colors.surfaceElevated }]}
                                onPress={() =>
                                    router.push({
                                        pathname: '/category-editor',
                                        params: { categoryId: item.id },
                                    })
                                }
                                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                            >
                                <Ionicons name="pencil" size={14} color={colors.textSecondary} />
                            </TouchableOpacity>
                        </TouchableOpacity>
                    );
                }}
                ListEmptyComponent={
                    !loading ? (
                        <EmptyState
                            icon="folder-open-outline"
                            title="Henüz kategori yok"
                            subtitle="+ butonuna tıklayarak kategori oluşturun"
                        />
                    ) : null
                }
                contentContainerStyle={categories.length === 0 ? styles.emptyList : styles.list}
            />

            <FAB
                onPress={() => router.push('/category-editor')}
                icon="add"
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    list: {
        padding: Spacing.lg,
        paddingBottom: 100,
    },
    emptyList: {
        flexGrow: 1,
    },
    row: {
        gap: Spacing.md,
        marginBottom: Spacing.md,
    },
    card: {
        flex: 1,
        borderRadius: BorderRadius.lg,
        borderWidth: 1,
        overflow: 'hidden',
        position: 'relative',
    },
    colorBar: {
        height: 4,
        width: '100%',
    },
    cardContent: {
        padding: Spacing.lg,
        alignItems: 'center',
    },
    icon: {
        fontSize: 32,
        marginBottom: Spacing.sm,
    },
    name: {
        ...Typography.headline,
        textAlign: 'center',
        marginBottom: Spacing.xs,
    },
    count: {
        ...Typography.caption1,
    },
    editBtn: {
        position: 'absolute',
        top: Spacing.sm + 4,
        right: Spacing.sm,
        width: 28,
        height: 28,
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
    },
});

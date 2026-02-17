import EmptyState from '@/components/EmptyState';
import NoteCard from '@/components/NoteCard';
import SearchBar from '@/components/SearchBar';
import { Spacing, Typography } from '@/constants/theme';
import { useCategories } from '@/hooks/useCategories';
import { useSearch } from '@/hooks/useSearch';
import { useThemeColors } from '@/hooks/useThemeColors';
import { useFocusEffect, useRouter } from 'expo-router';
import React, { useCallback } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';

export default function SearchScreen() {
    const colors = useThemeColors();
    const router = useRouter();
    const { query, results, searching, search, clearSearch } = useSearch();
    const { categories, loadCategories } = useCategories();

    useFocusEffect(
        useCallback(() => {
            loadCategories();
        }, [loadCategories])
    );

    const getCategoryForNote = (categoryId: string | null) => {
        if (!categoryId) return null;
        return categories.find((c) => c.id === categoryId) ?? null;
    };

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <View style={styles.searchWrapper}>
                <SearchBar
                    value={query}
                    onChangeText={search}
                    onClear={clearSearch}
                    autoFocus
                />
            </View>

            {query.trim() ? (
                <>
                    <Text style={[styles.resultCount, { color: colors.textSecondary }]}>
                        {searching ? 'Aranıyor...' : `${results.length} sonuç bulundu`}
                    </Text>
                    <FlatList
                        data={results}
                        keyExtractor={(item) => item.id}
                        renderItem={({ item }) => (
                            <NoteCard
                                note={item}
                                category={getCategoryForNote(item.categoryId)}
                                onPress={() => {
                                    if (item.isPinProtected) {
                                        router.push({
                                            pathname: '/pin-lock',
                                            params: { noteId: item.id, mode: 'verify' },
                                        });
                                    } else {
                                        router.push({ pathname: '/note/[id]', params: { id: item.id } });
                                    }
                                }}
                            />
                        )}
                        ListEmptyComponent={
                            !searching ? (
                                <EmptyState
                                    icon="search-outline"
                                    title="Sonuç bulunamadı"
                                    subtitle="Farklı bir arama terimi deneyin"
                                />
                            ) : null
                        }
                        contentContainerStyle={results.length === 0 ? styles.emptyList : styles.list}
                    />
                </>
            ) : (
                <View style={styles.hintContainer}>
                    <EmptyState
                        icon="search-outline"
                        title="Notlarınızda arayın"
                        subtitle="Başlık, içerik veya etiketler ile arama yapabilirsiniz"
                    />
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    searchWrapper: {
        paddingTop: Spacing.md,
        paddingBottom: Spacing.sm,
    },
    resultCount: {
        ...Typography.footnote,
        paddingHorizontal: Spacing.lg,
        paddingBottom: Spacing.sm,
    },
    list: {
        paddingBottom: 40,
    },
    emptyList: {
        flexGrow: 1,
    },
    hintContainer: {
        flex: 1,
    },
});

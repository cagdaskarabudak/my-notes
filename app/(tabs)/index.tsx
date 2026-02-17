import CategoryChip from '@/components/CategoryChip';
import EmptyState from '@/components/EmptyState';
import FAB from '@/components/FAB';
import NoteCard from '@/components/NoteCard';
import { Spacing, Typography } from '@/constants/theme';
import { useCategories } from '@/hooks/useCategories';
import { useNotes } from '@/hooks/useNotes';
import { useThemeColors } from '@/hooks/useThemeColors';
import { useFocusEffect, useRouter } from 'expo-router';
import React, { useCallback, useState } from 'react';
import {
  Alert,
  FlatList,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

export default function NotesScreen() {
  const colors = useThemeColors();
  const router = useRouter();
  const { notes, loading, loadNotes, removeNote } = useNotes();
  const { categories, loadCategories } = useCategories();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  useFocusEffect(
    useCallback(() => {
      loadNotes();
      loadCategories();
    }, [loadNotes, loadCategories])
  );

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadNotes();
    await loadCategories();
    setRefreshing(false);
  }, [loadNotes, loadCategories]);

  const filteredNotes = selectedCategory
    ? notes.filter((n) => n.categoryId === selectedCategory)
    : notes;

  const handleDelete = (id: string, title: string) => {
    Alert.alert(
      'Notu Sil',
      `"${title}" notunu silmek istediğinize emin misiniz?`,
      [
        { text: 'İptal', style: 'cancel' },
        {
          text: 'Sil',
          style: 'destructive',
          onPress: () => removeNote(id),
        },
      ]
    );
  };

  const getCategoryForNote = (categoryId: string | null) => {
    if (!categoryId) return null;
    return categories.find((c) => c.id === categoryId) ?? null;
  };

  const renderHeader = () => (
    <View>
      {/* Stats */}
      <View style={styles.statsRow}>
        <Text style={[styles.statsText, { color: colors.textSecondary }]}>
          {filteredNotes.length} not
          {selectedCategory ? ' (filtrelenmiş)' : ''}
        </Text>
      </View>

      {/* Category filter */}
      {categories.length > 0 && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryScroll}
        >
          <CategoryChip
            category={{ id: 'all', name: 'Tümü', color: colors.primary, icon: '📋', createdAt: '' }}
            selected={selectedCategory === null}
            onPress={() => setSelectedCategory(null)}
            size="small"
          />
          {categories.map((cat) => (
            <CategoryChip
              key={cat.id}
              category={cat}
              selected={selectedCategory === cat.id}
              onPress={() =>
                setSelectedCategory(selectedCategory === cat.id ? null : cat.id)
              }
              size="small"
            />
          ))}
        </ScrollView>
      )}
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <FlatList
        data={filteredNotes}
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
            onLongPress={() => handleDelete(item.id, item.title)}
          />
        )}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={
          !loading ? (
            <EmptyState
              icon="document-text-outline"
              title="Henüz not yok"
              subtitle="+ butonuna tıklayarak ilk notunuzu oluşturun"
            />
          ) : null
        }
        contentContainerStyle={filteredNotes.length === 0 ? styles.emptyList : styles.list}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary}
          />
        }
      />

      <FAB onPress={() => router.push('/note/editor')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  statsRow: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.sm,
    paddingBottom: Spacing.sm,
  },
  statsText: {
    ...Typography.footnote,
  },
  categoryScroll: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.md,
  },
  list: {
    paddingTop: Spacing.sm,
    paddingBottom: 100,
  },
  emptyList: {
    flexGrow: 1,
  },
});

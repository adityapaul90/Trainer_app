import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Chip } from '@/components/Chip';
import { DesktopHeader } from '@/components/DesktopHeader';
import { EmptyState } from '@/components/EmptyState';
import { FilterSheet } from '@/components/FilterSheet';
import { ScreenMeta } from '@/components/ScreenMeta';
import { SearchPill } from '@/components/SearchPill';
import {
  SearchSheet,
  getSearchSummary,
} from '@/components/SearchSheet';
import { TrainerGridCard } from '@/components/TrainerGridCard';
import { TrainerMap } from '@/components/TrainerMap';
import {
  colors,
  layout,
  radius,
  type,
  fonts,
} from '@/constants/theme';
import { CATEGORIES } from '@/data/trainers';
import { usePublishedTrainers } from '@/context/PublishedTrainersContext';
import { useResponsive } from '@/hooks/useResponsive';
import {
  applyAdvancedFilters,
  countAdvancedFilters,
  EMPTY_ADVANCED_FILTERS,
  searchTrainers,
} from '@/utils/trainerFilters';

function param(value, fallback = '') {
  if (Array.isArray(value)) return value[0] || fallback;
  return value || fallback;
}

export default function ExploreScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { width, isDesktop } = useResponsive();

  const [filters, setFilters] = useState(EMPTY_ADVANCED_FILTERS);
  const [searchOpen, setSearchOpen] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [view, setView] = useState('list');
  const [selectedMapId, setSelectedMapId] = useState(null);
  const { trainers: publishedTrainers } = usePublishedTrainers();

  const requestedCategory = param(params.category, 'all');
  const category = CATEGORIES.some((item) => item.id === requestedCategory)
    ? requestedCategory
    : 'all';

  const search = useMemo(
    () => ({
      query: param(params.q),
      area: param(params.area),
      when: param(params.when, 'any'),
      who: param(params.who, 'solo'),
      category,
    }),
    [params.q, params.area, params.when, params.who, category]
  );

  const setCategory = (nextCategory) => {
    router.setParams({
      category: nextCategory === 'all' ? undefined : nextCategory,
    });
  };

  const submitSearch = (value) => {
    router.setParams({
      q: value.query || undefined,
      area: value.area || undefined,
      when: value.when !== 'any' ? value.when : undefined,
      who: value.who !== 'solo' ? value.who : undefined,
      category: value.category !== 'all' ? value.category : undefined,
    });
  };

  const baseTrainers = useMemo(
    () =>
      searchTrainers(publishedTrainers, search).sort(
        (a, b) => b.rating - a.rating
      ),
    [search, publishedTrainers]
  );

  const trainers = useMemo(
    () =>
      applyAdvancedFilters(baseTrainers, filters).sort((a, b) => {
        if (a.availableToday !== b.availableToday) {
          return a.availableToday ? -1 : 1;
        }
        return b.rating - a.rating;
      }),
    [baseTrainers, filters]
  );

  const contentWidth = Math.min(width, layout.wideWidth);
  const mapVisible = view === 'map';
  const mapWidth = 450;
  const mapSplit = isDesktop && mapVisible;
  const availableWidth =
    contentWidth -
    layout.screenPadding * 2 -
    (mapSplit ? mapWidth + 20 : 0);
  const columns = isDesktop && !mapSplit
    ? 4
    : mapSplit && availableWidth > 700
      ? 3
      : 2;
  const gridGap = isDesktop ? 18 : 14;
  const cardWidth = Math.max(
    (availableWidth - gridGap * (columns - 1)) / columns,
    150
  );

  const activeAdvanced = countAdvancedFilters(filters);
  const activeFilterCount =
    activeAdvanced +
    (category === 'all' ? 0 : 1) +
    (search.area ? 1 : 0) +
    (search.when !== 'any' ? 1 : 0) +
    (search.who !== 'solo' ? 1 : 0) +
    (search.query ? 1 : 0);

  const hasAnyFilter = activeFilterCount > 0;
  const summary = getSearchSummary(search);

  const resetAll = () => {
    setFilters(EMPTY_ADVANCED_FILTERS);
    router.setParams({
      q: undefined,
      area: undefined,
      when: undefined,
      who: undefined,
      category: undefined,
    });
  };

  const toggleFilter = (key) => {
    if (key === 'topRated') {
      setFilters((current) => ({
        ...current,
        minRating: current.minRating ? null : 4.95,
      }));
      return;
    }
    if (key === 'under60') {
      setFilters((current) => ({
        ...current,
        maxPrice: current.maxPrice ? null : 1500,
      }));
      return;
    }
    setFilters((current) => ({
      ...current,
      availableToday: !current.availableToday,
    }));
  };

  const clearArea = () => router.setParams({ area: undefined, q: undefined });
  const clearWhen = () => router.setParams({ when: undefined });
  const clearWho = () => router.setParams({ who: undefined });

  const renderGrid = () => (
    <View style={[styles.grid, { columnGap: gridGap }]}>
      {trainers.map((trainer) => (
        <TrainerGridCard
          key={trainer.id}
          trainer={trainer}
          width={cardWidth}
        />
      ))}
    </View>
  );

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScreenMeta
        title="Explore trainers"
        description="Browse vetted strength, HIIT, yoga, boxing, and mobility coaches. Filter by price, rating, and availability."
      />
      <DesktopHeader active="explore" location={search.area || undefined} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.container}>
          <View
            style={[styles.headerRow, isDesktop && styles.headerRowDesktop]}
          >
            <View style={styles.headerCopy}>
              <Text style={styles.eyebrow}>Find your coach</Text>
              <Text style={[styles.title, isDesktop && styles.titleDesktop]}>
                Explore trainers
              </Text>
              <Text style={styles.subtitle}>
                Vetted coaches across India.
              </Text>
            </View>
            <View style={styles.countBadge}>
              <Text style={styles.countNumber}>{trainers.length}</Text>
              <Text style={styles.countLabel}>coaches</Text>
            </View>
          </View>

          <SearchPill
            value={search}
            onPress={() => setSearchOpen(true)}
            isDesktop={isDesktop}
            style={styles.searchPill}
          />

          <View style={styles.toolbar}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Open filters"
              onPress={() => setFiltersOpen(true)}
              style={({ pressed }) => [
                styles.filtersButton,
                activeAdvanced > 0 && styles.filtersButtonActive,
                pressed && styles.pressed,
              ]}
            >
              <Ionicons
                name="options-outline"
                size={15}
                color={activeAdvanced > 0 ? colors.volt : colors.ink}
              />
              <Text
                style={[
                  styles.filtersText,
                  activeAdvanced > 0 && styles.filtersTextActive,
                ]}
              >
                Filters
              </Text>
              {activeAdvanced > 0 ? (
                <View style={styles.filtersCount}>
                  <Text style={styles.filtersCountText}>{activeAdvanced}</Text>
                </View>
              ) : null}
            </Pressable>

            {hasAnyFilter ? (
              <Pressable
                accessibilityRole="button"
                onPress={resetAll}
                style={({ pressed }) => [
                  styles.resetButton,
                  pressed && styles.pressed,
                ]}
              >
                <Ionicons name="refresh" size={13} color={colors.ink} />
                <Text style={styles.resetText}>Reset</Text>
              </Pressable>
            ) : null}

            <View style={styles.viewToggle}>
              <Pressable
                accessibilityRole="button"
                accessibilityState={{ selected: !mapVisible }}
                onPress={() => setView('list')}
                style={({ pressed }) => [
                  styles.viewOption,
                  !mapVisible && styles.viewOptionActive,
                  pressed && styles.pressed,
                ]}
              >
                <Ionicons
                  name="grid-outline"
                  size={13}
                  color={!mapVisible ? colors.ink : colors.muted}
                />
                <Text
                  style={[
                    styles.viewText,
                    !mapVisible && styles.viewTextActive,
                  ]}
                >
                  List
                </Text>
              </Pressable>
              <Pressable
                accessibilityRole="button"
                accessibilityState={{ selected: mapVisible }}
                onPress={() => {
                  setView('map');
                  if (!selectedMapId && trainers[0]) {
                    setSelectedMapId(trainers[0].id);
                  }
                }}
                style={({ pressed }) => [
                  styles.viewOption,
                  mapVisible && styles.viewOptionActive,
                  pressed && styles.pressed,
                ]}
              >
                <Ionicons
                  name="map-outline"
                  size={13}
                  color={mapVisible ? colors.ink : colors.muted}
                />
                <Text
                  style={[
                    styles.viewText,
                    mapVisible && styles.viewTextActive,
                  ]}
                >
                  Map
                </Text>
              </Pressable>
            </View>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.bleed}
            contentContainerStyle={styles.categoryRow}
          >
            {CATEGORIES.map((item) => (
              <Chip
                key={item.id}
                label={item.label}
                icon={item.icon}
                selected={category === item.id}
                onPress={() => setCategory(item.id)}
              />
            ))}
          </ScrollView>

          <View style={styles.filterRow}>
            <Chip
              label="Top rated"
              icon="star-outline"
              small
              selected={filters.minRating !== null}
              onPress={() => toggleFilter('topRated')}
            />
            <Chip
              label="Under ₹1,500"
              icon="pricetag-outline"
              small
              selected={filters.maxPrice !== null}
              onPress={() => toggleFilter('under60')}
            />
            <Chip
              label="Available today"
              small
              selected={filters.availableToday}
              onPress={() => toggleFilter('availableToday')}
            />
          </View>

          {search.area || search.when !== 'any' || search.who !== 'solo' ? (
            <View style={styles.activeRow}>
              {search.area ? (
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel={`Clear ${summary.where}`}
                  onPress={clearArea}
                  style={({ pressed }) => [
                    styles.activeChip,
                    pressed && styles.pressed,
                  ]}
                >
                  <Ionicons
                    name="location-outline"
                    size={12}
                    color={colors.ink}
                  />
                  <Text style={styles.activeText}>{summary.where}</Text>
                  <Ionicons name="close" size={11} color={colors.muted} />
                </Pressable>
              ) : null}
              {search.when !== 'any' ? (
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel={`Clear ${summary.when}`}
                  onPress={clearWhen}
                  style={({ pressed }) => [
                    styles.activeChip,
                    pressed && styles.pressed,
                  ]}
                >
                  <Ionicons
                    name="calendar-outline"
                    size={12}
                    color={colors.ink}
                  />
                  <Text style={styles.activeText}>{summary.when}</Text>
                  <Ionicons name="close" size={11} color={colors.muted} />
                </Pressable>
              ) : null}
              {search.who !== 'solo' ? (
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel={`Clear ${summary.who}`}
                  onPress={clearWho}
                  style={({ pressed }) => [
                    styles.activeChip,
                    pressed && styles.pressed,
                  ]}
                >
                  <Ionicons
                    name="people-outline"
                    size={12}
                    color={colors.ink}
                  />
                  <Text style={styles.activeText}>{summary.who}</Text>
                  <Ionicons name="close" size={11} color={colors.muted} />
                </Pressable>
              ) : null}
            </View>
          ) : null}

          <View style={styles.resultsRow}>
            <Text style={styles.resultsText}>
              {trainers.length} {trainers.length === 1 ? 'coach' : 'coaches'}
              {search.area ? ` in ${search.area}` : ' in India'}
            </Text>
            {!mapVisible ? (
              <Text style={styles.sortText}>Top rated first</Text>
            ) : null}
          </View>

          {trainers.length === 0 ? (
            <EmptyState
              icon="search-outline"
              title="No coaches found"
              message="Try a different specialty, widen your filters, or search another city or state."
              actionLabel="Clear filters"
              onAction={resetAll}
            />
          ) : mapSplit ? (
            <View style={styles.mapSplit}>
              <View style={styles.mapList}>{renderGrid()}</View>
              <TrainerMap
                trainers={trainers}
                selectedId={selectedMapId}
                onSelect={setSelectedMapId}
                height={620}
                style={styles.mapPanel}
              />
            </View>
          ) : mapVisible ? (
            <>
              <TrainerMap
                trainers={trainers}
                selectedId={selectedMapId}
                onSelect={setSelectedMapId}
                height={380}
              />
              <View style={styles.mapGrid}>{renderGrid()}</View>
            </>
          ) : (
            renderGrid()
          )}

          <Text style={styles.footer}>
            Every coach is background checked and reviewed by real clients.
          </Text>
        </View>
      </ScrollView>

      {searchOpen ? (
        <SearchSheet
          visible
          onClose={() => setSearchOpen(false)}
          initial={search}
          onSubmit={submitSearch}
        />
      ) : null}
      {filtersOpen ? (
        <FilterSheet
          visible
          onClose={() => setFiltersOpen(false)}
          initial={filters}
          baseTrainers={baseTrainers}
          onApply={setFilters}
        />
      ) : null}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  scrollContent: {
    paddingBottom: 36,
  },
  container: {
    width: '100%',
    maxWidth: layout.wideWidth,
    alignSelf: 'center',
    paddingHorizontal: layout.screenPadding,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingTop: 10,
    gap: 12,
  },
  headerRowDesktop: {
    paddingTop: 32,
  },
  headerCopy: {
    flex: 1,
  },
  eyebrow: {
    ...type.label,
  },
  title: {
    ...type.display,
    fontSize: 32,
    fontFamily: fonts.regular,
    lineHeight: 37,
    marginTop: 5,
  },
  titleDesktop: {
    fontSize: 44,
    fontFamily: fonts.regular,
    lineHeight: 49,
    letterSpacing: -1.8,
    marginTop: 6,
  },
  subtitle: {
    ...type.small,
    marginTop: 6,
  },
  countBadge: {
    alignItems: 'center',
    backgroundColor: colors.ink,
    borderRadius: radius.md,
    paddingHorizontal: 12,
    paddingVertical: 9,
    marginTop: 6,
  },
  countNumber: {
    fontSize: 18,
    lineHeight: 21,
    fontWeight: '800',
    fontFamily: fonts.extrabold,
    color: colors.volt,
  },
  countLabel: {
    fontSize: 9,
    lineHeight: 12,
    fontWeight: '700',
    fontFamily: fonts.bold,
    letterSpacing: 0.4,
    textTransform: 'uppercase',
    color: 'rgba(255,255,255,0.65)',
  },
  searchPill: {
    marginTop: 22,
  },
  toolbar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 14,
  },
  filtersButton: {
    height: 38,
    paddingHorizontal: 14,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.surface,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  filtersButtonActive: {
    backgroundColor: colors.ink,
    borderColor: colors.ink,
  },
  filtersText: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '700',
    fontFamily: fonts.bold,
    color: colors.ink,
  },
  filtersTextActive: {
    color: colors.white,
  },
  filtersCount: {
    minWidth: 17,
    height: 17,
    paddingHorizontal: 4,
    borderRadius: 9,
    backgroundColor: colors.volt,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filtersCountText: {
    fontSize: 9.5,
    lineHeight: 12,
    fontWeight: '800',
    fontFamily: fonts.extrabold,
    color: colors.ink,
  },
  resetButton: {
    height: 38,
    paddingHorizontal: 12,
    borderRadius: radius.pill,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  resetText: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '700',
    fontFamily: fonts.bold,
    color: colors.ink,
    textDecorationLine: 'underline',
  },
  viewToggle: {
    marginLeft: 'auto',
    flexDirection: 'row',
    gap: 2,
    padding: 3,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.surfaceMuted,
  },
  viewOption: {
    height: 32,
    paddingHorizontal: 11,
    borderRadius: radius.pill,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  viewOptionActive: {
    backgroundColor: colors.surface,
  },
  viewText: {
    fontSize: 11,
    lineHeight: 14,
    fontWeight: '700',
    fontFamily: fonts.bold,
    color: colors.muted,
  },
  viewTextActive: {
    color: colors.ink,
  },
  bleed: {
    marginHorizontal: -layout.screenPadding,
    marginTop: 16,
  },
  categoryRow: {
    paddingHorizontal: layout.screenPadding,
    gap: 8,
  },
  filterRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 12,
  },
  activeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 12,
  },
  activeChip: {
    height: 32,
    paddingHorizontal: 11,
    borderRadius: radius.pill,
    backgroundColor: colors.voltSoft,
    borderWidth: 1,
    borderColor: colors.volt,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  activeText: {
    fontSize: 11,
    lineHeight: 14,
    fontWeight: '700',
    fontFamily: fonts.bold,
    color: colors.ink,
  },
  resultsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    marginTop: 20,
    marginBottom: 12,
  },
  resultsText: {
    ...type.small,
    fontWeight: '700',
    fontFamily: fonts.bold,
    color: colors.ink,
  },
  sortText: {
    ...type.tiny,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    rowGap: 18,
  },
  mapSplit: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 20,
  },
  mapList: {
    flex: 1,
    minWidth: 0,
  },
  mapPanel: {
    width: 450,
  },
  mapGrid: {
    marginTop: 18,
  },
  footer: {
    ...type.tiny,
    textAlign: 'center',
    marginTop: 28,
  },
  pressed: {
    opacity: 0.78,
  },
});

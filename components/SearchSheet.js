import { Ionicons } from '@expo/vector-icons';
import { useMemo, useState } from 'react';
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import {
  colors,
  radius,
  shadows,
  spacing,
  type,
  fonts,
} from '@/constants/theme';
import {
  CATEGORIES,
  getAllTrainers,
} from '@/data/trainers';
import { usePublishedTrainers } from '@/context/PublishedTrainersContext';
import {
  EMPTY_SEARCH,
  searchTrainers,
} from '@/utils/trainerFilters';

export const WHEN_OPTIONS = [
  { id: 'any', label: 'Any time', note: 'Every coach' },
  { id: 'today', label: 'Today', note: 'Ready now' },
  { id: 'tomorrow', label: 'Tomorrow', note: 'Plan ahead' },
  { id: 'week', label: 'This week', note: 'Flexible' },
];

export const WHO_OPTIONS = [
  { id: 'solo', label: 'Just me', icon: 'person-outline' },
  { id: 'partner', label: 'Me + partner', icon: 'people-outline' },
  { id: 'group', label: 'Small group', icon: 'people-circle-outline' },
];

export function getSearchSummary(value = EMPTY_SEARCH) {
  const when =
    WHEN_OPTIONS.find((item) => item.id === value.when) || WHEN_OPTIONS[0];
  const who =
    WHO_OPTIONS.find((item) => item.id === value.who) || WHO_OPTIONS[0];

  return {
    where: value.area || 'Anywhere in India',
    when: when.label,
    who: who.label,
  };
}

function OptionCard({ item, selected, onPress, wide = false }) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected }}
      onPress={onPress}
      style={({ pressed }) => [
        styles.optionCard,
        wide && styles.optionCardWide,
        selected && styles.optionCardSelected,
        pressed && styles.pressed,
      ]}
    >
      <View style={styles.optionTop}>
        {item.icon ? (
          <Ionicons
            name={item.icon}
            size={16}
            color={selected ? colors.ink : colors.muted}
          />
        ) : null}
        <Text
          style={[styles.optionLabel, selected && styles.optionLabelSelected]}
        >
          {item.label}
        </Text>
        {selected ? (
          <View style={styles.optionCheck}>
            <Ionicons name="checkmark" size={10} color={colors.ink} />
          </View>
        ) : null}
      </View>
      {item.note ? <Text style={styles.optionNote}>{item.note}</Text> : null}
    </Pressable>
  );
}

export function SearchSheet({ visible, onClose, initial, onSubmit }) {
  const [draft, setDraft] = useState({ ...EMPTY_SEARCH, ...initial });
  const { trainers: publishedTrainers } = usePublishedTrainers();

  const areas = useMemo(() => {
    const options = new Map();
    publishedTrainers.forEach((trainer) => {
      [trainer.city, trainer.state]
        .filter(Boolean)
        .forEach((value) => {
          const key = value.toLowerCase();
          if (!options.has(key)) options.set(key, value);
        });
    });
    return [...options.values()].sort((a, b) => a.localeCompare(b));
  }, [publishedTrainers]);

  const count = searchTrainers(getAllTrainers(), draft).length;
  const setField = (key, value) =>
    setDraft((current) => ({ ...current, [key]: value }));

  const submit = () => {
    onSubmit({ ...draft, query: draft.query.trim() });
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Close search"
          onPress={onClose}
          style={StyleSheet.absoluteFill}
        />
        <View style={styles.panel}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.panelContent}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.panelHeader}>
              <Text style={styles.brand}>
                instafit<Text style={styles.brandDot}>.</Text>
              </Text>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Close search"
                onPress={onClose}
                style={({ pressed }) => [
                  styles.closeButton,
                  pressed && styles.pressed,
                ]}
              >
                <Ionicons name="close" size={18} color={colors.ink} />
              </Pressable>
            </View>

            <Text style={styles.panelTitle}>Find your next coach</Text>
            <Text style={styles.panelSubtitle}>
              Where, when, and how you want to train. We will show you who is
              free.
            </Text>

            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <View style={styles.sectionIcon}>
                  <Ionicons
                    name="location-outline"
                    size={15}
                    color={colors.ink}
                  />
                </View>
                <Text style={styles.sectionLabel}>Where</Text>
              </View>
              <View style={styles.inputWrap}>
                <Ionicons
                  name="search"
                  size={16}
                  color={colors.muted}
                />
                <TextInput
                  value={draft.query}
                  onChangeText={(query) => setField('query', query)}
                  placeholder="City, state, coach, or specialty"
                  placeholderTextColor={colors.muted}
                  style={styles.input}
                  autoCapitalize="none"
                  autoCorrect={false}
                  returnKeyType="search"
                  accessibilityLabel="Search by neighborhood, coach, or specialty"
                />
                {draft.query ? (
                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel="Clear search text"
                    hitSlop={8}
                    onPress={() => setField('query', '')}
                  >
                    <Ionicons
                      name="close-circle"
                      size={17}
                      color={colors.lineStrong}
                    />
                  </Pressable>
                ) : null}
              </View>

              <View style={styles.chipWrap}>
                <Pressable
                  accessibilityRole="button"
                  accessibilityState={{ selected: !draft.area }}
                  onPress={() => setField('area', '')}
                  style={({ pressed }) => [
                    styles.areaChip,
                    !draft.area && styles.areaChipSelected,
                    pressed && styles.pressed,
                  ]}
                >
                  <Text
                    style={[
                      styles.areaChipText,
                      !draft.area && styles.areaChipTextSelected,
                    ]}
                  >
                    Anywhere in India
                  </Text>
                </Pressable>
                {areas.map((area) => {
                  const selected = draft.area === area;
                  return (
                    <Pressable
                      key={area}
                      accessibilityRole="button"
                      accessibilityState={{ selected }}
                      onPress={() => setField('area', selected ? '' : area)}
                      style={({ pressed }) => [
                        styles.areaChip,
                        selected && styles.areaChipSelected,
                        pressed && styles.pressed,
                      ]}
                    >
                      <Text
                        style={[
                          styles.areaChipText,
                          selected && styles.areaChipTextSelected,
                        ]}
                      >
                        {area}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>

            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <View style={styles.sectionIcon}>
                  <Ionicons
                    name="calendar-outline"
                    size={15}
                    color={colors.ink}
                  />
                </View>
                <Text style={styles.sectionLabel}>When</Text>
              </View>
              <View style={styles.optionRow}>
                {WHEN_OPTIONS.map((item) => (
                  <OptionCard
                    key={item.id}
                    item={item}
                    selected={draft.when === item.id}
                    onPress={() => setField('when', item.id)}
                  />
                ))}
              </View>
            </View>

            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <View style={styles.sectionIcon}>
                  <Ionicons
                    name="people-outline"
                    size={15}
                    color={colors.ink}
                  />
                </View>
                <Text style={styles.sectionLabel}>Who</Text>
              </View>
              <View style={styles.optionRow}>
                {WHO_OPTIONS.map((item) => (
                  <OptionCard
                    key={item.id}
                    item={item}
                    selected={draft.who === item.id}
                    onPress={() => setField('who', item.id)}
                  />
                ))}
              </View>
            </View>

            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <View style={styles.sectionIcon}>
                  <Ionicons
                    name="barbell-outline"
                    size={15}
                    color={colors.ink}
                  />
                </View>
                <Text style={styles.sectionLabel}>Training focus</Text>
              </View>
              <View style={styles.chipWrap}>
                {CATEGORIES.map((item) => {
                  const selected = draft.category === item.id;
                  return (
                    <Pressable
                      key={item.id}
                      accessibilityRole="button"
                      accessibilityState={{ selected }}
                      onPress={() => setField('category', item.id)}
                      style={({ pressed }) => [
                        styles.areaChip,
                        selected && styles.areaChipSelected,
                        pressed && styles.pressed,
                      ]}
                    >
                      <Text
                        style={[
                          styles.areaChipText,
                          selected && styles.areaChipTextSelected,
                        ]}
                      >
                        {item.label}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>
          </ScrollView>

          <View style={styles.footer}>
            <Pressable
              accessibilityRole="button"
              onPress={() => setDraft({ ...EMPTY_SEARCH })}
              style={({ pressed }) => [
                styles.clearButton,
                pressed && styles.pressed,
              ]}
            >
              <Text style={styles.clearText}>Clear all</Text>
            </Pressable>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={`Show ${count} coaches`}
              onPress={submit}
              style={({ pressed }) => [
                styles.submitButton,
                pressed && styles.pressed,
              ]}
            >
              <Ionicons name="search" size={16} color={colors.white} />
              <Text style={styles.submitText}>
                Show {count} {count === 1 ? 'coach' : 'coaches'}
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(16,18,13,0.62)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.md,
  },
  panel: {
    width: '100%',
    maxWidth: 760,
    maxHeight: '92%',
    backgroundColor: colors.bg,
    borderRadius: radius.xxl,
    overflow: 'hidden',
    ...shadows.card,
  },
  panelContent: {
    padding: 24,
    paddingBottom: 12,
  },
  panelHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  brand: {
    fontSize: 23,
    lineHeight: 27,
    fontWeight: '800',
    fontFamily: fonts.extrabold,
    letterSpacing: -1.2,
    color: colors.ink,
  },
  brandDot: {
    color: colors.volt,
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
  },
  panelTitle: {
    ...type.display,
    fontSize: 30,
    fontFamily: fonts.regular,
    lineHeight: 35,
    marginTop: 20,
  },
  panelSubtitle: {
    ...type.small,
    marginTop: 6,
    maxWidth: 470,
  },
  section: {
    marginTop: 22,
    paddingTop: 18,
    borderTopWidth: 1,
    borderTopColor: colors.line,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  sectionIcon: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: colors.volt,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionLabel: {
    fontSize: 11,
    lineHeight: 14,
    fontWeight: '800',
    fontFamily: fonts.extrabold,
    letterSpacing: 1,
    textTransform: 'uppercase',
    color: colors.ink,
  },
  inputWrap: {
    height: 50,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
    paddingHorizontal: 14,
  },
  input: {
    flex: 1,
    fontSize: 14,
    fontFamily: fonts.regular,
    color: colors.ink,
    paddingVertical: 0,
  },
  chipWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 10,
  },
  areaChip: {
    height: 34,
    paddingHorizontal: 12,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  areaChipSelected: {
    backgroundColor: colors.ink,
    borderColor: colors.ink,
  },
  areaChipText: {
    fontSize: 11.5,
    lineHeight: 15,
    fontWeight: '700',
    fontFamily: fonts.bold,
    color: colors.inkSoft,
  },
  areaChipTextSelected: {
    color: colors.white,
  },
  optionRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  optionCard: {
    flexGrow: 1,
    flexBasis: 120,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.surface,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  optionCardWide: {
    flexBasis: 180,
  },
  optionCardSelected: {
    borderColor: colors.ink,
    backgroundColor: colors.voltSoft,
  },
  optionTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  optionLabel: {
    flex: 1,
    fontSize: 12.5,
    lineHeight: 16,
    fontWeight: '700',
    fontFamily: fonts.bold,
    color: colors.inkSoft,
  },
  optionLabelSelected: {
    color: colors.ink,
  },
  optionCheck: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: colors.volt,
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionNote: {
    fontSize: 10,
    lineHeight: 13,
    fontWeight: '600',
    fontFamily: fonts.semibold,
    color: colors.muted,
    marginTop: 2,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    paddingHorizontal: 24,
    paddingTop: 14,
    paddingBottom: 18,
    borderTopWidth: 1,
    borderTopColor: colors.line,
    backgroundColor: colors.bg,
  },
  clearButton: {
    paddingVertical: 10,
    paddingHorizontal: 4,
  },
  clearText: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '700',
    fontFamily: fonts.bold,
    color: colors.ink,
    textDecorationLine: 'underline',
  },
  submitButton: {
    height: 46,
    paddingHorizontal: 18,
    borderRadius: radius.md,
    backgroundColor: colors.ink,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  submitText: {
    fontSize: 13,
    lineHeight: 17,
    fontWeight: '800',
    fontFamily: fonts.extrabold,
    color: colors.white,
  },
  pressed: {
    opacity: 0.8,
  },
});

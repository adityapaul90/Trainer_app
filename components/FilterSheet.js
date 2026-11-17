import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import {
  colors,
  radius,
  shadows,
  spacing,
  type,
} from '@/constants/theme';
import { CATEGORIES } from '@/data/trainers';
import { applyAdvancedFilters } from '@/utils/trainerFilters';

const PRICE_OPTIONS = [
  { value: null, label: 'Any' },
  { value: 1000, label: 'Up to ₹1,000' },
  { value: 1250, label: 'Up to ₹1,250' },
  { value: 1500, label: 'Up to ₹1,500' },
  { value: 2000, label: 'Up to ₹2,000' },
];

const RATING_OPTIONS = [
  { value: null, label: 'Any' },
  { value: 4.9, label: '4.9+' },
  { value: 4.95, label: '4.95+' },
];

function Section({ title, note, children }) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {note ? <Text style={styles.sectionNote}>{note}</Text> : null}
      <View style={styles.sectionBody}>{children}</View>
    </View>
  );
}

function ChoiceRow({ options, value, onChange }) {
  return (
    <View style={styles.choiceRow}>
      {options.map((option) => {
        const selected = value === option.value;
        return (
          <Pressable
            key={`${option.label}`}
            accessibilityRole="button"
            accessibilityState={{ selected }}
            onPress={() => onChange(option.value)}
            style={({ pressed }) => [
              styles.choice,
              selected && styles.choiceSelected,
              pressed && styles.pressed,
            ]}
          >
            <Text
              style={[
                styles.choiceText,
                selected && styles.choiceTextSelected,
              ]}
            >
              {option.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

function ToggleRow({ icon, title, note, value, onPress }) {
  return (
    <Pressable
      accessibilityRole="switch"
      accessibilityState={{ checked: value }}
      onPress={onPress}
      style={({ pressed }) => [
        styles.toggleRow,
        pressed && styles.pressed,
      ]}
    >
      <View style={styles.toggleIcon}>
        <Ionicons name={icon} size={16} color={colors.ink} />
      </View>
      <View style={styles.toggleCopy}>
        <Text style={styles.toggleTitle}>{title}</Text>
        <Text style={styles.toggleNote}>{note}</Text>
      </View>
      <View style={[styles.switch, value && styles.switchOn]}>
        <View style={[styles.switchKnob, value && styles.switchKnobOn]} />
      </View>
    </Pressable>
  );
}

export function FilterSheet({
  visible,
  onClose,
  initial,
  baseTrainers,
  onApply,
}) {
  const [draft, setDraft] = useState(initial);

  const count = applyAdvancedFilters(baseTrainers, draft).length;
  const specialtyOptions = CATEGORIES.filter((item) => item.id !== 'all');
  const setField = (key, value) =>
    setDraft((current) => ({ ...current, [key]: value }));

  const toggleSpecialty = (id) => {
    setDraft((current) => {
      const specialties = current.specialties || [];
      return {
        ...current,
        specialties: specialties.includes(id)
          ? specialties.filter((item) => item !== id)
          : [...specialties, id],
      };
    });
  };

  const clear = () =>
    setDraft({
      maxPrice: null,
      minRating: null,
      availableToday: false,
      verifiedOnly: false,
      specialties: [],
    });

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
          accessibilityLabel="Close filters"
          onPress={onClose}
          style={StyleSheet.absoluteFill}
        />
        <View style={styles.panel}>
          <View style={styles.header}>
            <View>
              <Text style={styles.eyebrow}>Refine your search</Text>
              <Text style={styles.title}>Filters</Text>
            </View>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Close filters"
              onPress={onClose}
              style={({ pressed }) => [
                styles.closeButton,
                pressed && styles.pressed,
              ]}
            >
              <Ionicons name="close" size={18} color={colors.ink} />
            </Pressable>
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            <Section title="Session price" note="Price before the service fee.">
              <ChoiceRow
                options={PRICE_OPTIONS}
                value={draft.maxPrice}
                onChange={(value) => setField('maxPrice', value)}
              />
            </Section>

            <Section title="Rating" note="Every review comes from a completed session.">
              <ChoiceRow
                options={RATING_OPTIONS}
                value={draft.minRating}
                onChange={(value) => setField('minRating', value)}
              />
            </Section>

            <Section title="Availability">
              <ToggleRow
                icon="flash-outline"
                title="Available today"
                note="Coaches with an open slot in the next 12 hours."
                value={draft.availableToday}
                onPress={() => setField('availableToday', !draft.availableToday)}
              />
              <ToggleRow
                icon="shield-checkmark-outline"
                title="Verified coaches only"
                note="Identity, certification, and background checked."
                value={draft.verifiedOnly}
                onPress={() => setField('verifiedOnly', !draft.verifiedOnly)}
              />
            </Section>

            <Section title="Specialty" note="Pick as many as you like.">
              <View style={styles.specialtyWrap}>
                {specialtyOptions.map((item) => {
                  const selected = (draft.specialties || []).includes(item.id);
                  return (
                    <Pressable
                      key={item.id}
                      accessibilityRole="button"
                      accessibilityState={{ selected }}
                      onPress={() => toggleSpecialty(item.id)}
                      style={({ pressed }) => [
                        styles.specialty,
                        selected && styles.specialtySelected,
                        pressed && styles.pressed,
                      ]}
                    >
                      <Ionicons
                        name={item.icon}
                        size={14}
                        color={selected ? colors.volt : colors.inkSoft}
                      />
                      <Text
                        style={[
                          styles.specialtyText,
                          selected && styles.specialtyTextSelected,
                        ]}
                      >
                        {item.label}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </Section>
          </ScrollView>

          <View style={styles.footer}>
            <Pressable
              accessibilityRole="button"
              onPress={clear}
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
              onPress={() => {
                onApply(draft);
                onClose();
              }}
              style={({ pressed }) => [
                styles.applyButton,
                pressed && styles.pressed,
              ]}
            >
              <Text style={styles.applyText}>
                Show {count} {count === 1 ? 'coach' : 'coaches'}
              </Text>
              <Ionicons name="arrow-forward" size={15} color={colors.ink} />
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
    maxWidth: 560,
    maxHeight: '90%',
    backgroundColor: colors.bg,
    borderRadius: radius.xxl,
    overflow: 'hidden',
    ...shadows.card,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 12,
    paddingHorizontal: 24,
    paddingTop: 22,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
  },
  eyebrow: {
    ...type.label,
  },
  title: {
    ...type.display,
    fontSize: 28,
    lineHeight: 32,
    marginTop: 4,
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
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 20,
  },
  section: {
    paddingTop: 20,
    paddingBottom: 18,
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
  },
  sectionTitle: {
    fontSize: 15,
    lineHeight: 20,
    fontWeight: '800',
    letterSpacing: -0.2,
    color: colors.ink,
  },
  sectionNote: {
    ...type.tiny,
    marginTop: 2,
  },
  sectionBody: {
    marginTop: 12,
    gap: 8,
  },
  choiceRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  choice: {
    height: 36,
    paddingHorizontal: 14,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  choiceSelected: {
    backgroundColor: colors.ink,
    borderColor: colors.ink,
  },
  choiceText: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '700',
    color: colors.inkSoft,
  },
  choiceTextSelected: {
    color: colors.volt,
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 11,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.surface,
  },
  toggleIcon: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: colors.voltSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  toggleCopy: {
    flex: 1,
    minWidth: 0,
  },
  toggleTitle: {
    fontSize: 13,
    lineHeight: 17,
    fontWeight: '700',
    color: colors.ink,
  },
  toggleNote: {
    fontSize: 10.5,
    lineHeight: 14,
    fontWeight: '500',
    color: colors.muted,
    marginTop: 1,
  },
  switch: {
    width: 38,
    height: 22,
    borderRadius: 11,
    backgroundColor: colors.lineStrong,
    padding: 3,
    justifyContent: 'center',
  },
  switchOn: {
    backgroundColor: colors.ink,
  },
  switchKnob: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: colors.white,
  },
  switchKnobOn: {
    alignSelf: 'flex-end',
    backgroundColor: colors.volt,
  },
  specialtyWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  specialty: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    height: 36,
    paddingHorizontal: 12,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.surface,
  },
  specialtySelected: {
    backgroundColor: colors.ink,
    borderColor: colors.ink,
  },
  specialtyText: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '700',
    color: colors.inkSoft,
  },
  specialtyTextSelected: {
    color: colors.white,
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
  },
  clearButton: {
    paddingVertical: 10,
    paddingHorizontal: 2,
  },
  clearText: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '700',
    color: colors.ink,
    textDecorationLine: 'underline',
  },
  applyButton: {
    height: 46,
    paddingHorizontal: 18,
    borderRadius: radius.md,
    backgroundColor: colors.volt,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  applyText: {
    fontSize: 13,
    lineHeight: 17,
    fontWeight: '800',
    color: colors.ink,
  },
  pressed: {
    opacity: 0.8,
  },
});

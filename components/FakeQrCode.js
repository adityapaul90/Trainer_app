import { StyleSheet, View } from 'react-native';

import { colors } from '@/constants/theme';

const MODULES = 25;
const FINDERS = [
  { row: 0, col: 0 },
  { row: 0, col: MODULES - 7 },
  { row: MODULES - 7, col: 0 },
];

function finderModule(row, col) {
  const finder = FINDERS.find(
    (origin) =>
      row >= origin.row &&
      row < origin.row + 7 &&
      col >= origin.col &&
      col < origin.col + 7
  );
  if (!finder) return null;

  const r = row - finder.row;
  const c = col - finder.col;
  return (
    r === 0 ||
    r === 6 ||
    c === 0 ||
    c === 6 ||
    (r >= 2 && r <= 4 && c >= 2 && c <= 4)
  );
}

function buildMatrix() {
  return Array.from({ length: MODULES }, (_, row) =>
    Array.from({ length: MODULES }, (_, col) => {
      const finder = finderModule(row, col);
      if (finder !== null) return finder;
      return (row * 7 + col * 13 + row * col) % 5 < 2;
    })
  );
}

const MATRIX = buildMatrix();

export function FakeQrCode({ size = 220 }) {
  const cell = size / MODULES;

  return (
    <View style={[styles.code, { width: size, height: size }]}>
      {MATRIX.map((cells, row) => (
        <View key={row} style={styles.row}>
          {cells.map((dark, col) => (
            <View
              key={col}
              style={{
                width: cell,
                height: cell,
                backgroundColor: dark ? colors.ink : colors.white,
              }}
            />
          ))}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  code: {
    backgroundColor: colors.white,
  },
  row: {
    flexDirection: 'row',
  },
});

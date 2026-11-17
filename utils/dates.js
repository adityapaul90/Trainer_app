const WEEKDAYS_SHORT = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const WEEKDAYS_LONG = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];
const MONTHS_SHORT = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];
const MONTHS_LONG = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

export function toDateKey(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function parseDateKey(key) {
  const [year, month, day] = key.split('-').map(Number);
  return new Date(year, month - 1, day);
}

export function daysFromNow(offset) {
  const date = new Date();
  date.setHours(12, 0, 0, 0);
  date.setDate(date.getDate() + offset);
  return toDateKey(date);
}

export function getNextDays(count) {
  const today = new Date();
  today.setHours(12, 0, 0, 0);

  return Array.from({ length: count }, (_, index) => {
    const date = new Date(today);
    date.setDate(today.getDate() + index);
    const key = toDateKey(date);

    let relative = WEEKDAYS_SHORT[date.getDay()];
    if (index === 0) relative = 'Today';
    if (index === 1) relative = 'Tomorrow';

    return {
      key,
      relative,
      weekday: WEEKDAYS_SHORT[date.getDay()],
      weekdayLong: WEEKDAYS_LONG[date.getDay()],
      day: String(date.getDate()).padStart(2, '0'),
      month: MONTHS_SHORT[date.getMonth()],
      monthLong: MONTHS_LONG[date.getMonth()],
      year: date.getFullYear(),
    };
  });
}

export function daysUntil(key) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const target = parseDateKey(key);
  target.setHours(0, 0, 0, 0);

  return Math.round((target.getTime() - today.getTime()) / 86400000);
}

export function formatRelativeDay(key) {
  const days = daysUntil(key);

  if (days === 0) return 'Today';
  if (days === 1) return 'Tomorrow';
  if (days > 1) return `In ${days} days`;
  if (days === -1) return 'Yesterday';
  return `${Math.abs(days)} days ago`;
}

export function formatFullDate(key) {
  const date = parseDateKey(key);
  return `${WEEKDAYS_LONG[date.getDay()]}, ${MONTHS_LONG[date.getMonth()]} ${date.getDate()}`;
}

export function formatShortDate(key) {
  const date = parseDateKey(key);
  return `${WEEKDAYS_SHORT[date.getDay()]}, ${MONTHS_SHORT[date.getMonth()]} ${date.getDate()}`;
}

export function formatMonthDay(key) {
  const date = parseDateKey(key);
  return {
    month: MONTHS_SHORT[date.getMonth()].toUpperCase(),
    day: String(date.getDate()).padStart(2, '0'),
    weekday: WEEKDAYS_SHORT[date.getDay()],
  };
}

export function isToday(key) {
  return key === toDateKey(new Date());
}

export function isUpcoming(key) {
  return key >= toDateKey(new Date());
}

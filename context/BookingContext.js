import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import {
  addSavedBookingId,
  getSavedBookingIds,
} from '@/services/bookingStore';
import { getCustomerBooking } from '@/services/customerBookings';

const BookingContext = createContext(null);

function timeToMinutes(value) {
  const [clock, meridiem] = value.split(' ');
  const [hours, minutes] = clock.split(':').map(Number);
  let normalized = hours % 12;
  if (meridiem === 'PM') normalized += 12;
  return normalized * 60 + minutes;
}

function formatClock(date = new Date()) {
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  });
}

export function BookingProvider({ children }) {
  const [bookings, setBookings] = useState([]);
  const [favoriteIds, setFavoriteIds] = useState([]);
  const [threads, setThreads] = useState([]);

  useEffect(() => {
    let active = true;

    getSavedBookingIds()
      .then((ids) =>
        Promise.all(ids.map((id) => getCustomerBooking(id).catch(() => null)))
      )
      .then((rows) => {
        if (!active) return;
        const saved = rows.filter(Boolean);
        if (!saved.length) return;
        setBookings((current) => {
          const known = new Set(current.map((item) => item.id));
          return [
            ...saved.filter((item) => !known.has(item.id)),
            ...current,
          ];
        });
      })
      .catch(() => {});

    return () => {
      active = false;
    };
  }, []);

  const addBooking = useCallback((booking) => {
    setBookings((current) => [booking, ...current]);
    addSavedBookingId(booking.id).catch(() => {});
  }, []);

  const cancelBooking = useCallback((bookingId) => {
    setBookings((current) =>
      current.map((booking) =>
        booking.id === bookingId
          ? { ...booking, status: 'cancelled' }
          : booking
      )
    );
  }, []);

  const toggleFavorite = useCallback((trainerId) => {
    setFavoriteIds((current) =>
      current.includes(trainerId)
        ? current.filter((id) => id !== trainerId)
        : [...current, trainerId]
    );
  }, []);

  const isFavorite = useCallback(
    (trainerId) => favoriteIds.includes(trainerId),
    [favoriteIds]
  );

  const getBooking = useCallback(
    (bookingId) => bookings.find((booking) => booking.id === bookingId),
    [bookings]
  );

  const getThread = useCallback(
    (threadId) => threads.find((thread) => thread.id === threadId),
    [threads]
  );

  const markThreadRead = useCallback((threadId) => {
    setThreads((current) =>
      current.map((thread) =>
        thread.id === threadId ? { ...thread, unread: 0 } : thread
      )
    );
  }, []);

  const startThread = useCallback((trainerId) => {
    const threadId = `thread-${trainerId}`;
    setThreads((current) => {
      if (current.some((thread) => thread.id === threadId)) {
        return current;
      }
      return [
        {
          id: threadId,
          trainerId,
          unread: 0,
          updatedAt: Date.now(),
          messages: [],
        },
        ...current,
      ];
    });
    return threadId;
  }, []);

  const sendMessage = useCallback((threadId, text) => {
    const trimmed = text.trim();
    if (!trimmed) return;

    const message = {
      id: `msg-${Date.now()}`,
      from: 'user',
      text: trimmed,
      at: formatClock(),
    };

    setThreads((current) =>
      current.map((thread) =>
        thread.id === threadId
          ? {
              ...thread,
              updatedAt: Date.now(),
              unread: 0,
              messages: [...thread.messages, message],
            }
          : thread
      )
    );
  }, []);

  const upcomingBookings = useMemo(
    () =>
      bookings
        .filter((booking) => booking.status === 'confirmed')
        .sort((a, b) => {
          if (a.dateKey === b.dateKey) {
            return timeToMinutes(a.time) - timeToMinutes(b.time);
          }
          return a.dateKey.localeCompare(b.dateKey);
        }),
    [bookings]
  );

  const pastBookings = useMemo(
    () =>
      bookings
        .filter(
          (booking) =>
            booking.status === 'completed' || booking.status === 'cancelled'
        )
        .sort((a, b) => b.dateKey.localeCompare(a.dateKey)),
    [bookings]
  );

  const unreadCount = useMemo(
    () => threads.reduce((total, thread) => total + (thread.unread || 0), 0),
    [threads]
  );

  const value = useMemo(
    () => ({
      bookings,
      upcomingBookings,
      pastBookings,
      favoriteIds,
      threads,
      unreadCount,
      addBooking,
      cancelBooking,
      toggleFavorite,
      isFavorite,
      getBooking,
      getThread,
      startThread,
      sendMessage,
      markThreadRead,
    }),
    [
      bookings,
      upcomingBookings,
      pastBookings,
      favoriteIds,
      threads,
      unreadCount,
      addBooking,
      cancelBooking,
      toggleFavorite,
      isFavorite,
      getBooking,
      getThread,
      startThread,
      sendMessage,
      markThreadRead,
    ]
  );

  return (
    <BookingContext.Provider value={value}>{children}</BookingContext.Provider>
  );
}

export function useBookings() {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error('useBookings must be used inside a BookingProvider');
  }
  return context;
}

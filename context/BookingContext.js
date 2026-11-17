import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';

import { daysFromNow } from '@/utils/dates';

const BookingContext = createContext(null);

function timeToMinutes(value) {
  const [clock, meridiem] = value.split(' ');
  const [hours, minutes] = clock.split(':').map(Number);
  let normalized = hours % 12;
  if (meridiem === 'PM') normalized += 12;
  return normalized * 60 + minutes;
}

const SEED_BOOKINGS = [
  {
    id: 'seed-maya',
    trainerId: 'maya-chen',
    dateKey: daysFromNow(2),
    time: '10:00 AM',
    duration: 60,
    sessionType: 'in-person',
    total: 1899,
    status: 'confirmed',
    createdAt: 'seed',
  },
  {
    id: 'seed-sofia',
    trainerId: 'sofia-alvarez',
    dateKey: daysFromNow(-8),
    time: '9:00 AM',
    duration: 45,
    sessionType: 'online',
    total: 1199,
    status: 'completed',
    createdAt: 'seed',
  },
  {
    id: 'seed-marcus',
    trainerId: 'marcus-reed',
    dateKey: daysFromNow(-21),
    time: '6:30 PM',
    duration: 60,
    sessionType: 'in-person',
    total: 1599,
    status: 'completed',
    createdAt: 'seed',
  },
];

const SEED_THREADS = [
  {
    id: 'thread-maya-chen',
    trainerId: 'maya-chen',
    unread: 1,
    updatedAt: 3,
    messages: [
      {
        id: 'msg-maya-1',
        from: 'trainer',
        text: 'Hey Aditya! Looking forward to Thursday. Any focus areas you want me to build around?',
        at: '9:12 AM',
      },
      {
        id: 'msg-maya-2',
        from: 'user',
        text: 'Mostly squat depth and keeping my brace on the way up.',
        at: '9:20 AM',
      },
      {
        id: 'msg-maya-3',
        from: 'trainer',
        text: 'Perfect. I will bring a banded drill and film one set so you can see the difference. Bring your flat shoes.',
        at: '9:28 AM',
      },
    ],
  },
  {
    id: 'thread-sofia-alvarez',
    trainerId: 'sofia-alvarez',
    unread: 0,
    updatedAt: 2,
    messages: [
      {
        id: 'msg-sofia-1',
        from: 'trainer',
        text: 'Your hip mobility work is paying off. Keep the 5-minute routine on your off days and we will test it Saturday.',
        at: 'Yesterday',
      },
      {
        id: 'msg-sofia-2',
        from: 'user',
        text: 'Will do. The couch stretch is humbling.',
        at: 'Yesterday',
      },
    ],
  },
  {
    id: 'thread-andre-thompson',
    trainerId: 'andre-thompson',
    unread: 1,
    updatedAt: 1,
    messages: [
      {
        id: 'msg-andre-1',
        from: 'trainer',
        text: 'Dropping a quick note: your footwork homework is in the app. Two rounds, no more. Quality over volume.',
        at: 'Mon',
      },
    ],
  },
];

function formatClock(date = new Date()) {
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  });
}

const AUTO_REPLIES = {
  'maya-chen':
    'Got it. I will build that into the plan and send you a quick warm-up before Thursday.',
  'sofia-alvarez':
    'That sounds good. Keep it gentle today and we can adjust the sequence when you arrive.',
  'andre-thompson':
    'Perfect. Bring water and I will have the pads ready. We will keep the rounds short and sharp.',
};

const DEFAULT_REPLY =
  'Thanks for the note. I will get back to you shortly with a plan for our next session.';

export function BookingProvider({ children }) {
  const [bookings, setBookings] = useState(SEED_BOOKINGS);
  const [favoriteIds, setFavoriteIds] = useState([
    'maya-chen',
    'sofia-alvarez',
    'andre-thompson',
  ]);
  const [threads, setThreads] = useState(SEED_THREADS);

  const addBooking = useCallback((booking) => {
    setBookings((current) => [booking, ...current]);
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

    const target = threads.find((thread) => thread.id === threadId);
    const reply = target
      ? AUTO_REPLIES[target.trainerId] || DEFAULT_REPLY
      : DEFAULT_REPLY;

    setTimeout(() => {
      setThreads((current) =>
        current.map((thread) =>
          thread.id === threadId
            ? {
                ...thread,
                updatedAt: Date.now(),
                messages: [
                  ...thread.messages,
                  {
                    id: `msg-${Date.now()}-reply`,
                    from: 'trainer',
                    text: reply,
                    at: formatClock(),
                  },
                ],
              }
            : thread
        )
      );
    }, 1400);
  }, [threads]);

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

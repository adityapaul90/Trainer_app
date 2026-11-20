import { api } from './api';

function toBooking(row) {
  return {
    id: row.id,
    trainerId: row.trainerId,
    trainerName: row.trainerName || '',
    name: row.name,
    phone: row.phone,
    dateKey: row.dateKey,
    time: row.time,
    duration: row.duration,
    sessionType: row.sessionType,
    total: row.total,
    status: row.status || 'confirmed',
    createdAt: row.createdAt,
  };
}

export function sendBookingOtp(phone) {
  return api('/customer-bookings/otp', {
    method: 'POST',
    body: { phone },
    auth: false,
  });
}

export function verifyBookingOtp(phone, code) {
  return api('/customer-bookings/verify', {
    method: 'POST',
    body: { phone, code },
    auth: false,
  });
}

export function saveCustomerBooking(payload) {
  return api('/customer-bookings', {
    method: 'POST',
    body: payload,
    auth: false,
  }).then(toBooking);
}

export function getCustomerBooking(id) {
  return api(`/customer-bookings/${id}`, { auth: false }).then(toBooking);
}

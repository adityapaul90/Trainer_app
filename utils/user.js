export function getFirstName(user) {
  return user?.name?.trim().split(/\s+/)[0] || '';
}

export function getInitials(user) {
  return (user?.name || '')
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join('');
}

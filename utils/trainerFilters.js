export const EMPTY_ADVANCED_FILTERS = {
  maxPrice: null,
  minRating: null,
  availableToday: false,
  verifiedOnly: false,
  specialties: [],
};

export const EMPTY_SEARCH = {
  query: '',
  area: '',
  when: 'any',
  who: 'solo',
  category: 'all',
};

export function searchTrainers(trainers, search = {}) {
  const query = (search.query || '').trim().toLowerCase();
  const area = search.area || '';
  const category =
    search.category && search.category !== 'all' ? search.category : null;
  const when = search.when || 'any';
  const who = search.who || 'solo';

  return trainers.filter((trainer) => {
    const searchable = [
      trainer.name,
      trainer.role,
      trainer.neighborhood,
      trainer.area,
      trainer.city,
      trainer.state,
      ...trainer.tags,
    ]
      .filter(Boolean)
      .join(' ')
      .toLowerCase();

    const areaText = (
      trainer.searchArea ||
      [trainer.neighborhood, trainer.area, trainer.city, trainer.state]
        .filter(Boolean)
        .join(' ')
    ).toLowerCase();

    const matchesQuery = !query || searchable.includes(query);
    const matchesArea =
      !area || areaText.includes(area.trim().toLowerCase());
    const matchesCategory =
      !category || trainer.categories.includes(category);
    const matchesWhen = when !== 'today' || trainer.availableToday;
    const matchesWho =
      who !== 'group' ||
      trainer.tags.some((tag) => tag.toLowerCase().includes('group'));

    return (
      matchesQuery &&
      matchesArea &&
      matchesCategory &&
      matchesWhen &&
      matchesWho
    );
  });
}

export function applyAdvancedFilters(trainers, filters = {}) {
  return trainers.filter((trainer) => {
    const matchesPrice = !filters.maxPrice || trainer.price <= filters.maxPrice;
    const matchesRating =
      !filters.minRating || trainer.rating >= filters.minRating;
    const matchesToday =
      !filters.availableToday || trainer.availableToday;
    const matchesVerified = !filters.verifiedOnly || trainer.verified;
    const matchesSpecialty =
      !filters.specialties ||
      filters.specialties.length === 0 ||
      filters.specialties.some((id) => trainer.categories.includes(id));

    return (
      matchesPrice &&
      matchesRating &&
      matchesToday &&
      matchesVerified &&
      matchesSpecialty
    );
  });
}

export function countAdvancedFilters(filters = {}) {
  let count = 0;
  if (filters.maxPrice) count += 1;
  if (filters.minRating) count += 1;
  if (filters.availableToday) count += 1;
  if (filters.verifiedOnly) count += 1;
  count += filters.specialties ? filters.specialties.length : 0;
  return count;
}

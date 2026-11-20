import { getTrainerById } from '@/data/trainers';
import { buildMetadata } from '@/utils/metadata';

import TrainerDetailScreen from '@/screens/TrainerDetailScreen';

export function generateMetadata(request, params) {
  const rawId = params ? params.id : undefined;
  const trainer = getTrainerById(Array.isArray(rawId) ? rawId[0] : rawId);

  if (!trainer) {
    return buildMetadata('Trainer profile');
  }

  return buildMetadata(
    trainer.name,
    `Book ${trainer.name}, ${trainer.role.toLowerCase()} in ${trainer.neighborhood}. Rated ${trainer.rating} from ${trainer.reviewCount} client reviews.`
  );
}

export default function TrainerRoute() {
  return <TrainerDetailScreen />;
}

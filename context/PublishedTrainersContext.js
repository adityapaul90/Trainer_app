import { createContext, useContext, useEffect, useState } from 'react';

import { registerPublishedTrainers } from '@/data/trainers';
import { getPublishedTrainers } from '@/services/publishedTrainers';

const PublishedTrainersContext = createContext({
  trainers: [],
  loading: true,
});

export function PublishedTrainersProvider({ children }) {
  const [trainers, setTrainers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    getPublishedTrainers()
      .then((list) => {
        if (!active) return;
        registerPublishedTrainers(list);
        setTrainers(list);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  return (
    <PublishedTrainersContext.Provider value={{ trainers, loading }}>
      {children}
    </PublishedTrainersContext.Provider>
  );
}

export function usePublishedTrainers() {
  return useContext(PublishedTrainersContext);
}

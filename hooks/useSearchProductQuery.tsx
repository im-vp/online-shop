'use client';

import { useEffect, useState } from 'react';

import { useDebounce } from 'use-debounce';

import { ProductApi } from '@/services/api/products';
import { useQuery } from '@tanstack/react-query';

export const useSearchProductQuery = (val: string) => {
  const [enabled, setEnabled] = useState(false);
  const [debouncedValue] = useDebounce(val, 1000);

  const { data, isSuccess, isFetching } = useQuery({
    queryKey: ['search', val],
    queryFn: () => ProductApi.getProductsBySearch(debouncedValue),
    enabled,
  });

  useEffect(() => {
    if (debouncedValue && val === debouncedValue) {
      setEnabled(true);
    } else {
      setEnabled(false);
    }
  }, [debouncedValue, val]);

  return { data, isSuccess, isFetching };
};

'use client';

import { useEffect, useRef, useState } from 'react';

import { getProducts } from '@/services/api/products';
import { IApiResponse, IProductResponse } from '@/types/types';
import { useQuery } from '@tanstack/react-query';

export const useGetProductsQuery = (productSlug: string, stringParams: string) => {
  const [firstRender, setFirstRender] = useState(stringParams);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    if (firstRender !== stringParams) setEnabled(true);
  }, [stringParams]);

  const { data, isSuccess, isFetching } = useQuery<IApiResponse<IProductResponse>>({
    queryKey: ['products', { stringParams }],
    queryFn: () => getProducts(productSlug, stringParams),
    enabled,
    staleTime: 1000 * 60 * 5,
  });

  return { data, isSuccess, isFetching };
};

'use client';

import { useEffect, useState } from 'react';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import { getObjectFilterParams, getStringFilterParams } from '@/lib/utils/utils';

import { IFilterParams, RemoveFiltersType } from '@/types/types';

export const useProductFilters = ({ callback }: { callback: (obj: IFilterParams) => void }) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const getParams = Object.fromEntries(searchParams.entries());

  const [stringParams, setStringParams] = useState<string>(getStringFilterParams(getParams));
  const [filterParams, setFilterParams] = useState<{
    key: string;
    val: string;
    remove?: RemoveFiltersType;
  } | null>(null);

  const handleChangeSort = (obj: { key: string; val: string; remove?: RemoveFiltersType }) => {
    setFilterParams(obj);
  };

  useEffect(() => {
    if (filterParams === null) return;

    let stringFilterParams = null;

    if (filterParams?.remove === 'one') {
      delete getParams[filterParams.key];
      stringFilterParams = getStringFilterParams(getParams) || pathname;
    } else if (filterParams?.remove === 'all') {
      stringFilterParams = getParams.sort ? pathname + '?sort=' + getParams.sort : pathname;
    } else {
      getParams[filterParams.key] = filterParams.val;
      stringFilterParams = getStringFilterParams(getParams) || pathname;
    }

    router.replace(stringFilterParams, {
      scroll: false,
    });
    setStringParams(stringFilterParams);
    callback(filterParams?.remove === 'all' ? {} : getObjectFilterParams(getParams));
  }, [filterParams]);

  return { stringParams, handleChangeSort };
};

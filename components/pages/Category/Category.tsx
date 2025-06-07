'use client';

import { useEffect, useState } from 'react';

import { PriceRange } from '@/components/elements/PriceRange';
import { SelectedFilters } from '@/components/elements/SelectedFilters';
import { Sort } from '@/components/elements/Sort';
import { ProductItem } from '@/components/modules/product-item/ProductItem';

import { useGetProductsQuery } from '@/hooks/useGetProductsQuery';
import { useProductFilters } from '@/hooks/useProductFilters';
import '@/styles/category-page/category-page.css';
import { ICategories, IFilterParams, IProduct } from '@/types/types';

interface Props {
  products: IProduct[];
  productsQuantity: number;
  favorites: string[] | null;
  category: ICategories;
  filterParams: IFilterParams;
}

export const Category = ({
  products,
  category,
  productsQuantity,
  favorites,
  filterParams: filters,
}: Props) => {
  const [productsList, setProductsList] = useState(products);
  const [filterParams, setFilterParams] = useState(filters);
  const { stringParams, handleChangeSort } = useProductFilters({
    callback: (obj) => setFilterParams({ ...obj }),
  });
  const { data, isSuccess, isFetching } = useGetProductsQuery(category.slug, stringParams);

  useEffect(() => {
    if (isSuccess && data?.data && data.success) {
      setProductsList(data.data.products);
    }
  }, [isSuccess, data]);

  return (
    <section className="category-page">
      <h1 className="category-page__title">{category.name}</h1>
      <div className="category-page__top-line">
        <SelectedFilters params={filterParams} callback={handleChangeSort} />
        <div className="category-page__sorting">
          <Sort
            defaultValue={filterParams?.sort}
            callback={(value) => handleChangeSort({ key: 'sort', val: value })}
          />
        </div>
      </div>
      <div className="category-page__container">
        <div className="category-page__filter-container">
          <PriceRange
            min={filterParams?.range?.min}
            max={filterParams?.range?.max}
            callback={(min, max) => {
              handleChangeSort({ key: 'range', val: `${min}-${max}` });
            }}
          />
        </div>
        <div
          className={`category-page__main-container ${isFetching ? 'category-page__main-container--loading' : ''}`}
        >
          {productsQuantity > 0 ? (
            <section className={'category-page__list'}>
              {productsList.map((product) => (
                <ProductItem key={product._id} {...product} favorites={favorites} />
              ))}
            </section>
          ) : (
            <p className="category-page__empty">Ничего не найдено</p>
          )}
        </div>
      </div>
    </section>
  );
};

import { notFound } from 'next/navigation';

import Breadcrumbs from '@/components/modules/breadcrumbs/Breadcrumbs';
import { Category } from '@/components/pages/Category/Category';

import { getObjectFilterParams, getStringFilterParams } from '@/lib/utils/utils';

import { getProducts } from '@/services/api/products';
import { getUserFavoritesIds } from '@/services/server-action/favorites';

interface Props {
  params: { 'category-slug': string };
  searchParams: { [key: string]: string };
}

export async function generateMetadata({ params }: Props) {
  const categoryName = params['category-slug'];
  const { data } = await getProducts(categoryName);

  if (data.productsQuantity > 1) {
    return {
      title: data.products[0].category.name,
      description: `Купить ${categoryName} в интернет магазине 'Online Shop'`,
    };
  }

  return {
    title: 'Страница не найдена',
    description: `Страница '${categoryName}' - не найдена`,
  };
}

const CategoryPage = async ({ params, searchParams }: Props) => {
  const categoryName = params['category-slug'];
  const filterParams = getObjectFilterParams(searchParams);

  const { success, data } = await getProducts(categoryName, getStringFilterParams(searchParams));

  if (!success) {
    return notFound();
  }
  const favorites = await getUserFavoritesIds();

  return (
    <>
      <Breadcrumbs segments={[{ slug: data.category.slug, name: data.category.name }]} />
      <Category
        products={data.products}
        productsQuantity={data.productsQuantity}
        category={data.category}
        favorites={favorites}
        filterParams={filterParams}
      />
    </>
  );
};

export default CategoryPage;

import { notFound } from 'next/navigation';

import Breadcrumbs from '@/components/modules/breadcrumbs/Breadcrumbs';
import { Category } from '@/components/pages/Category/Category';

import { getObjectFilterParams } from '@/lib/utils/utils';

import { getUserFavoritesIds } from '@/services/server-action/favorites';
import { getCategoryProducts } from '@/services/server-action/products';

interface Props {
  params: { 'category-slug': string };
  searchParams: { [key: string]: string };
}

export async function generateMetadata({ params, searchParams }: Props) {
  const categoryName = params['category-slug'];
  const { success, data } = await getCategoryProducts(categoryName, searchParams);

  if (success && data && data.productsQuantity > 1) {
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

  const { success, data } = await getCategoryProducts(categoryName, searchParams);

  if (!success || !data) {
    return notFound();
  }
  const filterParams = getObjectFilterParams(searchParams);

  const { data: favorites } = await getUserFavoritesIds();

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

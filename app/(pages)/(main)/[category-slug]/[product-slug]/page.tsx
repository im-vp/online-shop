import { FC } from 'react';

import { notFound } from 'next/navigation';

import Breadcrumbs from '@/components/modules/breadcrumbs/Breadcrumbs';
import Product from '@/components/pages/Product/Product';

import { ProductApi } from '@/services/api/products';
import { getUserProfile } from '@/services/server-action/actions';
import { getReviewsByProductId } from '@/services/server-action/reviews';

interface Props {
  params: { 'product-slug': string };
}

export async function generateMetadata({ params }: Props) {
  const productSlug = params['product-slug'];
  const { data, success } = await ProductApi.getProduct(productSlug);

  if (success && data) {
    return {
      title: data.name,
      description: `Купить ${data.name}, ${data.description ? data.description : ''}'`,
    };
  }
}

const ProductPage: FC<Props> = async ({ params }) => {
  const { 'product-slug': productSlug } = params;
  const { success, data } = await ProductApi.getProduct(productSlug);

  if (!success || !data) {
    return notFound();
  }

  const { data: userProfile } = await getUserProfile();
  const { data: productReviews } = await getReviewsByProductId(data._id);

  return (
    <>
      <Breadcrumbs
        segments={[
          { slug: data.category.slug, name: data.category.name },
          { slug: data.slug, name: data.name },
        ]}
      />
      <Product product={data} profile={userProfile} reviews={productReviews ?? []} />
    </>
  );
};

export default ProductPage;

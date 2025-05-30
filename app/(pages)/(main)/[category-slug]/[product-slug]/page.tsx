import React, { FC } from 'react';

import { notFound } from 'next/navigation';

import Breadcrumbs from '@/components/modules/breadcrumbs/Breadcrumbs';
import Product from '@/components/pages/Product/Product';

import { getUserProfile, loginCheck } from '@/services/server-action/actions';
import { getProduct } from '@/services/server-action/products';
import { getReviewsByProductId } from '@/services/server-action/reviews';

interface Props {
  params: { 'product-slug': string };
}

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: Props) {
  const productName = params['product-slug'];
  const { data, success } = await getProduct(productName);

  if (success && data) {
    return {
      title: data.name,
      description: `Купить ${data.name}, ${data.description ? data.description : ''}'`,
    };
  }
}

const ProductPage: FC<Props> = async ({ params }) => {
  const { 'product-slug': productSlug } = params;
 console.log('LOG 1');
  const { success, data } = await getProduct(productSlug);
  console.log(data, success, 'LOG');
  if (!success || !data) {
    return notFound();
  }

  const isAuth = await loginCheck();

  const profile = isAuth && (await getUserProfile());
  const parseUserProfile = profile ? JSON.parse(JSON.stringify(profile)) : null;

  const reviews = await getReviewsByProductId(data._id);

  const parseUserReviews = JSON.parse(JSON.stringify(reviews));

  return (
    <>
      <Breadcrumbs
        segments={[
          { slug: data.category.slug, name: data.category.name },
          { slug: data.slug, name: data.name },
        ]}
      />
      <Product
        product={data}
        isAuth={isAuth}
        profile={parseUserProfile}
        reviews={parseUserReviews}
      />
    </>
  );
};

export default ProductPage;

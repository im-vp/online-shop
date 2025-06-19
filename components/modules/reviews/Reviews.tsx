'use client';

import { useState } from 'react';

import dynamic from 'next/dynamic';
import Link from 'next/link';

import { ReviewsItem } from '@/components/modules/reviews/ReviewsItem';
import ReviewsItemSkeleton from '@/components/modules/reviews/ReviewsItemSkeleton';
import Spinner from '@/components/ui/spinner/Spinner';

import { useUserStore } from '@/hooks/store/useStore';
import { ReviewsApi } from '@/services/api/reviews';
import '@/styles/reviews/reviews.css';
import { useQuery } from '@tanstack/react-query';
import { IProduct } from '@/types/types';

const ReviewForm = dynamic(() => import('@/components/modules/reviews/ReviewsForm'), {
  loading: () => (
    <Spinner
      color="#83837b"
      css={{ width: '30px', height: '39px', display: 'block', margin: '0 auto' }}
    />
  ),
});

interface IProps {
  product: IProduct;
}

export const Reviews = ({ product }: IProps) => {
  const isAuth = useUserStore((state) => state.isAuth);
  const [isFormShow, setIsFormShow] = useState(false);

  const { data, isPending, isSuccess } = useQuery({
    queryKey: ['productReviews', product._id],
    queryFn: () => ReviewsApi.getProductReviews(product._id),
    staleTime: 5 * 60 * 1000,
  });

  return (
    <section className="reviews">
      <h2 className="reviews__title">Отзывы про {product.name}</h2>

      {isPending ? null : isAuth ? (
        <div className="reviews__form-container">
          <button
            type="button"
            className="reviews__form-toggle-btn"
            onClick={() => setIsFormShow((prev) => !prev)}
          >
            {isFormShow ? 'Скрыть форму' : 'Добавить отзыв'}
          </button>
          <div>
            {isFormShow && (
              <ReviewForm productId={product._id} productSlug={product.slug} callback={() => setIsFormShow(false)} />
            )}
          </div>
        </div>
      ) : (
        <p className="reviews__empty">
          <Link href="/authentication" title="Авторизация" className="underline-hover">
            Авторизуйтесь
          </Link>
          {', '}
          что бы оставить отзыв
        </p>
      )}
      {isPending ? (
        Array.from({ length: 3 }).map((_, index) => <ReviewsItemSkeleton key={index} />)
      ) : isSuccess && data.data && data.data.length ? (
        <ul className="reviews__list">
          {data.data.map((review) => (
            <li className="reviews__list-item" key={review._id}>
              <ReviewsItem
                firstName={review.user.firstName}
                lastName={review.user.lastName}
                rating={review.rating}
                reviewText={review.reviewText}
                date={review.date}
              />
            </li>
          ))}
        </ul>
      ) : (
        <p className="reviews__empty">
          На данный момент у товара отсутствуют отзывы. Вы можете быть первым.
        </p>
      )}
    </section>
  );
};

'use client';

import { useState } from 'react';

import dynamic from 'next/dynamic';
import Link from 'next/link';

import { ReviewsItem } from '@/components/modules/reviews/ReviewsItem';
import Spinner from '@/components/ui/spinner/Spinner';

import { useUserStore } from '@/hooks/store/useStore';
import '@/styles/reviews/reviews.css';
import { IReviews } from '@/types/types';

const ReviewForm = dynamic(() => import('@/components/modules/reviews/ReviewsForm'), {
  loading: () => (
    <Spinner
      color="#83837b"
      css={{ width: '30px', height: '39px', display: 'block', margin: '0 auto' }}
    />
  ),
});

interface IProps {
  productId: string;
  productName: string;
  reviews: IReviews[];
}

export const Reviews = ({ productName, productId, reviews }: IProps) => {
  const [isFormShow, setIsFormShow] = useState(false);
  const isAuth = useUserStore((state) => state.isAuth);

  return (
    <section className="reviews">
      <h2 className="reviews__title">Отзывы про {productName}</h2>

      {isAuth ? (
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
              <ReviewForm productId={productId} callback={() => setIsFormShow(false)} />
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

      {reviews.length > 0 ? (
        <ul className="reviews__list">
          {reviews.map((review) => (
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

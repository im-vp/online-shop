import { Rating } from '@/components/elements/Rating';

import { getFormattedDate } from '@/lib/utils/utils';

import '@/styles/reviews/reviews-item.css';

interface IProps {
  firstName: string;
  lastName: string;
  reviewText: string;
  rating: number;
  date: Date;
}

export const ReviewsItem = ({ firstName, lastName, reviewText, date, rating }: IProps) => {

  return (
    <section className="reviews-item">
      <div className="reviews-item__top">
        <div className="reviews-item__name">
          {firstName} {lastName}
        </div>
        <div className="reviews-item__date">{getFormattedDate({ date: new Date(date) })}</div>
      </div>
      <div className="reviews-item__rating">
        <Rating value={rating} showCount={false} />
      </div>
      <div className="reviews-item__text">{reviewText}</div>
    </section>
  );
};

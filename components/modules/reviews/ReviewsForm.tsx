'use client';

import { useState } from 'react';

import { useRouter } from 'next/navigation';

import { Controller, useForm } from 'react-hook-form';

import { Rating } from '@/components/elements/Rating';
import Spinner from '@/components/ui/spinner/Spinner';

import { addReview } from '@/services/api/reviews';
import '@/styles/reviews/reviews-form.css';
import { IReviewBody } from '@/types/types';

interface IProps {
  userId: string;
  productId: string;
  firstName: string;
  lastName: string;
  callback?: () => void;
}

const ReviewsForm = ({ userId, productId, firstName, lastName, callback }: IProps) => {
  const router = useRouter();
  const {
    handleSubmit,
    register,
    control,
    formState: { errors },
  } = useForm<IReviewBody>();
  const [spinner, setSpinner] = useState(false);
  const [response, setResponse] = useState<{ success: boolean; message: string } | null>(null);

  const onSubmit = handleSubmit(async (data) => {
    setSpinner(true);

    const { success, message } = await addReview({
      ...data,
      user: userId,
      product: productId,
    });
    setSpinner(false);
    setResponse({ success, message });
    if (success) {
      callback && callback();
      router.refresh();
    }
  });

  return (
    <form className="reviews-form" onSubmit={onSubmit}>
      <div className="row">
        <Controller
          name="rating"
          control={control}
          rules={{
            required: 'Рейтинг обязателен',
          }}
          render={({ field }) => (
            <Rating
              readonly={false}
              showCount={false}
              value={field.value}
              callback={field.onChange} // Обновление значения в React Hook Form
            />
          )}
        />
        {errors.rating && <p className="input-error">{errors.rating.message}</p>}
      </div>
      <div className="row reviews-form__name">
        <div>
          <input
            className="reviews-form__field"
            type="text"
            placeholder="Имя"
            defaultValue={firstName}
            {...register('firstName', {
              required: 'поле обязательно для заполнения',
              pattern: {
                value: /^[A-Za-zА-Яа-яЁё]+$/i,
                message: 'Имя должно содержать только буквы',
              },
            })}
          />
          {errors.firstName && <p className="input-error">{errors.firstName.message}</p>}
        </div>
        <div>
          <input
            className="reviews-form__field"
            type="text"
            placeholder="Фамилия"
            defaultValue={lastName}
            {...register('lastName', {
              required: 'поле обязательно для заполнения',
              pattern: {
                value: /^[A-Za-zА-Яа-яЁё]+$/i,
                message: 'Фамилия должно содержать только буквы',
              },
            })}
          />
          {errors.lastName && <p className="input-error">{errors.lastName.message}</p>}
        </div>
      </div>
      <div className="row">
        <textarea
          className="reviews-form__field"
          placeholder="Текст отзыва"
          defaultValue=""
          {...register('reviewText', {
            required: 'поле обязательно для заполнения',
          })}
        />
        {errors.reviewText && <p className="input-error">{errors.reviewText.message}</p>}
      </div>
      {response?.message && (
        <div className={`row ${response?.success ? 'form-success' : 'form-error'}`}>
          {response.message}
        </div>
      )}
      <div className="row row-button">
        {spinner ? (
          <Spinner color="#1db954" css={{ width: '30px', height: '39px' }} />
        ) : (
          <button className="reviews-form__btn-submit" type="submit">
            Оставить отзыв
          </button>
        )}
      </div>
    </form>
  );
};

export default ReviewsForm;

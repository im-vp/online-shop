import { FC } from 'react';

import { Control, Controller, FieldErrors, UseFormRegister } from 'react-hook-form';

import { PHONE_MASK, VALIDATION_FIELDS } from '@/constants/constants';
import style from '@/styles/checkout-page/checkoutUserInfo.module.css';
import { CheckoutFormValues } from '@/types/types';
import { IUser } from '@/types/user-types';
import { InputMask } from '@react-input/mask';

interface Props {
  register: UseFormRegister<CheckoutFormValues>;
  errors: FieldErrors<CheckoutFormValues>;
  profile?: IUser;
  control: Control<CheckoutFormValues, any>;
}

const CheckoutUserInfo: FC<Props> = ({ register, errors, profile, control }) => {
  return (
    <div className={style.container}>
      <div className={style.row}>
        <label>
          <span className="label-field__title">Имя:</span>
          <input
            type="text"
            className={style.input}
            placeholder="Введите ваше имя"
            defaultValue={profile?.firstName}
            {...register('firstName', {
              required: VALIDATION_FIELDS.required.message,
              pattern: {
                value: VALIDATION_FIELDS.onlyLetters.pattern,
                message: VALIDATION_FIELDS.onlyLetters.message,
              },
            })}
          />
        </label>
        {errors.firstName && <p className="input-error">{errors.firstName.message}</p>}
      </div>
      <div className={style.row}>
        <label>
          <span className="label-field__title">Фамилия:</span>
          <input
            type="text"
            className={style.input}
            placeholder="Введите вашу фамилию"
            defaultValue={profile?.lastName}
            {...register('lastName', {
              required: VALIDATION_FIELDS.required.message,
              pattern: {
                value: VALIDATION_FIELDS.onlyLetters.pattern,
                message: VALIDATION_FIELDS.onlyLetters.message,
              },
            })}
          />
        </label>
        {errors.lastName && <p className="input-error">{errors.lastName.message}</p>}
      </div>
      <div className={style.row}>
        <span className="label-field__title">E-mail:</span>
        <input
          type="email"
          className={style.input}
          placeholder="Введите вашу почту"
          defaultValue={profile?.email}
          {...register('email', {
            required: VALIDATION_FIELDS.required.message,
            pattern: {
              value: VALIDATION_FIELDS.email.pattern,
              message: VALIDATION_FIELDS.email.message,
            },
          })}
        />
        {errors.email && <p className="input-error">{errors.email.message}</p>}
      </div>
      <div className={style.row}>
        <span className="label-field__title">Телефон:</span>
        <Controller
          name="phoneNumber"
          control={control}
          rules={{
            required: VALIDATION_FIELDS.required.message,
            pattern: {
              value: VALIDATION_FIELDS.phoneUA.pattern,
              message: VALIDATION_FIELDS.phoneUA.message,
            },
          }}
          render={({ field }) => (
            <InputMask
              mask={PHONE_MASK.UA.mask}
              replacement={PHONE_MASK.UA.replacement}
              value={field.value ?? ''}
              onChange={field.onChange}
              onBlur={field.onBlur}
              className={style.input}
              showMask
            ></InputMask>
          )}
        />
        {errors.phoneNumber && <p className="input-error">{errors.phoneNumber.message}</p>}
      </div>
    </div>
  );
};

export default CheckoutUserInfo;

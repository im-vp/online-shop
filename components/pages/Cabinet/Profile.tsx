'use client';

import { FC, useState } from 'react';

import { Controller, useForm } from 'react-hook-form';

import Spinner from '@/components/ui/spinner/Spinner';

import { isPhoneEmptyWithMask, phoneMaskFormat } from '@/lib/utils/utils';

import { PHONE_MASK, VALIDATION_FIELDS } from '@/constants/constants';
import { editUserProfile } from '@/services/server-action/profile';
import '@/styles/cabinet-page/user-profile.css';
import { IEditUser, IUser } from '@/types/user-types';
import { InputMask } from '@react-input/mask';

interface Props {
  profile: IUser;
}

const UserProfile: FC<Props> = ({ profile }) => {
  const {
    handleSubmit,
    register,
    reset,
    control,
    formState: { errors },
  } = useForm<IEditUser>({
    defaultValues: {
      phoneNumber: phoneMaskFormat(profile?.phoneNumber || ''),
    },
  });

  const [isEdit, setIsEdit] = useState(false);
  const [isSpinner, setIsSpinner] = useState(false);
  const [isResponse, isSetResponse] = useState<{ success: boolean; message: string } | null>(null);

  const onSubmit = handleSubmit(async (data) => {
    if (
      data.email === profile.email &&
      data.phoneNumber === profile.phoneNumber &&
      data.firstName === profile.firstName &&
      data.lastName === profile.lastName
    ) {
      setIsEdit(false);
      return;
    }

    setIsSpinner(true);

    const { success, message } = await editUserProfile({
      ...data,
      phoneNumber: isPhoneEmptyWithMask(String(data.phoneNumber), PHONE_MASK.UA.mask)
        ? ''
        : data.phoneNumber,
    });

    isSetResponse({ success, message });
    if (success) {
      setIsEdit(false);
    }
    setTimeout(() => {
      isSetResponse(null);
    }, 4500);
    setIsSpinner(false);
  });
  return (
    <div className="user-profile">
      <form className="user-profile__form" onSubmit={onSubmit}>
        <div className="row">
          <label className="label-field">
            <span className="label-field__title">Ваше имя</span>
            <input
              type="text"
              placeholder="Имя"
              className="profile-input"
              defaultValue={profile.firstName}
              disabled={!isEdit}
              {...register('firstName', {
                value: profile.firstName,
                required: VALIDATION_FIELDS.required.message,
                pattern: {
                  value: VALIDATION_FIELDS.onlyLetters.pattern,
                  message: VALIDATION_FIELDS.onlyLetters.message,
                },
              })}
            />
            {errors.firstName && <p className="input-error">{errors.firstName.message}</p>}
          </label>
        </div>
        <div className="row">
          <label className="label-field">
            <span className="label-field__title">Ваша фамилия</span>
            <input
              type="text"
              placeholder="Фамилия"
              className="profile-input"
              defaultValue={profile.lastName}
              disabled={!isEdit}
              {...register('lastName', {
                value: profile.lastName,
                required: VALIDATION_FIELDS.required.message,
                pattern: {
                  value: VALIDATION_FIELDS.onlyLetters.pattern,
                  message: VALIDATION_FIELDS.onlyLetters.message,
                },
              })}
            />
            {errors.lastName && <p className="input-error">{errors.lastName.message}</p>}
          </label>
        </div>
        <div className="row">
          <label className="label-field">
            <span className="label-field__title">Ваш E-mail</span>
            <input
              type="email"
              placeholder="E-mail"
              className="profile-input"
              defaultValue={profile.email}
              disabled={!isEdit}
              {...register('email', {
                value: profile.email,
                required: VALIDATION_FIELDS.required.message,
                pattern: {
                  value: VALIDATION_FIELDS.email.pattern,
                  message: VALIDATION_FIELDS.email.message,
                },
              })}
            />
          </label>
          {errors.email && <p className="input-error">{errors.email.message}</p>}
        </div>
        <div className="row">
          <label className="label-field">
            <span className="label-field__title">Ваш телефон</span>
            <Controller
              name="phoneNumber"
              control={control}
              rules={{
                validate: (value) => {
                  if (isPhoneEmptyWithMask(String(value), PHONE_MASK.UA.mask)) return true;
                  return (
                    VALIDATION_FIELDS.phoneUA.pattern.test(String(value)) ||
                    VALIDATION_FIELDS.phoneUA.message
                  );
                },
              }}
              render={({ field }) => (
                <InputMask
                  mask={PHONE_MASK.UA.mask}
                  replacement={PHONE_MASK.UA.replacement}
                  value={field.value ?? PHONE_MASK.UA.mask}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  className="profile-input"
                  showMask
                  disabled={!isEdit}
                ></InputMask>
              )}
            />
            {isEdit && errors.phoneNumber && (
              <p className="input-error">{errors.phoneNumber.message}</p>
            )}
          </label>
        </div>
        <div className="user-profile__button-wrap">
          {!isEdit ? (
            <button
              type="button"
              className="user-profile__button user-profile__button-edit"
              onClick={(e) => {
                e.preventDefault();
                setIsEdit(true);
              }}
            >
              Редактировать
            </button>
          ) : (
            <>
              {isSpinner ? (
                <Spinner
                  css={{
                    height: '39px',
                    width: '128px',
                    padding: '5px 20px',
                    backgroundColor: '#1db954',
                    borderRadius: '3px',
                  }}
                />
              ) : (
                <button type="submit" className="user-profile__button user-profile__button-save">
                  Сохранить
                </button>
              )}
              <button
                type="button"
                className="user-profile__button user-profile__button-cancel"
                onClick={() => {
                  setIsEdit(false);
                  reset();
                }}
              >
                Отменить
              </button>
            </>
          )}
          {isResponse?.message && (
            <p className={isResponse.success ? 'input-success' : 'input-error'}>
              {isResponse.message}
            </p>
          )}
        </div>
      </form>
    </div>
  );
};

export default UserProfile;

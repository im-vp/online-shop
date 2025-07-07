'use client';

import { FC, useState } from 'react';

import { useForm } from 'react-hook-form';

import Spinner from '@/components/ui/spinner/Spinner';

import { AUTH_FORM_TYPE } from '@/constants/constants';
import { UserApi } from '@/services/api/user';
import { IRegistrationBody, TypeForm } from '@/types/auth-types';

interface Props {
  onClick?: (type: TypeForm) => void;
}

const Registration: FC<Props> = ({ onClick }) => {
  const {
    handleSubmit,
    register,
    watch,
    formState: { errors },
  } = useForm<IRegistrationBody>();
  const [spinner, setSpinner] = useState(false);
  const [response, setResponse] = useState<{ success: boolean; message: string } | null>(null);

  const handleSwitchTo = () => {
    onClick && onClick(AUTH_FORM_TYPE.authorization as TypeForm);
  };

  const passwordValue = watch('password');
  const onSubmit = handleSubmit(async (data) => {
    setSpinner(true);
    const { success, message } = await UserApi.userRegistration(data);
    setSpinner(false);
    setResponse({ success, message });
    if (success) {
      handleSwitchTo();
    }
  });

  return (
    <div className="registration auth-container">
      <h1 className="auth-container__title">Регистрация</h1>
      <form className="auth-from" onSubmit={onSubmit}>
        <div className="row">
          <input
            type="text"
            placeholder="Имя"
            defaultValue=""
            {...register('firstName', {
              required: 'поле обязательно для заполнения',
              pattern: {
                value: /^[A-Za-zА-Яа-яЁё]+$/i,
                message: 'Имя должно содержать только буквы',
              },
            })}
          />
          {errors.firstName && <p className="auth-from__input-error">{errors.firstName.message}</p>}
        </div>
        <div className="row">
          <input
            type="text"
            placeholder="Фамилия"
            defaultValue=""
            {...register('lastName', {
              required: 'поле обязательно для заполнения',
              pattern: {
                value: /^[A-Za-zА-Яа-яЁё]+$/i,
                message: 'Фамилия должно содержать только буквы',
              },
            })}
          />
          {errors.lastName && <p className="auth-from__input-error">{errors.lastName.message}</p>}
        </div>
        <div className="row">
          <input
            type="email"
            placeholder="E-mail"
            defaultValue=""
            {...register('email', {
              required: 'поле обязательно для заполнения',
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: 'Не корректный E-mail адрес. Например my-email@domain.net',
              },
            })}
          />
          {errors.email && <p className="auth-from__input-error">{errors.email.message}</p>}
        </div>
        <div className="row">
          <input
            type="password"
            placeholder="Пароль"
            defaultValue=""
            {...register('password', {
              required: 'поле обязательно для заполнения',
              pattern: {
                value: /^(?=.*[A-Za-zА-Яа-яЁё])(?=.*\d)[A-Za-zА-Яа-яЁё\d]{8,}$/,
                message: 'Пароль должен содержать минимум 8 символов, включая буквы и цифры',
              },
            })}
          />
          {errors.password && <p className="auth-from__input-error">{errors.password.message}</p>}
        </div>
        <div className="row">
          <input
            type="password"
            placeholder="Повторите пароль"
            defaultValue=""
            {...register('passwordConfirm', {
              required: 'поле обязательно для заполнения',
              validate: (value) => value === passwordValue || 'Пароли не совпадают',
            })}
          />
          {errors.passwordConfirm && (
            <p className="auth-from__input-error">{errors.passwordConfirm.message}</p>
          )}
        </div>
        {response?.message && <div className="row auth-from__message">{response.message}</div>}
        <div className="row row-button">
          {spinner ? (
            <Spinner />
          ) : response?.success && response.success ? (
            <></>
          ) : (
            <button className="auth-from__submit" type="submit" disabled={spinner}>
              Зарегистрироваться
            </button>
          )}
        </div>
      </form>
      <div className="registration__switch">
        <span className="registration__switch-text">Уже есть аккаунт?</span>{' '}
        <button type="button" onClick={handleSwitchTo} className="registration__switch-btn">
          Войти
        </button>
      </div>
    </div>
  );
};

export default Registration;

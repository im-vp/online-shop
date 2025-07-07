'use client';

import { FC, useState } from 'react';

import { useRouter } from 'next/navigation';

import { useForm } from 'react-hook-form';

import Spinner from '@/components/ui/spinner/Spinner';

import { AUTH_FORM_TYPE, POPUP_ID } from '@/constants/constants';
import { useUserStore } from '@/hooks/store/useStore';
import { UserApi } from '@/services/api/user';
import { getUserFavoritesIds } from '@/services/server-action/favorites';
import { usePopupStore } from '@/store/PopupStore';
import { IAuthorizationBody, TypeForm } from '@/types/auth-types';

interface Props {
  onClick?: (type: TypeForm) => void;
}

const Authorization: FC<Props> = ({ onClick }) => {
  const { setAuthStatus, addUserFavorites } = useUserStore((state) => state);

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<IAuthorizationBody>();
  const router = useRouter();
  const { activePopup, togglePopup } = usePopupStore((state) => state);
  const [spinner, setSpinner] = useState(false);
  const [response, setResponse] = useState<{ success: boolean; message: string } | null>(null);

  const handleSwitchTo = () => {
    onClick && onClick(AUTH_FORM_TYPE.registration as TypeForm);
  };
  const onSubmit = handleSubmit(async (body) => {
    setSpinner(true);
    const { success, message } = await UserApi.userLogin(body);

    setSpinner(false);
    setResponse({ success, message });

    if (success) {
      if (activePopup === POPUP_ID.authentication) {
        togglePopup(null);
      } else {
        router.push('/');
      }
      setAuthStatus(true);
      const { success, data } = await getUserFavoritesIds();
      if (success && data) addUserFavorites(data);
    }
  });
  return (
    <div className="authorization auth-container">
      <h1 className="auth-container__title">Авторизация</h1>
      <form className="auth-from" onSubmit={onSubmit}>
        <div className="row">
          <input
            type="email"
            placeholder="Ваш e-mail"
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
            placeholder="Ваш пароль"
            defaultValue=""
            {...register('password', {
              required: 'поле обязательно для заполнения',
            })}
          />
          {errors.password && <p className="auth-from__input-error">{errors.password.message}</p>}
        </div>
        {response?.message && <div className="row auth-from__message">{response.message}</div>}
        <div className="row row-button">
          {spinner ? (
            <Spinner />
          ) : response?.success && response.success ? (
            <></>
          ) : (
            <button className="auth-from__submit" type="submit" disabled={spinner}>
              Войти
            </button>
          )}
        </div>
      </form>
      <div className="registration__switch">
        <span className="registration__switch-text">Ещё нет аккаунта?</span>{' '}
        <button type="button" onClick={handleSwitchTo} className="registration__switch-btn">
          Зарегистрироваться
        </button>
      </div>
    </div>
  );
};

export default Authorization;

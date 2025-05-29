'use client';

import { useState } from 'react';

import Authorization from '@/components/modules/auth/Authorization';
import Registration from '@/components/modules/auth/Registration';

import { AUTH_FORM_TYPE } from '@/constants/constants';
import '@/styles/authentication-page/authentication.css';
import { TypeForm } from '@/types/auth-types';

const AuthContainer = () => {
  const [openFormType, setOpenFormType] = useState<TypeForm>('authorization');

  const handlerSwitchForm = (type: TypeForm) => {
    setOpenFormType(type);
  };
  return (
    <div className="authentication">
      {openFormType === AUTH_FORM_TYPE.authorization ? (
        <Authorization onClick={handlerSwitchForm} />
      ) : (
        <Registration onClick={handlerSwitchForm} />
      )}
    </div>
  );
};

export default AuthContainer;

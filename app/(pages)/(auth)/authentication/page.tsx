import React from 'react';

import { Metadata } from 'next';

import AuthContainer from '@/components/modules/auth/AuthContainer';

export const metadata: Metadata = {
  title: 'Online Shop | Авторизация',
};

const AuthenticationPage = () => {
  return <AuthContainer />;
};

export default AuthenticationPage;

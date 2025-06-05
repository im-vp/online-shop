'use client';

import { FC, createContext } from 'react';

import { IHeaderData } from '@/types/types';

export const UserContext = createContext<IHeaderData>({
  isAuth: false,
  myFavorites: null,
  cartQuantity: 0,
});

interface Props {
  children: React.ReactNode;
  value: IHeaderData;
}

const HeaderProvider: FC<Props> = ({ children, value }) => {
  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export default HeaderProvider;

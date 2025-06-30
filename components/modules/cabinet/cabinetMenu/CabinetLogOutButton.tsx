'use client';

import { FC } from 'react';

import { useRouter } from 'next/navigation';

import { useUserStore } from '@/hooks/store/useStore';
import { UserApi } from '@/services/api/user';

interface Props {}

const CabinetLogOutButton: FC<Props> = ({}) => {
  const router = useRouter();
  const resetUserInfo = useUserStore((state) => state.resetUserInfo);

  const handlerLogout = async () => {
    const { success } = await UserApi.logout();

    if (success) {
      router.push('/');
      resetUserInfo();
    }
  };
  return (
    <button type="button" className="cabinet-page__menu-link logout-button" onClick={handlerLogout}>
      Выйти из кабинета
    </button>
  );
};

export default CabinetLogOutButton;

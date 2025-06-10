'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

import { CABINET_MENU_LIST } from '@/constants/constants';
import { useUserStore } from '@/hooks/store/useStore';
import { UserApi } from '@/services/api/user';

const CabinetMenu = () => {
  const path = usePathname();
  const router = useRouter();
  const { setAuthStatus, addUserFavorites } = useUserStore((state) => state);

  const handlerLogout = async () => {
    const { success } = await UserApi.logout();

    if (success) {
      router.push('/');
      setAuthStatus(false);
      addUserFavorites([]);
    }
  };

  return (
    <nav className="cabinet-page__menu">
      <ul className="cabinet-page__menu-list">
        {CABINET_MENU_LIST.map((item) => (
          <li key={item.path} className="cabinet-page__menu-item">
            <Link
              href={item.path}
              className={`cabinet-page__menu-link ${path === item.path ? 'cabinet-page__menu-link--active' : ''}`}
              title={item.name}
            >
              {item.name}
            </Link>
          </li>
        ))}
        <li className="cabinet-page__menu-item">
          <button
            type="button"
            className="cabinet-page__menu-link logout-button"
            onClick={handlerLogout}
          >
            Выйти из кабинета
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default CabinetMenu;

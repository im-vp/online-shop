import { FC, useContext } from 'react';

import Link from 'next/link';

import { UserContext } from '@/components/modules/header/HeaderProvider';

interface Props {}

const HeaderCategories: FC<Props> = ({}) => {
  const { categoriesInfo } = useContext(UserContext);

  if (!categoriesInfo.categories.length) return null;

  return (
    <div className="header__categories-popup smoothly-down box-shadow-white">
      {categoriesInfo.categories.map((el) => (
        <div key={el._id} className="header__categories-popup-item">
          <Link href={`/${el.slug}`}>{el.name}</Link>
        </div>
      ))}
    </div>
  );
};

export default HeaderCategories;

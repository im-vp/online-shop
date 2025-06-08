import { FC } from 'react';

import Link from 'next/link';

import { useInitDataContext } from '@/hooks/store/useStore';

interface Props {}

const HeaderCategories: FC<Props> = ({}) => {
  const { categoriesInfo } = useInitDataContext();

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

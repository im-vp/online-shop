'use client';

import { FC } from 'react';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import breadcrumbsGlossary from '@/services/breadcrumbs-glossary.json';
import style from '@/styles/breadcrumbs.module.css';

interface Props {
  segments?: {
    slug: string;
    name: string;
  }[];
}

const Breadcrumbs: FC<Props> = ({ segments }) => {
  const glossary = breadcrumbsGlossary as Record<string, string>;
  const segmentsArr =
    segments ||
    usePathname()
      .split('/')
      .filter(Boolean)
      .map((item) => ({
        slug: item,
        name: glossary[item] || item,
      }));

  if (!segmentsArr.length) return null;

  return (
    <nav className={style.container}>
      <ol className={style.list}>
        <li className={style.item}>
          <Link href={'/'} className={style.link}>
            {glossary['home']}
          </Link>
        </li>
        {segmentsArr.map((segment, index) => (
          <li key={segment.slug} className={style.item}>
            {segmentsArr.length - 1 === index ? (
              <span className={style.separator}>{segment.name}</span>
            ) : (
              <Link href={`/${segment.slug}`} className={style.link}>
                {segment.name}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;

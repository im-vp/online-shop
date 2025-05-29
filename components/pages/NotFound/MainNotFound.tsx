import Image from 'next/image';
import Link from 'next/link';

import '@/styles/not-found/main-not-found.css';

export const MainNotFound = () => {
  return (
    <div className="not-found-page">
      <section className="not-found-page__content">
        <h1 className="page__title">Страница не найдена</h1>
        <div className="not-found-page__image">
          <Image src="/image/assets/404.svg" alt="ошибка 404" width={450} height={450} />
        </div>
        <p className="not-found-page__text">
          Вернуться на{' '}
          <Link className="underline-hover" href="/">
            главную страницу
          </Link>
        </p>
      </section>
    </div>
  );
};

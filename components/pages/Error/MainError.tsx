import Image from 'next/image';
import Link from 'next/link';

import '@/styles/error/error-page.css';

export const MainError = () => {
  return (
    <div className="error-page">
      <section className="error-page__content">
        <h1 className="page__title">Что-то пошло не так...</h1>
        <div className="error-page__image">
          <Image src="/image/assets/error.svg" alt="ошибка" width={450} height={450} />
        </div>
        <p className="error-page__text">
          Вернуться на{' '}
          <Link className="underline-hover" href="/">
            главную страницу
          </Link>
        </p>
      </section>
    </div>
  );
};

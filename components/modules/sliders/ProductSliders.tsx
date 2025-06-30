'use client';

import { CSSProperties, useState } from 'react';

import 'swiper/css';
import { Navigation } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import { SwiperOptions } from 'swiper/types';

import { ProductSliderItem } from '@/components/modules/sliders/ProductSliderItem';

import style from '@/styles/sliders/productSliders.module.css';
import '@/styles/ui/skeleton/skeleton.css';
import { IProduct } from '@/types/types';

export const ProductSliders = ({
  products,
  title,
  className = '',
  inlineStyle = {},
}: {
  products: IProduct[];
  title?: string;
  className?: string;
  inlineStyle?: CSSProperties;
}) => {
  const [isSliderInitialized, setIsSliderInitialized] = useState(false);
  if (!products.length) return null;

  const settings: SwiperOptions = {
    modules: [Navigation],
    spaceBetween: 15,
    navigation: products.length > 4,
    loop: true,
    breakpoints: {
      320: {
        slidesPerView: 1,
      },
      450: {
        slidesPerView: products.length > 2 ? 2 : products.length,
      },
      700: {
        slidesPerView: products.length > 3 ? 3 : products.length,
      },
      1000: {
        slidesPerView: products.length > 4 ? 4 : products.length,
      },
    },
  };

  return (
    <section className={`${style.container} ${className}`} style={{ ...inlineStyle }}>
      {title && <h2 className={style.title}>{title}</h2>}
      <Swiper
        className={`${isSliderInitialized ? '' : 'skeleton-element'} ${style.slider}`}
        {...settings}
        onSwiper={() => setIsSliderInitialized(true)}
      >
        {products.map((product) => (
          <SwiperSlide key={product._id}>
            <ProductSliderItem product={product} />
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
};

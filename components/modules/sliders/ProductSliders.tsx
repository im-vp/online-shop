'use client';

import { CSSProperties } from 'react';

import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';

import { ProductSliderItem } from '@/components/modules/sliders/ProductSliderItem';

import style from '@/styles/sliders/productSliders.module.css';
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
  if (!products.length) return null;

  return (
    <section className={`${style.container} ${className}`} style={{ ...inlineStyle }}>
      {title && <h2 className={style.title}>{title}</h2>}
      <Slider className={style.slider} slidesToShow={products.length > 4 ? 4 : products.length}>
        {products.map((product) => (
          <ProductSliderItem product={product} key={product._id} />
        ))}
      </Slider>
    </section>
  );
};

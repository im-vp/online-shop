'use client';

import { FC, useState } from 'react';

import Image from 'next/image';

import 'swiper/css';
import 'swiper/css/thumbs';
import { Navigation, Thumbs } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import type { SwiperOptions } from 'swiper/types';
import type { Swiper as SwiperClass } from 'swiper/types';

import style from '@/styles/productSlider.module.css';

interface Props {
  images: string[];
  className?: string;
}

const ProductSlider: FC<Props> = ({ images, className }) => {
  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperClass | null>(null);
  const settingsMain: SwiperOptions = {
    modules: [Thumbs, Navigation],
    thumbs: { swiper: thumbsSwiper },
    navigation: true,
    loop: true,
  };
  const settingsThumbs: SwiperOptions = {
    modules: [Thumbs],
    slidesPerView: images.length > 3 ? 3 : images.length,
    watchSlidesProgress: true,
    spaceBetween: 10,
  };

  if (!images.length) return null;

  if (images.length === 1) return <Image src={images[0]} alt="" width={620} height={530} />;

  return (
    <div className={`${style.container} ${className}`}>
      <Swiper {...settingsMain} className={style.slider}>
        {images.map((el) => (
          <SwiperSlide key={el}>
            <div className={style.item}>
              <Image src={el} alt="" width={620} height={530} />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
      <Swiper onSwiper={setThumbsSwiper} {...settingsThumbs} className={style.dots}>
        {images.map((el, index) => (
          <SwiperSlide key={index} className={style.dots__btn}>
            <Image src={el} alt="" width={50} height={50} />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default ProductSlider;

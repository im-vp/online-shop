'use client';

import Image from 'next/image';
import Link from 'next/link';

import { Navigation, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import { SwiperOptions } from 'swiper/types';

const HomeSlider = () => {
  const img = [
    {
      src: '/image/banners/banner1.jpg',
      alt: 'banner1',
      link: '/phones',
    },
    {
      src: '/image/banners/banner2.jpg',
      alt: 'banner2',
      link: '/laptops',
    },
  ];

  const settings: SwiperOptions = {
    navigation: true,
    loop: true,
    pagination: {
      clickable: true,
    },
  };

  return (
    <div className="home-slider-container">
      <Swiper modules={[Navigation, Pagination]} {...settings} className="slide--theme home-slider">
        {img.map((el) => (
          <SwiperSlide>
            <Link key={el.link} href={el.link} className="home-slider__item">
              <Image src={el.src} alt="" width={1290} height={500} />
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default HomeSlider;

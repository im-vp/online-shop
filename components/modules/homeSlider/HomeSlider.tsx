'use client';

import Image from 'next/image';
import Link from 'next/link';

import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';

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

  const settings = {
    dots: true,
  };

  return (
    <div className="home-slider-container">
      <Slider {...settings} className="slide--theme home-slider">
        {img.map((el) => (
          <Link key={el.link} href={el.link} className="home-slider__item">
            <Image src={el.src} alt="" width={1290} height={500} />
          </Link>
        ))}
      </Slider>
    </div>
  );
};

export default HomeSlider;

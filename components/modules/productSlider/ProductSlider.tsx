import { FC } from 'react';

import Image from 'next/image';

import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';

import style from '@/styles/productSlider.module.css';

interface Props {
  images: string[];
  className?: string;
}

const ProductSlider: FC<Props> = ({ images, className }) => {
  const settings = {
    customPaging: function (i: number) {
      return (
        <button type="button" className={style.dots__btn}>
          <Image src={images[i]} alt="" width={620} height={530} />
        </button>
      );
    },
    dotsClass: `slick-dots ${style.dots}`,
    dots: true,
    infinite: true,
  };
  if (!images.length) return null;
  if (images.length === 1) return <Image src={images[0]} alt="" width={620} height={530} />;
  return (
    <div className={`${style.container} ${className}`}>
      <Slider {...settings} className={style.slider}>
        {images.map((el) => (
          <div key={el}>
            <div className={style.item}>
              <Image src={el} alt="" width={620} height={530} />
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default ProductSlider;

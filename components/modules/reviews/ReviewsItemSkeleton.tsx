import '@/styles/ui/skeleton/skeleton.css';

const ReviewsItemSkeleton = () => {
  return (
    <section className="reviews-item">
      <div className="reviews-item__top">
        <div className="reviews-item__name">
          <div className="skeleton-box" style={{ width: '160px' }}></div>
        </div>
        <div className="reviews-item__date">
          <div className="skeleton-box" style={{ width: '140px' }}></div>
        </div>
      </div>
      <div className="reviews-item__rating">
        <div className="skeleton-box" style={{ width: '130px' }}></div>
      </div>
      <div className="reviews-item__text">
        <div className="skeleton-box"></div>
        <div className="skeleton-box"></div>
      </div>
    </section>
  );
};

export default ReviewsItemSkeleton;

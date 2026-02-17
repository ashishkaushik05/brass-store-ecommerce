
import React from 'react';
import { Review } from '../types';
import Icon from './Icon';

interface ReviewSectionProps {
  reviews: Review[];
}

const ReviewStars: React.FC<{ rating: number }> = ({ rating }) => (
  <div className="flex items-center gap-1">
    {[...Array(5)].map((_, i) => (
      <Icon key={i} name="star" className={`${i < rating ? 'text-primary' : 'text-gray-300'}`} style={{fontVariationSettings: "'FILL' 1"}}/>
    ))}
  </div>
);

const ReviewSection: React.FC<ReviewSectionProps> = ({ reviews }) => {
  const averageRating = reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length;

  return (
    <section className="py-16 border-t border-[#e6e2db]">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Left: Summary & Form */}
        <div className="lg:col-span-1 flex flex-col gap-8">
          <h3 className="text-2xl font-bold font-serif text-text-main">Customer Reviews</h3>
          <div className="flex items-center gap-4">
            <ReviewStars rating={averageRating} />
            <p className="font-bold">{averageRating.toFixed(1)} out of 5</p>
          </div>
          <p className="text-text-subtle">{reviews.length} customer ratings</p>
          <button className="w-full h-12 bg-text-main text-white font-bold rounded-lg hover:bg-primary hover:text-text-main transition-colors">
            Write a Review
          </button>
        </div>
        
        {/* Right: Reviews List */}
        <div className="lg:col-span-2 flex flex-col gap-8">
          {reviews.map(review => (
            <div key={review.id} className="border-b border-[#e6e2db] pb-6">
              <div className="flex items-center gap-4 mb-2">
                <div className="w-10 h-10 rounded-full bg-primary/20 text-primary font-bold flex items-center justify-center">
                  {review.author.charAt(0)}
                </div>
                <div>
                  <p className="font-bold">{review.author}</p>
                  <p className="text-xs text-text-subtle">{review.date}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 my-3">
                <ReviewStars rating={review.rating} />
                <h4 className="font-bold text-text-main">{review.title}</h4>
              </div>
              <p className="text-text-subtle leading-relaxed">{review.content}</p>
              {review.verified && (
                <div className="flex items-center gap-1 mt-3 text-xs text-green-600 font-bold">
                  <Icon name="verified" className="text-[14px]" />
                  <span>Verified Purchase</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ReviewSection;

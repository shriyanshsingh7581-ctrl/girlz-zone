import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { HERO_BANNERS } from '../data/initialData';
import { ProductCategory } from '../types';
import { ResilientImage } from './ResilientImage';

interface HeroCarouselProps {
  onSelectCategory: (category: ProductCategory) => void;
  onApplyCouponBanner: (code: string) => void;
}

export const HeroCarousel: React.FC<HeroCarouselProps> = ({
  onSelectCategory,
  onApplyCouponBanner,
}) => {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % HERO_BANNERS.length);
    }, 5500);
    return () => clearInterval(timer);
  }, []);

  const currentSlide = HERO_BANNERS[activeIndex];

  const handlePrev = () => {
    setActiveIndex(
      (prev) => (prev - 1 + HERO_BANNERS.length) % HERO_BANNERS.length
    );
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % HERO_BANNERS.length);
  };

  return (
    <section
      aria-label="Promotional Offers Carousel"
      className="relative overflow-hidden rounded-2xl border border-[#F3DCE2] bg-white shadow-sm"
    >
      <div
        className={`relative bg-gradient-to-br ${currentSlide.gradient} text-white transition-colors duration-300`}
      >
        <div className="grid grid-cols-1 md:grid-cols-12 items-center gap-4 p-5 sm:p-6">
          {/* Left Copy Column */}
          <div className="md:col-span-7 flex flex-col justify-between space-y-3 z-10">
            <div className="flex items-center gap-2 text-[11px] font-semibold tracking-wider text-[#FDE68A]">
              <span>{currentSlide.kicker}</span>
              <span aria-hidden="true">·</span>
              <span className="font-mono-num text-white/95">
                {currentSlide.accentBadge}
              </span>
            </div>

            <h2 className="font-serif-display text-xl sm:text-2xl font-bold leading-snug text-white [text-wrap:balance]">
              {currentSlide.headline}
            </h2>

            <p className="text-xs sm:text-sm text-rose-100/95 leading-relaxed max-w-xl">
              {currentSlide.subtext}
            </p>

            <div className="pt-1 flex flex-wrap items-center gap-2.5">
              <button
                type="button"
                onClick={() => onSelectCategory(currentSlide.targetCategory)}
                className="min-h-[44px] px-4 py-2 rounded-xl bg-white text-[#881337] font-semibold text-xs sm:text-sm inline-flex items-center gap-2 shadow-sm hover:bg-rose-50 active:scale-[0.98] transition-all whitespace-nowrap shrink-0 cursor-pointer"
              >
                <span>{currentSlide.ctaLabel}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => onApplyCouponBanner('GIRLZ10')}
                className="min-h-[44px] px-3.5 py-2 rounded-xl bg-black/25 hover:bg-black/35 text-white border border-white/25 text-xs font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                Tap to Copy Code: <span className="font-mono-num font-bold">GIRLZ10</span>
              </button>
            </div>
          </div>

          {/* Right Studio Artwork Preview */}
          <div className="md:col-span-5 relative flex items-center justify-center">
            <div className="w-full max-w-[240px] sm:max-w-[270px] aspect-[4/3] rounded-xl overflow-hidden border border-white/25 shadow-md bg-[#FFF9F6]">
              <ResilientImage
                src={currentSlide.image}
                alt={currentSlide.headline}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>

        {/* Carousel Controls & Slide Indicators */}
        <div className="px-5 pb-3.5 flex items-center justify-between border-t border-white/10 pt-2.5">
          <div className="flex items-center gap-2" role="tablist" aria-label="Offer slides">
            {HERO_BANNERS.map((slide, idx) => (
              <button
                key={slide.id}
                type="button"
                role="tab"
                aria-selected={idx === activeIndex}
                aria-label={`Slide ${idx + 1}: ${slide.kicker}`}
                onClick={() => setActiveIndex(idx)}
                className={`h-2 rounded-full transition-all cursor-pointer ${
                  idx === activeIndex
                    ? 'w-7 bg-[#FDE68A]'
                    : 'w-2 bg-white/40 hover:bg-white/70'
                }`}
              />
            ))}
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={handlePrev}
              aria-label="Previous offer slide"
              className="w-8 h-8 rounded-lg bg-white/15 hover:bg-white/25 flex items-center justify-center text-white transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={handleNext}
              aria-label="Next offer slide"
              className="w-8 h-8 rounded-lg bg-white/15 hover:bg-white/25 flex items-center justify-center text-white transition-colors cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

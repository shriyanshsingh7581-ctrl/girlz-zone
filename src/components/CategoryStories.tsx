import React from 'react';
import { CATEGORY_CIRCLES } from '../data/initialData';
import { ProductCategory } from '../types';
import { ResilientImage } from './ResilientImage';

interface CategoryStoriesProps {
  selectedCategory: ProductCategory;
  onSelectCategory: (category: ProductCategory) => void;
  categoryCounts: Record<string, number>;
}

export const CategoryStories: React.FC<CategoryStoriesProps> = ({
  selectedCategory,
  onSelectCategory,
  categoryCounts,
}) => {
  return (
    <section aria-label="Shop by Category" className="py-1">
      <div className="flex items-center justify-between mb-2.5 px-0.5">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-semibold text-[#1F1216]">
            Explore Store Categories
          </h3>
          <span aria-hidden="true" className="text-xs text-[#8A6A72]">·</span>
          <span className="text-xs text-[#7A5660]">
            Swipe to filter
          </span>
        </div>
        {selectedCategory !== 'All' && (
          <button
            type="button"
            onClick={() => onSelectCategory('All')}
            className="text-xs font-semibold text-[#E11D48] hover:underline cursor-pointer whitespace-nowrap shrink-0"
          >
            Reset Filter
          </button>
        )}
      </div>

      <div className="flex items-start gap-3 sm:gap-4 overflow-x-auto no-scrollbar pb-1.5 pt-0.5 px-0.5">
        {CATEGORY_CIRCLES.map((cat) => {
          const isActive = selectedCategory === cat.id;
          const count = categoryCounts[cat.id] ?? 0;

          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => onSelectCategory(cat.id)}
              aria-pressed={isActive}
              className="group flex flex-col items-center shrink-0 min-w-[74px] max-w-[84px] text-center focus:outline-none cursor-pointer"
            >
              {/* Story Circle Ring */}
              <div
                className={`w-16 h-16 sm:w-[70px] sm:h-[70px] rounded-full p-[2.5px] transition-transform duration-150 group-active:scale-95 ${
                  isActive
                    ? 'bg-gradient-to-tr from-[#E11D48] via-[#FB7185] to-[#D97706] shadow-sm'
                    : 'bg-gradient-to-tr from-[#E8CFD6] to-[#F3E1E6] group-hover:from-[#FB7185] group-hover:to-[#FDE68A]'
                }`}
              >
                <div className="w-full h-full rounded-full bg-white p-[2px] overflow-hidden relative">
                  <ResilientImage
                    src={cat.image}
                    alt={cat.label}
                    className="w-full h-full rounded-full object-cover group-hover:scale-105 transition-transform duration-200"
                  />
                </div>
              </div>

              {/* Category Label */}
              <span
                className={`mt-1.5 text-[11px] leading-tight line-clamp-1 w-full transition-colors ${
                  isActive
                    ? 'font-bold text-[#E11D48]'
                    : 'font-medium text-[#2D1A20] group-hover:text-[#E11D48]'
                }`}
              >
                {cat.label}
              </span>
              <span className="text-[10px] text-[#7A5660] font-mono-num">
                {count} items
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
};

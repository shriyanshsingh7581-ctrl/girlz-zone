import React from 'react';
import { Heart, Plus, Minus, Star } from 'lucide-react';
import { Product } from '../types';
import { calculateDiscountPercent } from '../utils/storeLogic';
import { ResilientImage } from './ResilientImage';

interface ProductCardProps {
  product: Product;
  cartQuantity: number;
  isWishlisted: boolean;
  onToggleWishlist: (productId: string) => void;
  onUpdateCartQuantity: (productId: string, delta: number) => void;
  onOpenQuickView: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  cartQuantity,
  isWishlisted,
  onToggleWishlist,
  onUpdateCartQuantity,
  onOpenQuickView,
}) => {
  const discountPercent = calculateDiscountPercent(product.mrp, product.price);
  const tagLabel = product.isBestseller ? 'Bestseller' : product.tag;

  return (
    <article
      className="group bg-white rounded-2xl border border-[#EFE2E6] overflow-hidden flex flex-col justify-between transition-all duration-150 hover:-translate-y-0.5 hover:shadow-md"
      data-testid={`product-card-${product.id}`}
    >
      {/* Top Clickable Image & Metadata Area */}
      <div>
        <div className="relative aspect-[4/3] w-full bg-[#FFF9F6] overflow-hidden">
          <button
            type="button"
            onClick={() => onOpenQuickView(product)}
            aria-label={`View details for ${product.name}`}
            className="w-full h-full block text-left focus:outline-none cursor-pointer"
          >
            <ResilientImage
              src={product.image}
              alt={product.name}
              category={product.category}
              className={`w-full h-full object-cover transition-transform duration-200 group-hover:scale-103 ${
                !product.inStock ? 'opacity-50 grayscale' : ''
              }`}
            />
          </button>

          {/* Top Left Single Subtle Kicker Tag */}
          {(discountPercent > 0 || tagLabel) && (
            <div className="absolute top-2.5 left-2.5 pointer-events-none">
              <span className="bg-white/92 backdrop-blur-xs text-[#1F1216] text-[10px] font-medium px-2 py-0.5 rounded-md shadow-2xs inline-flex items-center gap-1">
                {discountPercent > 0 && (
                  <span className="font-mono-num font-bold text-[#E11D48]">
                    {discountPercent}% OFF
                  </span>
                )}
                {discountPercent > 0 && tagLabel && (
                  <span aria-hidden="true" className="text-[#8A6A72]">
                    ·
                  </span>
                )}
                {tagLabel && (
                  <span className="font-semibold text-[#9F1239]">
                    {tagLabel}
                  </span>
                )}
              </span>
            </div>
          )}

          {/* Top Right Wishlist Heart Toggle (44x44px hitbox) */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onToggleWishlist(product.id);
            }}
            aria-label={
              isWishlisted
                ? `Remove ${product.name} from wishlist`
                : `Add ${product.name} to wishlist`
            }
            aria-pressed={isWishlisted}
            className="absolute top-1.5 right-1.5 min-w-[40px] min-h-[40px] rounded-full flex items-center justify-center bg-white/85 backdrop-blur-xs hover:bg-white text-[#1F1216] shadow-2xs transition-transform active:scale-90 cursor-pointer"
          >
            <Heart
              className={`w-4 h-4 transition-colors ${
                isWishlisted
                  ? 'fill-[#E11D48] text-[#E11D48]'
                  : 'text-[#5C3A42]'
              }`}
            />
          </button>

          {/* Out of Stock Overlay */}
          {!product.inStock && (
            <div className="absolute inset-x-0 bottom-0 bg-[#1F1216]/85 text-white text-[11px] font-semibold text-center py-1">
              Out of Stock at Ambernath Store
            </div>
          )}
        </div>

        {/* Product Copy Block */}
        <div className="p-3 sm:p-3.5 pb-2">
          {/* Clean Unboxed Metadata Row */}
          <div className="flex items-center justify-between gap-1 text-[11px] text-[#7A5660] mb-1">
            <span className="truncate font-medium">{product.category}</span>
            <span className="inline-flex items-center gap-0.5 font-mono-num font-semibold text-[#1F1216] shrink-0">
              <Star className="w-3 h-3 fill-[#D97706] text-[#D97706]" />
              <span>{product.rating.toFixed(1)}</span>
            </span>
          </div>

          {/* Product Title */}
          <button
            type="button"
            onClick={() => onOpenQuickView(product)}
            className="text-left block w-full focus:outline-none cursor-pointer"
          >
            <h4 className="text-xs sm:text-sm font-semibold text-[#1F1216] line-clamp-2 leading-snug min-h-[2.5rem] group-hover:text-[#E11D48] transition-colors">
              {product.name}
            </h4>
          </button>
        </div>
      </div>

      {/* Bottom Price & Interactive Add to Bag Counter */}
      <div className="px-3 sm:px-3.5 pb-3 sm:pb-3.5 pt-1 flex flex-col gap-2.5">
        <div className="flex items-baseline gap-1.5 font-mono-num">
          <span className="text-sm sm:text-base font-bold text-[#1F1216]">
            ₹{product.price}
          </span>
          {product.mrp > product.price && (
            <span className="text-[11px] text-[#8A6A72] line-through">
              ₹{product.mrp}
            </span>
          )}
          {discountPercent > 0 && (
            <span className="text-[11px] font-semibold text-[#047857] ml-auto">
              Save ₹{product.mrp - product.price}
            </span>
          )}
        </div>

        {!product.inStock ? (
          <button
            type="button"
            disabled
            className="w-full min-h-[40px] rounded-xl bg-[#F3ECEE] text-[#8A6A72] text-xs font-semibold cursor-not-allowed"
          >
            Currently Out of Stock
          </button>
        ) : cartQuantity === 0 ? (
          <button
            type="button"
            onClick={() => onUpdateCartQuantity(product.id, 1)}
            aria-label={`Add ${product.name} to bag`}
            className="w-full min-h-[40px] py-2 px-3 rounded-xl bg-[#E11D48] hover:bg-[#BE123C] active:scale-[0.98] text-white font-semibold text-xs flex items-center justify-center gap-1.5 shadow-2xs transition-all whitespace-nowrap shrink-0 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Add to Bag</span>
          </button>
        ) : (
          <div
            className="w-full min-h-[40px] rounded-xl bg-[#FFF1F2] border border-[#FECDD3] flex items-center justify-between px-1.5"
            aria-label={`Quantity selector for ${product.name}`}
          >
            <button
              type="button"
              onClick={() => onUpdateCartQuantity(product.id, -1)}
              aria-label={`Decrease quantity of ${product.name}`}
              className="w-8 h-8 rounded-lg bg-white text-[#E11D48] hover:bg-[#FFE4E6] flex items-center justify-center shadow-2xs transition-colors cursor-pointer"
            >
              <Minus className="w-3.5 h-3.5 stroke-[2.5]" />
            </button>
            <span
              className="font-mono-num text-xs sm:text-sm font-bold text-[#9F1239]"
              data-testid={`qty-${product.id}`}
            >
              {cartQuantity} in Bag
            </span>
            <button
              type="button"
              onClick={() => onUpdateCartQuantity(product.id, 1)}
              aria-label={`Increase quantity of ${product.name}`}
              className="w-8 h-8 rounded-lg bg-[#E11D48] text-white hover:bg-[#BE123C] flex items-center justify-center shadow-2xs transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
            </button>
          </div>
        )}
      </div>
    </article>
  );
};

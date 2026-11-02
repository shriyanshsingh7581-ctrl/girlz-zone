import React, { useState, useEffect } from 'react';
import {
  X,
  Heart,
  Star,
  Plus,
  Minus,
  ShoppingBag,
  Zap,
  CheckCircle2,
  MapPin,
} from 'lucide-react';
import { Product } from '../types';
import { calculateDiscountPercent } from '../utils/storeLogic';
import { ResilientImage } from './ResilientImage';

interface ProductQuickViewModalProps {
  product: Product | null;
  cartQuantity: number;
  isWishlisted: boolean;
  onClose: () => void;
  onToggleWishlist: (productId: string) => void;
  onSetCartQuantity: (productId: string, newQuantity: number) => void;
  onBuyNow: (productId: string, quantity: number) => void;
}

export const ProductQuickViewModal: React.FC<ProductQuickViewModalProps> = ({
  product,
  cartQuantity,
  isWishlisted,
  onClose,
  onToggleWishlist,
  onSetCartQuantity,
  onBuyNow,
}) => {
  const [selectedQty, setSelectedQty] = useState<number>(1);

  useEffect(() => {
    if (product) {
      setSelectedQty(cartQuantity > 0 ? cartQuantity : 1);
    }
  }, [product, cartQuantity]);

  if (!product) return null;

  const discountPercent = calculateDiscountPercent(product.mrp, product.price);

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/55 backdrop-blur-xs p-0 sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="quick-view-title"
    >
      {/* Backdrop click to dismiss */}
      <div className="fixed inset-0" onClick={onClose} aria-hidden="true" />

      <div className="relative z-10 w-full max-w-lg bg-white rounded-t-3xl sm:rounded-3xl border border-[#EFE2E6] shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Grab Handle for Mobile Bottom Sheet */}
        <div className="w-10 h-1.5 bg-[#DFC8CF] rounded-full mx-auto mt-2.5 mb-1 sm:hidden" />

        {/* Top Bar inside Sheet */}
        <div className="px-5 py-3 flex items-center justify-between border-b border-[#F3E6EA]">
          <div className="flex items-center gap-2 text-xs text-[#7A5660]">
            <span className="font-semibold text-[#9F1239]">{product.category}</span>
            {product.shadeOrSize && (
              <>
                <span aria-hidden="true">·</span>
                <span>{product.shadeOrSize}</span>
              </>
            )}
          </div>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => onToggleWishlist(product.id)}
              aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
              className="w-9 h-9 rounded-full bg-[#FAF6F3] hover:bg-[#FFE4E6] flex items-center justify-center text-[#1F1216] transition-colors cursor-pointer"
            >
              <Heart
                className={`w-4 h-4 ${
                  isWishlisted ? 'fill-[#E11D48] text-[#E11D48]' : 'text-[#5C3A42]'
                }`}
              />
            </button>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close product quick view"
              className="w-9 h-9 rounded-full bg-[#FAF6F3] hover:bg-[#F3E6EA] flex items-center justify-center text-[#1F1216] transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Scrollable Sheet Body */}
        <div className="overflow-y-auto p-5 space-y-4">
          {/* Large Product Studio Image */}
          <div className="relative aspect-[4/3] w-full rounded-2xl overflow-hidden bg-[#FFF9F6] border border-[#F3E6EA]">
            <ResilientImage
              src={product.image}
              alt={product.name}
              category={product.category}
              className="w-full h-full object-cover"
            />
            {discountPercent > 0 && (
              <span className="absolute top-3 left-3 bg-[#1F1216]/90 text-white text-xs font-mono-num font-semibold px-2.5 py-1 rounded-lg">
                {discountPercent}% OFF
              </span>
            )}
          </div>

          {/* Title, Rating & Stock Status */}
          <div className="space-y-2">
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
              <span className="inline-flex items-center gap-1.5 font-medium text-[#047857]">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>
                  {product.inStock
                    ? 'In Stock at Ambernath Store'
                    : 'Out of Stock at Ambernath Store'}
                </span>
              </span>
              <span className="inline-flex items-center gap-1 font-mono-num text-[#1F1216] font-semibold">
                <Star className="w-3.5 h-3.5 fill-[#D97706] text-[#D97706]" />
                <span>{product.rating.toFixed(1)}</span>
                <span className="text-[#7A5660] font-normal">
                  ({product.reviewsCount} verified reviews)
                </span>
              </span>
            </div>

            <h3
              id="quick-view-title"
              className="font-serif-display text-lg sm:text-xl font-bold text-[#1F1216] leading-snug"
            >
              {product.name}
            </h3>

            {/* Price Row */}
            <div className="flex items-baseline gap-2.5 pt-1 font-mono-num">
              <span className="text-2xl font-bold text-[#E11D48]">
                ₹{product.price}
              </span>
              {product.mrp > product.price && (
                <span className="text-sm text-[#8A6A72] line-through">
                  MRP ₹{product.mrp}
                </span>
              )}
              {discountPercent > 0 && (
                <span className="text-xs font-semibold text-[#047857]">
                  (You save ₹{product.mrp - product.price})
                </span>
              )}
            </div>
          </div>

          {/* Description & Store Pickup Notice */}
          <div className="space-y-3 pt-1 border-t border-[#F3E6EA]">
            <p className="text-xs sm:text-sm text-[#4A2E35] leading-relaxed">
              {product.description}
            </p>

            {product.highlights && product.highlights.length > 0 && (
              <ul className="space-y-1.5 text-xs text-[#4A2E35]">
                {product.highlights.map((pt, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#E11D48] shrink-0" />
                    <span>{pt}</span>
                  </li>
                ))}
              </ul>
            )}

            <div className="p-3 rounded-xl bg-[#FAF6F3] border border-[#EFE2E6] flex items-center gap-2.5 text-xs text-[#5C3A42]">
              <MapPin className="w-4 h-4 text-[#E11D48] shrink-0" />
              <span>
                Same-day Express Delivery in Ambernath East &amp; West, or Instant
                Store Pickup at Girlz Zone Ambernath.
              </span>
            </div>
          </div>

          {/* Quantity Selector */}
          {product.inStock && (
            <div className="flex items-center justify-between pt-2 border-t border-[#F3E6EA]">
              <span className="text-xs font-semibold text-[#1F1216]">
                Select Quantity
              </span>
              <div className="inline-flex items-center gap-3 bg-[#FAF6F3] border border-[#E5D2D8] rounded-xl px-2 py-1">
                <button
                  type="button"
                  onClick={() => setSelectedQty((q) => Math.max(1, q - 1))}
                  aria-label="Decrease quantity"
                  className="w-8 h-8 rounded-lg bg-white text-[#1F1216] hover:bg-[#FFE4E6] flex items-center justify-center shadow-2xs cursor-pointer"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="font-mono-num text-sm font-bold min-w-[1.5rem] text-center">
                  {selectedQty}
                </span>
                <button
                  type="button"
                  onClick={() => setSelectedQty((q) => q + 1)}
                  aria-label="Increase quantity"
                  className="w-8 h-8 rounded-lg bg-white text-[#1F1216] hover:bg-[#FFE4E6] flex items-center justify-center shadow-2xs cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Sticky Bottom Action Bar: Add to Cart & Buy Now */}
        <div className="p-4 bg-white border-t border-[#EFE2E6] grid grid-cols-2 gap-3">
          <button
            type="button"
            disabled={!product.inStock}
            onClick={() => {
              onSetCartQuantity(product.id, selectedQty);
              onClose();
            }}
            className="min-h-[46px] px-4 py-2.5 rounded-xl border border-[#E11D48] bg-[#FFF1F2] hover:bg-[#FFE4E6] text-[#9F1239] font-semibold text-xs sm:text-sm inline-flex items-center justify-center gap-2 transition-colors disabled:opacity-50 cursor-pointer whitespace-nowrap"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Add to Cart ({selectedQty})</span>
          </button>

          <button
            type="button"
            disabled={!product.inStock}
            onClick={() => {
              onBuyNow(product.id, selectedQty);
            }}
            className="min-h-[46px] px-4 py-2.5 rounded-xl bg-[#E11D48] hover:bg-[#BE123C] text-white font-semibold text-xs sm:text-sm inline-flex items-center justify-center gap-2 shadow-sm transition-colors disabled:opacity-50 cursor-pointer whitespace-nowrap"
          >
            <Zap className="w-4 h-4" />
            <span>Buy Now · ₹{product.price * selectedQty}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

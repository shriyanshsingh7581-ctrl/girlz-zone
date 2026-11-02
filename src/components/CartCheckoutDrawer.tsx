import React, { useState } from 'react';
import {
  X,
  Plus,
  Minus,
  Trash2,
  Tag,
  ShoppingBag,
  CheckCircle2,
  MessageCircle,
  Sparkles,
  MapPin,
  CreditCard,
  Copy,
  ExternalLink,
} from 'lucide-react';
import {
  BillSummary,
  CartItem,
  DeliveryOption,
  Order,
  PaymentMethod,
  Product,
} from '../types';
import {
  buildWhatsAppOrderUrl,
  formatWhatsAppOrderMessage,
} from '../utils/storeLogic';
import { STORE_WHATSAPP_NUMBER } from '../data/initialData';
import { ResilientImage } from './ResilientImage';

interface CartCheckoutDrawerProps {
  isOpen: boolean;
  cart: CartItem[];
  products: Product[];
  couponCode: string;
  bill: BillSummary;
  onClose: () => void;
  onUpdateQuantity: (productId: string, delta: number) => void;
  onChangeCouponCode: (code: string) => void;
  onPlaceOrder: (orderData: {
    customerName: string;
    phone: string;
    deliveryOption: DeliveryOption;
    address: string;
    paymentMethod: PaymentMethod;
    orderSource: 'Online Instant' | 'WhatsApp Direct';
  }) => Order;
  onSwitchToAdmin: () => void;
}

export const CartCheckoutDrawer: React.FC<CartCheckoutDrawerProps> = ({
  isOpen,
  cart,
  products,
  couponCode,
  bill,
  onClose,
  onUpdateQuantity,
  onChangeCouponCode,
  onPlaceOrder,
  onSwitchToAdmin,
}) => {
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [deliveryOption, setDeliveryOption] = useState<DeliveryOption>(
    'Home Delivery in Ambernath'
  );
  const [address, setAddress] = useState('');
  const [paymentMethod, setPaymentMethod] =
    useState<PaymentMethod>('Cash on Delivery');
  const [formError, setFormError] = useState<string | null>(null);
  const [confirmedOrder, setConfirmedOrder] = useState<Order | null>(null);
  const [copiedWhatsAppText, setCopiedWhatsAppText] = useState(false);

  if (!isOpen) return null;

  const populatedItems = cart
    .map((item) => {
      const product = products.find((p) => p.id === item.productId);
      return product ? { product, quantity: item.quantity } : null;
    })
    .filter(
      (x): x is { product: Product; quantity: number } => x !== null
    );

  const validateAndSubmit = (
    orderSource: 'Online Instant' | 'WhatsApp Direct'
  ) => {
    if (populatedItems.length === 0) {
      setFormError('Your shopping bag is empty.');
      return;
    }
    if (!customerName.trim()) {
      setFormError('Please enter your full name.');
      return;
    }
    const cleanPhone = phone.replace(/[^0-9]/g, '');
    if (cleanPhone.length < 10) {
      setFormError('Please enter a valid 10-digit mobile number.');
      return;
    }
    const effectiveAddress =
      deliveryOption === 'Store Pickup - Girlz Zone Ambernath' && !address.trim()
        ? 'Store Pickup — Girlz Zone, Shivaji Chowk, Ambernath'
        : address.trim();

    if (!effectiveAddress) {
      setFormError('Please enter your delivery address in Ambernath.');
      return;
    }

    setFormError(null);
    const createdOrder = onPlaceOrder({
      customerName: customerName.trim(),
      phone: cleanPhone,
      deliveryOption,
      address: effectiveAddress,
      paymentMethod,
      orderSource,
    });

    setConfirmedOrder(createdOrder);
  };

  const handleResetAndClose = () => {
    setConfirmedOrder(null);
    setFormError(null);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-black/55 backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
      aria-labelledby="shopping-bag-title"
    >
      <div
        className="fixed inset-0"
        onClick={handleResetAndClose}
        aria-hidden="true"
      />

      <div className="relative z-10 w-full max-w-md bg-[#FAF6F3] h-full shadow-2xl flex flex-col justify-between overflow-hidden border-l border-[#EFE2E6]">
        {/* Top Drawer Header */}
        <div className="px-5 py-4 bg-white border-b border-[#EFE2E6] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#FFF1F2] text-[#E11D48] flex items-center justify-center">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h2
                id="shopping-bag-title"
                className="font-serif-display text-base font-bold text-[#1F1216]"
              >
                {confirmedOrder
                  ? `Order Confirmed · ${confirmedOrder.id}`
                  : 'Your Shopping Bag'}
              </h2>
              <p className="text-[11px] text-[#7A5660]">
                Girlz Zone Ambernath · Fast Local Dispatch
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleResetAndClose}
            aria-label="Close shopping bag"
            className="w-9 h-9 rounded-full bg-[#FAF6F3] hover:bg-[#F3E6EA] flex items-center justify-center text-[#1F1216] transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Drawer Body */}
        {confirmedOrder ? (
          /* Animated Order Confirmed View */
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            <div className="bg-white rounded-2xl border border-[#D1FAE5] p-5 text-center space-y-3 shadow-xs">
              <div className="w-14 h-14 rounded-full bg-[#ECFDF5] text-[#047857] mx-auto flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <span className="text-xs font-mono-num font-bold text-[#047857]">
                  ORDER ID: #{confirmedOrder.id}
                </span>
                <h3 className="font-serif-display text-xl font-bold text-[#1F1216]">
                  Thank You, {confirmedOrder.customerName}!
                </h3>
                <p className="text-xs text-[#5C3A42]">
                  Your order has been saved and synced straight to the{' '}
                  <strong>Girlz Zone Ambernath Admin Panel</strong>.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-[#FAF6F3] text-left text-xs space-y-1.5 border border-[#EFE2E6]">
                <div className="flex justify-between">
                  <span className="text-[#7A5660]">Phone:</span>
                  <span className="font-mono-num font-semibold text-[#1F1216]">
                    {confirmedOrder.phone}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#7A5660]">Delivery Mode:</span>
                  <span className="font-semibold text-[#1F1216]">
                    {confirmedOrder.deliveryOption}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#7A5660]">Payment Method:</span>
                  <span className="font-semibold text-[#1F1216]">
                    {confirmedOrder.paymentMethod}
                  </span>
                </div>
                <div className="flex justify-between pt-1 border-t border-[#E6D5DA]">
                  <span className="font-bold text-[#1F1216]">Grand Total:</span>
                  <span className="font-mono-num font-bold text-[#E11D48] text-sm">
                    ₹{confirmedOrder.grandTotal}
                  </span>
                </div>
              </div>

              {/* Direct WhatsApp Dispatch Card for +919324654685 */}
              <div className="p-3.5 rounded-xl bg-[#ECFDF5] border border-[#A7F3D0] text-left space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#065F46]">
                    WhatsApp Bill Ready ({STORE_WHATSAPP_NUMBER})
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard?.writeText(
                        formatWhatsAppOrderMessage(confirmedOrder)
                      );
                      setCopiedWhatsAppText(true);
                      setTimeout(() => setCopiedWhatsAppText(false), 2000);
                    }}
                    className="text-[11px] font-semibold text-[#047857] inline-flex items-center gap-1 hover:underline cursor-pointer"
                  >
                    <Copy className="w-3 h-3" />
                    <span>{copiedWhatsAppText ? 'Copied!' : 'Copy Bill'}</span>
                  </button>
                </div>

                <pre className="text-[10px] font-mono-num bg-white/90 p-2.5 rounded-lg border border-[#A7F3D0] text-[#1F1216] whitespace-pre-wrap max-h-36 overflow-y-auto">
                  {formatWhatsAppOrderMessage(confirmedOrder)}
                </pre>

                <a
                  href={buildWhatsAppOrderUrl(confirmedOrder)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full min-h-[42px] rounded-xl bg-[#059669] hover:bg-[#047857] text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-xs transition-colors"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Open WhatsApp (+91 93246 54685)</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row gap-2">
                <button
                  type="button"
                  onClick={() => {
                    handleResetAndClose();
                    onSwitchToAdmin();
                  }}
                  className="flex-1 min-h-[44px] px-4 py-2 rounded-xl bg-[#1F1216] hover:bg-[#352026] text-white text-xs font-semibold transition-colors cursor-pointer"
                >
                  View Order in Admin Panel
                </button>
                <button
                  type="button"
                  onClick={handleResetAndClose}
                  className="flex-1 min-h-[44px] px-4 py-2 rounded-xl border border-[#E5D2D8] bg-white hover:bg-[#FAF6F3] text-[#1F1216] text-xs font-semibold transition-colors cursor-pointer"
                >
                  Continue Shopping
                </button>
              </div>
            </div>
          </div>
        ) : populatedItems.length === 0 ? (
          /* Empty Bag State */
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-3">
            <div className="w-16 h-16 rounded-2xl bg-white border border-[#EFE2E6] flex items-center justify-center text-[#E11D48] shadow-2xs">
              <ShoppingBag className="w-8 h-8 stroke-[1.75]" />
            </div>
            <h3 className="font-serif-display text-lg font-bold text-[#1F1216]">
              Your Girlz Zone Bag is Empty
            </h3>
            <p className="text-xs text-[#7A5660] max-w-xs leading-relaxed">
              Explore our Makeup, 24K Gold Skincare, Luxury Perfumes, Bridal
              Clutches, and Kundan Jewellery to add items to your bag.
            </p>
            <button
              type="button"
              onClick={onClose}
              className="mt-2 min-h-[44px] px-5 py-2.5 rounded-xl bg-[#E11D48] text-white text-xs font-semibold hover:bg-[#BE123C] transition-colors cursor-pointer"
            >
              Browse Bestsellers
            </button>
          </div>
        ) : (
          /* Populated Bag + Coupon + Bill Summary + Checkout Form */
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
            {/* Free Delivery Banner */}
            <div className="p-3 rounded-xl bg-white border border-[#EFE2E6] flex items-center justify-between text-xs">
              <span className="text-[#4A2E35] font-medium">
                {bill.deliveryFee === 0 ? (
                  <>
                    <strong className="text-[#047857]">FREE Delivery</strong>{' '}
                    unlocked on your order!
                  </>
                ) : (
                  <>
                    Add{' '}
                    <strong className="font-mono-num text-[#E11D48]">
                      ₹{Math.max(0, 499 - (bill.itemTotal - bill.couponDiscount))}
                    </strong>{' '}
                    more for FREE Ambernath Home Delivery
                  </>
                )}
              </span>
              <span className="font-mono-num text-[11px] font-semibold text-[#9F1239]">
                {populatedItems.length}{' '}
                {populatedItems.length === 1 ? 'item' : 'items'}
              </span>
            </div>

            {/* Cart Items List */}
            <div className="space-y-2.5">
              {populatedItems.map(({ product, quantity }) => (
                <div
                  key={product.id}
                  className="p-3 rounded-2xl bg-white border border-[#EFE2E6] flex items-center gap-3"
                >
                  <div className="w-16 h-16 rounded-xl overflow-hidden bg-[#FFF9F6] border border-[#F3E6EA] shrink-0">
                    <ResilientImage
                      src={product.image}
                      alt={product.name}
                      category={product.category}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] text-[#7A5660] font-medium">
                      {product.category}
                    </p>
                    <h4 className="text-xs font-semibold text-[#1F1216] truncate">
                      {product.name}
                    </h4>
                    <div className="mt-1 flex items-baseline gap-1.5 font-mono-num">
                      <span className="text-xs font-bold text-[#E11D48]">
                        ₹{product.price * quantity}
                      </span>
                      <span className="text-[10px] text-[#8A6A72] line-through">
                        ₹{product.mrp * quantity}
                      </span>
                    </div>
                  </div>

                  {/* Quantity +/- Controls */}
                  <div className="flex items-center gap-1.5 bg-[#FAF6F3] border border-[#E5D2D8] rounded-xl p-1 shrink-0">
                    <button
                      type="button"
                      onClick={() => onUpdateQuantity(product.id, -1)}
                      aria-label={`Decrease quantity of ${product.name}`}
                      className="w-7 h-7 rounded-lg bg-white text-[#1F1216] hover:text-[#E11D48] flex items-center justify-center shadow-2xs cursor-pointer"
                    >
                      {quantity === 1 ? (
                        <Trash2 className="w-3.5 h-3.5 text-[#E11D48]" />
                      ) : (
                        <Minus className="w-3.5 h-3.5" />
                      )}
                    </button>
                    <span className="font-mono-num text-xs font-bold w-5 text-center">
                      {quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => onUpdateQuantity(product.id, 1)}
                      aria-label={`Increase quantity of ${product.name}`}
                      className="w-7 h-7 rounded-lg bg-[#E11D48] text-white flex items-center justify-center shadow-2xs cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Coupon Code Box */}
            <div className="p-3.5 rounded-2xl bg-white border border-[#EFE2E6] space-y-2.5">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="coupon-input"
                  className="text-xs font-semibold text-[#1F1216] flex items-center gap-1.5"
                >
                  <Tag className="w-3.5 h-3.5 text-[#E11D48]" />
                  <span>Apply Promo / Coupon Code</span>
                </label>
                <button
                  type="button"
                  onClick={() => onChangeCouponCode('GIRLZ10')}
                  className="text-[11px] font-mono-num font-semibold text-[#E11D48] hover:underline cursor-pointer"
                >
                  Tap to apply GIRLZ10 (10% OFF)
                </button>
              </div>

              <div className="flex items-center gap-2">
                <input
                  id="coupon-input"
                  type="text"
                  value={couponCode}
                  onChange={(e) => onChangeCouponCode(e.target.value)}
                  placeholder="Enter code (e.g. GIRLZ10)"
                  className="flex-1 h-10 px-3 rounded-xl bg-[#FAF6F3] border border-[#E5D2D8] text-xs font-mono-num uppercase text-[#1F1216] focus:outline-none focus:border-[#E11D48]"
                />
                {bill.appliedCoupon && (
                  <span className="text-xs font-semibold text-[#047857] shrink-0">
                    ✓ {bill.appliedCoupon} (-₹{bill.couponDiscount})
                  </span>
                )}
              </div>
            </div>

            {/* Full Bill Summary */}
            <div className="p-4 rounded-2xl bg-white border border-[#EFE2E6] space-y-2 text-xs">
              <h3 className="font-semibold text-[#1F1216] pb-1 border-b border-[#F3E6EA]">
                Bill Summary
              </h3>
              <div className="flex justify-between text-[#5C3A42]">
                <span>Item Total (MRP ₹{bill.mrpTotal})</span>
                <span className="font-mono-num font-semibold text-[#1F1216]">
                  ₹{bill.itemTotal}
                </span>
              </div>
              {bill.couponDiscount > 0 && (
                <div className="flex justify-between text-[#047857]">
                  <span>Coupon Discount ({bill.appliedCoupon})</span>
                  <span className="font-mono-num font-semibold">
                    -₹{bill.couponDiscount}
                  </span>
                </div>
              )}
              <div className="flex justify-between text-[#5C3A42]">
                <span>Delivery Fee ({deliveryOption.split(' - ')[0]})</span>
                <span className="font-mono-num font-semibold text-[#047857]">
                  {bill.deliveryFee === 0 ? 'FREE' : `₹${bill.deliveryFee}`}
                </span>
              </div>
              <div className="pt-2 border-t border-[#EFE2E6] flex justify-between items-baseline">
                <span className="text-sm font-bold text-[#1F1216]">
                  Grand Total
                </span>
                <span
                  className="font-mono-num text-base font-bold text-[#E11D48]"
                  data-testid="checkout-grand-total"
                >
                  ₹{bill.grandTotal}
                </span>
              </div>
              {bill.totalSavings > 0 && (
                <p className="text-[11px] font-medium text-[#047857] pt-0.5">
                  You save ₹{bill.totalSavings} on this order at Girlz Zone!
                </p>
              )}
            </div>

            {/* Checkout Customer Details Form */}
            <div className="p-4 rounded-2xl bg-white border border-[#EFE2E6] space-y-3">
              <h3 className="text-xs font-semibold text-[#1F1216] flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#E11D48]" />
                <span>Customer &amp; Delivery Details</span>
              </h3>

              {formError && (
                <div
                  role="alert"
                  className="p-2.5 rounded-xl bg-[#FFF1F2] border border-[#FECDD3] text-xs font-medium text-[#be123c]"
                >
                  {formError}
                </div>
              )}

              <div>
                <label
                  htmlFor="checkout-name"
                  className="block text-[11px] font-medium text-[#5C3A42] mb-1"
                >
                  Customer Full Name *
                </label>
                <input
                  id="checkout-name"
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="e.g., Anjali Patil"
                  className="w-full h-10 px-3 rounded-xl bg-[#FAF6F3] border border-[#E5D2D8] text-xs text-[#1F1216] focus:outline-none focus:border-[#E11D48]"
                />
              </div>

              <div>
                <label
                  htmlFor="checkout-phone"
                  className="block text-[11px] font-medium text-[#5C3A42] mb-1"
                >
                  WhatsApp / Mobile Number *
                </label>
                <input
                  id="checkout-phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="10-digit mobile number (e.g. 9820123456)"
                  className="w-full h-10 px-3 rounded-xl bg-[#FAF6F3] border border-[#E5D2D8] text-xs font-mono-num text-[#1F1216] focus:outline-none focus:border-[#E11D48]"
                />
              </div>

              <div>
                <label
                  htmlFor="checkout-delivery-option"
                  className="block text-[11px] font-medium text-[#5C3A42] mb-1"
                >
                  Delivery Option *
                </label>
                <select
                  id="checkout-delivery-option"
                  value={deliveryOption}
                  onChange={(e) =>
                    setDeliveryOption(e.target.value as DeliveryOption)
                  }
                  className="w-full h-10 px-3 rounded-xl bg-[#FAF6F3] border border-[#E5D2D8] text-xs text-[#1F1216] focus:outline-none focus:border-[#E11D48]"
                >
                  <option value="Home Delivery in Ambernath">
                    Home Delivery in Ambernath (East &amp; West)
                  </option>
                  <option value="Store Pickup - Girlz Zone Ambernath">
                    Store Pickup - Girlz Zone Ambernath
                  </option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="checkout-address"
                  className="block text-[11px] font-medium text-[#5C3A42] mb-1"
                >
                  Full Delivery Address / Pickup Note *
                </label>
                <textarea
                  id="checkout-address"
                  rows={2}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder={
                    deliveryOption === 'Store Pickup - Girlz Zone Ambernath'
                      ? 'Optional pickup time note (or leave default for Shivaji Chowk store)'
                      : 'Flat / Building, Landmark, Ambernath East or West - 421501'
                  }
                  className="w-full p-2.5 rounded-xl bg-[#FAF6F3] border border-[#E5D2D8] text-xs text-[#1F1216] focus:outline-none focus:border-[#E11D48]"
                />
              </div>

              <div>
                <span className="block text-[11px] font-medium text-[#5C3A42] mb-1.5">
                  Payment Method *
                </span>
                <div className="grid grid-cols-3 gap-2">
                  {(
                    [
                      'Cash on Delivery',
                      'UPI / GPay',
                      'Pay at Store',
                    ] as PaymentMethod[]
                  ).map((method) => (
                    <button
                      key={method}
                      type="button"
                      onClick={() => setPaymentMethod(method)}
                      aria-pressed={paymentMethod === method}
                      className={`min-h-[38px] px-2 py-1.5 rounded-xl text-[11px] font-semibold border transition-colors cursor-pointer ${
                        paymentMethod === method
                          ? 'bg-[#FFF1F2] border-[#E11D48] text-[#9F1239]'
                          : 'bg-[#FAF6F3] border-[#E5D2D8] text-[#5C3A42] hover:text-[#1F1216]'
                      }`}
                    >
                      {method}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Sticky Bottom Dual Order Buttons */}
        {!confirmedOrder && populatedItems.length > 0 && (
          <div className="p-4 bg-white border-t border-[#EFE2E6] space-y-2.5 shrink-0">
            <button
              type="button"
              onClick={() => validateAndSubmit('WhatsApp Direct')}
              className="w-full min-h-[44px] px-4 py-2.5 rounded-xl bg-[#059669] hover:bg-[#047857] text-white font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer"
            >
              <MessageCircle className="w-4 h-4 shrink-0" />
              <span>Place Order on WhatsApp (+91 93246 54685)</span>
            </button>

            <button
              type="button"
              onClick={() => validateAndSubmit('Online Instant')}
              className="w-full min-h-[44px] px-4 py-2.5 rounded-xl bg-[#E11D48] hover:bg-[#BE123C] text-white font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm transition-colors cursor-pointer"
            >
              <Sparkles className="w-4 h-4 shrink-0" />
              <span>Confirm Instant Online Order · ₹{bill.grandTotal}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

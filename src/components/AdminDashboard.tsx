import React, { useState } from 'react';
import {
  Lock,
  Delete,
  Package,
  IndianRupee,
  ShoppingBag,
  Truck,
  PhoneCall,
  MessageCircle,
  Plus,
  Trash2,
  Edit3,
  Check,
  LogOut,
  Upload,
} from 'lucide-react';
import {
  Order,
  OrderStatus,
  Product,
  StrictProductCategory,
} from '../types';
import {
  buildWhatsAppOrderUrl,
  calculateAdminMetrics,
  STRICT_CATEGORIES,
  verifyAdminPin,
} from '../utils/storeLogic';
import { getFallbackSvgForCategory } from '../utils/artwork';
import { ResilientImage } from './ResilientImage';

interface AdminDashboardProps {
  isUnlocked: boolean;
  orders: Order[];
  products: Product[];
  onUnlockSuccess: () => void;
  onLockAdmin: () => void;
  onUpdateOrderStatus: (orderId: string, status: OrderStatus) => void;
  onAddProduct: (newProduct: Omit<Product, 'id'>) => void;
  onUpdateProduct: (productId: string, patch: Partial<Product>) => void;
  onDeleteProduct: (productId: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  isUnlocked,
  orders,
  products,
  onUnlockSuccess,
  onLockAdmin,
  onUpdateOrderStatus,
  onAddProduct,
  onUpdateProduct,
  onDeleteProduct,
}) => {
  const [pinBuffer, setPinBuffer] = useState('');
  const [pinError, setPinError] = useState(false);
  const [activeAdminTab, setActiveAdminTab] = useState<'orders' | 'inventory'>(
    'orders'
  );
  const [actionFeedback, setActionFeedback] = useState<string | null>(null);

  // New Product Form State
  const [prodName, setProdName] = useState('');
  const [prodCategory, setProdCategory] =
    useState<StrictProductCategory>('Makeup');
  const [prodMrp, setProdMrp] = useState('699');
  const [prodPrice, setProdPrice] = useState('449');
  const [prodImageUrl, setProdImageUrl] = useState('');
  const [prodBestseller, setProdBestseller] = useState(true);
  const [prodFormError, setProdFormError] = useState<string | null>(null);

  // Inline Price Editing State
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [editingPriceValue, setEditingPriceValue] = useState<string>('');

  const triggerToast = (msg: string) => {
    setActionFeedback(msg);
    setTimeout(() => setActionFeedback(null), 3200);
  };

  const handleDigitPress = (digit: string) => {
    setPinError(false);
    const nextPin = (pinBuffer + digit).slice(0, 4);
    setPinBuffer(nextPin);

    if (nextPin.length === 4) {
      if (verifyAdminPin(nextPin)) {
        setPinBuffer('');
        onUnlockSuccess();
      } else {
        setPinError(true);
        setTimeout(() => setPinBuffer(''), 450);
      }
    }
  };

  const handleBackspace = () => {
    setPinError(false);
    setPinBuffer((prev) => prev.slice(0, -1));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setProdImageUrl(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prodName.trim()) {
      setProdFormError('Please enter a product name.');
      return;
    }
    const mrpNum = Number(prodMrp);
    const priceNum = Number(prodPrice);
    if (!mrpNum || !priceNum || priceNum <= 0 || mrpNum < priceNum) {
      setProdFormError(
        'Please enter valid prices (MRP must be greater than or equal to Selling Price).'
      );
      return;
    }

    setProdFormError(null);
    const finalImage =
      prodImageUrl.trim() ||
      getFallbackSvgForCategory(prodCategory, prodName.trim());

    onAddProduct({
      name: prodName.trim(),
      category: prodCategory,
      mrp: mrpNum,
      price: priceNum,
      rating: 4.9,
      reviewsCount: 18,
      image: finalImage,
      tag: prodBestseller ? 'Bestseller' : 'New',
      isBestseller: prodBestseller,
      inStock: true,
      shadeOrSize: 'In Stock · Ambernath Exclusive',
      description: `Authentic ${prodName.trim()} available at Girlz Zone Ambernath with fast local home delivery and store pickup.`,
      highlights: [
        '100% Quality Checked at Girlz Zone Ambernath',
        'Available for same-day local delivery',
      ],
    });

    setProdName('');
    setProdMrp('699');
    setProdPrice('449');
    setProdImageUrl('');
    triggerToast(`Added "${prodName.trim()}" to live store catalog!`);
  };

  // PIN Lock Screen
  if (!isUnlocked) {
    return (
      <section
        aria-label="Store Admin PIN Login"
        className="max-w-md mx-auto my-4 bg-white rounded-3xl border border-[#EFE2E6] p-6 shadow-sm text-center space-y-5"
      >
        <div className="w-12 h-12 rounded-2xl bg-[#FFF1F2] text-[#E11D48] mx-auto flex items-center justify-center">
          <Lock className="w-6 h-6" />
        </div>

        <div className="space-y-1">
          <h2 className="font-serif-display text-xl font-bold text-[#1F1216]">
            Store Admin Dashboard
          </h2>
          <p className="text-xs text-[#7A5660]">
            Girlz Zone Ambernath · Owner Access Only
          </p>
          <p className="text-xs font-mono-num font-semibold text-[#E11D48] pt-1">
            Demo PIN: 7777
          </p>
        </div>

        {/* 4-Digit PIN Boxes */}
        <div className="flex items-center justify-center gap-3 py-1">
          {[0, 1, 2, 3].map((slot) => {
            const filled = pinBuffer.length > slot;
            return (
              <div
                key={slot}
                className={`w-12 h-12 rounded-2xl border-2 flex items-center justify-center font-mono-num text-lg font-bold transition-all ${
                  pinError
                    ? 'border-[#E11D48] bg-[#FFF1F2] text-[#E11D48]'
                    : filled
                    ? 'border-[#E11D48] bg-[#FAF6F3] text-[#1F1216]'
                    : 'border-[#E5D2D8] bg-[#FAF6F3] text-[#8A6A72]'
                }`}
              >
                {filled ? '•' : ''}
              </div>
            );
          })}
        </div>

        {pinError && (
          <p role="alert" className="text-xs font-semibold text-[#E11D48]">
            Incorrect PIN. Please enter Demo PIN 7777.
          </p>
        )}

        {/* Numeric Keypad */}
        <div className="grid grid-cols-3 gap-2.5 max-w-[260px] mx-auto">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
            <button
              key={digit}
              type="button"
              onClick={() => handleDigitPress(digit)}
              aria-label={`PIN digit ${digit}`}
              className="h-12 rounded-2xl bg-[#FAF6F3] hover:bg-[#FFE4E6] active:scale-95 text-[#1F1216] font-mono-num text-base font-bold border border-[#EFE2E6] transition-all cursor-pointer"
            >
              {digit}
            </button>
          ))}

          <button
            type="button"
            onClick={() => {
              setPinBuffer('');
              onUnlockSuccess();
            }}
            className="h-12 rounded-2xl bg-[#FFF1F2] hover:bg-[#FFE4E6] text-[#E11D48] text-[11px] font-bold border border-[#FECDD3] transition-colors cursor-pointer"
          >
            Auto 7777
          </button>

          <button
            type="button"
            onClick={() => handleDigitPress('0')}
            aria-label="PIN digit 0"
            className="h-12 rounded-2xl bg-[#FAF6F3] hover:bg-[#FFE4E6] active:scale-95 text-[#1F1216] font-mono-num text-base font-bold border border-[#EFE2E6] transition-all cursor-pointer"
          >
            0
          </button>

          <button
            type="button"
            onClick={handleBackspace}
            aria-label="Backspace PIN digit"
            className="h-12 rounded-2xl bg-[#FAF6F3] hover:bg-[#F3E6EA] text-[#5C3A42] flex items-center justify-center border border-[#EFE2E6] transition-colors cursor-pointer"
          >
            <Delete className="w-4 h-4" />
          </button>
        </div>
      </section>
    );
  }

  const metrics = calculateAdminMetrics(orders, products);

  return (
    <section aria-label="Store Admin Dashboard" className="space-y-5 pb-6">
      {/* Top Admin Header Bar */}
      <div className="bg-white rounded-2xl border border-[#EFE2E6] p-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 text-xs text-[#7A5660]">
            <span className="font-semibold text-[#E11D48]">
              ADMIN PORTAL · PIN 7777 VERIFIED
            </span>
            <span aria-hidden="true">·</span>
            <span>Ambernath Store</span>
          </div>
          <h2 className="font-serif-display text-lg sm:text-xl font-bold text-[#1F1216]">
            Girlz Zone Retail Command Center
          </h2>
        </div>

        <button
          type="button"
          onClick={onLockAdmin}
          className="min-h-[40px] px-3.5 py-2 rounded-xl border border-[#E5D2D8] bg-[#FAF6F3] hover:bg-[#FFE4E6] text-xs font-semibold text-[#1F1216] inline-flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Lock Admin</span>
        </button>
      </div>

      {actionFeedback && (
        <div
          role="status"
          className="p-3 rounded-xl bg-[#ECFDF5] border border-[#A7F3D0] text-xs font-semibold text-[#065F46] flex items-center justify-between"
        >
          <span>{actionFeedback}</span>
        </div>
      )}

      {/* 4 Summary Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-white rounded-2xl border border-[#EFE2E6] p-4 space-y-1">
          <div className="flex items-center justify-between text-xs text-[#7A5660]">
            <span>Total Orders</span>
            <ShoppingBag className="w-4 h-4 text-[#E11D48]" />
          </div>
          <p
            className="font-mono-num text-2xl font-bold text-[#1F1216]"
            data-testid="admin-total-orders"
          >
            {metrics.totalOrders}
          </p>
          <p className="text-[11px] text-[#7A5660]">Live localStorage sync</p>
        </div>

        <div className="bg-white rounded-2xl border border-[#EFE2E6] p-4 space-y-1">
          <div className="flex items-center justify-between text-xs text-[#7A5660]">
            <span>Today&apos;s Revenue (₹)</span>
            <IndianRupee className="w-4 h-4 text-[#047857]" />
          </div>
          <p
            className="font-mono-num text-2xl font-bold text-[#047857]"
            data-testid="admin-total-revenue"
          >
            ₹{metrics.todaysRevenue.toLocaleString('en-IN')}
          </p>
          <p className="text-[11px] text-[#7A5660]">Online + WhatsApp bills</p>
        </div>

        <div className="bg-white rounded-2xl border border-[#EFE2E6] p-4 space-y-1">
          <div className="flex items-center justify-between text-xs text-[#7A5660]">
            <span>Total Products</span>
            <Package className="w-4 h-4 text-[#D97706]" />
          </div>
          <p
            className="font-mono-num text-2xl font-bold text-[#1F1216]"
            data-testid="admin-total-products"
          >
            {metrics.totalProducts}
          </p>
          <p className="text-[11px] text-[#7A5660]">
            {products.filter((p) => p.inStock).length} in stock right now
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-[#EFE2E6] p-4 space-y-1">
          <div className="flex items-center justify-between text-xs text-[#7A5660]">
            <span>Pending Deliveries</span>
            <Truck className="w-4 h-4 text-[#9F1239]" />
          </div>
          <p
            className="font-mono-num text-2xl font-bold text-[#E11D48]"
            data-testid="admin-pending-deliveries"
          >
            {metrics.pendingDeliveries}
          </p>
          <p className="text-[11px] text-[#7A5660]">Awaiting completion</p>
        </div>
      </div>

      {/* Segmented Tab Switcher: Tab 1 (Live Orders) vs Tab 2 (Inventory & Product Manager) */}
      <div className="grid grid-cols-2 gap-1.5 p-1.5 bg-white rounded-2xl border border-[#EFE2E6]">
        <button
          type="button"
          onClick={() => setActiveAdminTab('orders')}
          aria-pressed={activeAdminTab === 'orders'}
          className={`min-h-[42px] px-2 sm:px-4 py-2 rounded-xl text-[11px] sm:text-xs font-semibold transition-all cursor-pointer truncate ${
            activeAdminTab === 'orders'
              ? 'bg-[#E11D48] text-white shadow-xs'
              : 'text-[#5C3A42] hover:text-[#1F1216]'
          }`}
        >
          Live Orders Management ({orders.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveAdminTab('inventory')}
          aria-pressed={activeAdminTab === 'inventory'}
          className={`min-h-[42px] px-2 sm:px-4 py-2 rounded-xl text-[11px] sm:text-xs font-semibold transition-all cursor-pointer truncate ${
            activeAdminTab === 'inventory'
              ? 'bg-[#E11D48] text-white shadow-xs'
              : 'text-[#5C3A42] hover:text-[#1F1216]'
          }`}
        >
          Inventory &amp; Product Manager ({products.length})
        </button>
      </div>

      {/* TAB 1: LIVE ORDERS MANAGEMENT */}
      {activeAdminTab === 'orders' ? (
        <div className="space-y-3">
          {orders.map((order) => (
            <article
              key={order.id}
              className="bg-white rounded-2xl border border-[#EFE2E6] p-4 space-y-3"
              data-testid={`admin-order-${order.id}`}
            >
              <div className="flex flex-wrap items-start justify-between gap-2 border-b border-[#F3E6EA] pb-3">
                <div>
                  <div className="flex items-center gap-2 text-xs">
                    <span className="font-mono-num font-bold text-[#E11D48]">
                      #{order.id}
                    </span>
                    <span aria-hidden="true" className="text-[#8A6A72]">
                      ·
                    </span>
                    <span className="font-semibold text-[#1F1216]">
                      {order.customerName}
                    </span>
                    <span aria-hidden="true" className="text-[#8A6A72]">
                      ·
                    </span>
                    <span className="text-[#7A5660]">{order.createdAt}</span>
                  </div>
                  <p className="text-xs text-[#5C3A42] mt-1">
                    {order.deliveryOption} — {order.address}
                  </p>
                </div>

                <div className="text-right font-mono-num">
                  <span className="text-base font-bold text-[#1F1216]">
                    ₹{order.grandTotal}
                  </span>
                  <p className="text-[11px] font-sans text-[#7A5660]">
                    {order.paymentMethod} · Status: <strong>{order.status}</strong>
                  </p>
                </div>
              </div>

              {/* Ordered Items List */}
              <div className="space-y-1.5">
                <p className="text-[11px] font-semibold text-[#7A5660]">
                  Ordered Items ({order.items.reduce((s, i) => s + i.quantity, 0)}):
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {order.items.map((item, idx) => (
                    <div
                      key={`${order.id}-${idx}`}
                      className="flex items-center gap-2.5 p-2 rounded-xl bg-[#FAF6F3] border border-[#EFE2E6] text-xs"
                    >
                      <div className="w-10 h-10 rounded-lg overflow-hidden bg-white shrink-0">
                        <ResilientImage
                          src={item.image}
                          alt={item.name}
                          category={item.category}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-semibold text-[#1F1216] truncate">
                          {item.name}
                        </p>
                        <p className="font-mono-num text-[11px] text-[#7A5660]">
                          Qty: {item.quantity} × ₹{item.price} = ₹
                          {item.quantity * item.price}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 1-Click Actions: Call Customer, WhatsApp Bill & Change Order Status */}
              <div className="pt-2 border-t border-[#F3E6EA] flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap items-center gap-2">
                  <a
                    href={`tel:${order.phone}`}
                    onClick={() =>
                      triggerToast(
                        `Dialing ${order.customerName} (+91 ${order.phone})...`
                      )
                    }
                    className="min-h-[38px] px-3 py-1.5 rounded-xl bg-[#FAF6F3] hover:bg-[#FFE4E6] border border-[#E5D2D8] text-xs font-semibold text-[#1F1216] inline-flex items-center gap-1.5 transition-colors"
                  >
                    <PhoneCall className="w-3.5 h-3.5 text-[#E11D48]" />
                    <span>Call Customer ({order.phone})</span>
                  </a>

                  <a
                    href={buildWhatsAppOrderUrl(order, `91${order.phone}`)}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() =>
                      triggerToast(
                        `Prepared WhatsApp Bill for ${order.customerName} (#${order.id})`
                      )
                    }
                    className="min-h-[38px] px-3 py-1.5 rounded-xl bg-[#ECFDF5] hover:bg-[#D1FAE5] border border-[#A7F3D0] text-xs font-semibold text-[#065F46] inline-flex items-center gap-1.5 transition-colors"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>WhatsApp Bill</span>
                  </a>
                </div>

                {/* Status Selector Buttons */}
                <div className="flex flex-wrap items-center gap-1.5">
                  {(
                    [
                      'New',
                      'Packed',
                      'Out for Delivery',
                      'Completed',
                    ] as OrderStatus[]
                  ).map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => {
                        onUpdateOrderStatus(order.id, st);
                        triggerToast(`Order #${order.id} marked as "${st}"`);
                      }}
                      aria-pressed={order.status === st}
                      className={`min-h-[34px] px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-colors cursor-pointer ${
                        order.status === st
                          ? 'bg-[#1F1216] text-white'
                          : 'bg-[#FAF6F3] text-[#5C3A42] hover:bg-[#F3E6EA]'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>
      ) : (
        /* TAB 2: INVENTORY & PRODUCT MANAGER */
        <div className="space-y-5">
          {/* + Add New Product Form */}
          <form
            onSubmit={handleCreateProduct}
            className="bg-white rounded-2xl border border-[#EFE2E6] p-4 sm:p-5 space-y-4"
          >
            <div className="flex items-center justify-between border-b border-[#F3E6EA] pb-2.5">
              <h3 className="font-serif-display text-base font-bold text-[#1F1216] flex items-center gap-2">
                <Plus className="w-4 h-4 text-[#E11D48]" />
                <span>Add New Product to Storefront</span>
              </h3>
              <span className="text-[11px] text-[#7A5660]">
                Syncs instantly to Customer View
              </span>
            </div>

            {prodFormError && (
              <div
                role="alert"
                className="p-2.5 rounded-xl bg-[#FFF1F2] border border-[#FECDD3] text-xs font-medium text-[#BE123C]"
              >
                {prodFormError}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label
                  htmlFor="new-prod-name"
                  className="block text-[11px] font-medium text-[#5C3A42] mb-1"
                >
                  Product Name *
                </label>
                <input
                  id="new-prod-name"
                  type="text"
                  value={prodName}
                  onChange={(e) => setProdName(e.target.value)}
                  placeholder="e.g. Bridal Rose Gold Highlighter Palette"
                  className="w-full h-10 px-3 rounded-xl bg-[#FAF6F3] border border-[#E5D2D8] text-xs text-[#1F1216] focus:outline-none focus:border-[#E11D48]"
                />
              </div>

              <div>
                <label
                  htmlFor="new-prod-category"
                  className="block text-[11px] font-medium text-[#5C3A42] mb-1"
                >
                  Category (7 Store Categories) *
                </label>
                <select
                  id="new-prod-category"
                  value={prodCategory}
                  onChange={(e) =>
                    setProdCategory(e.target.value as StrictProductCategory)
                  }
                  className="w-full h-10 px-3 rounded-xl bg-[#FAF6F3] border border-[#E5D2D8] text-xs text-[#1F1216] focus:outline-none focus:border-[#E11D48]"
                >
                  {STRICT_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="new-prod-mrp"
                  className="block text-[11px] font-medium text-[#5C3A42] mb-1"
                >
                  MRP Price (₹) *
                </label>
                <input
                  id="new-prod-mrp"
                  type="number"
                  min={1}
                  value={prodMrp}
                  onChange={(e) => setProdMrp(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl bg-[#FAF6F3] border border-[#E5D2D8] text-xs font-mono-num text-[#1F1216] focus:outline-none focus:border-[#E11D48]"
                />
              </div>

              <div>
                <label
                  htmlFor="new-prod-price"
                  className="block text-[11px] font-medium text-[#5C3A42] mb-1"
                >
                  Selling Price (₹) *
                </label>
                <input
                  id="new-prod-price"
                  type="number"
                  min={1}
                  value={prodPrice}
                  onChange={(e) => setProdPrice(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl bg-[#FAF6F3] border border-[#E5D2D8] text-xs font-mono-num text-[#1F1216] focus:outline-none focus:border-[#E11D48]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end">
              <div className="sm:col-span-6">
                <label
                  htmlFor="new-prod-img"
                  className="block text-[11px] font-medium text-[#5C3A42] mb-1"
                >
                  Image URL (Optional — Auto Studio Artwork if blank)
                </label>
                <input
                  id="new-prod-img"
                  type="text"
                  value={prodImageUrl}
                  onChange={(e) => setProdImageUrl(e.target.value)}
                  placeholder="Paste image URL or upload photo ->"
                  className="w-full h-10 px-3 rounded-xl bg-[#FAF6F3] border border-[#E5D2D8] text-xs text-[#1F1216] focus:outline-none focus:border-[#E11D48]"
                />
              </div>

              <div className="sm:col-span-3">
                <label className="w-full h-10 px-3 rounded-xl bg-[#FAF6F3] hover:bg-[#FFE4E6] border border-[#E5D2D8] text-xs font-semibold text-[#1F1216] flex items-center justify-center gap-1.5 cursor-pointer transition-colors">
                  <Upload className="w-3.5 h-3.5 text-[#E11D48]" />
                  <span>Upload Photo</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
              </div>

              <div className="sm:col-span-3">
                <button
                  type="button"
                  onClick={() => setProdBestseller((b) => !b)}
                  aria-pressed={prodBestseller}
                  className={`w-full h-10 px-3 rounded-xl border text-xs font-semibold transition-colors cursor-pointer ${
                    prodBestseller
                      ? 'bg-[#FFF1F2] border-[#E11D48] text-[#9F1239]'
                      : 'bg-[#FAF6F3] border-[#E5D2D8] text-[#5C3A42]'
                  }`}
                >
                  {prodBestseller ? '★ Bestseller: YES' : 'Bestseller: NO'}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full sm:w-auto min-h-[42px] px-5 py-2.5 rounded-xl bg-[#E11D48] hover:bg-[#BE123C] text-white font-semibold text-xs inline-flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>+ Add Product to Live Store</span>
            </button>
          </form>

          {/* Existing Inventory List */}
          <div className="space-y-2.5">
            <h3 className="text-xs font-semibold text-[#5C3A42] px-1">
              Manage Existing Catalog ({products.length} Products)
            </h3>

            {products.map((product) => {
              const isEditing = editingProductId === product.id;

              return (
                <div
                  key={product.id}
                  className="bg-white rounded-2xl border border-[#EFE2E6] p-3 flex flex-wrap items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <div className="w-14 h-14 rounded-xl overflow-hidden bg-[#FFF9F6] border border-[#F3E6EA] shrink-0">
                      <ResilientImage
                        src={product.image}
                        alt={product.name}
                        category={product.category}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 text-[11px] text-[#7A5660]">
                        <span>{product.category}</span>
                        <span aria-hidden="true">·</span>
                        <span
                          className={
                            product.inStock
                              ? 'text-[#047857] font-semibold'
                              : 'text-[#E11D48] font-semibold'
                          }
                        >
                          {product.inStock ? 'In Stock' : 'Out of Stock'}
                        </span>
                      </div>
                      <h4 className="text-xs sm:text-sm font-semibold text-[#1F1216] truncate">
                        {product.name}
                      </h4>
                      <div className="flex items-center gap-2 font-mono-num text-xs mt-0.5">
                        <span className="font-bold text-[#E11D48]">
                          ₹{product.price}
                        </span>
                        <span className="text-[#8A6A72] line-through text-[11px]">
                          MRP ₹{product.mrp}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Admin Quick Controls: Edit Price, Toggle Stock, Delete */}
                  <div className="flex flex-wrap items-center gap-2">
                    {isEditing ? (
                      <div className="flex items-center gap-1.5">
                        <input
                          type="number"
                          value={editingPriceValue}
                          onChange={(e) => setEditingPriceValue(e.target.value)}
                          aria-label={`New price for ${product.name}`}
                          className="w-20 h-8 px-2 rounded-lg bg-[#FAF6F3] border border-[#E11D48] font-mono-num text-xs"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const nextVal = Number(editingPriceValue);
                            if (nextVal > 0) {
                              onUpdateProduct(product.id, {
                                price: nextVal,
                                mrp: Math.max(product.mrp, nextVal),
                              });
                              triggerToast(
                                `Updated price of "${product.name}" to ₹${nextVal}`
                              );
                            }
                            setEditingProductId(null);
                          }}
                          aria-label={`Save price for ${product.name}`}
                          className="h-8 px-2.5 rounded-lg bg-[#059669] text-white text-xs font-semibold inline-flex items-center gap-1 cursor-pointer"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Save</span>
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => {
                          setEditingProductId(product.id);
                          setEditingPriceValue(String(product.price));
                        }}
                        className="min-h-[34px] px-2.5 py-1 rounded-lg bg-[#FAF6F3] hover:bg-[#FFE4E6] border border-[#E5D2D8] text-xs font-medium text-[#1F1216] inline-flex items-center gap-1 cursor-pointer"
                      >
                        <Edit3 className="w-3.5 h-3.5 text-[#E11D48]" />
                        <span>Edit Price</span>
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => {
                        onUpdateProduct(product.id, {
                          inStock: !product.inStock,
                        });
                        triggerToast(
                          `Marked "${product.name}" as ${
                            !product.inStock ? 'In Stock' : 'Out of Stock'
                          }`
                        );
                      }}
                      className={`min-h-[34px] px-2.5 py-1 rounded-lg text-xs font-semibold border transition-colors cursor-pointer ${
                        product.inStock
                          ? 'bg-[#ECFDF5] border-[#A7F3D0] text-[#065F46]'
                          : 'bg-[#FFF1F2] border-[#FECDD3] text-[#BE123C]'
                      }`}
                    >
                      {product.inStock ? 'Set Out-of-Stock' : 'Restore Stock'}
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        onDeleteProduct(product.id);
                        triggerToast(`Deleted "${product.name}" from store`);
                      }}
                      aria-label={`Delete ${product.name}`}
                      className="w-8 h-8 rounded-lg bg-[#FFF1F2] hover:bg-[#FFE4E6] text-[#E11D48] flex items-center justify-center transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </section>
  );
};

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import {
  Search,
  Heart,
  ShoppingBag,
  Home,
  Grid,
  Percent,
  ShieldCheck,
  MapPin,
  X,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import {
  AppMode,
  CartItem,
  CustomerTab,
  DeliveryOption,
  Order,
  OrderStatus,
  PaymentMethod,
  Product,
  ProductCategory,
} from './types';
import {
  CATEGORY_CIRCLES,
  INITIAL_ORDERS,
  INITIAL_PRODUCTS,
} from './data/initialData';
import {
  calculateBillSummary,
  calculateDiscountPercent,
  filterProducts,
  getTotalCartItemsCount,
  mutateCartQuantity,
} from './utils/storeLogic';
import { HeroCarousel } from './components/HeroCarousel';
import { CategoryStories } from './components/CategoryStories';
import { ProductCard } from './components/ProductCard';
import { ProductQuickViewModal } from './components/ProductQuickViewModal';
import { CartCheckoutDrawer } from './components/CartCheckoutDrawer';
import { AdminDashboard } from './components/AdminDashboard';
import { ResilientImage } from './components/ResilientImage';

const STORAGE_KEYS = {
  PRODUCTS: 'girlz_zone_ambernath_products_v1',
  ORDERS: 'girlz_zone_ambernath_orders_v1',
  CART: 'girlz_zone_ambernath_cart_v1',
  WISHLIST: 'girlz_zone_ambernath_wishlist_v1',
};

export default function App() {
  // Persistent Products State
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // ignore storage errors
    }
    return INITIAL_PRODUCTS;
  });

  // Persistent Orders State
  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ORDERS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // ignore storage errors
    }
    return INITIAL_ORDERS;
  });

  // Persistent Shopping Bag State
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CART);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {
      // ignore
    }
    return [{ productId: 'gz-prod-1', quantity: 1 }];
  });

  // Persistent Wishlist State
  const [wishlistIds, setWishlistIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.WISHLIST);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {
      // ignore
    }
    return ['gz-prod-1', 'gz-prod-6'];
  });

  // UI Navigation States
  const [appMode, setAppMode] = useState<AppMode>('customer');
  const [activeTab, setActiveTab] = useState<CustomerTab>('Home');
  const [selectedCategory, setSelectedCategory] =
    useState<ProductCategory>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [couponCode, setCouponCode] = useState('GIRLZ10');
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(
    null
  );
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAdminUnlocked, setIsAdminUnlocked] = useState(false);
  const [toastBanner, setToastBanner] = useState<string | null>(null);

  // Sync with localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
    } catch {
      // ignore
    }
  }, [products]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
    } catch {
      // ignore
    }
  }, [orders]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart));
    } catch {
      // ignore
    }
  }, [cart]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.WISHLIST, JSON.stringify(wishlistIds));
    } catch {
      // ignore
    }
  }, [wishlistIds]);

  const showToast = (msg: string) => {
    setToastBanner(msg);
    setTimeout(() => setToastBanner(null), 2600);
  };

  // Computed counts & filtered products
  const totalCartItems = useMemo(() => getTotalCartItemsCount(cart), [cart]);

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { All: products.length };
    for (const p of products) {
      counts[p.category] = (counts[p.category] || 0) + 1;
    }
    return counts;
  }, [products]);

  const visibleProducts = useMemo(() => {
    if (activeTab === 'Wishlist') {
      return filterProducts(
        products,
        selectedCategory,
        searchQuery,
        false,
        wishlistIds
      );
    }
    if (activeTab === 'Offers') {
      return filterProducts(products, selectedCategory, searchQuery, true);
    }
    return filterProducts(products, selectedCategory, searchQuery, false);
  }, [products, selectedCategory, searchQuery, activeTab, wishlistIds]);

  const billSummary = useMemo(
    () =>
      calculateBillSummary(
        cart,
        products,
        couponCode,
        'Home Delivery in Ambernath'
      ),
    [cart, products, couponCode]
  );

  // Handlers
  const handleToggleWishlist = (productId: string) => {
    setWishlistIds((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  const handleUpdateCartQuantity = (productId: string, delta: number) => {
    setCart((prev) => mutateCartQuantity(prev, productId, delta));
  };

  const handleSetCartQuantity = (productId: string, newQuantity: number) => {
    setCart((prev) => {
      const filtered = prev.filter((item) => item.productId !== productId);
      return newQuantity > 0
        ? [...filtered, { productId, quantity: newQuantity }]
        : filtered;
    });
    showToast('Added item to your Girlz Zone Shopping Bag!');
  };

  const handleBuyNow = (productId: string, quantity: number) => {
    handleSetCartQuantity(productId, quantity);
    setQuickViewProduct(null);
    setIsCartOpen(true);
  };

  const handleSelectCategory = (cat: ProductCategory) => {
    setSelectedCategory(cat);
    if (activeTab === 'Admin') {
      setAppMode('customer');
      setActiveTab('Home');
    }
  };

  const handleBottomTabClick = (tab: CustomerTab) => {
    setActiveTab(tab);
    if (tab === 'Admin') {
      setAppMode('admin');
    } else {
      setAppMode('customer');
    }
  };

  const handleModeSwitch = (mode: AppMode) => {
    setAppMode(mode);
    if (mode === 'admin') {
      setActiveTab('Admin');
    } else if (activeTab === 'Admin') {
      setActiveTab('Home');
    }
  };

  const handlePlaceOrder = (orderData: {
    customerName: string;
    phone: string;
    deliveryOption: DeliveryOption;
    address: string;
    paymentMethod: PaymentMethod;
    orderSource: 'Online Instant' | 'WhatsApp Direct';
  }): Order => {
    const finalBill = calculateBillSummary(
      cart,
      products,
      couponCode,
      orderData.deliveryOption
    );

    const orderItems = cart
      .map((c) => {
        const prod = products.find((p) => p.id === c.productId);
        if (!prod) return null;
        return {
          productId: prod.id,
          name: prod.name,
          category: prod.category,
          price: prod.price,
          mrp: prod.mrp,
          quantity: c.quantity,
          image: prod.image,
        };
      })
      .filter((x): x is NonNullable<typeof x> => x !== null);

    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const newOrder: Order = {
      id: `GZ-${randomNum}`,
      customerName: orderData.customerName,
      phone: orderData.phone,
      deliveryOption: orderData.deliveryOption,
      address: orderData.address,
      paymentMethod: orderData.paymentMethod,
      items: orderItems,
      itemTotal: finalBill.itemTotal,
      discountAmount: finalBill.couponDiscount,
      couponCode: finalBill.appliedCoupon ?? undefined,
      deliveryFee: finalBill.deliveryFee,
      grandTotal: finalBill.grandTotal,
      status: 'New',
      createdAt: 'Just now',
      orderSource: orderData.orderSource,
    };

    setOrders((prev) => [newOrder, ...prev]);
    setCart([]);
    return newOrder;
  };

  const handleUpdateOrderStatus = (orderId: string, status: OrderStatus) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status } : o))
    );
  };

  const handleAddProduct = (newProd: Omit<Product, 'id'>) => {
    const created: Product = {
      ...newProd,
      id: `gz-prod-${Date.now()}`,
    };
    setProducts((prev) => [created, ...prev]);
  };

  const handleUpdateProduct = (productId: string, patch: Partial<Product>) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === productId ? { ...p, ...patch } : p))
    );
  };

  const handleDeleteProduct = (productId: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== productId));
    setCart((prev) => prev.filter((c) => c.productId !== productId));
  };

  const handleResetDemoData = () => {
    setProducts(INITIAL_PRODUCTS);
    setOrders(INITIAL_ORDERS);
    setCart([{ productId: 'gz-prod-1', quantity: 1 }]);
    setWishlistIds(['gz-prod-1', 'gz-prod-6']);
    showToast('Restored default Girlz Zone Ambernath demo data.');
  };

  return (
    <div className="min-h-screen max-w-full overflow-x-hidden bg-[#FAF6F3] text-[#1F1216] pb-20">
      {/* STICKY TOP HEADER (Strictly 1-row, 3-zone, 52px height to stay well under 15% mobile sticky cap) */}
      <header className="sticky top-0 z-30 h-[52px] bg-white/95 backdrop-blur-md border-b border-[#EFE2E6] px-4 sm:px-6 flex items-center justify-between gap-4">
        {/* Zone 1: Single-line Brand Wordmark */}
        <a
          href="#top"
          onClick={(e) => {
            e.preventDefault();
            handleModeSwitch('customer');
            setActiveTab('Home');
            setSelectedCategory('All');
          }}
          className="font-serif-display text-lg sm:text-xl font-bold tracking-tight text-[#E11D48] whitespace-nowrap shrink-0"
        >
          Girlz Zone
        </a>

        {/* Zone 2: Desktop Single-Line Navigation Links */}
        <nav
          aria-label="Primary Store Navigation"
          className="hidden md:flex items-center gap-6 text-xs font-medium text-[#5C3A42]"
        >
          <button
            type="button"
            onClick={() => {
              handleModeSwitch('customer');
              setActiveTab('Home');
              setSelectedCategory('All');
            }}
            className={`hover:text-[#E11D48] transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              appMode === 'customer' && activeTab === 'Home'
                ? 'text-[#E11D48] font-semibold underline underline-offset-4'
                : ''
            }`}
          >
            Storefront
          </button>
          <button
            type="button"
            onClick={() => {
              handleModeSwitch('customer');
              setActiveTab('Categories');
            }}
            className={`hover:text-[#E11D48] transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              appMode === 'customer' && activeTab === 'Categories'
                ? 'text-[#E11D48] font-semibold underline underline-offset-4'
                : ''
            }`}
          >
            Categories
          </button>
          <button
            type="button"
            onClick={() => {
              handleModeSwitch('customer');
              setActiveTab('Offers');
            }}
            className={`hover:text-[#E11D48] transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              appMode === 'customer' && activeTab === 'Offers'
                ? 'text-[#E11D48] font-semibold underline underline-offset-4'
                : ''
            }`}
          >
            Mega Offers
          </button>
          <button
            type="button"
            onClick={() => {
              handleModeSwitch('customer');
              setActiveTab('Wishlist');
            }}
            className={`hover:text-[#E11D48] transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              appMode === 'customer' && activeTab === 'Wishlist'
                ? 'text-[#E11D48] font-semibold underline underline-offset-4'
                : ''
            }`}
          >
            Wishlist ({wishlistIds.length})
          </button>
          <button
            type="button"
            onClick={() => handleModeSwitch('admin')}
            className={`hover:text-[#E11D48] transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              appMode === 'admin'
                ? 'text-[#E11D48] font-semibold underline underline-offset-4'
                : ''
            }`}
          >
            Admin (PIN: 7777)
          </button>
        </nav>

        {/* Zone 3: Primary Action — Shopping Bag Button */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => setIsCartOpen(true)}
            aria-label={`Open shopping bag with ${totalCartItems} items`}
            className="min-h-[38px] px-3.5 py-1.5 rounded-xl bg-[#E11D48] hover:bg-[#BE123C] text-white text-xs font-semibold inline-flex items-center gap-2 shadow-2xs transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Bag</span>
            <span
              className="font-mono-num font-bold bg-white/20 px-1.5 py-0.5 rounded-md text-[11px]"
              data-testid="header-bag-count"
            >
              {totalCartItems}
            </span>
          </button>
        </div>
      </header>

      {/* MAIN CONTENT CONTAINER */}
      <main className="max-w-6xl mx-auto px-3.5 sm:px-6 pt-3 space-y-4">
        {/* TOP FLOATING MODE SWITCHER & AMBERNATH LOCATION BAR */}
        <div className="bg-white rounded-2xl border border-[#EFE2E6] p-2.5 sm:p-3 shadow-2xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-2.5">
          {/* Segmented Mode Switcher: 1. Customer E-Commerce Store View vs 2. Store Admin Dashboard (PIN: 7777) */}
          <div
            className="grid grid-cols-2 gap-1 p-1 bg-[#FAF6F3] rounded-xl border border-[#EFE2E6]"
            role="group"
            aria-label="Application Mode Switcher"
          >
            <button
              type="button"
              onClick={() => handleModeSwitch('customer')}
              aria-pressed={appMode === 'customer'}
              className={`min-h-[38px] px-2 sm:px-3 py-1.5 rounded-lg text-[11px] sm:text-xs font-semibold transition-all truncate cursor-pointer ${
                appMode === 'customer'
                  ? 'bg-[#E11D48] text-white shadow-2xs'
                  : 'text-[#5C3A42] hover:text-[#1F1216]'
              }`}
            >
              Customer E-Commerce Store View
            </button>
            <button
              type="button"
              onClick={() => handleModeSwitch('admin')}
              aria-pressed={appMode === 'admin'}
              className={`min-h-[38px] px-2 sm:px-3 py-1.5 rounded-lg text-[11px] sm:text-xs font-semibold transition-all truncate cursor-pointer ${
                appMode === 'admin'
                  ? 'bg-[#1F1216] text-white shadow-2xs'
                  : 'text-[#5C3A42] hover:text-[#1F1216]'
              }`}
            >
              Store Admin Dashboard (PIN: 7777)
            </button>
          </div>

          {/* Location Text + Wishlist Quick Action */}
          <div className="flex items-center justify-between md:justify-end gap-3 px-1 text-xs text-[#5C3A42]">
            <span className="inline-flex items-center gap-1.5 font-medium truncate">
              <MapPin className="w-3.5 h-3.5 text-[#E11D48] shrink-0" />
              <span className="truncate">
                Ambernath Store · Fast Local &amp; Pan-India Delivery
              </span>
            </span>

            <button
              type="button"
              onClick={() => {
                handleModeSwitch('customer');
                setActiveTab('Wishlist');
              }}
              aria-label={`View wishlist (${wishlistIds.length} saved items)`}
              className="inline-flex items-center gap-1 font-semibold text-[#9F1239] hover:underline shrink-0 cursor-pointer"
            >
              <Heart className="w-3.5 h-3.5 fill-[#E11D48] text-[#E11D48]" />
              <span className="font-mono-num">{wishlistIds.length}</span>
            </button>
          </div>
        </div>

        {/* Toast Feedback Banner */}
        {toastBanner && (
          <div
            role="status"
            className="p-3 rounded-xl bg-[#1F1216] text-white text-xs font-medium flex items-center justify-between shadow-md"
          >
            <span>{toastBanner}</span>
            <button
              type="button"
              onClick={() => setToastBanner(null)}
              aria-label="Dismiss notification"
              className="text-white/70 hover:text-white cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* CONDITIONAL VIEW: CUSTOMER E-COMMERCE STORE vs ADMIN DASHBOARD */}
        {appMode === 'admin' ? (
          <AdminDashboard
            isUnlocked={isAdminUnlocked}
            orders={orders}
            products={products}
            onUnlockSuccess={() => setIsAdminUnlocked(true)}
            onLockAdmin={() => setIsAdminUnlocked(false)}
            onUpdateOrderStatus={handleUpdateOrderStatus}
            onAddProduct={handleAddProduct}
            onUpdateProduct={handleUpdateProduct}
            onDeleteProduct={handleDeleteProduct}
          />
        ) : (
          <div className="space-y-4">
            {/* LIVE SEARCH BAR & QUICK FILTER ROW */}
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-[#8A6A72] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  aria-label="Search Girlz Zone beauty, skincare, perfumes, handbags, and jewellery"
                  placeholder="Search lipsticks, 24K serum, Kundan choker, clutches..."
                  className="w-full h-11 pl-10 pr-9 rounded-2xl bg-white border border-[#E5D2D8] text-xs sm:text-sm text-[#1F1216] placeholder:text-[#8A6A72] focus:outline-none focus:border-[#E11D48] shadow-2xs"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    aria-label="Clear search query"
                    className="w-7 h-7 rounded-full hover:bg-[#FAF6F3] flex items-center justify-center absolute right-2 top-1/2 -translate-y-1/2 text-[#7A5660] cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              <button
                type="button"
                onClick={handleResetDemoData}
                title="Reset Demo Store Data"
                aria-label="Reset Demo Store Data"
                className="min-h-[44px] px-3 rounded-2xl bg-white border border-[#E5D2D8] hover:bg-[#FAF6F3] text-[#5C3A42] text-xs font-medium inline-flex items-center gap-1.5 shrink-0 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Reset Demo</span>
              </button>
            </div>

            {/* TAB-SPECIFIC HEADER OR HERO CAROUSEL */}
            {activeTab === 'Home' && !searchQuery && (
              <HeroCarousel
                onSelectCategory={handleSelectCategory}
                onApplyCouponBanner={(code) => {
                  setCouponCode(code);
                  showToast(
                    `Coupon ${code} (10% OFF) applied to your shopping bag!`
                  );
                }}
              />
            )}

            {/* Interactive Story-Style Category Circles (8 Categories) */}
            <CategoryStories
              selectedCategory={selectedCategory}
              onSelectCategory={handleSelectCategory}
              categoryCounts={categoryCounts}
            />

            {/*Dedicated Categories Directory View when on 'Categories' Tab */}
            {activeTab === 'Categories' && (
              <section
                aria-label="All Store Categories Directory"
                className="bg-white rounded-2xl border border-[#EFE2E6] p-4 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <h2 className="font-serif-display text-base sm:text-lg font-bold text-[#1F1216]">
                    Shop by Department · Girlz Zone Ambernath
                  </h2>
                  <span className="text-xs text-[#7A5660]">
                    7 Signature Departments
                  </span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {CATEGORY_CIRCLES.filter((c) => c.id !== 'All').map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => {
                        setSelectedCategory(cat.id);
                        setActiveTab('Home');
                      }}
                      className="p-3 rounded-2xl bg-[#FAF6F3] hover:bg-[#FFF1F2] border border-[#EFE2E6] flex items-center gap-3 text-left transition-colors cursor-pointer"
                    >
                      <div className="w-12 h-12 rounded-xl overflow-hidden bg-white shrink-0 border border-[#E5D2D8]">
                        <ResilientImage
                          src={cat.image}
                          alt={cat.label}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-[#1F1216] truncate">
                          {cat.label}
                        </p>
                        <p className="text-[11px] text-[#E11D48] font-mono-num">
                          {categoryCounts[cat.id] ?? 0} Products
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              </section>
            )}

            {/* Dedicated Offers Callout when on 'Offers' Tab */}
            {activeTab === 'Offers' && (
              <section className="bg-gradient-to-r from-[#881337] via-[#BE123C] to-[#E11D48] rounded-2xl p-4 text-white flex flex-wrap items-center justify-between gap-3">
                <div className="space-y-1">
                  <p className="text-[11px] font-mono-num font-semibold text-[#FDE68A]">
                    AMBERNATH MEGA SALE · EXTRA 10% OFF COUPON
                  </p>
                  <h2 className="font-serif-display text-lg font-bold">
                    Flat 30% to 45% OFF Steal Deals + Extra 10% OFF with GIRLZ10
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setCouponCode('GIRLZ10');
                    setIsCartOpen(true);
                  }}
                  className="min-h-[40px] px-4 py-2 rounded-xl bg-white text-[#881337] text-xs font-bold cursor-pointer whitespace-nowrap"
                >
                  Apply GIRLZ10 in Bag
                </button>
              </section>
            )}

            {/* PRODUCT CATALOG SECTION HEADER */}
            <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
              <div className="flex items-center gap-2">
                <h2 className="font-serif-display text-base sm:text-xl font-bold text-[#1F1216]">
                  {activeTab === 'Wishlist'
                    ? 'Your Saved Wishlist'
                    : activeTab === 'Offers'
                    ? 'Mega Beauty & Bridal Steal Deals (30%+ OFF)'
                    : selectedCategory === 'All'
                    ? 'Bestsellers & New Arrivals'
                    : `${selectedCategory} Collection`}
                </h2>
                <span aria-hidden="true" className="text-[#8A6A72]">
                  ·
                </span>
                <span className="text-xs font-mono-num text-[#7A5660]">
                  {visibleProducts.length}{' '}
                  {visibleProducts.length === 1 ? 'Product' : 'Products'}
                </span>
              </div>

              {/* Category Filter Indicator */}
              {selectedCategory !== 'All' && (
                <button
                  type="button"
                  onClick={() => setSelectedCategory('All')}
                  className="text-xs font-semibold text-[#E11D48] hover:underline cursor-pointer"
                >
                  Showing {selectedCategory} · View All
                </button>
              )}
            </div>

            {/* 2-COLUMN MOBILE PRODUCT GRID (4-column on wide desktop) */}
            {visibleProducts.length === 0 ? (
              <div className="bg-white rounded-2xl border border-[#EFE2E6] p-8 text-center space-y-3">
                <Sparkles className="w-8 h-8 text-[#E11D48] mx-auto" />
                <h3 className="font-serif-display text-base font-bold text-[#1F1216]">
                  No matching products found
                </h3>
                <p className="text-xs text-[#7A5660] max-w-sm mx-auto">
                  {activeTab === 'Wishlist'
                    ? 'Tap the heart icon on any lipstick, serum, perfume, clutch, or jewellery piece to save it to your wishlist.'
                    : 'Try clearing your search filter or switching to All Categories.'}
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedCategory('All');
                    setSearchQuery('');
                    setActiveTab('Home');
                  }}
                  className="min-h-[40px] px-4 py-2 rounded-xl bg-[#E11D48] text-white text-xs font-semibold cursor-pointer"
                >
                  Show All Store Products
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
                {visibleProducts.map((product) => {
                  const cartItem = cart.find((c) => c.productId === product.id);
                  const qty = cartItem ? cartItem.quantity : 0;
                  const wishlisted = wishlistIds.includes(product.id);

                  return (
                    <ProductCard
                      key={product.id}
                      product={product}
                      cartQuantity={qty}
                      isWishlisted={wishlisted}
                      onToggleWishlist={handleToggleWishlist}
                      onUpdateCartQuantity={handleUpdateCartQuantity}
                      onOpenQuickView={(prod) => setQuickViewProduct(prod)}
                    />
                  );
                })}
              </div>
            )}

            {/* STORE TRUST & AMBERNATH BOUTIQUE STORY FOOTER */}
            <footer className="mt-8 bg-white rounded-2xl border border-[#EFE2E6] p-5 space-y-3 text-xs text-[#5C3A42]">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#F3E6EA] pb-3">
                <div>
                  <p className="font-serif-display text-base font-bold text-[#1F1216]">
                    Girlz Zone — Ambernath Flagship Store
                  </p>
                  <p className="text-xs text-[#7A5660]">
                    Cosmetics · Skincare · Perfumes · Bridal Handbags · Kundan
                    Jewellery · Korean Hair Accessories
                  </p>
                </div>
                <span className="font-mono-num text-xs font-semibold text-[#E11D48]">
                  WhatsApp Orders: +91 93246 54685
                </span>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-[#7A5660]">
                <span>100% Authentic Beauty &amp; Bridal Fashion</span>
                <span aria-hidden="true">·</span>
                <span>Same-Day Ambernath Delivery &amp; Instant Store Pickup</span>
                <span aria-hidden="true">·</span>
                <span>Cash on Delivery &amp; UPI Accepted</span>
              </div>
            </footer>
          </div>
        )}
      </main>

      {/* STICKY BOTTOM NAVIGATION BAR (5 Tabs: Home, Categories, Offers, Wishlist, Admin (PIN: 7777)) */}
      {/* Compact 56px height so Top Header (52px) + Bottom Nav (56px) = 108px (<15% of 844px mobile viewport) */}
      <nav
        aria-label="Mobile Bottom Navigation"
        className="fixed bottom-0 left-0 right-0 z-30 h-14 bg-white/95 backdrop-blur-md border-t border-[#EFE2E6] px-2"
      >
        <div className="max-w-xl mx-auto h-full grid grid-cols-5 items-center">
          <button
            type="button"
            onClick={() => handleBottomTabClick('Home')}
            aria-label="Home tab"
            className={`h-full flex flex-col items-center justify-center cursor-pointer transition-colors ${
              appMode === 'customer' && activeTab === 'Home'
                ? 'text-[#E11D48] font-bold'
                : 'text-[#5C3A42] hover:text-[#1F1216]'
            }`}
          >
            <Home className="w-4 h-4" />
            <span className="text-[10px] mt-0.5 whitespace-nowrap">Home</span>
          </button>

          <button
            type="button"
            onClick={() => handleBottomTabClick('Categories')}
            aria-label="Categories tab"
            className={`h-full flex flex-col items-center justify-center cursor-pointer transition-colors ${
              appMode === 'customer' && activeTab === 'Categories'
                ? 'text-[#E11D48] font-bold'
                : 'text-[#5C3A42] hover:text-[#1F1216]'
            }`}
          >
            <Grid className="w-4 h-4" />
            <span className="text-[10px] mt-0.5 whitespace-nowrap">
              Categories
            </span>
          </button>

          <button
            type="button"
            onClick={() => handleBottomTabClick('Offers')}
            aria-label="Offers tab"
            className={`h-full flex flex-col items-center justify-center cursor-pointer transition-colors ${
              appMode === 'customer' && activeTab === 'Offers'
                ? 'text-[#E11D48] font-bold'
                : 'text-[#5C3A42] hover:text-[#1F1216]'
            }`}
          >
            <Percent className="w-4 h-4" />
            <span className="text-[10px] mt-0.5 whitespace-nowrap">Offers</span>
          </button>

          <button
            type="button"
            onClick={() => handleBottomTabClick('Wishlist')}
            aria-label={`Wishlist tab (${wishlistIds.length} items)`}
            className={`relative h-full flex flex-col items-center justify-center cursor-pointer transition-colors ${
              appMode === 'customer' && activeTab === 'Wishlist'
                ? 'text-[#E11D48] font-bold'
                : 'text-[#5C3A42] hover:text-[#1F1216]'
            }`}
          >
            <div className="relative">
              <Heart className="w-4 h-4" />
              {wishlistIds.length > 0 && (
                <span className="absolute -top-1.5 -right-2.5 min-w-[14px] h-[14px] px-1 rounded-full bg-[#E11D48] text-white font-mono-num text-[9px] font-bold flex items-center justify-center">
                  {wishlistIds.length}
                </span>
              )}
            </div>
            <span className="text-[10px] mt-0.5 whitespace-nowrap">
              Wishlist
            </span>
          </button>

          <button
            type="button"
            onClick={() => handleBottomTabClick('Admin')}
            aria-label="Admin (PIN: 7777) tab"
            className={`h-full flex flex-col items-center justify-center cursor-pointer transition-colors ${
              appMode === 'admin'
                ? 'text-[#E11D48] font-bold'
                : 'text-[#5C3A42] hover:text-[#1F1216]'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span className="text-[10px] mt-0.5 whitespace-nowrap">
              Admin (7777)
            </span>
          </button>
        </div>
      </nav>

      {/* PRODUCT QUICK-VIEW BOTTOM SHEET MODAL */}
      <ProductQuickViewModal
        product={quickViewProduct}
        cartQuantity={
          quickViewProduct
            ? cart.find((c) => c.productId === quickViewProduct.id)?.quantity ??
              0
            : 0
        }
        isWishlisted={
          quickViewProduct ? wishlistIds.includes(quickViewProduct.id) : false
        }
        onClose={() => setQuickViewProduct(null)}
        onToggleWishlist={handleToggleWishlist}
        onSetCartQuantity={handleSetCartQuantity}
        onBuyNow={handleBuyNow}
      />

      {/* SLIDE-OUT SHOPPING BAG & COMPLETE CHECKOUT FLOW */}
      <CartCheckoutDrawer
        isOpen={isCartOpen}
        cart={cart}
        products={products}
        couponCode={couponCode}
        bill={billSummary}
        onClose={() => setIsCartOpen(false)}
        onUpdateQuantity={handleUpdateCartQuantity}
        onChangeCouponCode={setCouponCode}
        onPlaceOrder={handlePlaceOrder}
        onSwitchToAdmin={() => {
          setIsAdminUnlocked(true);
          handleModeSwitch('admin');
        }}
      />
    </div>
  );
}

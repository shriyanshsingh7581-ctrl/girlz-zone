import {
  BillSummary,
  CartItem,
  DeliveryOption,
  Order,
  Product,
  ProductCategory,
  StrictProductCategory,
} from '../types';
import { ADMIN_DEMO_PIN, STORE_WHATSAPP_NUMBER } from '../data/initialData';

export const COUPON_CODES: Record<string, { rate: number; description: string }> = {
  GIRLZ10: { rate: 0.1, description: '10% OFF Storewide Coupon' },
  AMBERNATH20: { rate: 0.2, description: '20% OFF Ambernath Local VIP Offer' },
  BRIDAL15: { rate: 0.15, description: '15% OFF Bridal & Party Special' },
};

export function calculateDiscountPercent(mrp: number, price: number): number {
  if (mrp <= 0 || price >= mrp) return 0;
  return Math.round(((mrp - price) / mrp) * 100);
}

export function filterProducts(
  products: Product[],
  category: ProductCategory,
  searchQuery: string,
  onlyOffers = false,
  wishlistIds?: string[]
): Product[] {
  const normalizedQuery = searchQuery.trim().toLowerCase();

  return products.filter((product) => {
    if (wishlistIds && !wishlistIds.includes(product.id)) {
      return false;
    }
    if (category !== 'All' && product.category !== category) {
      return false;
    }
    if (onlyOffers && calculateDiscountPercent(product.mrp, product.price) < 30) {
      return false;
    }
    if (normalizedQuery) {
      const hay = `${product.name} ${product.category} ${product.description} ${product.shadeOrSize ?? ''}`.toLowerCase();
      if (!hay.includes(normalizedQuery)) {
        return false;
      }
    }
    return true;
  });
}

export function mutateCartQuantity(
  cart: CartItem[],
  productId: string,
  delta: number
): CartItem[] {
  const existing = cart.find((item) => item.productId === productId);
  if (!existing) {
    if (delta > 0) {
      return [...cart, { productId, quantity: delta }];
    }
    return cart;
  }

  const nextQty = existing.quantity + delta;
  if (nextQty <= 0) {
    return cart.filter((item) => item.productId !== productId);
  }

  return cart.map((item) =>
    item.productId === productId ? { ...item, quantity: nextQty } : item
  );
}

export function getTotalCartItemsCount(cart: CartItem[]): number {
  return cart.reduce((sum, item) => sum + item.quantity, 0);
}

export function calculateBillSummary(
  cart: CartItem[],
  products: Product[],
  rawCouponCode: string,
  deliveryOption: DeliveryOption
): BillSummary {
  let itemTotal = 0;
  let mrpTotal = 0;

  for (const item of cart) {
    const product = products.find((p) => p.id === item.productId);
    if (product) {
      itemTotal += product.price * item.quantity;
      mrpTotal += product.mrp * item.quantity;
    }
  }

  const productSavings = Math.max(0, mrpTotal - itemTotal);
  const normalizedCoupon = rawCouponCode.trim().toUpperCase();
  const couponRule = COUPON_CODES[normalizedCoupon];

  const couponDiscount =
    couponRule && itemTotal > 0 ? Math.round(itemTotal * couponRule.rate) : 0;
  const appliedCoupon = couponDiscount > 0 ? normalizedCoupon : null;

  const discountedSubtotal = Math.max(0, itemTotal - couponDiscount);

  let deliveryFee = 0;
  if (itemTotal > 0) {
    if (deliveryOption === 'Store Pickup - Girlz Zone Ambernath') {
      deliveryFee = 0;
    } else {
      // Free local delivery in Ambernath on orders ₹499+, otherwise ₹40
      deliveryFee = discountedSubtotal >= 499 ? 0 : 40;
    }
  }

  const grandTotal = discountedSubtotal + deliveryFee;
  const totalSavings = productSavings + couponDiscount;

  return {
    itemTotal,
    mrpTotal,
    productSavings,
    couponDiscount,
    appliedCoupon,
    deliveryFee,
    grandTotal,
    totalSavings,
  };
}

export function verifyAdminPin(pinInput: string): boolean {
  return pinInput.trim() === ADMIN_DEMO_PIN;
}

export interface AdminMetrics {
  totalOrders: number;
  todaysRevenue: number;
  totalProducts: number;
  pendingDeliveries: number;
}

export function calculateAdminMetrics(
  orders: Order[],
  products: Product[]
): AdminMetrics {
  const totalOrders = orders.length;
  const todaysRevenue = orders.reduce((sum, o) => sum + o.grandTotal, 0);
  const totalProducts = products.length;
  const pendingDeliveries = orders.filter((o) => o.status !== 'Completed').length;

  return {
    totalOrders,
    todaysRevenue,
    totalProducts,
    pendingDeliveries,
  };
}

export function formatWhatsAppOrderMessage(order: Order): string {
  const lines: string[] = [
    `*🌸 GIRLZ ZONE AMBERNATH — NEW ORDER (${order.id}) 🌸*`,
    `--------------------------------`,
    `👤 *Customer:* ${order.customerName}`,
    `📞 *Phone:* ${order.phone}`,
    `🚚 *Delivery:* ${order.deliveryOption}`,
    `📍 *Address:* ${order.address}`,
    `💳 *Payment:* ${order.paymentMethod}`,
    `--------------------------------`,
    `*🛍️ ORDERED ITEMS:*`,
  ];

  order.items.forEach((item, index) => {
    lines.push(
      `${index + 1}. ${item.name} × ${item.quantity} = ₹${item.price * item.quantity}`
    );
  });

  lines.push(`--------------------------------`);
  lines.push(`🧾 *Item Total:* ₹${order.itemTotal}`);
  if (order.discountAmount > 0) {
    lines.push(
      `🏷️ *Coupon Discount (${order.couponCode || 'PROMO'}):* -₹${order.discountAmount}`
    );
  }
  lines.push(
    `🛵 *Delivery Fee:* ${order.deliveryFee === 0 ? 'FREE' : `₹${order.deliveryFee}`}`
  );
  lines.push(`✨ *GRAND TOTAL: ₹${order.grandTotal}*`);
  lines.push(`--------------------------------`);
  lines.push(`📍 *Store:* Girlz Zone, Ambernath`);

  return lines.join('\n');
}

export function buildWhatsAppOrderUrl(
  order: Order,
  targetPhone = STORE_WHATSAPP_NUMBER
): string {
  const cleanPhone = targetPhone.replace(/[^0-9]/g, '');
  const text = formatWhatsAppOrderMessage(order);
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`;
}

export const STRICT_CATEGORIES: StrictProductCategory[] = [
  'Makeup',
  'Skin Care',
  'Hair Care',
  'Perfumes & Deo',
  'Handbags',
  'Artificial Jewellery',
  'Hair Accessories',
];

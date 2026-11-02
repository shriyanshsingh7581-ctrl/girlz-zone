import test from 'node:test';
import assert from 'node:assert/strict';
import {
  buildWhatsAppOrderUrl,
  calculateAdminMetrics,
  calculateBillSummary,
  calculateDiscountPercent,
  filterProducts,
  getTotalCartItemsCount,
  mutateCartQuantity,
  verifyAdminPin,
} from './storeLogic';
import { INITIAL_ORDERS, INITIAL_PRODUCTS } from '../data/initialData';

test('calculateDiscountPercent computes accurate percentage off', () => {
  assert.equal(calculateDiscountPercent(599, 399), 33);
  assert.equal(calculateDiscountPercent(1000, 700), 30);
  assert.equal(calculateDiscountPercent(500, 500), 0);
});

test('mutateCartQuantity adds, increments, decrements, and removes items cleanly', () => {
  let cart = mutateCartQuantity([], 'gz-prod-1', 1);
  assert.equal(cart.length, 1);
  assert.equal(cart[0].quantity, 1);

  cart = mutateCartQuantity(cart, 'gz-prod-1', 2);
  assert.equal(getTotalCartItemsCount(cart), 3);

  cart = mutateCartQuantity(cart, 'gz-prod-1', -3);
  assert.equal(cart.length, 0);
});

test('calculateBillSummary applies GIRLZ10 coupon and free delivery threshold', () => {
  const cart = [{ productId: 'gz-prod-1', quantity: 2 }]; // 399 * 2 = 798
  const bill = calculateBillSummary(
    cart,
    INITIAL_PRODUCTS,
    'girlz10',
    'Home Delivery in Ambernath'
  );

  assert.equal(bill.itemTotal, 798);
  assert.equal(bill.appliedCoupon, 'GIRLZ10');
  assert.equal(bill.couponDiscount, 80); // 10% of 798 rounded
  assert.equal(bill.deliveryFee, 0); // > 499
  assert.equal(bill.grandTotal, 718);
});

test('filterProducts filters by category and search query', () => {
  const makeupItems = filterProducts(INITIAL_PRODUCTS, 'Makeup', '');
  assert.ok(makeupItems.length >= 2);
  assert.ok(makeupItems.every((p) => p.category === 'Makeup'));

  const kundanItems = filterProducts(INITIAL_PRODUCTS, 'All', 'kundan');
  assert.equal(kundanItems.length, 1);
  assert.equal(kundanItems[0].category, 'Artificial Jewellery');
});

test('verifyAdminPin validates PIN 7777', () => {
  assert.equal(verifyAdminPin('7777'), true);
  assert.equal(verifyAdminPin('1234'), false);
});

test('calculateAdminMetrics computes accurate totals from orders and products', () => {
  const metrics = calculateAdminMetrics(INITIAL_ORDERS, INITIAL_PRODUCTS);
  assert.equal(metrics.totalOrders, INITIAL_ORDERS.length);
  assert.equal(metrics.totalProducts, INITIAL_PRODUCTS.length);
  assert.ok(metrics.todaysRevenue > 0);
  assert.ok(metrics.pendingDeliveries > 0);
});

test('buildWhatsAppOrderUrl formats +919324654685 and itemized bill', () => {
  const url = buildWhatsAppOrderUrl(INITIAL_ORDERS[0]);
  assert.ok(url.startsWith('https://wa.me/919324654685?text='));
  assert.ok(decodeURIComponent(url).includes('Priya Deshmukh'));
  assert.ok(decodeURIComponent(url).includes('GZ-8492'));
});

test('all 17 initial products have valid XML-escaped SVG data URIs', () => {
  assert.ok(INITIAL_PRODUCTS.length >= 16);
  for (const prod of INITIAL_PRODUCTS) {
    assert.ok(prod.image.startsWith('data:image/svg+xml;charset=utf-8,'));
    const decodedSvg = decodeURIComponent(
      prod.image.replace('data:image/svg+xml;charset=utf-8,', '')
    );
    // Ensure no raw unescaped ampersands exist inside the SVG
    const rawAmpersands = decodedSvg.replace(/&amp;|&lt;|&gt;|&quot;|&apos;/g, '');
    assert.equal(rawAmpersands.includes('&'), false, `Unescaped & in ${prod.name}`);
  }
});

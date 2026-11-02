export type ProductCategory =
  | 'All'
  | 'Makeup'
  | 'Skin Care'
  | 'Hair Care'
  | 'Perfumes & Deo'
  | 'Handbags'
  | 'Artificial Jewellery'
  | 'Hair Accessories';

export type StrictProductCategory = Exclude<ProductCategory, 'All'>;

export interface Product {
  id: string;
  name: string;
  category: StrictProductCategory;
  mrp: number;
  price: number;
  rating: number;
  reviewsCount: number;
  image: string;
  tag?: 'Bestseller' | 'New';
  isBestseller: boolean;
  inStock: boolean;
  description: string;
  highlights: string[];
  shadeOrSize?: string;
}

export interface CartItem {
  productId: string;
  quantity: number;
}

export type DeliveryOption =
  | 'Home Delivery in Ambernath'
  | 'Store Pickup - Girlz Zone Ambernath';

export type PaymentMethod =
  | 'Cash on Delivery'
  | 'UPI / GPay'
  | 'Pay at Store';

export type OrderStatus = 'New' | 'Packed' | 'Out for Delivery' | 'Completed';

export interface OrderItem {
  productId: string;
  name: string;
  category: StrictProductCategory;
  price: number;
  mrp: number;
  quantity: number;
  image: string;
}

export interface Order {
  id: string;
  customerName: string;
  phone: string;
  deliveryOption: DeliveryOption;
  address: string;
  paymentMethod: PaymentMethod;
  items: OrderItem[];
  itemTotal: number;
  discountAmount: number;
  couponCode?: string;
  deliveryFee: number;
  grandTotal: number;
  status: OrderStatus;
  createdAt: string;
  orderSource: 'Online Instant' | 'WhatsApp Direct';
}

export type CustomerTab = 'Home' | 'Categories' | 'Offers' | 'Wishlist' | 'Admin';

export type AppMode = 'customer' | 'admin';

export interface BillSummary {
  itemTotal: number;
  mrpTotal: number;
  productSavings: number;
  couponDiscount: number;
  appliedCoupon: string | null;
  deliveryFee: number;
  grandTotal: number;
  totalSavings: number;
}

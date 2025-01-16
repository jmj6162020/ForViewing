export interface User {
  id: number;
  name: string;
  email: string;
  email_verified_at?: string;
  campus: string;
  created_at: string;
  role: string;
  designation: string;
}

export type PageProps<
  T extends Record<string, unknown> = Record<string, unknown>,
> = T & {
  auth: {
    user: User;
  };
  flash: {
    message: string;
  };
  cartItemCount: number;
  refundRequests: RefundRequest[];
};

export interface Category {
  id?: number;
  name: string;
  slug: string;
}

export interface Product {
  id?: number;
  category_id: string;
  category: Category;
  name: string;
  campus: string;
  sku: string;
  details: string;
  images: Image[];
  variants: Variant[];
  reviews: [];

  price_range: string;
  stock: number;
  total_sold: number;
  rating: number;
}

export interface Image {
  id?: number;
  public_url: string;
}

export interface Variant {
  id?: string | number;
  name: string;
  price: number;
  quantity: number;

  total_sold?: number;
}

export interface CartItem {
  id: number;
  user_id?: string;
  guest_id?: string;
  product: Product;
  variant: Variant;
  quantity: number;
  selected: boolean;
}

export interface Order {
  id: number;
  tracking_number;
  user: User;
  items: OrderItem[];
  total_amount: number;
  status: string;
  campus: string;
  payment_type: string;
  created_at: string;
  salary_deduction: SalaryDeduction;
}

export interface SalaryDeduction {
  id: number;
  student_1: string;
  student_1_yrlvl: string;

  student_2: string;
  student_2_yrlvl: string;

  student_3: string;
  student_3_yrlvl: string;

  student_4: string;
  student_4_yrlvl: string;

  starting_date: string;
  ending_date: string;
  amount: string;
}

export interface OrderItem {
  id: number;
  order: Order;
  product: Product;
  variant: Variant;
  quantity: number;
  refund_request: RefundRequest;
  review: Review;
}

export interface RefundRequest {
  id: number;
  status: string;
  user: User;
  item: OrderItem;
  reason: string;
  images: Image[];
  quantity: number;
  total: number;
  created_at: string;
  campus: string;
}

export interface Review {
  id: number;
  user: User;
  item: OrderItem;
  rating: number;
  comment: string;
  created_at: string;
}

export interface ProductForm {
  category_id: string;
  campus: string;
  name: string;
  sku: string;
  details: string;
  images: File[];
  variants: Variant[];
}

export interface Message {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  contact_number: string;
  message: string;
  read: boolean;
  created_at: string;
  formatted_created_at: string;
}

export interface Customer {
  id: number;
  name: string;
  email: string;
  orders: Order[];
  created_at: string;
}

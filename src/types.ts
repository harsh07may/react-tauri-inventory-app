export interface Product {
  id: string;
  name: string;
  sku: string | null;
  description: string | null;
  category: string | null;
  purchase_price: number;
  selling_price: number;
  quantity_in_stock: number;
  low_stock_threshold: number;
  created_at?: string;
  updated_at?: string;
}

export interface Invoice {
  id: string;
  invoice_number: string;
  subtotal: number;
  tax_percent: number;
  tax_amount: number;
  total_amount: number;
  payment_method: string;
  created_by: string;
  created_at: string;
}

export interface InvoiceItem {
  id: string;
  invoice_id: string;
  product_id: string;
  quantity: number;
  unit_price: number;
  line_total: number;
}

export interface CartItem extends Product {
  cartQty: number;
}

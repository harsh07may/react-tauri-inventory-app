import { useQueryClient } from '@tanstack/react-query';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useDebounce } from 'use-debounce';
import { Cart } from '../components/Billing/Cart';
import { CheckoutSummary } from '../components/Billing/CheckoutSummary';
import { ProductCatalog } from '../components/Billing/ProductCatalog';
import { getDb } from '../db';
import { dashboardKeys } from '../hooks/useDashboard';
import { productKeys, useSearchProducts } from '../hooks/useProducts';
import { reportKeys } from '../hooks/useReports';
import { useSettings } from '../hooks/useSettings'; // Added import
import { useCartStore } from '../store/useCartStore';

export default function Billing() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [debouncedSearch] = useDebounce(search, 300);
  const { data: filteredProducts = [], refetch: refetchProducts } = useSearchProducts(debouncedSearch);

  const { cart, clearCart } = useCartStore();
  const { data: settings } = useSettings(); // Added settings hook
  const [paymentMethod, setPaymentMethod] = useState<'cash'|'card'|'upi'>('cash');
  const [taxPercent, setTaxPercent] = useState(0); // Changed initial state to 0
  const searchInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  // Set default tax when items are added if it's currently 0
  useEffect(() => {
    if (cart.length > 0 && taxPercent === 0 && settings) {
      setTaxPercent(settings.defaultTaxPercent);
    }
  }, [cart.length, taxPercent, settings]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter' && e.ctrlKey) {
        handleSaveInvoice();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cart, paymentMethod, taxPercent, filteredProducts, search]); // Re-bind to capture latest state

  const subtotal = cart.reduce((sum, item) => sum + (item.selling_price * item.cartQty), 0);
  const taxAmount = (subtotal * taxPercent) / 100;
  const total = subtotal + taxAmount;
  const totalItems = cart.reduce((s,i) => s + i.cartQty, 0);

  const handleSaveInvoice = async () => {
    if (cart.length === 0) return;
    
    try {
      const db = await getDb();
      
      const invoiceId = crypto.randomUUID();
      const invoiceNumber = `INV-${Date.now().toString().slice(-6)}`;
      const creatorId = '11111111-1111-1111-1111-111111111111'; // Admin seeded ID

      // 1. Create Invoice
      await db.execute(
        "INSERT INTO invoices (id, invoice_number, subtotal, tax_percent, tax_amount, total_amount, payment_method, created_by) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)",
        [invoiceId, invoiceNumber, subtotal, taxPercent, taxAmount, total, paymentMethod, creatorId]
      );

      // 2. Add items and update stock
      for (const item of cart) {
        const itemId = crypto.randomUUID();
        const lineTotal = item.selling_price * item.cartQty;
        
        await db.execute(
          "INSERT INTO invoice_items (id, invoice_id, product_id, quantity, unit_price, line_total) VALUES ($1, $2, $3, $4, $5, $6)",
          [itemId, invoiceId, item.id, item.cartQty, item.selling_price, lineTotal]
        );

        const movementId = crypto.randomUUID();
        await db.execute(
          "INSERT INTO stock_movements (id, product_id, change_quantity, reason, reference_invoice_id, created_by) VALUES ($1, $2, $3, $4, $5, $6)",
          [movementId, item.id, -item.cartQty, 'sale', invoiceId, creatorId]
        );

        await db.execute(
          "UPDATE products SET quantity_in_stock = quantity_in_stock - $1 WHERE id = $2",
          [item.cartQty, item.id]
        );
      }
      
      queryClient.invalidateQueries({ queryKey: productKeys.all });
      queryClient.invalidateQueries({ queryKey: dashboardKeys.all });
      queryClient.invalidateQueries({ queryKey: reportKeys.all });
      clearCart();
      refetchProducts();
      
      toast.success("Invoice generated successfully");
      navigate(`/print/${invoiceId}`);
      
    } catch (err) {
      console.error(err);
      toast.error("Error saving invoice: " + String(err));
    }
  };

  return (
    <div className="flex flex-col lg:flex-row h-[calc(100vh-3rem)] gap-6 overflow-hidden">
      <ProductCatalog 
        search={search}
        setSearch={setSearch}
        filteredProducts={filteredProducts}
        searchInputRef={searchInputRef}
      />

      <div className="flex-4 flex flex-col bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <Cart />
        <CheckoutSummary 
          cartLength={cart.length}
          totalItems={totalItems}
          subtotal={subtotal}
          taxPercent={taxPercent}
          setTaxPercent={setTaxPercent}
          taxAmount={taxAmount}
          total={total}
          paymentMethod={paymentMethod}
          setPaymentMethod={setPaymentMethod}
          onSaveInvoice={handleSaveInvoice}
        />
      </div>
    </div>
  );
}

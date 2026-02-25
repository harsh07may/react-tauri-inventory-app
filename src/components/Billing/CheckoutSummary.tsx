import { Banknote, CreditCard, Printer, QrCode } from 'lucide-react';

interface Props {
  cartLength: number;
  totalItems: number;
  subtotal: number;
  taxPercent: number;
  setTaxPercent: (val: number) => void;
  taxAmount: number;
  total: number;
  paymentMethod: 'cash' | 'card' | 'upi';
  setPaymentMethod: (val: 'cash' | 'card' | 'upi') => void;
  onSaveInvoice: () => void;
}

export function CheckoutSummary({
  cartLength,
  totalItems,
  subtotal,
  taxPercent,
  setTaxPercent,
  taxAmount,
  total,
  paymentMethod,
  setPaymentMethod,
  onSaveInvoice
}: Props) {
  return (
    <div className="p-6 bg-slate-50 border-t border-slate-200">
      <div className="flex justify-between mb-2 text-sm text-slate-600">
        <span>Subtotal ({totalItems} items)</span>
        <span>${subtotal.toFixed(2)}</span>
      </div>
      <div className="flex justify-between mb-2 text-sm text-slate-600 items-center">
        <span className="flex items-center gap-2">
          Tax 
          <input 
            type="number" 
            className="w-12 px-2 py-1 border border-slate-300 rounded outline-none focus:border-primary"
            value={taxPercent} 
            onChange={e => setTaxPercent(Number(e.target.value) || 0)} 
          />%
        </span>
        <span>${taxAmount.toFixed(2)}</span>
      </div>
      <div className="flex justify-between mt-4 pt-4 border-t border-dashed border-slate-300 text-xl font-extrabold text-slate-900">
        <span>Grand Total</span>
        <span className="text-primary">${total.toFixed(2)}</span>
      </div>

      <div className="mt-6 mb-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
        Payment Method
      </div>
      <div className="grid grid-cols-3 gap-2 mb-4">
        <button className={`p-3 border rounded-lg flex flex-col items-center gap-1 cursor-pointer transition-all ${paymentMethod === 'cash' ? 'border-primary bg-primary/10 text-primary' : 'bg-white text-slate-600 border-slate-300 hover:bg-slate-50'}`} onClick={() => setPaymentMethod('cash')}>
          <Banknote size={20} />
          <span className="text-sm font-medium">Cash</span>
        </button>
        <button className={`p-3 border rounded-lg flex flex-col items-center gap-1 cursor-pointer transition-all ${paymentMethod === 'card' ? 'border-primary bg-primary/10 text-primary' : 'bg-white text-slate-600 border-slate-300 hover:bg-slate-50'}`} onClick={() => setPaymentMethod('card')}>
          <CreditCard size={20} />
          <span className="text-sm font-medium">Card</span>
        </button>
        <button className={`p-3 border rounded-lg flex flex-col items-center gap-1 cursor-pointer transition-all ${paymentMethod === 'upi' ? 'border-primary bg-primary/10 text-primary' : 'bg-white text-slate-600 border-slate-300 hover:bg-slate-50'}`} onClick={() => setPaymentMethod('upi')}>
          <QrCode size={20} />
          <span className="text-sm font-medium">UPI</span>
        </button>
      </div>

      <div className="flex gap-4">
        <button className="flex-1 bg-primary text-white border-none p-4 rounded-lg text-base font-bold cursor-pointer flex justify-center items-center gap-2 transition-colors hover:bg-blue-600 disabled:bg-slate-400 disabled:cursor-not-allowed" disabled={cartLength === 0} onClick={onSaveInvoice}>
          <Printer size={20} />
          Save & Print (Ctrl+Enter)
        </button>
      </div>
    </div>
  );
}

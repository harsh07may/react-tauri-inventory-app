import { Minus, Plus, Trash2 } from 'lucide-react';
import { useCartStore } from '../../store/useCartStore';

export function Cart() {
  const { cart, updateCartQty, removeCartItem, clearCart } = useCartStore();

  return (
    <>
      <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
        <span className="font-bold text-slate-900">Current Order</span>
        <button 
          className="text-red-500 bg-transparent border-none cursor-pointer text-sm font-medium hover:text-red-600 transition-colors"
          onClick={clearCart}
        >
          Clear All
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-2 flex flex-col gap-1">
        {cart.length === 0 ? (
          <div className="p-8 text-center text-slate-400">
            Cart is empty. Select products to add.
          </div>
        ) : (
          cart.map(item => (
            <div key={item.id} className="flex items-center p-3 border border-slate-200 rounded-lg gap-4">
              <div className="flex-2 min-w-0">
                <div className="font-semibold text-sm text-slate-800 whitespace-nowrap overflow-hidden text-ellipsis">{item.name}</div>
                <div className="text-xs text-slate-500">${item.selling_price.toFixed(2)}</div>
              </div>
              
              <div className="flex items-center border border-slate-300 rounded-md overflow-hidden shrink-0">
                <button className="bg-slate-100 border-none w-7 h-7 flex items-center justify-center cursor-pointer text-slate-500 hover:bg-slate-200 hover:text-primary transition-colors" onClick={() => updateCartQty(item.id, -1)}><Minus size={14} /></button>
                <input readOnly className="w-8 h-7 border-none text-center text-sm font-semibold bg-white outline-none" value={item.cartQty} />
                <button className="bg-slate-100 border-none w-7 h-7 flex items-center justify-center cursor-pointer text-slate-500 hover:bg-slate-200 hover:text-primary transition-colors" onClick={() => updateCartQty(item.id, 1)}><Plus size={14} /></button>
              </div>

              <div className="flex-1 text-right font-bold text-sm text-slate-900 shrink-0">
                ${(item.selling_price * item.cartQty).toFixed(2)}
              </div>

              <button className="bg-transparent border-none text-slate-300 cursor-pointer hover:text-red-500 p-1 shrink-0 transition-colors" onClick={() => removeCartItem(item.id)}>
                <Trash2 size={16} />
              </button>
            </div>
          ))
        )}
      </div>
    </>
  );
}

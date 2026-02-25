import { Search, ShoppingCart } from 'lucide-react';
import { useRef } from 'react';
import { useCartStore } from '../../store/useCartStore';
import { Product } from '../../types';

interface Props {
  search: string;
  setSearch: (val: string) => void;
  filteredProducts: Product[];
  searchInputRef: React.RefObject<HTMLInputElement | null>;
}

export function ProductCatalog({ search, setSearch, filteredProducts, searchInputRef }: Props) {
  const addToCart = useCartStore((state) => state.addToCart);
  const parentRef = useRef<HTMLDivElement>(null);

  // We have a grid layout. Virtualization for a grid can be tricky with different widths.
  // Instead of complex grid virtualization which might break responsiveness, 
  // Let's use a simpler fixed grid or we can stick to native scrolling if the list isn't massive (50 limit is already applied).
  // Given the debounce limits it to 50 items anyway (LIMIT 50 in our hook), virtualization is strictly not necessary here.
  // We'll leave it as a native grid for now since 50 items render instantly. If we remove the LIMIT 50 in the future, we can add window virtualization.
  
  return (
    <div className="flex-6 flex flex-col bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
      <div className="p-4 border-b border-slate-200 bg-slate-50">
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            ref={searchInputRef}
            type="text" 
            className="w-full py-3 pr-4 pl-10 border border-slate-300 rounded-lg text-sm outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20" 
            placeholder="Search item by name or SKU..." 
            value={search}
            onChange={e => setSearch(e.target.value)}
            autoFocus
          />
        </div>
      </div>
      
      <div ref={parentRef} className="flex-1 overflow-y-auto p-4 grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-4 bg-slate-100 items-start content-start">
        {filteredProducts.map(p => {
          const outOfStock = p.quantity_in_stock === 0;
          const lowStock = p.quantity_in_stock > 0 && p.quantity_in_stock <= p.low_stock_threshold;
          
          return (
            <div 
              key={p.id} 
              className={`bg-white border border-slate-200 rounded-xl p-4 cursor-pointer transition-all flex flex-col relative hover:shadow-md hover:-translate-y-0.5 ${outOfStock ? 'opacity-50 grayscale hover:shadow-none hover:translate-y-0' : 'hover:border-primary'}`}
              onClick={() => !outOfStock && addToCart(p)}
            >
              <div className={`absolute top-2 right-2 text-[10px] font-bold py-0.5 px-1.5 rounded-full ${outOfStock ? 'bg-red-100 text-red-800' : lowStock ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}>
                {p.quantity_in_stock} LEFT
              </div>
              <div className="aspect-4/3 bg-slate-50 rounded-lg mb-3 flex items-center justify-center text-slate-400">
                <ShoppingCart size={32} className="opacity-50" />
              </div>
              <div className="font-semibold text-sm text-slate-800 mb-1 whitespace-nowrap overflow-hidden text-ellipsis">{p.name}</div>
              <div className="flex justify-between items-end mt-auto">
                <div className="text-[10px] text-slate-500 font-mono">{p.sku || 'NO-SKU'}</div>
                <div className="font-bold text-primary text-base">${p.selling_price.toFixed(2)}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

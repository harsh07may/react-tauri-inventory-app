import { useVirtualizer } from '@tanstack/react-virtual';
import { Edit2, Package, Trash2 } from 'lucide-react';
import { useRef } from 'react';
import { Product } from '../../types';

interface Props {
  products: Product[];
  isLoading: boolean;
  onEdit: (product: Product) => void;
  onDelete: (id: string) => void;
}

export function ProductsTable({ products, isLoading, onEdit, onDelete }: Props) {
  const parentRef = useRef<HTMLDivElement>(null);

  const rowVirtualizer = useVirtualizer({
    count: products.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 61, // Exact height of the rows
    overscan: 5,
  });

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm flex flex-col flex-1 min-h-0">
      <div className="overflow-x-auto">
        <div className="w-full flex border-b border-slate-200 bg-slate-50 sticky top-0 z-10 shadow-sm text-xs font-semibold text-slate-500 uppercase tracking-wider">
          <div className="py-3 px-4 flex-1 min-w-50">Product Name</div>
          <div className="py-3 px-4 w-37.5">SKU</div>
          <div className="py-3 px-4 w-37.5">Category</div>
          <div className="py-3 px-4 w-30 text-right">Selling Price</div>
          <div className="py-3 px-4 w-25 text-center">Qty</div>
          <div className="py-3 px-4 w-37.5">Status</div>
          <div className="py-3 px-4 w-30 text-right">Actions</div>
        </div>
      </div>
      
      <div ref={parentRef} className="flex-1 overflow-auto">
        {isLoading ? (
          <div className="p-8 text-center text-slate-500 border-b border-slate-100">
            Loading products...
          </div>
        ) : products.length === 0 ? (
          <div className="p-8 text-center text-slate-500 border-b border-slate-100">
            No products found. Add your first product!
          </div>
        ) : (
          <div 
            style={{
              height: `${rowVirtualizer.getTotalSize()}px`,
              width: '100%',
              position: 'relative',
            }}
          >
            {rowVirtualizer.getVirtualItems().map((virtualRow) => {
              const p = products[virtualRow.index];
              const isLowStock = p.quantity_in_stock <= p.low_stock_threshold;
              
              return (
                <div 
                  key={virtualRow.index}
                  className="hover:bg-slate-50 absolute top-0 left-0 w-full flex items-center border-b border-slate-100 bg-white"
                  style={{
                    height: `${virtualRow.size}px`,
                    transform: `translateY(${virtualRow.start}px)`,
                  }}
                >
                  <div className="p-4 text-sm text-slate-700 flex-1 min-w-50">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-slate-100 rounded flex items-center justify-center text-slate-400 shrink-0">
                        <Package size={18} />
                      </div>
                      <span className="font-medium whitespace-nowrap overflow-hidden text-ellipsis">{p.name}</span>
                    </div>
                  </div>
                  <div className="p-4 text-sm text-slate-500 font-mono w-37.5">{p.sku}</div>
                  <div className="p-4 text-sm text-slate-500 w-37.5">General</div>
                  <div className="p-4 text-sm text-slate-700 text-right font-medium w-30">${p.selling_price.toFixed(2)}</div>
                  <div className={`p-4 text-sm text-center font-bold w-25 ${isLowStock ? 'text-red-600' : 'text-slate-700'}`}>
                    {p.quantity_in_stock}
                  </div>
                  <div className="p-4 text-sm text-slate-700 w-37.5">
                    <span className={`inline-flex items-center gap-1.5 py-1 px-2.5 rounded-full text-xs font-medium leading-none ${isLowStock ? 'bg-red-50 text-red-700 border border-red-200 animate-pulse' : 'bg-emerald-50 text-emerald-700 border border-emerald-200'}`}>
                      <div className={`w-1.5 h-1.5 rounded-full ${isLowStock ? 'bg-red-500' : 'bg-emerald-500'}`} />
                      {isLowStock ? 'Low Stock' : 'In Stock'}
                    </span>
                  </div>
                  <div className="p-4 text-sm text-slate-700 text-right w-30">
                    <button className="bg-transparent border-none text-slate-400 cursor-pointer p-1 rounded hover:text-primary transition-colors" onClick={() => onEdit(p)}><Edit2 size={16} /></button>
                    <button className="bg-transparent border-none text-slate-400 cursor-pointer p-1 rounded hover:text-red-500 transition-colors" onClick={() => onDelete(p.id)}><Trash2 size={16} /></button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

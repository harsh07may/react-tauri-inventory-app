import { useVirtualizer } from '@tanstack/react-virtual';
import { ExternalLink, X } from 'lucide-react';
import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Invoice } from '../../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  invoices: Invoice[];
  isLoading: boolean;
}

export function TransactionsModal({ isOpen, onClose, invoices, isLoading }: Props) {
  const parentRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const rowVirtualizer = useVirtualizer({
    count: invoices.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 48, // approximate height of invoice row
    overscan: 5,
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl flex flex-col overflow-hidden max-h-[90vh]">
        <div className="p-5 px-6 border-b border-slate-100 flex justify-between items-center bg-white z-20 shrink-0">
          <div>
            <h3 className="text-slate-900 text-lg font-bold">All Transactions</h3>
            <p className="text-slate-500 text-sm mt-0.5">{invoices.length} total records</p>
          </div>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 bg-slate-100 hover:bg-slate-200 p-2 rounded-lg cursor-pointer transition-colors border-none flex items-center justify-center"
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="overflow-x-auto shrink-0">
          <div className="w-full flex border-b border-slate-200 bg-slate-50 sticky top-0 z-10 shadow-sm text-xs font-semibold text-slate-500 uppercase tracking-wider">
            <div className="py-3 px-6 flex-1 min-w-40">Invoice ID</div>
            <div className="py-3 px-6 w-48">Date</div>
            <div className="py-3 px-6 w-32">Payment</div>
            <div className="py-3 px-6 w-40 text-right pr-8">Amount</div>
          </div>
        </div>

        <div ref={parentRef} className="flex-1 overflow-auto bg-white min-h-60">
          {isLoading ? (
            <div className="p-8 text-center text-slate-500 flex items-center justify-center h-full">
              Loading transactions...
            </div>
          ) : invoices.length === 0 ? (
            <div className="p-8 text-center text-slate-500 flex items-center justify-center h-full">
              No transactions found.
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
                const inv = invoices[virtualRow.index];
                const dateStr = new Date(inv.created_at + 'Z').toLocaleString('en-US', {
                  dateStyle: 'medium',
                  timeStyle: 'short'
                });
                
                return (
                  <div
                    key={virtualRow.index}
                    onClick={() => {
                      onClose();
                      navigate(`/print/${inv.id}`);
                    }}
                    className="hover:bg-blue-50/50 absolute top-0 left-0 w-full flex items-center border-b border-slate-100 transition-colors cursor-pointer group"
                    style={{
                      height: `${virtualRow.size}px`,
                      transform: `translateY(${virtualRow.start}px)`,
                    }}
                  >
                    <div className="py-3 px-6 flex-1 min-w-40 font-medium text-slate-900 group-hover:text-primary transition-colors flex items-center gap-2" title={inv.invoice_number}>
                      <span className="overflow-hidden text-ellipsis whitespace-nowrap">{inv.invoice_number}</span>
                      <ExternalLink size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <div className="py-3 px-6 w-48 text-sm text-slate-600">
                      {dateStr}
                    </div>
                    <div className="py-3 px-6 w-32">
                      <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider
                        ${inv.payment_method === 'cash' ? 'bg-green-50 text-green-700 border-green-100' : ''}
                        ${inv.payment_method === 'card' ? 'bg-blue-50 text-blue-700 border-blue-100' : ''}
                        ${inv.payment_method === 'upi' ? 'bg-purple-50 text-purple-700 border-purple-100' : ''}
                        border
                      `}>
                        <span className={`w-1.5 h-1.5 rounded-full ${inv.payment_method === 'cash' ? 'bg-green-600' : inv.payment_method === 'card' ? 'bg-blue-600' : 'bg-purple-600'}`}></span>
                        {inv.payment_method}
                      </span>
                    </div>
                    <div className="py-3 px-6 w-40 text-right font-semibold text-slate-900 pr-8">
                      ${inv.total_amount.toFixed(2)}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

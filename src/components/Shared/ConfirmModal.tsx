import { AlertTriangle, X } from 'lucide-react';

interface Props {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export function ConfirmModal({ isOpen, title, message, onConfirm, onCancel, isLoading }: Props) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-60 p-4">
      <div className="bg-white w-full max-w-sm rounded-xl shadow-2xl overflow-hidden flex flex-col scale-100 animate-in fade-in zoom-in-95 duration-200">
        <div className="p-6 flex flex-col gap-4">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-red-100 text-red-600 flex items-center justify-center shrink-0">
              <AlertTriangle size={24} />
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-start mb-1">
                <h3 className="text-lg font-bold text-slate-900">{title}</h3>
                <button 
                  onClick={onCancel}
                  className="bg-transparent border-none text-slate-400 cursor-pointer p-1 rounded hover:bg-slate-100 hover:text-slate-700 transition-colors -mt-1 -mr-2"
                >
                  <X size={20} />
                </button>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed">
                {message}
              </p>
            </div>
          </div>
        </div>
        
        <div className="px-6 py-4 border-t border-slate-100 flex justify-end gap-3 bg-slate-50">
          <button 
            type="button" 
            disabled={isLoading} 
            className="bg-white border border-slate-300 text-slate-700 px-4 py-2 rounded-md font-medium cursor-pointer hover:bg-slate-50 transition-colors disabled:opacity-50" 
            onClick={onCancel}
          >
            Cancel
          </button>
          <button 
            type="button" 
            disabled={isLoading} 
            className="bg-red-600 text-white border-none px-4 py-2 rounded-md font-semibold text-sm cursor-pointer shadow-sm hover:bg-red-700 transition-colors disabled:opacity-50"
            onClick={onConfirm}
          >
            {isLoading ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  );
}

import { Percent, Receipt, Save, Store } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { useSettings, useUpdateSettings } from '../hooks/useSettings';

export default function Settings() {
  const { data: settings, isLoading } = useSettings();
  const updateSettings = useUpdateSettings();

  const [shopName, setShopName] = useState('');
  const [taxNumber, setTaxNumber] = useState('');
  const [taxPercent, setTaxPercent] = useState('');

  useEffect(() => {
    if (settings) {
      setShopName(settings.shopName);
      setTaxNumber(settings.taxNumber);
      setTaxPercent(settings.defaultTaxPercent.toString());
    }
  }, [settings]);

  const handleSave = () => {
    updateSettings.mutate(
      { shopName, taxNumber, defaultTaxPercent: parseFloat(taxPercent) || 0 },
      {
        onSuccess: () => toast.success('Shop settings saved successfully!'),
        onError: (err) => toast.error(`Failed to save settings: ${err.message}`)
      }
    );
  };

  if (isLoading) return <div className="p-8 text-center text-slate-500">Loading settings...</div>;

  return (
    <div className="flex flex-col h-full gap-6">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-2 pb-4 border-b border-slate-200">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">System Settings</h1>
          <p className="text-slate-500 text-base">Configure your shop details and manage data backup.</p>
        </div>
      </header>

      {/* Shop Configuration Section */}
      <section className="flex flex-col gap-4 bg-white rounded-xl border border-slate-200 p-6 md:p-8 shadow-sm">
        <div className="flex items-center gap-3 border-b border-slate-100 pb-4 mb-2">
          <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
            <Store size={24} />
          </div>
          <div>
            <h2 className="text-slate-900 text-xl font-bold leading-tight">Shop Configuration</h2>
            <p className="text-slate-500 text-sm">General information about your retail store.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          <label className="flex flex-col gap-2 md:col-span-2">
            <span className="text-slate-900 text-sm font-semibold">Shop Name</span>
            <div className="relative">
              <Store className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input 
                className="flex w-full rounded-lg border border-slate-300 bg-slate-50 text-slate-900 placeholder:text-slate-400 focus:border-primary focus:ring-1 focus:ring-primary h-12 pl-11 pr-4 text-base transition-colors duration-200" 
                placeholder="e.g. City General Store" 
                type="text" 
                value={shopName}
                onChange={e => setShopName(e.target.value)}
              />
            </div>
          </label>

          <label className="flex flex-col gap-2">
            <span className="text-slate-900 text-sm font-semibold">GST/Tax Number</span>
            <div className="relative">
              <Receipt className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input 
                className="flex w-full rounded-lg border border-slate-300 bg-slate-50 text-slate-900 placeholder:text-slate-400 focus:border-primary focus:ring-1 focus:ring-primary h-12 pl-11 pr-4 text-base transition-colors duration-200" 
                placeholder="e.g. 22AAAAA0000A1Z5" 
                type="text" 
                value={taxNumber}
                onChange={e => setTaxNumber(e.target.value)}
              />
            </div>
          </label>

          <label className="flex flex-col gap-2">
            <span className="text-slate-900 text-sm font-semibold">Default Tax Percentage (%)</span>
            <div className="relative">
              <Percent className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input 
                className="flex w-full rounded-lg border border-slate-300 bg-slate-50 text-slate-900 placeholder:text-slate-400 focus:border-primary focus:ring-1 focus:ring-primary h-12 pl-11 pr-4 text-base transition-colors duration-200" 
                placeholder="0.00" 
                type="number" 
                value={taxPercent}
                onChange={e => setTaxPercent(e.target.value)}
              />
            </div>
          </label>
        </div>

        <div className="flex justify-end pt-4">
          <button 
            onClick={handleSave}
            disabled={updateSettings.isPending}
            className="flex items-center gap-2 bg-primary hover:bg-blue-600 text-white font-medium py-2.5 px-6 rounded-lg transition-colors shadow-sm shadow-blue-200 border-none cursor-pointer disabled:opacity-50"
          >
            <Save size={20} />
            {updateSettings.isPending ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </section>
    </div>
  );
}

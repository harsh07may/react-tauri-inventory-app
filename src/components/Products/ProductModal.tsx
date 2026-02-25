import { zodResolver } from '@hookform/resolvers/zod';
import { Edit3, Info, PackageSearch, QrCode, Save, X } from 'lucide-react';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useCreateProduct, useUpdateProduct } from '../../hooks/useProducts';
import { Product } from '../../types';

interface Props {
  product?: Product;
  onClose: () => void;
}

const productSchema = z.object({
  name: z.string().min(1, 'Product Name is required'),
  sku: z.string().optional(),
  purchase_price: z.number().min(0, 'Must be greater than 0'),
  selling_price: z.number().min(0, 'Must be greater than 0'),
  quantity_in_stock: z.number().int().min(0, 'Must be greater than 0'),
  low_stock_threshold: z.number().int().min(0, 'Must be greater than 0'),
}).refine(data => data.selling_price >= data.purchase_price, {
  message: "Selling price cannot be lower than purchase price",
  path: ["selling_price"]
});

type FormValues = z.infer<typeof productSchema>;

export function ProductModal({ product, onClose }: Props) {
  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();

  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: '',
      sku: '',
      purchase_price: 0,
      selling_price: 0,
      quantity_in_stock: 0,
      low_stock_threshold: 5
    }
  });

  useEffect(() => {
    if (product) {
      reset({
        name: product.name,
        sku: product.sku || '',
        purchase_price: product.purchase_price,
        selling_price: product.selling_price,
        quantity_in_stock: product.quantity_in_stock,
        low_stock_threshold: product.low_stock_threshold
      });
    }
  }, [product, reset]);

  const onSubmit = (data: FormValues) => {
    if (product) {
      updateProduct.mutate({ ...product, ...data }, {
        onSuccess: () => onClose()
      });
    } else {
      createProduct.mutate({ ...data, sku: data.sku || null, description: null, category: null }, {
        onSuccess: () => onClose()
      });
    }
  };

  const isPending = createProduct.isPending || updateProduct.isPending;

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-opacity">
      <div className="relative w-full max-w-2xl transform overflow-hidden rounded-xl bg-white shadow-2xl transition-all border border-slate-200 flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4 shrink-0 bg-white">
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <PackageSearch className="text-primary" size={24} />
            {product ? 'Edit Product' : 'Add New Product'}
          </h2>
          <button 
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition-colors bg-transparent border-none cursor-pointer p-1"
          >
            <X size={24} />
          </button>
        </div>
        
        <div className="overflow-y-auto px-6 py-6 bg-white flex-1">
          <form id="product-form" onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              <label className="col-span-1 md:col-span-2 flex flex-col gap-1.5">
                <span className="text-sm font-medium text-slate-700">Product Name</span>
                <div className="relative">
                  <input 
                    autoFocus
                    className={`w-full rounded-lg border bg-slate-50 text-slate-900 placeholder:text-slate-400 focus:border-primary focus:ring-1 focus:ring-primary h-12 pl-4 pr-10 transition-colors outline-none
                      ${errors.name ? 'border-red-500' : 'border-slate-200'}
                    `}
                    placeholder="e.g., Wireless Mechanical Keyboard" 
                    type="text" 
                    {...register('name')}
                  />
                  <Edit3 className="absolute right-3 top-3.5 text-slate-400 pointer-events-none" size={20} />
                </div>
                {errors.name && <span className="text-xs text-red-500 mt-1">{errors.name.message}</span>}
              </label>

              <label className="col-span-1 md:col-span-2 flex flex-col gap-1.5">
                <span className="text-sm font-medium text-slate-700">SKU / Barcode</span>
                <div className="relative flex gap-2">
                  <input
                    className="flex-1 rounded-lg border border-slate-200 bg-slate-50 text-slate-900 placeholder:text-slate-400 focus:border-primary focus:ring-1 focus:ring-primary h-12 px-4 transition-colors outline-none"
                    placeholder="Scan or enter SKU" 
                    type="text" 
                    {...register('sku')}
                  />
                  <button
                    className="flex shrink-0 items-center justify-center h-12 w-12 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-primary transition-colors cursor-pointer"
                    title="Generate SKU" 
                    type="button"
                    onClick={() => {
                      const randomSku = 'SKU-' + Math.random().toString(36).substr(2, 6).toUpperCase();
                      reset({ ...product, name: register('name').name, sku: randomSku });
                    }}
                  >
                    <QrCode size={20} />
                  </button>
                </div>
              </label>

              <div className="col-span-1 md:col-span-2 grid grid-cols-2 gap-6 p-4 rounded-lg bg-slate-50 border border-slate-100">
                <h3 className="col-span-2 text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">Pricing Information</h3>
                
                <label className="flex flex-col gap-1.5">
                  <span className="text-sm font-medium text-slate-700">Purchase Price</span>
                  <div className="relative">
                    <span className="absolute left-3 top-3.5 text-slate-500">$</span>
                    <input
                      className={`w-full rounded-lg border bg-white text-slate-900 placeholder:text-slate-400 focus:border-primary focus:ring-1 focus:ring-primary h-12 pl-8 pr-4 transition-colors font-mono outline-none
                        ${errors.purchase_price ? 'border-red-500' : 'border-slate-200'}
                      `}
                      placeholder="0.00" 
                      step="0.01" 
                      type="number" 
                      {...register('purchase_price', { valueAsNumber: true })}
                    />
                  </div>
                  {errors.purchase_price && <span className="text-xs text-red-500 mt-1">{errors.purchase_price.message}</span>}
                </label>

                <label className="flex flex-col gap-1.5">
                  <span className="text-sm font-medium text-slate-700">Selling Price</span>
                  <div className="relative">
                    <span className="absolute left-3 top-3.5 text-slate-500">$</span>
                    <input
                      className={`w-full rounded-lg border bg-white text-slate-900 placeholder:text-slate-400 focus:border-primary focus:ring-1 focus:ring-primary h-12 pl-8 pr-4 transition-colors font-mono outline-none
                        ${errors.selling_price ? 'border-red-500' : 'border-slate-200'}
                      `}
                      placeholder="0.00" 
                      step="0.01" 
                      type="number" 
                      {...register('selling_price', { valueAsNumber: true })}
                    />
                  </div>
                  {errors.selling_price && <span className="text-xs text-red-500 mt-1">{errors.selling_price.message}</span>}
                </label>
              </div>

              <div className="col-span-1 md:col-span-2 grid grid-cols-2 gap-6">
                <label className="flex flex-col gap-1.5">
                  <span className="text-sm font-medium text-slate-700">Current Quantity</span>
                  <div className="relative">
                    <input
                      className={`w-full rounded-lg border bg-slate-50 text-slate-900 placeholder:text-slate-400 focus:border-primary focus:ring-1 focus:ring-primary h-12 px-4 transition-colors outline-none
                        ${errors.quantity_in_stock ? 'border-red-500' : 'border-slate-200'}
                      `}
                      placeholder="0" 
                      type="number" 
                      {...register('quantity_in_stock', { valueAsNumber: true })}
                    />
                  </div>
                  {errors.quantity_in_stock && <span className="text-xs text-red-500 mt-1">{errors.quantity_in_stock.message}</span>}
                </label>

                <label className="flex flex-col gap-1.5">
                  <span className="text-sm font-medium text-slate-700 flex items-center gap-1.5" title="Alert when stock falls below this number">
                    Low Stock Alert
                    <Info size={14} className="text-slate-400 cursor-help" />
                  </span>
                  <div className="relative">
                    <input
                      className={`w-full rounded-lg border bg-slate-50 text-slate-900 placeholder:text-slate-400 focus:border-primary focus:ring-1 focus:ring-primary h-12 px-4 transition-colors outline-none
                        ${errors.low_stock_threshold ? 'border-red-500' : 'border-slate-200'}
                      `}
                      placeholder="10" 
                      type="number" 
                      {...register('low_stock_threshold', { valueAsNumber: true })}
                    />
                  </div>
                  {errors.low_stock_threshold && <span className="text-xs text-red-500 mt-1">{errors.low_stock_threshold.message}</span>}
                </label>
              </div>

              <div className="col-span-1 md:col-span-2 flex items-center gap-6 pt-2">
                <label className="inline-flex items-center cursor-pointer group">
                  <input defaultChecked className="sr-only peer" type="checkbox" />
                  <div className="relative w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:inset-s-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                  <span className="ms-3 text-sm font-medium text-slate-700 group-hover:text-slate-900 transition-colors">Active Product</span>
                </label>
                
                <label className="inline-flex items-center cursor-pointer group">
                  <input className="sr-only peer" type="checkbox" />
                  <div className="relative w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:inset-s-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                  <span className="ms-3 text-sm font-medium text-slate-700 group-hover:text-slate-900 transition-colors">Taxable</span>
                </label>
              </div>

            </div>
          </form>
        </div>
        
        <div className="flex items-center justify-end gap-3 border-t border-slate-100 bg-slate-50 px-6 py-4 shrink-0">
          <button
            className="rounded-lg px-6 py-3 text-sm font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-200 focus:outline-none transition-all cursor-pointer border-none bg-slate-100 disabled:opacity-50"
            type="button"
            disabled={isPending}
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            form="product-form"
            className="flex items-center gap-2 rounded-lg bg-primary px-8 py-3 text-sm font-bold text-white shadow-md shadow-primary/20 hover:bg-blue-600 focus:outline-none transition-all cursor-pointer border-none disabled:opacity-50"
            type="submit"
            disabled={isPending}
          >
            <Save size={20} />
            {isPending ? 'Saving...' : 'Save Product'}
          </button>
        </div>
      </div>
    </div>
  );
}

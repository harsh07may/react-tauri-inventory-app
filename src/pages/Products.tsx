import { Plus } from 'lucide-react';
import { useState } from 'react';
import { ProductModal } from '../components/Products/ProductModal';
import { ProductsTable } from '../components/Products/ProductsTable';
import { ConfirmModal } from '../components/Shared/ConfirmModal';
import { useDeleteProduct, useProducts } from '../hooks/useProducts';
import { Product } from '../types';

export default function Products() {
  const { data: products = [], isLoading, error } = useProducts();
  const deleteProduct = useDeleteProduct();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | undefined>();
  const [deletingProductId, setDeletingProductId] = useState<string | null>(null);

  const handleAdd = () => {
    setEditingProduct(undefined);
    setIsModalOpen(true);
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  const confirmDelete = (id: string) => {
    setDeletingProductId(id);
  };

  const executeDelete = () => {
    if (deletingProductId) {
      deleteProduct.mutate(deletingProductId, {
        onSettled: () => setDeletingProductId(null)
      });
    }
  };

  if (error) {
    return <div className="p-8 text-center text-red-500">Error loading products: {String(error)}</div>;
  }

  return (
    <div className="flex flex-col h-full">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-200">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Product Inventory</h1>
          <p className="text-slate-500 text-base">Manage stock levels, prices, and product details.</p>
        </div>
        <div className="flex gap-3">
          <button 
            className="flex items-center justify-center gap-2 h-10 px-5 bg-primary hover:bg-blue-600 text-white rounded-lg shadow-sm shadow-primary/20 transition-all text-sm font-semibold border-none cursor-pointer" 
            onClick={handleAdd}
          >
            <Plus size={18} />
            <span>Add Product</span>
          </button>
        </div>
      </header>

      <ProductsTable 
        products={products}
        isLoading={isLoading}
        onEdit={handleEdit}
        onDelete={confirmDelete}
      />

      {isModalOpen && (
        <ProductModal 
          product={editingProduct} 
          onClose={() => setIsModalOpen(false)} 
        />
      )}
      
      <ConfirmModal 
        isOpen={deletingProductId !== null}
        title="Delete Product"
        message="Are you sure you want to delete this product? This action cannot be undone."
        onConfirm={executeDelete}
        onCancel={() => setDeletingProductId(null)}
        isLoading={deleteProduct.isPending}
      />
    </div>
  );
}

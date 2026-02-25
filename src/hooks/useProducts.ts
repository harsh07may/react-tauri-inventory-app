import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { getDb } from '../db';
import { Product } from '../types';

export const productKeys = {
  all: ['products'] as const,
  lists: () => [...productKeys.all, 'list'] as const,
  list: (filters: string) => [...productKeys.lists(), { filters }] as const,
  details: () => [...productKeys.all, 'detail'] as const,
  detail: (id: string) => [...productKeys.details(), id] as const,
};

export function useProducts() {
  return useQuery({
    queryKey: productKeys.lists(),
    queryFn: async () => {
      const db = await getDb();
      return db.select<Product[]>("SELECT * FROM products ORDER BY name ASC");
    },
  });
}

export function useSearchProducts(searchTerm: string) {
  return useQuery({
    queryKey: [...productKeys.lists(), { search: searchTerm }],
    queryFn: async () => {
      const db = await getDb();
      if (!searchTerm) {
        return db.select<Product[]>("SELECT * FROM products ORDER BY name ASC LIMIT 50");
      }
      const term = `%${searchTerm}%`;
      return db.select<Product[]>(
        "SELECT * FROM products WHERE name LIKE $1 OR sku LIKE $1 ORDER BY name ASC LIMIT 50",
        [term]
      );
    }
  });
}

export function useDeleteProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const db = await getDb();
      await db.execute("DELETE FROM products WHERE id = $1", [id]);
      return id;
    },
    onSuccess: () => {
      toast.success('Product deleted successfully');
      queryClient.invalidateQueries({ queryKey: productKeys.all });
    },
    onError: (error) => {
      console.error(error);
      toast.error('Cannot delete product if it has sales history.');
    }
  });
}

export function useCreateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (product: Omit<Product, 'id' | 'created_at' | 'updated_at'>) => {
      const db = await getDb();
      const newId = crypto.randomUUID();
      await db.execute(
        "INSERT INTO products (id, name, sku, purchase_price, selling_price, quantity_in_stock, low_stock_threshold) VALUES ($1, $2, $3, $4, $5, $6, $7)",
        [newId, product.name, product.sku || '', product.purchase_price, product.selling_price, product.quantity_in_stock, product.low_stock_threshold]
      );
      return { id: newId, ...product };
    },
    onSuccess: () => {
      toast.success('Product added successfully');
      queryClient.invalidateQueries({ queryKey: productKeys.all });
    },
    onError: (error) => {
      toast.error(`Error adding product: ${error}`);
    }
  });
}

export function useUpdateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (product: Product) => {
      const db = await getDb();
      await db.execute(
        "UPDATE products SET name = $1, sku = $2, purchase_price = $3, selling_price = $4, quantity_in_stock = $5, low_stock_threshold = $6 WHERE id = $7",
        [product.name, product.sku || '', product.purchase_price, product.selling_price, product.quantity_in_stock, product.low_stock_threshold, product.id]
      );
      return product;
    },
    onSuccess: () => {
      toast.success('Product updated successfully');
      queryClient.invalidateQueries({ queryKey: productKeys.all });
    },
    onError: (error) => {
      toast.error(`Error updating product: ${error}`);
    }
  });
}

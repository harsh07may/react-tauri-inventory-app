import { useQuery } from '@tanstack/react-query';
import { getDb } from '../db';
import { Invoice } from '../types';

export const dashboardKeys = {
  all: ['dashboard'] as const,
  stats: () => [...dashboardKeys.all, 'stats'] as const,
  recentInvoices: () => [...dashboardKeys.all, 'recentInvoices'] as const,
};

export function useDashboardStats() {
  return useQuery({
    queryKey: dashboardKeys.stats(),
    queryFn: async () => {
      const db = await getDb();
      
      // We use SQLite's built-in date functions to convert the UTC timestamp to localtime
      // and compare it to the current localtime date
      const salesResult = await db.select<{total: number | null}[]>(
        "SELECT SUM(total_amount) as total FROM invoices WHERE date(created_at, 'localtime') = date('now', 'localtime')"
      );
      
      const invoicesResult = await db.select<{count: number}[]>(
        "SELECT COUNT(*) as count FROM invoices WHERE date(created_at, 'localtime') = date('now', 'localtime')"
      );
      
      const prevSalesResult = await db.select<{total: number | null}[]>(
        "SELECT SUM(total_amount) as total FROM invoices WHERE date(created_at, 'localtime') = date('now', '-1 day', 'localtime')"
      );
      
      const prevInvoicesResult = await db.select<{count: number}[]>(
        "SELECT COUNT(*) as count FROM invoices WHERE date(created_at, 'localtime') = date('now', '-1 day', 'localtime')"
      );

      const lowStockResult = await db.select<{count: number}[]>(
        "SELECT COUNT(*) as count FROM products WHERE quantity_in_stock <= low_stock_threshold"
      );
      
      const todaySales = salesResult[0]?.total || 0;
      const yesterdaySales = prevSalesResult[0]?.total || 0;
      const salesGrowth = yesterdaySales === 0 ? 100 : ((todaySales - yesterdaySales) / yesterdaySales) * 100;

      const invoicesToday = invoicesResult[0]?.count || 0;
      const invoicesYesterday = prevInvoicesResult[0]?.count || 0;
      const invoicesGrowth = invoicesYesterday === 0 ? 100 : ((invoicesToday - invoicesYesterday) / invoicesYesterday) * 100;

      return {
        todaySales,
        salesGrowth,
        invoicesToday,
        invoicesGrowth,
        lowStockItems: lowStockResult[0]?.count || 0,
      };
    }
  });
}

export function useRecentInvoices() {
  return useQuery({
    queryKey: dashboardKeys.recentInvoices(),
    queryFn: async () => {
      const db = await getDb();
      // Fetch the 5 most recent invoices
      return db.select<Invoice[]>("SELECT * FROM invoices ORDER BY created_at DESC LIMIT 5");
    }
  });
}

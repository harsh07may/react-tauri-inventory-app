import { useQuery } from '@tanstack/react-query';
import { getDb } from '../db';

export const reportKeys = {
  all: ['reports'] as const,
  stats: () => [...reportKeys.all, 'stats'] as const,
  weeklySales: () => [...reportKeys.all, 'weeklySales'] as const,
  allInvoices: () => [...reportKeys.all, 'allInvoices'] as const,
};

export function useReportStats() {
  return useQuery({
    queryKey: reportKeys.stats(),
    queryFn: async () => {
      const db = await getDb();
      
      const salesResult = await db.select<{total: number | null}[]>(
        "SELECT SUM(total_amount) as total FROM invoices WHERE date(created_at, 'localtime') = date('now', 'localtime')"
      );
      const prevSalesResult = await db.select<{total: number | null}[]>(
        "SELECT SUM(total_amount) as total FROM invoices WHERE date(created_at, 'localtime') = date('now', '-1 day', 'localtime')"
      );

      const monthlySalesResult = await db.select<{total: number | null}[]>(
        "SELECT SUM(total_amount) as total FROM invoices WHERE strftime('%Y-%m', created_at, 'localtime') = strftime('%Y-%m', 'now', 'localtime')"
      );
      const prevMonthlySalesResult = await db.select<{total: number | null}[]>(
        "SELECT SUM(total_amount) as total FROM invoices WHERE strftime('%Y-%m', created_at, 'localtime') = strftime('%Y-%m', 'now', '-1 month', 'localtime')"
      );

      const invoicesResult = await db.select<{count: number}[]>(
        "SELECT COUNT(*) as count FROM invoices WHERE date(created_at, 'localtime') = date('now', 'localtime')"
      );

      const todaySales = salesResult[0]?.total || 0;
      const yesterdaySales = prevSalesResult[0]?.total || 0;
      const salesGrowth = yesterdaySales === 0 ? 100 : ((todaySales - yesterdaySales) / yesterdaySales) * 100;

      const monthlySales = monthlySalesResult[0]?.total || 0;
      const lastMonthSales = prevMonthlySalesResult[0]?.total || 0;
      const monthlyGrowth = lastMonthSales === 0 ? 100 : ((monthlySales - lastMonthSales) / lastMonthSales) * 100;

      return {
        todaySales,
        salesGrowth,
        monthlySales,
        monthlyGrowth,
        todayInvoices: invoicesResult[0]?.count || 0,
      };
    }
  });
}

export function useWeeklySales() {
  return useQuery({
    queryKey: reportKeys.weeklySales(),
    queryFn: async () => {
      const db = await getDb();
      
      // Get sales from the last 7 days grouped by date
      const result = await db.select<{date: string, total: number}[]>(`
        SELECT 
          date(created_at, 'localtime') as date, 
          SUM(total_amount) as total 
        FROM invoices 
        WHERE date(created_at, 'localtime') >= date('now', '-6 days', 'localtime')
        GROUP BY date(created_at, 'localtime')
        ORDER BY date ASC
      `);

      // Fill in zeros for missing days
      const days = [];
      let totalWeekSales = 0;
      
      for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const dateStr = d.toISOString().split('T')[0]; // Format exactly like SQLite date() e.g. YYYY-MM-DD
        
        const found = result.find(r => r.date === dateStr);
        const amt = found ? found.total : 0;
        
        days.push({
          date: dateStr,
          dayOfWeek: d.toLocaleDateString('en-US', { weekday: 'short' }),
          total: amt
        });
        
        totalWeekSales += amt;
      }

      return {
        days,
        totalWeekSales
      };
    }
  });
}

export function useAllInvoices() {
  return useQuery({
    queryKey: reportKeys.allInvoices(),
    queryFn: async () => {
      const db = await getDb();
      // Fetch all invoices ordered by newest first
      return db.select<any[]>("SELECT * FROM invoices ORDER BY created_at DESC");
    }
  });
}

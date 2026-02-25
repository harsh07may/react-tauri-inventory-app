import { Calendar, DollarSign, Download, Receipt, TrendingDown, TrendingUp } from 'lucide-react';
import { useState } from 'react';
import { TransactionsModal } from '../components/Reports/TransactionsTable';
import { useRecentInvoices } from '../hooks/useDashboard';
import { useAllInvoices, useReportStats, useWeeklySales } from '../hooks/useReports';

export default function Reports() {
  const [isTransactionsModalOpen, setIsTransactionsModalOpen] = useState(false);

  const { data: stats, isLoading: statsLoading } = useReportStats();
  const { data: weekly, isLoading: weeklyLoading } = useWeeklySales();
  const { data: allInvoices = [], isLoading: invoicesLoading } = useAllInvoices();
  const { data: recentInvoices = [], isLoading: recentLoading } = useRecentInvoices();

  const maxDailySales = weekly?.days ? Math.max(...weekly.days.map(d => d.total)) : 0;

  const handleExportCSV = () => {
    const headers = ['Invoice ID', 'Date', 'Payment Method', 'Total Amount'];
    const csvContent = [
      headers.join(','),
      ...allInvoices.map(inv => [
        inv.invoice_number,
        new Date(inv.created_at + 'Z').toLocaleString('en-US'),
        inv.payment_method,
        inv.total_amount
      ].join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `sales_report_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  return (
    <div className="flex flex-col h-full gap-6">
      {/* Header Section */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-slate-200">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Sales Reports & Analytics</h1>
          <p className="text-slate-500 text-base">Overview of your store's performance metrics.</p>
        </div>
        
        <button 
          onClick={handleExportCSV}
          className="flex items-center justify-center gap-2 h-10 px-5 bg-white border border-slate-200 hover:border-primary/50 hover:bg-slate-50 text-slate-700 rounded-lg shadow-sm transition-all text-sm font-semibold group cursor-pointer"
        >
          <Download size={20} className="group-hover:text-primary transition-colors" />
          <span>Export to CSV</span>
        </button>
      </header>

      {/* Summary Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Today's Sales */}
        <div className="flex flex-col gap-3 rounded-xl p-6 bg-white border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <p className="text-slate-500 text-sm font-medium uppercase tracking-wider">Today's Sales</p>
            <div className="bg-blue-50 p-2 rounded-lg text-primary">
              <DollarSign size={20} />
            </div>
          </div>
          <p className="text-slate-900 text-3xl font-bold tracking-tight">
            {statsLoading ? '...' : `$${(stats?.todaySales || 0).toFixed(2)}`}
          </p>
          <div className="flex items-center gap-1 text-sm">
            {!statsLoading && stats && (
              <span className={`flex items-center font-medium ${stats.salesGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {stats.salesGrowth >= 0 ? <TrendingUp size={16}/> : <TrendingDown size={16}/>}
                {Math.abs(stats.salesGrowth).toFixed(1)}%
              </span>
            )}
            <span className="text-slate-400">vs yesterday</span>
          </div>
        </div>

        {/* Monthly Total */}
        <div className="flex flex-col gap-3 rounded-xl p-6 bg-white border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <p className="text-slate-500 text-sm font-medium uppercase tracking-wider">Monthly Total</p>
            <div className="bg-blue-50 p-2 rounded-lg text-primary">
              <Calendar size={20} />
            </div>
          </div>
          <p className="text-slate-900 text-3xl font-bold tracking-tight">
            {statsLoading ? '...' : `$${(stats?.monthlySales || 0).toFixed(2)}`}
          </p>
          <div className="flex items-center gap-1 text-sm">
             {!statsLoading && stats && (
              <span className={`flex items-center font-medium ${stats.monthlyGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {stats.monthlyGrowth >= 0 ? <TrendingUp size={16}/> : <TrendingDown size={16}/>}
                {Math.abs(stats.monthlyGrowth).toFixed(1)}%
              </span>
            )}
            <span className="text-slate-400">vs last month</span>
          </div>
        </div>

        {/* Total Invoices */}
        <div className="flex flex-col gap-3 rounded-xl p-6 bg-white border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <p className="text-slate-500 text-sm font-medium uppercase tracking-wider">Total Invoices</p>
            <div className="bg-blue-50 p-2 rounded-lg text-primary">
              <Receipt size={20} />
            </div>
          </div>
          <p className="text-slate-900 text-3xl font-bold tracking-tight">
            {statsLoading ? '...' : stats?.todayInvoices || 0}
          </p>
          <div className="flex items-center gap-1 text-sm">
            <span className="text-slate-500">Processed today</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart Section */}
        <div className="lg:col-span-2 flex flex-col rounded-xl bg-white border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-slate-900 text-lg font-bold">Daily Sales (Last 7 Days)</h2>
              <p className="text-slate-500 text-sm mt-1">Gross sales volume by day</p>
            </div>
            <div className="flex flex-col items-end">
              <p className="text-slate-900 text-2xl font-bold">
                {weeklyLoading ? '...' : `$${(weekly?.totalWeekSales || 0).toFixed(2)}`}
              </p>
              <div className="flex items-center gap-1 text-sm">
                <span className="text-slate-400">total in period</span>
              </div>
            </div>
          </div>

          <div className="p-6 pt-8">
            <div className="grid grid-cols-7 gap-3 sm:gap-6 h-60 items-end">
              {weeklyLoading ? (
                <div className="col-span-7 h-full flex items-center justify-center text-slate-500">Loading chart data...</div>
              ) : (
                weekly?.days?.map((day, idx) => {
                  // Calculate height percentage: minimum 5% to show something if there are sales, 0 if nothing.
                  const heightPercent = maxDailySales === 0 ? 0 : Math.max(2, (day.total / maxDailySales) * 100);
                  
                  return (
                    <div key={idx} className="flex flex-col items-center gap-2 group h-full justify-end w-full">
                      <div className="relative w-full max-w-12 bg-slate-100 rounded-t-sm group-hover:bg-slate-200 transition-all flex flex-col justify-end overflow-hidden h-full" title={`$${day.total.toFixed(2)}`}>
                        <div 
                          className="w-full bg-blue-500/80 group-hover:bg-blue-600 transition-colors rounded-t-sm" 
                          style={{ height: `${heightPercent}%` }}
                        ></div>
                      </div>
                      <span className="text-xs font-semibold text-slate-500">{day.dayOfWeek}</span>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* Recent Transactions Mini Table */}
        <div className="flex flex-col rounded-xl bg-white border border-slate-200 shadow-sm overflow-hidden min-h-0">
          <div className="p-4 px-6 border-b border-slate-100">
            <h3 className="text-slate-900 text-base font-bold">Recent Invoices</h3>
          </div>
          <div className="overflow-x-auto overflow-y-auto flex-1 h-full">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 text-xs uppercase font-medium text-slate-500 sticky top-0">
                <tr>
                  <th className="px-6 py-3 border-b border-slate-200">Invoice ID</th>
                  <th className="px-6 py-3 border-b border-slate-200">Payment</th>
                  <th className="px-6 py-3 border-b border-slate-200 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recentLoading ? (
                  <tr>
                    <td colSpan={3} className="px-6 py-8 text-center text-slate-500">
                      Loading...
                    </td>
                  </tr>
                ) : recentInvoices.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="px-6 py-8 text-center text-slate-500">
                      Empty.
                    </td>
                  </tr>
                ) : (
                  recentInvoices.map((inv) => (
                    <tr key={inv.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-3 font-medium text-slate-900 block overflow-hidden text-ellipsis whitespace-nowrap max-w-24" title={inv.invoice_number}>{inv.invoice_number}</td>
                      <td className="px-6 py-3">
                        <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium uppercase
                          ${inv.payment_method === 'cash' ? 'bg-green-50 text-green-700 border-green-100' : ''}
                          ${inv.payment_method === 'card' ? 'bg-blue-50 text-blue-700 border-blue-100' : ''}
                          ${inv.payment_method === 'upi' ? 'bg-purple-50 text-purple-700 border-purple-100' : ''}
                          border
                        `}>
                          <span className={`w-1.5 h-1.5 rounded-full ${inv.payment_method === 'cash' ? 'bg-green-600' : inv.payment_method === 'card' ? 'bg-blue-600' : 'bg-purple-600'}`}></span>
                          {inv.payment_method}
                        </span>
                      </td>
                      <td className="px-6 py-3 text-right font-semibold text-slate-900">${inv.total_amount.toFixed(2)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          <div className="px-6 py-3 border-t border-slate-100 flex justify-center bg-slate-50">
            <button 
              onClick={() => setIsTransactionsModalOpen(true)}
              className="text-sm text-primary font-medium hover:text-blue-700 transition-colors bg-transparent border-none cursor-pointer"
            >
              View All Transactions
            </button>
          </div>
        </div>
      </div>

      <TransactionsModal 
        isOpen={isTransactionsModalOpen} 
        onClose={() => setIsTransactionsModalOpen(false)} 
        invoices={allInvoices} 
        isLoading={invoicesLoading} 
      />
    </div>
  );
}

import { AlertTriangle, ArrowRight, Eye, PackageOpen, Receipt, Search, TrendingDown, TrendingUp } from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDashboardStats, useRecentInvoices } from '../hooks/useDashboard';

export default function Dashboard() {
  const navigate = useNavigate();
  const { data: stats, isLoading: statsLoading } = useDashboardStats();
  const { data: recentInvoices = [], isLoading: invoicesLoading } = useRecentInvoices();
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="flex flex-col h-full gap-8">
      {/* Header Section */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-200">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Dashboard Overview</h1>
          <p className="text-slate-500 text-base">Welcome back, here is what's happening at your store today.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              className="pl-10 pr-4 h-10 rounded-lg border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 w-64 shadow-sm" 
              placeholder="Search invoice..." 
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </header>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Sales Card */}
        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between h-40 relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <Receipt size={120} className="text-primary" />
          </div>
          <div>
            <p className="text-slate-500 font-medium text-sm uppercase tracking-wider mb-2">Today's Total Sales</p>
            <h3 className="text-4xl font-bold text-slate-900 tracking-tight">
              {statsLoading ? '...' : `$${(stats?.todaySales || 0).toFixed(2)}`}
            </h3>
          </div>
          <div className="flex items-center gap-2 mt-4">
            {!statsLoading && stats && (
              <span className={`text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1 ${stats.salesGrowth >= 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                {stats.salesGrowth >= 0 ? <TrendingUp size={14}/> : <TrendingDown size={14}/>}
                {stats.salesGrowth >= 0 ? '+' : ''}{stats.salesGrowth.toFixed(1)}%
              </span>
            )}
            <span className="text-slate-500 text-sm">vs yesterday</span>
          </div>
        </div>

        {/* Invoices Card */}
        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between h-40 relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <PackageOpen size={120} className="text-primary" />
          </div>
          <div>
            <p className="text-slate-500 font-medium text-sm uppercase tracking-wider mb-2">Invoices Today</p>
            <h3 className="text-4xl font-bold text-slate-900 tracking-tight">
              {statsLoading ? '...' : stats?.invoicesToday || 0}
            </h3>
          </div>
          <div className="flex items-center gap-2 mt-4">
            {!statsLoading && stats && (
              <span className={`text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1 ${stats.invoicesGrowth >= 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                {stats.invoicesGrowth >= 0 ? <TrendingUp size={14}/> : <TrendingDown size={14}/>}
                {stats.invoicesGrowth >= 0 ? '+' : ''}{stats.invoicesGrowth.toFixed(1)}%
              </span>
            )}
            <span className="text-slate-500 text-sm">vs yesterday</span>
          </div>
        </div>

        {/* Low Stock Card */}
        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between h-40 relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <AlertTriangle size={120} className="text-red-500" />
          </div>
          <div>
            <p className="text-slate-500 font-medium text-sm uppercase tracking-wider mb-2">Low Stock Items</p>
            <h3 className="text-4xl font-bold text-slate-900 tracking-tight">
              {statsLoading ? '...' : stats?.lowStockItems || 0}
            </h3>
          </div>
          <div className="flex items-center gap-2 mt-4">
            <span className="bg-red-100 text-red-700 text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
              <AlertTriangle size={14} />
              Action needed
            </span>
            <span className="text-slate-500 text-sm">Restock soon</span>
          </div>
        </div>
      </div>

      {/* Recent Invoices Table Section */}
      <div className="flex flex-col gap-4 flex-1">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-900">Recent Invoices</h2>
          <Link to="/reports" className="text-sm font-medium text-primary hover:text-blue-700 flex items-center gap-1 bg-transparent border-none cursor-pointer no-underline">
            View All
            <ArrowRight size={16} />
          </Link>
        </div>
        
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm flex-1 min-h-0">
          <div className="overflow-x-auto h-full">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider w-32">Invoice #</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider w-40">Date & Time</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Customer</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider w-48">Payment Method</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right w-40">Total Amount</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-center w-24">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {invoicesLoading ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-slate-500">
                      Loading recent invoices...
                    </td>
                  </tr>
                ) : recentInvoices.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-slate-500">
                      No invoices found. Generate a sale in Billing to see it here!
                    </td>
                  </tr>
                ) : (
                  recentInvoices
                    .filter(inv => inv.invoice_number.toLowerCase().includes(searchTerm.toLowerCase()))
                    .map((inv) => (
                    <tr key={inv.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 text-sm font-medium text-slate-900">{inv.invoice_number}</td>
                      <td className="px-6 py-4 text-sm text-slate-500">
                        {new Date(inv.created_at + 'Z').toLocaleString('en-US', {
                          month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit'
                        })}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-900 flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-500">WC</div>
                        Walk-in Customer
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium uppercase
                          ${inv.payment_method === 'cash' ? 'bg-green-100 text-green-800' : ''}
                          ${inv.payment_method === 'card' ? 'bg-blue-100 text-blue-800' : ''}
                          ${inv.payment_method === 'upi' ? 'bg-purple-100 text-purple-800' : ''}
                        `}>
                          {inv.payment_method}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm font-bold text-slate-900 text-right">${inv.total_amount.toFixed(2)}</td>
                      <td className="px-6 py-4 text-center">
                        <button 
                          onClick={() => navigate(`/print/${inv.id}`)}
                          className="text-slate-400 hover:text-primary transition-colors bg-transparent border-none cursor-pointer"
                        >
                          <Eye size={20} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

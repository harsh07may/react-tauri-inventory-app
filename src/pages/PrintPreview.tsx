import { documentDir } from '@tauri-apps/api/path';
import { save } from '@tauri-apps/plugin-dialog';
import { writeFile } from '@tauri-apps/plugin-fs';
import { toPng } from 'html-to-image';
import { jsPDF } from 'jspdf';
import { Download, Printer, Receipt, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import { getDb } from '../db';
import { useSettings } from '../hooks/useSettings';

interface Invoice {
  id: string;
  invoice_number: string;
  subtotal: number;
  tax_percent: number;
  tax_amount: number;
  total_amount: number;
  payment_method: string;
  created_at: string;
}

interface InvoiceItem {
  id: string;
  product_name: string;
  quantity: number;
  unit_price: number;
  line_total: number;
}

export default function PrintPreview() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: settings } = useSettings();
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [items, setItems] = useState<InvoiceItem[]>([]);
  const [isExporting, setIsExporting] = useState(false);
  const receiptRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadInvoice = async () => {
      try {
        const db = await getDb();
        const invRes = await db.select<Invoice[]>("SELECT * FROM invoices WHERE id = $1", [id]);
        if (invRes.length > 0) {
          setInvoice(invRes[0]);
          const itemRes = await db.select<InvoiceItem[]>(
            `SELECT i.*, p.name as product_name 
             FROM invoice_items i 
             JOIN products p ON i.product_id = p.id 
             WHERE i.invoice_id = $1`, 
            [id]
          );
          setItems(itemRes);
        }
      } catch (e) {
        console.error(e);
      }
    };
    if (id) loadInvoice();
  }, [id]);

  const handleSavePdf = async () => {
    if (!receiptRef.current || !invoice) return;
    
    try {
      setIsExporting(true);
      const toastId = toast.loading('Generating PDF...');

      // 1. Render HTML to PNG Data URL using html-to-image (supports OKLCH via native browser rendering)
      const dataUrl = await toPng(receiptRef.current, {
        pixelRatio: 2,
        backgroundColor: '#ffffff'
      });

      // 2. Calculate PDF dimensions (A4 format)
      const imgWidth = 210; // A4 width in mm
      const pageHeight = 297; // A4 height in mm
      const clientWidth = receiptRef.current.clientWidth || 1;
      const clientHeight = receiptRef.current.clientHeight || 1;
      const imgHeight = (clientHeight * imgWidth) / clientWidth;
      
      const pdf = new jsPDF('p', 'mm', 'a4');
      
      // Add the image to the PDF
      pdf.addImage(dataUrl, 'PNG', 0, 0, imgWidth, Math.min(imgHeight, pageHeight));

      // 3. Get the binary array buffer
      const pdfArrayBuffer = pdf.output('arraybuffer');

      // 4. Prompt user to save the file natively
      toast.loading('Select save location...', { id: toastId });
      
      const defaultPath = await documentDir();
      const filePath = await save({
        defaultPath: `${defaultPath}/Invoice_${invoice.invoice_number}.pdf`,
        filters: [{ name: 'PDF Document', extensions: ['pdf'] }]
      });

      if (filePath) {
        // 5. Write file using Tauri FS
        await writeFile(filePath, new Uint8Array(pdfArrayBuffer));
        toast.success(`Saved PDF to ${filePath}`, { id: toastId });
      } else {
        toast.dismiss(toastId); // User cancelled
      }

    } catch (error) {
      console.error('Failed to export PDF:', error);
      toast.error('Failed to generate PDF');
    } finally {
      setIsExporting(false);
    }
  };

  if (!invoice) return <div className="p-8 text-center text-slate-500">Loading invoice...</div>;

  return (
    <div className="flex flex-col h-screen bg-slate-100 overflow-hidden">
      <style>{`
        .receipt-paper::before,
        .receipt-paper::after {
          content: '';
          position: absolute;
          left: 0;
          width: 100%;
          height: 8px;
          background-size: 16px 8px;
        }
        .receipt-paper::before {
          top: -4px;
          background-image: radial-gradient(circle at top, transparent 4px, white 5px);
        }
        .receipt-paper::after {
          bottom: -4px;
          background-image: radial-gradient(circle at bottom, transparent 4px, white 5px);
        }
        @media print {
          body * {
            visibility: hidden;
          }
          .receipt-paper, .receipt-paper * {
            visibility: visible;
          }
          .receipt-paper {
            position: absolute;
            left: 0;
            top: 0;
            box-shadow: none;
            width: 100%;
          }
          .receipt-paper::before, .receipt-paper::after {
            display: none;
          }
          .print-header {
            display: none;
          }
        }
      `}</style>
      <header className="flex justify-between items-center p-4 bg-white border-b border-slate-200 shadow-sm shrink-0 print-header">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-primary/10 text-primary rounded-lg flex items-center justify-center">
            <Receipt size={24} />
          </div>
          <div>
            <h2 className="text-lg font-bold m-0 text-slate-900">QuickPOS</h2>
            <p className="text-xs text-slate-500 m-0 mt-0.5">Invoice {invoice.invoice_number} Preview</p>
          </div>
        </div>
        <div className="flex gap-3">
          <button className="bg-white border border-slate-300 text-slate-700 font-semibold px-4 py-2 rounded-lg cursor-pointer flex items-center gap-2 hover:bg-slate-50 transition-colors" onClick={() => navigate(-1)}>
            <X size={18} /> Close
          </button>
          <button 
            className="bg-slate-100 text-slate-700 border border-slate-200 font-semibold px-4 py-2 rounded-lg cursor-pointer flex items-center gap-2 hover:bg-slate-200 transition-colors shadow-sm disabled:opacity-50" 
            onClick={handleSavePdf}
            disabled={isExporting}
          >
            <Download size={18} /> {isExporting ? 'Exporting...' : 'Save as PDF'}
          </button>
          <button className="bg-primary text-white border-none font-semibold px-4 py-2 rounded-lg cursor-pointer flex items-center gap-2 hover:bg-blue-600 transition-colors shadow-sm" onClick={() => window.print()}>
            <Printer size={18} /> Print Invoice
          </button>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto flex justify-center p-8">
        <div ref={receiptRef} className="w-95 bg-white min-h-150 h-fit p-6 shadow-md relative font-mono text-slate-900 receipt-paper">
          <div className="w-12 h-12 bg-slate-900 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4 font-sans">
            {settings?.shopName ? settings.shopName.charAt(0).toUpperCase() : 'S'}
          </div>
          <div className="text-center uppercase font-bold text-xl mb-1 font-sans">
            {settings?.shopName || 'ShopManager Pro'}
          </div>
          <div className="text-center text-xs text-slate-500 mb-4 border-b border-dashed border-slate-300 pb-4">
            <p className="m-0">123 Market Street, City Center</p>
            <p className="m-0 mt-1">
              Ph: +91 98765 43210
              {settings?.taxNumber ? ` | GST: ${settings.taxNumber}` : ''}
            </p>
          </div>

          <div className="flex justify-between text-xs mb-4">
            <div>
              <p className="m-0">Inv No: <strong>{invoice.invoice_number}</strong></p>
              <p className="m-0 mt-1">Date: {new Date(invoice.created_at).toLocaleDateString()}</p>
            </div>
            <div className="text-right">
              <p className="m-0">Pay: <span className="uppercase">{invoice.payment_method}</span></p>
              <p className="m-0 mt-1">Time: {new Date(invoice.created_at).toLocaleTimeString()}</p>
            </div>
          </div>

          <table className="w-full text-xs border-collapse mb-4">
            <thead>
              <tr>
                <th className="text-left pb-2 border-b border-slate-900">Item</th>
                <th className="text-center pb-2 border-b border-slate-900">Qty</th>
                <th className="text-right pb-2 border-b border-slate-900">Price</th>
                <th className="text-right pb-2 border-b border-slate-900">Total</th>
              </tr>
            </thead>
            <tbody>
              {items.map(item => (
                <tr key={item.id}>
                  <td className="text-left py-2 align-top border-b border-dashed border-slate-200">
                    <span className="font-bold block font-sans">{item.product_name}</span>
                  </td>
                  <td className="text-center py-2 align-top border-b border-dashed border-slate-200">{item.quantity}</td>
                  <td className="text-right py-2 align-top border-b border-dashed border-slate-200">{item.unit_price.toFixed(2)}</td>
                  <td className="text-right py-2 align-top border-b border-dashed border-slate-200 text-slate-900 font-bold">{item.line_total.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="border-t border-slate-900 pt-2 flex flex-col gap-1 text-xs mb-6">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>${invoice.subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Tax ({invoice.tax_percent}%)</span>
              <span>${invoice.tax_amount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-lg font-bold mt-1 font-sans">
              <span>TOTAL</span>
              <span>${invoice.total_amount.toFixed(2)}</span>
            </div>
          </div>

          <div className="text-center text-[10px] text-slate-500 mt-8">
            <p className="font-bold text-xs mb-1 text-slate-900 m-0">THANK YOU FOR VISITING!</p>
            <p className="m-0">Please visit again. No returns on perishable items.</p>
          </div>
        </div>
      </main>
    </div>
  );
}

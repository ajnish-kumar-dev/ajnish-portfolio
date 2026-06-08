import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  FileText,
  Download,
  Eye,
  Loader2,
  Calendar,
  CheckCircle,
  Clock,
  AlertCircle,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { getUserInvoices } from '../../services/orderService';
import type { Invoice } from '../../types';

const statusConfig: Record<Invoice['status'], { bg: string; text: string; icon: React.ElementType }> = {
  draft: { bg: 'bg-slate-500/20', text: 'text-slate-400', icon: FileText },
  sent: { bg: 'bg-blue-500/20', text: 'text-blue-400', icon: Clock },
  paid: { bg: 'bg-green-500/20', text: 'text-green-400', icon: CheckCircle },
  cancelled: { bg: 'bg-red-500/20', text: 'text-red-400', icon: AlertCircle },
};

export function DashboardInvoices() {
  const { user } = useAuth();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');

  useEffect(() => {
    loadInvoices();
  }, [user?.id]);

  const loadInvoices = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const data = await getUserInvoices(user.id);
      setInvoices(data);
    } catch (error) {
      console.error('Failed to load invoices:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredInvoices = invoices.filter((invoice) => {
    if (filter === 'all') return true;
    return invoice.status === filter;
  });

  const getStatusBadge = (status: Invoice['status']) => {
    const config = statusConfig[status];
    const Icon = config.icon;
    return (
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
        <Icon className="w-3.5 h-3.5" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const downloadInvoice = (invoice: Invoice) => {
    // Generate a simple text invoice (in production, use a PDF library)
    const content = generateInvoiceText(invoice);
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${invoice.invoice_number}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-white mb-2">Invoices</h1>
        <p className="text-slate-400">View and download your invoices</p>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-6"
      >
        <div className="flex flex-wrap gap-2">
          {['all', 'draft', 'sent', 'paid', 'cancelled'].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                filter === status
                  ? 'bg-cyan-500 text-slate-900'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Invoices List */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 text-cyan-400 animate-spin" />
        </div>
      ) : filteredInvoices.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-20"
        >
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-slate-800 flex items-center justify-center">
            <FileText className="w-10 h-10 text-slate-600" />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">No invoices yet</h3>
          <p className="text-slate-400">Invoices will appear here after you make a purchase</p>
        </motion.div>
      ) : (
        <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl overflow-hidden">
          <table className="w-full">
            <thead className="bg-slate-900/50">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-medium text-slate-300">Invoice</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-slate-300">Order</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-slate-300">Date</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-slate-300">Due Date</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-slate-300">Status</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-slate-300">Amount</th>
                <th className="px-6 py-4 text-right text-sm font-medium text-slate-300">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/50">
              {filteredInvoices.map((invoice, index) => (
                <motion.tr
                  key={invoice.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.05 }}
                  className="hover:bg-slate-700/30 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500/20 to-blue-600/20 flex items-center justify-center">
                        <FileText className="w-5 h-5 text-cyan-400" />
                      </div>
                      <span className="font-medium text-white">{invoice.invoice_number}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-300">{invoice.order?.order_number}</td>
                  <td className="px-6 py-4 text-slate-400">
                    {new Date(invoice.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-slate-400">
                    {invoice.due_date ? new Date(invoice.due_date).toLocaleDateString() : '-'}
                  </td>
                  <td className="px-6 py-4">{getStatusBadge(invoice.status)}</td>
                  <td className="px-6 py-4 font-semibold text-white">
                    ${invoice.order?.total?.toFixed(2) || '0.00'}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => downloadInvoice(invoice)}
                        className="p-2 text-slate-400 hover:text-cyan-400 hover:bg-slate-700 rounded-lg transition-colors"
                        title="Download"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                      <button
                        className="p-2 text-slate-400 hover:text-cyan-400 hover:bg-slate-700 rounded-lg transition-colors"
                        title="View"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function generateInvoiceText(invoice: Invoice): string {
  const order = invoice.order;
  return `
=====================================
             INVOICE
=====================================

Invoice Number: ${invoice.invoice_number}
Date: ${new Date(invoice.created_at).toLocaleDateString()}
Due Date: ${invoice.due_date ? new Date(invoice.due_date).toLocaleDateString() : 'N/A'}
Status: ${invoice.status.toUpperCase()}

-------------------------------------
BILL TO:
-------------------------------------
${order?.billing_name || 'N/A'}
${order?.billing_email || ''}
${order?.billing_address || ''}
${order?.billing_city || ''}, ${order?.billing_state || ''}
${order?.billing_postal_code || ''} ${order?.billing_country || ''}

-------------------------------------
ITEMS:
-------------------------------------
${order?.items?.map(item =>
  `${item.product_name} x${item.quantity} @ $${item.unit_price.toFixed(2)} = $${item.total_price.toFixed(2)}`
).join('\n') || 'No items'}

-------------------------------------
                    Subtotal: $${order?.subtotal?.toFixed(2) || '0.00'}
                    Tax:      $${order?.tax?.toFixed(2) || '0.00'}
                    Discount: -$${order?.discount?.toFixed(2) || '0.00'}
-------------------------------------
                    TOTAL:    $${order?.total?.toFixed(2) || '0.00'}
=====================================

Thank you for your business!
`;
}

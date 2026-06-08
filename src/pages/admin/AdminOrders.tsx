import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Package,
  Search,
  Eye,
  ChevronDown,
  Check,
  X,
  Clock,
  Loader2,
  User,
  Mail,
  MapPin,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { getAllOrders, updateOrderStatus, getOrderById } from '../../services/orderService';
import type { Order } from '../../types';

const orderStatuses: Order['status'][] = ['pending', 'processing', 'active', 'completed', 'cancelled', 'refunded'];

export function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [updating, setUpdating] = useState<string | null>(null);

  useEffect(() => {
    loadOrders();
  }, [statusFilter]);

  const loadOrders = async () => {
    setLoading(true);
    try {
      const { orders: data } = await getAllOrders({
        status: statusFilter || undefined,
      });
      setOrders(data);
    } catch (error) {
      console.error('Failed to load orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredOrders = orders.filter((order) =>
    search
      ? order.order_number.toLowerCase().includes(search.toLowerCase()) ||
        order.billing_name.toLowerCase().includes(search.toLowerCase()) ||
        order.billing_email.toLowerCase().includes(search.toLowerCase())
      : true
  );

  const handleStatusUpdate = async (orderId: string, status: Order['status']) => {
    setUpdating(orderId);
    try {
      await updateOrderStatus(orderId, status);
      toast.success('Order status updated');
      loadOrders();
      if (selectedOrder?.id === orderId) {
        const updated = await getOrderById(orderId);
        setSelectedOrder(updated);
      }
    } catch (error) {
      toast.error('Failed to update order');
    } finally {
      setUpdating(null);
    }
  };

  const handlePaymentUpdate = async (orderId: string, paymentStatus: Order['payment_status']) => {
    setUpdating(orderId);
    try {
      await updateOrderStatus(orderId, selectedOrder?.status || 'pending', paymentStatus);
      toast.success('Payment status updated');
      loadOrders();
      if (selectedOrder?.id === orderId) {
        const updated = await getOrderById(orderId);
        setSelectedOrder(updated);
      }
    } catch (error) {
      toast.error('Failed to update payment status');
    } finally {
      setUpdating(null);
    }
  };

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-white mb-2">Orders</h1>
        <p className="text-slate-400">Manage and track customer orders</p>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-6 flex flex-col sm:flex-row gap-4"
      >
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search orders..."
            className="w-full pl-12 pr-4 py-2.5 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2.5 bg-slate-800/50 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-cyan-500"
        >
          <option value="">All Status</option>
          {orderStatuses.map((status) => (
            <option key={status} value={status}>
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </option>
          ))}
        </select>
      </motion.div>

      {/* Orders Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-slate-800/50 border border-slate-700/50 rounded-2xl overflow-hidden"
      >
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-cyan-400 animate-spin" />
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="text-center py-20">
            <Package className="w-12 h-12 text-slate-600 mx-auto mb-4" />
            <p className="text-slate-400">No orders found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-900/50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-medium text-slate-300">Order</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-slate-300">Customer</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-slate-300">Date</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-slate-300">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-slate-300">Payment</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-slate-300">Total</th>
                  <th className="px-6 py-4 text-right text-sm font-medium text-slate-300">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/50">
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-slate-700/30 transition-colors">
                    <td className="px-6 py-4">
                      <span className="font-medium text-cyan-400">{order.order_number}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-white">{order.billing_name}</p>
                        <p className="text-sm text-slate-400">{order.billing_email}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-300">
                      {new Date(order.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <select
                          value={order.status}
                          onChange={(e) => handleStatusUpdate(order.id, e.target.value as Order['status'])}
                          disabled={updating === order.id}
                          className={`px-2.5 py-1 rounded-full text-xs font-medium border-0 cursor-pointer ${
                            order.status === 'completed' ? 'bg-green-500/20 text-green-400' :
                            order.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                            order.status === 'cancelled' ? 'bg-red-500/20 text-red-400' :
                            'bg-blue-500/20 text-blue-400'
                          }`}
                        >
                          {orderStatuses.map((s) => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                        order.payment_status === 'paid' ? 'bg-green-500/20 text-green-400' :
                        order.payment_status === 'failed' ? 'bg-red-500/20 text-red-400' :
                        'bg-yellow-500/20 text-yellow-400'
                      }`}>
                        {order.payment_status}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-medium text-white">${order.total.toFixed(2)}</td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="p-2 text-slate-400 hover:text-cyan-400 hover:bg-slate-700 rounded-lg transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>

      {/* Order Detail Modal */}
      <AnimatePresence>
        {selectedOrder && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            onClick={() => setSelectedOrder(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-[#0F172A] border border-slate-700 rounded-2xl"
            >
              <div className="sticky top-0 flex items-center justify-between p-6 border-b border-slate-700 bg-[#0F172A]">
                <h2 className="text-xl font-semibold text-white">Order {selectedOrder.order_number}</h2>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="p-2 text-slate-400 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 space-y-6">
                {/* Order Status */}
                <div className="flex flex-wrap gap-4">
                  <div>
                    <label className="block text-sm text-slate-400 mb-2">Order Status</label>
                    <select
                      value={selectedOrder.status}
                      onChange={(e) => handleStatusUpdate(selectedOrder.id, e.target.value as Order['status'])}
                      className="px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
                    >
                      {orderStatuses.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm text-slate-400 mb-2">Payment Status</label>
                    <select
                      value={selectedOrder.payment_status}
                      onChange={(e) => handlePaymentUpdate(selectedOrder.id, e.target.value as Order['payment_status'])}
                      className="px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
                    >
                      <option value="pending">Pending</option>
                      <option value="paid">Paid</option>
                      <option value="failed">Failed</option>
                      <option value="refunded">Refunded</option>
                    </select>
                  </div>
                </div>

                {/* Customer Info */}
                <div className="p-4 bg-slate-800/50 rounded-xl border border-slate-700">
                  <h3 className="text-sm font-medium text-slate-300 mb-4">Customer Information</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-white">
                      <User className="w-4 h-4 text-slate-400" />
                      {selectedOrder.billing_name}
                    </div>
                    <div className="flex items-center gap-2 text-slate-300">
                      <Mail className="w-4 h-4 text-slate-400" />
                      {selectedOrder.billing_email}
                    </div>
                    {selectedOrder.billing_address && (
                      <div className="flex items-start gap-2 text-slate-300">
                        <MapPin className="w-4 h-4 text-slate-400 mt-0.5" />
                        <div>
                          {selectedOrder.billing_address}<br />
                          {selectedOrder.billing_city}, {selectedOrder.billing_state} {selectedOrder.billing_postal_code}<br />
                          {selectedOrder.billing_country}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Order Items */}
                <div>
                  <h3 className="text-sm font-medium text-slate-300 mb-4">Order Items</h3>
                  <div className="space-y-3">
                    {selectedOrder.items?.map((item) => (
                      <div key={item.id} className="flex items-center justify-between p-3 bg-slate-800/30 rounded-lg">
                        <div>
                          <p className="text-white">{item.product_name}</p>
                          <p className="text-sm text-slate-400">Qty: {item.quantity} x ${item.unit_price.toFixed(2)}</p>
                        </div>
                        <p className="font-medium text-white">${item.total_price.toFixed(2)}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Totals */}
                <div className="border-t border-slate-700 pt-4 space-y-2">
                  <div className="flex justify-between text-slate-300">
                    <span>Subtotal</span>
                    <span>${selectedOrder.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span>Tax</span>
                    <span>${selectedOrder.tax.toFixed(2)}</span>
                  </div>
                  {selectedOrder.discount > 0 && (
                    <div className="flex justify-between text-green-400">
                      <span>Discount</span>
                      <span>-${selectedOrder.discount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-xl font-bold text-white pt-2 border-t border-slate-700">
                    <span>Total</span>
                    <span>${selectedOrder.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

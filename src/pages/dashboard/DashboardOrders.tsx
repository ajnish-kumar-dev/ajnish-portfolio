import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Package,
  Eye,
  ChevronRight,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Loader2,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { getUserOrders } from '../../services/orderService';
import type { Order } from '../../types';

const statusColors: Record<Order['status'], { bg: string; text: string; icon: React.ElementType }> = {
  pending: { bg: 'bg-yellow-500/20', text: 'text-yellow-400', icon: Clock },
  processing: { bg: 'bg-blue-500/20', text: 'text-blue-400', icon: AlertCircle },
  active: { bg: 'bg-green-500/20', text: 'text-green-400', icon: CheckCircle },
  completed: { bg: 'bg-emerald-500/20', text: 'text-emerald-400', icon: CheckCircle },
  cancelled: { bg: 'bg-red-500/20', text: 'text-red-400', icon: XCircle },
  refunded: { bg: 'bg-purple-500/20', text: 'text-purple-400', icon: AlertCircle },
};

export function DashboardOrders() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');

  useEffect(() => {
    loadOrders();
  }, [user?.id]);

  const loadOrders = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const data = await getUserOrders(user.id);
      setOrders(data);
    } catch (error) {
      console.error('Failed to load orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredOrders = orders.filter((order) => {
    if (filter === 'all') return true;
    return order.status === filter;
  });

  const getStatusBadge = (status: Order['status']) => {
    const config = statusColors[status];
    const Icon = config.icon;
    return (
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
        <Icon className="w-3.5 h-3.5" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-white mb-2">My Orders</h1>
        <p className="text-slate-400">Track and manage your orders</p>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-6"
      >
        <div className="flex flex-wrap gap-2">
          {['all', 'pending', 'processing', 'active', 'completed', 'cancelled'].map((status) => (
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

      {/* Orders List */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 text-cyan-400 animate-spin" />
        </div>
      ) : filteredOrders.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-20"
        >
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-slate-800 flex items-center justify-center">
            <Package className="w-10 h-10 text-slate-600" />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">No orders yet</h3>
          <p className="text-slate-400 mb-6">Start shopping to see your orders here</p>
          <Link
            to="/dashboard/products"
            className="inline-flex items-center gap-2 px-6 py-3 bg-cyan-500 hover:bg-cyan-600 text-slate-900 font-medium rounded-xl transition-colors"
          >
            Browse Products
          </Link>
        </motion.div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order, index) => (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-slate-800/50 border border-slate-700/50 rounded-2xl overflow-hidden hover:border-cyan-500/30 transition-all"
            >
              <div className="p-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center flex-shrink-0">
                      <Package className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold text-white">{order.order_number}</p>
                      <p className="text-sm text-slate-400">
                        {new Date(order.created_at).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    {getStatusBadge(order.status)}
                    <span className="text-xl font-bold text-white">
                      ${order.total.toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Order Items Preview */}
                {order.items && order.items.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-slate-700/50">
                    <div className="flex flex-wrap gap-2">
                      {order.items.slice(0, 3).map((item) => (
                        <span
                          key={item.id}
                          className="px-3 py-1.5 bg-slate-700/50 rounded-lg text-sm text-slate-300"
                        >
                          {item.product_name} x{item.quantity}
                        </span>
                      ))}
                      {order.items.length > 3 && (
                        <span className="px-3 py-1.5 text-slate-400 text-sm">
                          +{order.items.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>

              <div className="px-6 py-4 bg-slate-900/50 border-t border-slate-700/50 flex items-center justify-between">
                <div className="flex items-center gap-4 text-sm">
                  <span className="text-slate-400">
                    {order.items?.length || 0} items
                  </span>
                  <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                    order.payment_status === 'paid'
                      ? 'bg-green-500/20 text-green-400'
                      : 'bg-yellow-500/20 text-yellow-400'
                  }`}>
                    {order.payment_status.toUpperCase()}
                  </span>
                </div>
                <Link
                  to={`/dashboard/orders/${order.id}`}
                  className="flex items-center gap-1 text-cyan-400 hover:text-cyan-300 text-sm font-medium transition-colors"
                >
                  View Details <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

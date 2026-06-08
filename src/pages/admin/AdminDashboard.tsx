import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  ShoppingBag,
  Users,
  DollarSign,
  Package,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { getProductStats } from '../../services/productService';
import { getOrderStats } from '../../services/orderService';
import { getUserStats } from '../../services/userService';
import { getAllOrders } from '../../services/orderService';

interface AdminStats {
  products: { total: number; active: number; draft: number };
  orders: { total: number; pending: number; processing: number; completed: number; totalRevenue: number };
  users: { total: number; clients: number; admins: number };
}

export function AdminDashboard() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const [productStats, orderStats, userStats, ordersData] = await Promise.all([
        getProductStats(),
        getOrderStats(),
        getUserStats(),
        getAllOrders({ limit: 5 }),
      ]);
      setStats({
        products: productStats,
        orders: orderStats,
        users: userStats,
      });
      setRecentOrders(ordersData.orders);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6 lg:p-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-slate-800 rounded w-48" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-slate-800 rounded-2xl" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  const statCards = [
    {
      label: 'Total Revenue',
      value: `$${(stats?.orders.totalRevenue || 0).toLocaleString()}`,
      icon: DollarSign,
      color: 'from-green-500 to-emerald-600',
      change: '+12.5%',
      positive: true,
    },
    {
      label: 'Total Orders',
      value: stats?.orders.total || 0,
      icon: ShoppingBag,
      color: 'from-cyan-500 to-blue-600',
      change: '+8.2%',
      positive: true,
    },
    {
      label: 'Total Products',
      value: stats?.products.total || 0,
      icon: Package,
      color: 'from-purple-500 to-violet-600',
      change: '+3',
      positive: true,
    },
    {
      label: 'Total Clients',
      value: stats?.users.clients || 0,
      icon: Users,
      color: 'from-orange-500 to-amber-600',
      change: '+5',
      positive: true,
    },
  ];

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-white mb-2">Admin Dashboard</h1>
        <p className="text-slate-400">Overview of your marketplace</p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <span className={`flex items-center gap-1 text-sm ${stat.positive ? 'text-green-400' : 'text-red-400'}`}>
                {stat.positive ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                {stat.change}
              </span>
            </div>
            <p className="text-2xl font-bold text-white">{stat.value}</p>
            <p className="text-sm text-slate-400">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Order Status */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-white">Order Status</h2>
            <Link to="/admin/orders" className="text-cyan-400 hover:text-cyan-300 text-sm">
              View All
            </Link>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-slate-300">Pending</span>
              <span className="px-3 py-1 bg-yellow-500/20 text-yellow-400 rounded-full text-sm font-medium">
                {stats?.orders.pending || 0}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-300">Processing</span>
              <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-sm font-medium">
                {stats?.orders.processing || 0}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-300">Completed</span>
              <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm font-medium">
                {stats?.orders.completed || 0}
              </span>
            </div>
          </div>
        </motion.div>

        {/* Product Status */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-white">Product Status</h2>
            <Link to="/admin/products" className="text-cyan-400 hover:text-cyan-300 text-sm">
              View All
            </Link>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-slate-300">Active</span>
              <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm font-medium">
                {stats?.products.active || 0}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-300">Draft</span>
              <span className="px-3 py-1 bg-slate-500/20 text-slate-400 rounded-full text-sm font-medium">
                {stats?.products.draft || 0}
              </span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Recent Orders */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-slate-800/50 border border-slate-700/50 rounded-2xl overflow-hidden"
      >
        <div className="p-6 border-b border-slate-700/50">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white">Recent Orders</h2>
            <Link to="/admin/orders" className="text-cyan-400 hover:text-cyan-300 text-sm flex items-center gap-1">
              View All <TrendingUp className="w-4 h-4" />
            </Link>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-900/50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Order</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/50">
              {recentOrders.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-slate-500">
                    No orders yet
                  </td>
                </tr>
              ) : (
                recentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-slate-700/30 transition-colors">
                    <td className="px-6 py-4">
                      <span className="font-medium text-white">{order.order_number}</span>
                    </td>
                    <td className="px-6 py-4 text-slate-300">{order.billing_name}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                        order.status === 'completed' ? 'bg-green-500/20 text-green-400' :
                        order.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                        'bg-blue-500/20 text-blue-400'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-medium text-white">${order.total.toFixed(2)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  ShoppingBag,
  FileText,
  DollarSign,
  Clock,
  TrendingUp,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { getClientStats } from '../../services/orderService';
import { getProducts } from '../../services/productService';
import type { Product, ClientStats } from '../../types';

export function DashboardOverview() {
  const { user, profile } = useAuth();
  const [stats, setStats] = useState<ClientStats | null>(null);
  const [recentProducts, setRecentProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [user?.id]);

  const loadData = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const [statsData, productsData] = await Promise.all([
        getClientStats(user.id),
        getProducts({ limit: 4 }),
      ]);
      setStats(statsData);
      setRecentProducts(productsData.products);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      label: 'Total Orders',
      value: stats?.totalOrders || 0,
      icon: ShoppingBag,
      color: 'from-cyan-500 to-blue-600',
    },
    {
      label: 'Total Spent',
      value: `$${(stats?.totalSpent || 0).toFixed(2)}`,
      icon: DollarSign,
      color: 'from-green-500 to-emerald-600',
    },
    {
      label: 'Active Orders',
      value: stats?.activeOrders || 0,
      icon: Clock,
      color: 'from-orange-500 to-amber-600',
    },
    {
      label: 'Pending Invoices',
      value: stats?.pendingInvoices || 0,
      icon: FileText,
      color: 'from-purple-500 to-violet-600',
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
        <h1 className="text-3xl font-bold text-white mb-2">
          Welcome back, {profile?.full_name?.split(' ')[0] || 'User'}!
        </h1>
        <p className="text-slate-400">
          Here's what's happening with your account today.
        </p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="relative overflow-hidden rounded-2xl bg-slate-800/50 border border-slate-700/50 p-6"
          >
            <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${stat.color} opacity-10 rounded-full -translate-y-1/2 translate-x-1/2`} />
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center mb-4`}>
              <stat.icon className="w-6 h-6 text-white" />
            </div>
            <p className="text-slate-400 text-sm mb-1">{stat.label}</p>
            <p className="text-2xl font-bold text-white">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="mb-8"
      >
        <h2 className="text-xl font-semibold text-white mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link
            to="/dashboard/products"
            className="flex items-center justify-between p-4 rounded-xl bg-slate-800/50 border border-slate-700/50 hover:border-cyan-500/50 transition-all group"
          >
            <div className="flex items-center gap-3">
              <ShoppingBag className="w-5 h-5 text-cyan-400" />
              <span className="text-white font-medium">Browse Products</span>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-cyan-400 group-hover:translate-x-1 transition-all" />
          </Link>
          <Link
            to="/dashboard/orders"
            className="flex items-center justify-between p-4 rounded-xl bg-slate-800/50 border border-slate-700/50 hover:border-cyan-500/50 transition-all group"
          >
            <div className="flex items-center gap-3">
              <FileText className="w-5 h-5 text-cyan-400" />
              <span className="text-white font-medium">View Orders</span>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-cyan-400 group-hover:translate-x-1 transition-all" />
          </Link>
          <Link
            to="/dashboard/invoices"
            className="flex items-center justify-between p-4 rounded-xl bg-slate-800/50 border border-slate-700/50 hover:border-cyan-500/50 transition-all group"
          >
            <div className="flex items-center gap-3">
              <TrendingUp className="w-5 h-5 text-cyan-400" />
              <span className="text-white font-medium">Download Invoices</span>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-cyan-400 group-hover:translate-x-1 transition-all" />
          </Link>
          <Link
            to="/dashboard/profile"
            className="flex items-center justify-between p-4 rounded-xl bg-slate-800/50 border border-slate-700/50 hover:border-cyan-500/50 transition-all group"
          >
            <div className="flex items-center gap-3">
              <TrendingUp className="w-5 h-5 text-cyan-400" />
              <span className="text-white font-medium">Update Profile</span>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-cyan-400 group-hover:translate-x-1 transition-all" />
          </Link>
        </div>
      </motion.div>

      {/* Featured Products */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-white">Featured Products</h2>
          <Link
            to="/dashboard/products"
            className="text-cyan-400 hover:text-cyan-300 text-sm font-medium flex items-center gap-1"
          >
            View All <ExternalLink className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-square rounded-2xl bg-slate-800 mb-4" />
                <div className="h-4 bg-slate-800 rounded w-3/4 mb-2" />
                <div className="h-4 bg-slate-800 rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : recentProducts.length === 0 ? (
          <div className="text-center py-12 rounded-2xl bg-slate-800/30 border border-slate-700/50">
            <ShoppingBag className="w-12 h-12 text-slate-600 mx-auto mb-4" />
            <p className="text-slate-400">No products available yet</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {recentProducts.map((product) => (
              <Link
                key={product.id}
                to={`/products/${product.slug}`}
                className="group"
              >
                <div className="aspect-square rounded-2xl overflow-hidden bg-slate-800 mb-4">
                  {product.image_url ? (
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <ShoppingBag className="w-12 h-12 text-slate-700" />
                    </div>
                  )}
                </div>
                <h3 className="font-medium text-white group-hover:text-cyan-400 transition-colors line-clamp-1">
                  {product.name}
                </h3>
                <p className="text-lg font-bold text-cyan-400 mt-1">
                  ${product.price.toFixed(2)}
                </p>
              </Link>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}

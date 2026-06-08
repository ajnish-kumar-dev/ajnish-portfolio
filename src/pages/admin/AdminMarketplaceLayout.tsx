import { useState } from 'react';
import { Outlet, NavLink, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Users,
  Menu,
  X,
  LogOut,
  ChevronDown,
  Settings,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const navItems = [
  { to: '/admin/marketplace', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/admin/marketplace/products', label: 'Products', icon: Package },
  { to: '/admin/marketplace/orders', label: 'Orders', icon: ShoppingBag },
  { to: '/admin/marketplace/clients', label: 'Clients', icon: Users },
];

export function AdminMarketplaceLayout() {
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-[#0A0F1E]">
      {/* Mobile Header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 z-50 h-16 bg-[#0A0F1E]/95 backdrop-blur-lg border-b border-slate-800">
        <div className="flex items-center justify-between h-full px-4">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 text-slate-400 hover:text-white transition-colors"
          >
            <Menu className="w-6 h-6" />
          </button>

          <Link to="/admin/marketplace" className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
            Admin
          </Link>

          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-violet-600 flex items-center justify-center text-white text-sm font-bold">
            {profile?.full_name?.[0] || 'A'}
          </div>
        </div>
      </header>

      {/* Sidebar */}
      <AnimatePresence>
        {(sidebarOpen || true) && (
          <>
            {/* Mobile Overlay */}
            <AnimatePresence>
              {sidebarOpen && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setSidebarOpen(false)}
                  className="lg:hidden fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
                />
              )}
            </AnimatePresence>

            {/* Sidebar Content */}
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: sidebarOpen || window.innerWidth >= 1024 ? 0 : -280 }}
              className="fixed top-0 left-0 bottom-0 z-50 w-[280px] bg-[#0F172A] border-r border-slate-800"
            >
              <div className="flex flex-col h-full">
                {/* Logo */}
                <div className="h-16 flex items-center justify-between px-6 border-b border-slate-800">
                  <Link to="/admin/marketplace" className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                    Marketplace Admin
                  </Link>
                  <button
                    onClick={() => setSidebarOpen(false)}
                    className="lg:hidden p-2 text-slate-400 hover:text-white transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Navigation */}
                <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
                  {navItems.map((item) => (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      end={item.end}
                      onClick={() => setSidebarOpen(false)}
                      className={({ isActive }) =>
                        `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                          isActive
                            ? 'bg-gradient-to-r from-cyan-500/20 to-blue-600/20 text-cyan-400 border border-cyan-500/30'
                            : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                        }`
                      }
                    >
                      <item.icon className="w-5 h-5" />
                      <span className="font-medium">{item.label}</span>
                    </NavLink>
                  ))}
                </nav>

                {/* User Section */}
                <div className="border-t border-slate-800 p-4">
                  <div className="relative">
                    <button
                      onClick={() => setUserMenuOpen(!userMenuOpen)}
                      className="w-full flex items-center gap-3 p-3 rounded-xl bg-slate-800/50 hover:bg-slate-800 transition-colors"
                    >
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-violet-600 flex items-center justify-center text-white font-semibold">
                        {profile?.full_name?.[0] || 'A'}
                      </div>
                      <div className="flex-1 text-left">
                        <p className="text-sm font-medium text-white truncate">
                          {profile?.full_name || 'Admin'}
                        </p>
                        <p className="text-xs text-slate-400">Administrator</p>
                      </div>
                      <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} />
                    </button>

                    <AnimatePresence>
                      {userMenuOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="absolute bottom-full left-0 right-0 mb-2 p-2 bg-slate-800 rounded-xl border border-slate-700 shadow-xl"
                        >
                          <button
                            onClick={handleSignOut}
                            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-red-400 hover:bg-slate-700 transition-colors"
                          >
                            <LogOut className="w-4 h-4" />
                            Sign Out
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="lg:ml-[280px] pt-16 lg:pt-0 min-h-screen">
        <Outlet />
      </main>
    </div>
  );
}

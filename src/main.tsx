import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { CartProvider } from './hooks/useCart';

// Portfolio App
import App from './App';

// Auth
import { AuthPage } from './pages/auth/AuthPage';

// Portfolio Admin
import { ProtectedRoute } from './components/admin/ProtectedRoute';
import { AdminLayout } from './pages/admin/AdminLayout';
import { LoginPage } from './pages/admin/LoginPage';
import { DashboardPage } from './pages/admin/DashboardPage';
import { ProjectsPage } from './pages/admin/ProjectsPage';
import { SkillsPage } from './pages/admin/SkillsPage';
import { ExperiencePage } from './pages/admin/ExperiencePage';
import { BlogPage } from './pages/admin/BlogPage';
import { TestimonialsPage } from './pages/admin/TestimonialsPage';

// Marketplace
import { ProductsPage } from './pages/marketplace/ProductsPage';
import { ProductDetailPage } from './pages/marketplace/ProductDetailPage';
import { CartPage } from './pages/marketplace/CartPage';
import { CheckoutPage } from './pages/marketplace/CheckoutPage';

// Client Dashboard
import { DashboardLayout } from './pages/dashboard/DashboardLayout';
import { DashboardOverview } from './pages/dashboard/DashboardOverview';
import { DashboardOrders } from './pages/dashboard/DashboardOrders';
import { DashboardInvoices } from './pages/dashboard/DashboardInvoices';
import { DashboardProfile } from './pages/dashboard/DashboardProfile';

// Admin Marketplace
import { AdminMarketplaceLayout } from './pages/admin/AdminMarketplaceLayout';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminProducts } from './pages/admin/AdminProducts';
import { AdminOrders } from './pages/admin/AdminOrders';
import { AdminClients } from './pages/admin/AdminClients';

const container = document.getElementById('root');
if (!container) throw new Error('Root container not found');

const root = createRoot(container);

root.render(
  <React.StrictMode>
    <HelmetProvider>
      <ThemeProvider>
        <AuthProvider>
          <CartProvider>
            <BrowserRouter>
              <Routes>
                {/* Public Marketplace Routes */}
                <Route path="/products" element={<ProductsPage />} />
                <Route path="/products/:slug" element={<ProductDetailPage />} />
                <Route path="/cart" element={<CartPage />} />
                <Route path="/checkout" element={<CheckoutPage />} />

                {/* Auth Routes */}
                <Route path="/login" element={<AuthPage />} />
                <Route path="/signup" element={<AuthPage />} />

                {/* Client Dashboard */}
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute>
                      <DashboardLayout />
                    </ProtectedRoute>
                  }
                >
                  <Route index element={<DashboardOverview />} />
                  <Route path="products" element={<ProductsPage />} />
                  <Route path="orders" element={<DashboardOrders />} />
                  <Route path="orders/:id" element={<DashboardOrders />} />
                  <Route path="invoices" element={<DashboardInvoices />} />
                  <Route path="cart" element={<CartPage />} />
                  <Route path="profile" element={<DashboardProfile />} />
                </Route>

                {/* Admin Marketplace Section */}
                <Route
                  path="/admin/marketplace"
                  element={
                    <ProtectedRoute requireAdmin>
                      <AdminMarketplaceLayout />
                    </ProtectedRoute>
                  }
                >
                  <Route index element={<AdminDashboard />} />
                  <Route path="products" element={<AdminProducts />} />
                  <Route path="orders" element={<AdminOrders />} />
                  <Route path="clients" element={<AdminClients />} />
                </Route>

                {/* Portfolio Admin Section */}
                <Route path="/admin/login" element={<LoginPage />} />
                <Route
                  path="/admin"
                  element={
                    <ProtectedRoute>
                      <AdminLayout />
                    </ProtectedRoute>
                  }
                >
                  <Route index element={<DashboardPage />} />
                  <Route path="projects" element={<ProjectsPage />} />
                  <Route path="skills" element={<SkillsPage />} />
                  <Route path="experience" element={<ExperiencePage />} />
                  <Route path="blog" element={<BlogPage />} />
                  <Route path="testimonials" element={<TestimonialsPage />} />
                </Route>

                {/* Main Portfolio Site - Catch All */}
                <Route path="/*" element={<App />} />
              </Routes>
            </BrowserRouter>
          </CartProvider>
        </AuthProvider>
      </ThemeProvider>
    </HelmetProvider>
  </React.StrictMode>
);

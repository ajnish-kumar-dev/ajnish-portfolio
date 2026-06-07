import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import App from './App';
import { ProtectedRoute } from './components/admin/ProtectedRoute';
import { AdminLayout } from './pages/admin/AdminLayout';
import { LoginPage } from './pages/admin/LoginPage';
import { DashboardPage } from './pages/admin/DashboardPage';
import { ProjectsPage } from './pages/admin/ProjectsPage';
import { SkillsPage } from './pages/admin/SkillsPage';
import { ExperiencePage } from './pages/admin/ExperiencePage';
import { BlogPage } from './pages/admin/BlogPage';
import { TestimonialsPage } from './pages/admin/TestimonialsPage';

const container = document.getElementById('root');
if (!container) throw new Error('Root container not found');

const root = createRoot(container);

root.render(
  <React.StrictMode>
    <HelmetProvider>
      <ThemeProvider>
        <AuthProvider>
          <BrowserRouter>
            <Routes>
              {/* Main Portfolio Site */}
              <Route path="/*" element={<App />} />

              {/* Admin Section */}
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
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </ThemeProvider>
    </HelmetProvider>
  </React.StrictMode>
);

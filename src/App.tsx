import React from 'react';
import { Switch, Route } from 'react-router-dom';
import { motion } from 'framer-motion';

// Layouts
import MainLayout from './layouts/main-layout';
import AdminLayout from './layouts/admin-layout';

// Pages
import HomePage from './pages/home';
import ProductsPage from './pages/products';
import ContactPage from './pages/contact';
import HowToBuyPage from './pages/how-to-buy';
import AdminLoginPage from './pages/admin/login';
import AdminDashboardPage from './pages/admin/dashboard';
import AdminProductsPage from './pages/admin/products';
import AdminAddEditProductPage from './pages/admin/add-edit-product';
import NotFoundPage from './pages/not-found';
import AdminSetupPage from './pages/admin/setup';

// Auth
import PrivateRoute from './components/private-route';

const App: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <Switch>
        {/* Public Routes */}
        <Route exact path="/">
          <MainLayout>
            <HomePage />
          </MainLayout>
        </Route>
        <Route exact path="/productos/:category?/:subcategory?">
          <MainLayout>
            <ProductsPage />
          </MainLayout>
        </Route>
        <Route exact path="/contacto">
          <MainLayout>
            <ContactPage />
          </MainLayout>
        </Route>
        <Route exact path="/como-comprar">
          <MainLayout>
            <HowToBuyPage />
          </MainLayout>
        </Route>

        {/* Admin Routes */}
        <Route exact path="/admin/login">
          <AdminLoginPage />
        </Route>
        <PrivateRoute exact path="/admin/dashboard">
          <AdminLayout>
            <AdminDashboardPage />
          </AdminLayout>
        </PrivateRoute>
        <PrivateRoute exact path="/admin/productos">
          <AdminLayout>
            <AdminProductsPage />
          </AdminLayout>
        </PrivateRoute>
        <PrivateRoute exact path="/admin/productos/nuevo">
          <AdminLayout>
            <AdminAddEditProductPage />
          </AdminLayout>
        </PrivateRoute>
        <PrivateRoute exact path="/admin/productos/editar/:id">
          <AdminLayout>
            <AdminAddEditProductPage />
          </AdminLayout>
        </PrivateRoute>

        {/* Admin Setup Route */}
        <Route exact path="/admin/setup">
          <AdminSetupPage />
        </Route>

        {/* 404 Route */}
        <Route>
          <MainLayout>
            <NotFoundPage />
          </MainLayout>
        </Route>
      </Switch>
    </motion.div>
  );
};

export default App;
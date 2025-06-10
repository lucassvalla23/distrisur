import React from 'react';
import { Link, useLocation, useHistory } from 'react-router-dom';
import { 
  Navbar, 
  NavbarBrand, 
  NavbarContent, 
  Button, 
  Dropdown, 
  DropdownTrigger, 
  DropdownMenu, 
  DropdownItem 
} from '@heroui/react';
import { Icon } from '@iconify/react';
import { motion } from 'framer-motion';
import Logo from '../components/logo';
import { useAuth } from '../contexts/auth-context';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const { currentUser, logout } = useAuth();
  const location = useLocation();
  const history = useHistory();

  const handleLogout = async () => {
    try {
      await logout();
      history.push('/admin/login');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar maxWidth="xl" isBordered className="bg-content1">
        <NavbarBrand>
          <Logo />
          <span className="ml-2 text-secondary font-medium">Panel Admin</span>
        </NavbarBrand>
        
        <NavbarContent className="hidden sm:flex gap-4" justify="center">
          <Link 
            to="/admin/dashboard" 
            className={`px-3 py-2 rounded-md ${isActive('/admin/dashboard') ? 'bg-primary-100 text-secondary' : 'text-default-600 hover:bg-content2'}`}
          >
            Dashboard
          </Link>
          <Link 
            to="/admin/productos" 
            className={`px-3 py-2 rounded-md ${isActive('/admin/productos') ? 'bg-primary-100 text-secondary' : 'text-default-600 hover:bg-content2'}`}
          >
            Productos
          </Link>
        </NavbarContent>
        
        <NavbarContent justify="end">
          <Dropdown placement="bottom-end">
            <DropdownTrigger>
              <Button 
                variant="light"
                className="text-default-600"
                endContent={<Icon icon="lucide:chevron-down" className="text-sm" />}
              >
                <Icon icon="lucide:user" className="text-lg mr-2" />
                {currentUser?.email?.split('@')[0] || 'Admin'}
              </Button>
            </DropdownTrigger>
            <DropdownMenu aria-label="Acciones de usuario">
              <DropdownItem key="profile">
                <div className="flex items-center gap-2">
                  <Icon icon="lucide:user" />
                  <span>Mi Perfil</span>
                </div>
              </DropdownItem>
              <DropdownItem key="settings">
                <div className="flex items-center gap-2">
                  <Icon icon="lucide:settings" />
                  <span>Configuración</span>
                </div>
              </DropdownItem>
              <DropdownItem key="logout" color="danger" onPress={handleLogout}>
                <div className="flex items-center gap-2">
                  <Icon icon="lucide:log-out" />
                  <span>Cerrar Sesión</span>
                </div>
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </NavbarContent>
      </Navbar>
      
      <motion.main 
        className="flex-grow p-4 md:p-6 bg-content2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="container mx-auto">
          {children}
        </div>
      </motion.main>
      
      <footer className="bg-content1 py-4 text-center text-default-500 text-sm">
        &copy; {new Date().getFullYear()} Distribuidora Sur - Panel de Administración
      </footer>
    </div>
  );
};

export default AdminLayout;

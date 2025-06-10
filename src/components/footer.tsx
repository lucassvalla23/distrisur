import React from 'react';
import { Link } from 'react-router-dom';
import { Divider } from '@heroui/react';
import { Icon } from '@iconify/react';
import Logo from './logo';

const Footer: React.FC = () => {
  return (
    <footer className="bg-content2 py-8 mt-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <Logo size="lg" />
            <p className="mt-4 text-default-600">
              Distribuidora mayorista de golosinas, productos de almacén y artículos de limpieza.
            </p>
            <div className="flex mt-4 space-x-4">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-default-500 hover:text-secondary">
                <Icon icon="logos:facebook" className="text-2xl" />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-default-500 hover:text-secondary">
                <Icon icon="logos:instagram-icon" className="text-2xl" />
              </a>
              <a href="https://wa.me/5491112345678" target="_blank" rel="noopener noreferrer" className="text-default-500 hover:text-secondary">
                <Icon icon="logos:whatsapp-icon" className="text-2xl" />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Enlaces Rápidos</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-default-600 hover:text-secondary">Inicio</Link>
              </li>
              <li>
                <Link to="/productos" className="text-default-600 hover:text-secondary">Productos</Link>
              </li>
              <li>
                <Link to="/contacto" className="text-default-600 hover:text-secondary">Contacto</Link>
              </li>
              <li>
                <Link to="/como-comprar" className="text-default-600 hover:text-secondary">Cómo Comprar</Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Contacto</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-2">
                <Icon icon="lucide:map-pin" className="text-secondary" />
                <span className="text-default-600">Av. Siempreviva 742, Buenos Aires</span>
              </li>
              <li className="flex items-center gap-2">
                <Icon icon="lucide:phone" className="text-secondary" />
                <span className="text-default-600">+54 9 11 1234-5678</span>
              </li>
              <li className="flex items-center gap-2">
                <Icon icon="lucide:mail" className="text-secondary" />
                <span className="text-default-600">info@distribuidorasur.com</span>
              </li>
              <li className="flex items-center gap-2">
                <Icon icon="lucide:clock" className="text-secondary" />
                <span className="text-default-600">Lun-Vie: 9:00 - 18:00</span>
              </li>
            </ul>
          </div>
        </div>
        
        <Divider className="my-6" />
        
        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-default-500 text-sm">
            &copy; {new Date().getFullYear()} Distribuidora Sur. Todos los derechos reservados.
          </p>
          <div className="mt-4 md:mt-0">
            <ul className="flex flex-wrap gap-4 text-sm">
              <li>
                <Link to="/terminos" className="text-default-500 hover:text-secondary">Términos y Condiciones</Link>
              </li>
              <li>
                <Link to="/privacidad" className="text-default-500 hover:text-secondary">Política de Privacidad</Link>
              </li>
              <li>
                <Link 
                  to="/admin/login" 
                  className="flex items-center gap-1 bg-secondary text-white px-3 py-1 rounded-md hover:bg-secondary-600 transition-colors"
                >
                  <Icon icon="lucide:lock" size={14} />
                  <span>Administración</span>
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
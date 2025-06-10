import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Navbar, 
  NavbarBrand, 
  NavbarContent, 
  NavbarItem, 
  NavbarMenuToggle,
  NavbarMenu,
  NavbarMenuItem,
  Button,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem
} from '@heroui/react';
import { Icon } from '@iconify/react';
import { motion } from 'framer-motion';

import Logo from './logo';
import SearchBar from './search-bar';
import CartButton from './cart-button';

const categories = [
  { 
    name: 'Golosinas', 
    path: '/productos/golosinas',
    subcategories: [
      { name: 'Alfajores', path: '/productos/golosinas/alfajores' },
      { name: 'Chocolates', path: '/productos/golosinas/chocolates' },
      { name: 'Caramelos', path: '/productos/golosinas/caramelos' },
      { name: 'Chupetines', path: '/productos/golosinas/chupetines' },
      { name: 'Chicles', path: '/productos/golosinas/chicles' }
    ]
  },
  { 
    name: 'Almacén', 
    path: '/productos/almacen',
    subcategories: [
      { name: 'Conservas', path: '/productos/almacen/conservas' },
      { name: 'Pastas', path: '/productos/almacen/pastas' },
      { name: 'Aceites', path: '/productos/almacen/aceites' },
      { name: 'Arroz', path: '/productos/almacen/arroz' },
      { name: 'Legumbres', path: '/productos/almacen/legumbres' }
    ]
  },
  { 
    name: 'Limpieza', 
    path: '/productos/limpieza',
    subcategories: [
      { name: 'Detergentes', path: '/productos/limpieza/detergentes' },
      { name: 'Lavandina', path: '/productos/limpieza/lavandina' },
      { name: 'Desinfectantes', path: '/productos/limpieza/desinfectantes' },
      { name: 'Papel', path: '/productos/limpieza/papel' },
      { name: 'Jabones', path: '/productos/limpieza/jabones' }
    ]
  }
];

const MainNavbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <Navbar 
      maxWidth="xl" 
      isBordered 
      className="bg-content1"
      onMenuOpenChange={setIsMenuOpen}
    >
      <NavbarContent>
        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Cerrar menú" : "Abrir menú"}
          className="sm:hidden"
        />
        <NavbarBrand>
          <Logo />
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent className="hidden sm:flex gap-4" justify="center">
        <NavbarItem isActive={isActive('/')}>
          <Link to="/" className="text-foreground">
            Inicio
          </Link>
        </NavbarItem>
        
        {categories.map((category) => (
          <Dropdown key={category.name}>
            <NavbarItem>
              <DropdownTrigger>
                <Button
                  disableRipple
                  className="p-0 bg-transparent data-[hover=true]:bg-transparent"
                  endContent={<Icon icon="lucide:chevron-down" className="text-sm" />}
                  radius="sm"
                  variant="light"
                >
                  {category.name}
                </Button>
              </DropdownTrigger>
            </NavbarItem>
            <DropdownMenu
              aria-label={`Subcategorías de ${category.name}`}
              className="w-[200px]"
              itemClasses={{
                base: "gap-4",
              }}
            >
              <DropdownItem key={`${category.name}-all`}>
                <Link 
                  to={category.path}
                  className="w-full block"
                >
                  Todos los productos
                </Link>
              </DropdownItem>
              {category.subcategories.map((subcategory) => (
                <DropdownItem key={subcategory.name}>
                  <Link 
                    to={subcategory.path}
                    className="w-full block"
                  >
                    {subcategory.name}
                  </Link>
                </DropdownItem>
              ))}
            </DropdownMenu>
          </Dropdown>
        ))}

        <NavbarItem isActive={isActive('/contacto')}>
          <Link to="/contacto" className="text-foreground">
            Contacto
          </Link>
        </NavbarItem>
        
        <NavbarItem isActive={isActive('/como-comprar')}>
          <Link to="/como-comprar" className="text-foreground">
            Cómo Comprar
          </Link>
        </NavbarItem>
      </NavbarContent>

      <NavbarContent justify="end">
        <NavbarItem className="hidden md:flex">
          <SearchBar />
        </NavbarItem>
        <NavbarItem>
          <CartButton />
        </NavbarItem>
      </NavbarContent>

      <NavbarMenu className="pt-6">
        <NavbarMenuItem>
          <div className="w-full mb-4">
            <SearchBar />
          </div>
        </NavbarMenuItem>
        <NavbarMenuItem>
          <Link 
            to="/"
            className={`w-full block py-2 ${isActive('/') ? 'text-secondary font-medium' : ''}`}
            onClick={() => setIsMenuOpen(false)}
          >
            Inicio
          </Link>
        </NavbarMenuItem>
        
        {categories.map((category, index) => (
          <div key={`${category.name}-mobile`}>
            <NavbarMenuItem>
              <Link 
                to={category.path}
                className={`w-full block py-2 font-medium ${location.pathname.includes(category.path.split('/')[2]) ? 'text-secondary' : ''}`}
                onClick={() => setIsMenuOpen(false)}
              >
                {category.name}
              </Link>
            </NavbarMenuItem>
            
            {category.subcategories.map((subcategory) => (
              <NavbarMenuItem key={subcategory.name} className="ml-4">
                <Link 
                  to={subcategory.path}
                  className={`w-full block py-1 text-sm ${isActive(subcategory.path) ? 'text-secondary' : 'text-foreground-500'}`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {subcategory.name}
                </Link>
              </NavbarMenuItem>
            ))}
          </div>
        ))}

        <NavbarMenuItem>
          <Link 
            to="/contacto"
            className={`w-full block py-2 ${isActive('/contacto') ? 'text-secondary font-medium' : ''}`}
            onClick={() => setIsMenuOpen(false)}
          >
            Contacto
          </Link>
        </NavbarMenuItem>
        
        <NavbarMenuItem>
          <Link 
            to="/como-comprar"
            className={`w-full block py-2 ${isActive('/como-comprar') ? 'text-secondary font-medium' : ''}`}
            onClick={() => setIsMenuOpen(false)}
          >
            Cómo Comprar
          </Link>
        </NavbarMenuItem>
      </NavbarMenu>
    </Navbar>
  );
};

export default MainNavbar;

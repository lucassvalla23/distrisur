import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { 
  Button, 
  Card, 
  CardBody, 
  Pagination, 
  Input, 
  Chip, 
  Dropdown, 
  DropdownTrigger, 
  DropdownMenu, 
  DropdownItem 
} from '@heroui/react';
import { Icon } from '@iconify/react';
import { motion } from 'framer-motion';
import { 
  collection, 
  query, 
  where, 
  getDocs, 
  orderBy, 
  limit 
} from 'firebase/firestore';
import { firestore } from '../../firebase/config';
import ProductCard from '../../components/product-card';

interface Product {
  id: string;
  name: string;
  price: number;
  boxPrice?: number;
  boxQuantity?: number;
  image: string;
  category: string;
  subcategory: string;
  variants?: string[];
}

interface RouteParams {
  category?: string;
  subcategory?: string;
}

const ProductsPage: React.FC = () => {
  const { category, subcategory } = useParams<RouteParams>();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const searchQuery = searchParams.get('search') || '';

  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [filter, setFilter] = useState(searchQuery);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [sortBy, setSortBy] = useState<'name' | 'price'>('name');
  
  const productsPerPage = 12;

  // Categorías y subcategorías
  const categories = [
    { 
      name: 'Golosinas', 
      value: 'golosinas',
      subcategories: [
        { name: 'Alfajores', value: 'alfajores' },
        { name: 'Chocolates', value: 'chocolates' },
        { name: 'Caramelos', value: 'caramelos' },
        { name: 'Chupetines', value: 'chupetines' },
        { name: 'Chicles', value: 'chicles' }
      ]
    },
    { 
      name: 'Almacén', 
      value: 'almacen',
      subcategories: [
        { name: 'Conservas', value: 'conservas' },
        { name: 'Pastas', value: 'pastas' },
        { name: 'Aceites', value: 'aceites' },
        { name: 'Arroz', value: 'arroz' },
        { name: 'Legumbres', value: 'legumbres' }
      ]
    },
    { 
      name: 'Limpieza', 
      value: 'limpieza',
      subcategories: [
        { name: 'Detergentes', value: 'detergentes' },
        { name: 'Lavandina', value: 'lavandina' },
        { name: 'Desinfectantes', value: 'desinfectantes' },
        { name: 'Papel', value: 'papel' },
        { name: 'Jabones', value: 'jabones' }
      ]
    }
  ];

  // Obtener el nombre de la categoría y subcategoría actual
  const currentCategory = categories.find(c => c.value === category);
  const currentSubcategory = currentCategory?.subcategories.find(s => s.value === subcategory);

  // Cargar productos desde Firestore
  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        let query = firestore.collection('products');
        
        if (category) {
          query = query.where('category', '==', category);
        }
        
        if (subcategory) {
          query = query.where('subcategory', '==', subcategory);
        }
        
        const snapshot = await query.get();
        
        // No usar datos de ejemplo, mostrar productos reales o array vacío
        const fetchedProducts = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        } as Product));
        
        setProducts(fetchedProducts);
      } catch (error) {
        console.error('Error fetching products:', error);
        // No usar datos de ejemplo, mostrar array vacío
        setProducts([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [category, subcategory]);

  // Filtrar y ordenar productos
  useEffect(() => {
    let result = [...products];
    
    // Aplicar filtro de búsqueda
    if (filter) {
      const filterLower = filter.toLowerCase();
      result = result.filter(product => 
        product.name.toLowerCase().includes(filterLower)
      );
    }
    
    // Aplicar ordenamiento
    result.sort((a, b) => {
      if (sortBy === 'name') {
        return sortOrder === 'asc' 
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name);
      } else {
        return sortOrder === 'asc' 
          ? a.price - b.price
          : b.price - a.price;
      }
    });
    
    setFilteredProducts(result);
    setCurrentPage(1); // Resetear a la primera página al filtrar
  }, [products, filter, sortOrder, sortBy]);

  // Calcular productos para la página actual
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  // Animaciones
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.3,
        ease: "easeOut"
      }
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <div className="flex items-center text-sm mb-6">
        <a href="/" className="text-default-500 hover:text-secondary">Inicio</a>
        <Icon icon="lucide:chevron-right" className="mx-2 text-default-400" />
        
        {category ? (
          <>
            <a href="/productos" className="text-default-500 hover:text-secondary">Productos</a>
            <Icon icon="lucide:chevron-right" className="mx-2 text-default-400" />
            <span className="text-secondary font-medium">
              {currentCategory?.name || category}
              {subcategory && (
                <>
                  <Icon icon="lucide:chevron-right" className="mx-2 text-default-400" />
                  <span className="text-secondary font-medium">
                    {currentSubcategory?.name || subcategory}
                  </span>
                </>
              )}
            </span>
          </>
        ) : (
          <span className="text-secondary font-medium">Productos</span>
        )}
      </div>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">
          {subcategory 
            ? currentSubcategory?.name || subcategory
            : category 
              ? currentCategory?.name || category
              : 'Todos los Productos'}
        </h1>
        <p className="text-default-600">
          {subcategory 
            ? `Explora nuestra selección de ${currentSubcategory?.name || subcategory} de la mejor calidad.`
            : category 
              ? `Descubre todos nuestros productos de ${currentCategory?.name || category}.`
              : 'Explora nuestro catálogo completo de productos.'}
        </p>
      </div>

      {/* Filters */}
      <Card className="mb-8">
        <CardBody>
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="w-full md:w-auto">
              <Input
                placeholder="Buscar productos..."
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                startContent={<Icon icon="lucide:search" className="text-default-400" />}
                className="w-full md:w-64"
              />
            </div>
            
            <div className="flex flex-wrap gap-2 items-center">
              <span className="text-default-600 text-sm">Ordenar por:</span>
              
              <Dropdown>
                <DropdownTrigger>
                  <Button 
                    variant="bordered" 
                    size="sm"
                    endContent={<Icon icon="lucide:chevron-down" className="text-sm" />}
                  >
                    {sortBy === 'name' ? 'Nombre' : 'Precio'}
                  </Button>
                </DropdownTrigger>
                <DropdownMenu 
                  aria-label="Ordenar por"
                  selectedKeys={[sortBy]}
                  onSelectionChange={(keys) => {
                    const selected = Array.from(keys)[0];
                    if (selected === 'name' || selected === 'price') {
                      setSortBy(selected);
                    }
                  }}
                  selectionMode="single"
                >
                  <DropdownItem key="name">Nombre</DropdownItem>
                  <DropdownItem key="price">Precio</DropdownItem>
                </DropdownMenu>
              </Dropdown>
              
              <Button 
                isIconOnly 
                variant="bordered" 
                size="sm"
                onPress={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              >
                <Icon 
                  icon={sortOrder === 'asc' ? "lucide:arrow-up" : "lucide:arrow-down"} 
                  className="text-sm" 
                />
              </Button>
              
              {filter && (
                <Button 
                  size="sm" 
                  variant="light" 
                  color="danger"
                  onPress={() => setFilter('')}
                  startContent={<Icon icon="lucide:x" className="text-sm" />}
                >
                  Limpiar filtro
                </Button>
              )}
            </div>
          </div>
          
          {/* Category chips */}
          {!category && (
            <div className="mt-4 flex flex-wrap gap-2">
              {categories.map((cat) => (
                <Chip
                  key={cat.value}
                  as="a"
                  href={`/productos/${cat.value}`}
                  variant="flat"
                  color="primary"
                  className="cursor-pointer"
                >
                  {cat.name}
                </Chip>
              ))}
            </div>
          )}
          
          {/* Subcategory chips */}
          {category && !subcategory && currentCategory && (
            <div className="mt-4 flex flex-wrap gap-2">
              {currentCategory.subcategories.map((subcat) => (
                <Chip
                  key={subcat.value}
                  as="a"
                  href={`/productos/${category}/${subcat.value}`}
                  variant="flat"
                  color="secondary"
                  className="cursor-pointer"
                >
                  {subcat.name}
                </Chip>
              ))}
            </div>
          )}
        </CardBody>
      </Card>

      {/* Products Grid */}
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Icon icon="lucide:loader" className="text-4xl text-secondary animate-spin" />
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="text-center py-16">
          <Icon icon="lucide:package-x" className="text-6xl text-default-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">No se encontraron productos</h3>
          <p className="text-default-500 mb-6">
            No hay productos que coincidan con tu búsqueda. Intenta con otros términos.
          </p>
          <Button 
            color="secondary" 
            variant="flat"
            onPress={() => setFilter('')}
          >
            Ver todos los productos
          </Button>
        </div>
      ) : (
        <motion.div 
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {currentProducts.map((product) => (
            <motion.div key={product.id} variants={itemVariants}>
              <ProductCard {...product} />
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Pagination */}
      {filteredProducts.length > 0 && (
        <div className="mt-8 flex justify-center">
          <Pagination
            total={totalPages}
            initialPage={1}
            page={currentPage}
            onChange={setCurrentPage}
            color="secondary"
            showControls
          />
        </div>
      )}
    </div>
  );
};

export default ProductsPage;
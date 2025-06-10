import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Table, 
  TableHeader, 
  TableColumn, 
  TableBody, 
  TableRow, 
  TableCell, 
  Button, 
  Input, 
  Dropdown, 
  DropdownTrigger, 
  DropdownMenu, 
  DropdownItem,
  Pagination,
  Chip,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure
} from '@heroui/react';
import { Icon } from '@iconify/react';
import { motion } from 'framer-motion';
import { 
  collection, 
  getDocs, 
  query, 
  orderBy, 
  doc, 
  deleteDoc,
  Timestamp 
} from 'firebase/firestore';
import { firestore } from '../../../firebase/config';

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
  createdAt: Date;
}

const AdminProductsPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  
  const productsPerPage = 10;

  // Categorías
  const categories = [
    { name: 'Todas', value: 'all' },
    { name: 'Golosinas', value: 'golosinas' },
    { name: 'Almacén', value: 'almacen' },
    { name: 'Limpieza', value: 'limpieza' }
  ];

  // Cargar productos desde Firestore
  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        // Create a reference to the products collection
        const productsRef = collection(firestore, 'products');
        
        // Create a query with ordering
        const productsQuery = query(productsRef, orderBy('name'));
        
        // Execute the query
        const snapshot = await getDocs(productsQuery);
        
        // No usar datos de ejemplo, mostrar productos reales o array vacío
        const fetchedProducts = snapshot.docs.map(doc => {
          const data = doc.data();
          // Handle Firestore Timestamp conversion
          let createdAt = new Date();
          if (data.createdAt) {
            if (data.createdAt instanceof Timestamp) {
              createdAt = data.createdAt.toDate();
            } else if (data.createdAt.seconds) {
              createdAt = new Date(data.createdAt.seconds * 1000);
            }
          }
          
          return {
            id: doc.id,
            ...data,
            createdAt
          } as Product;
        });
        
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
  }, []);

  // Filtrar productos
  useEffect(() => {
    let result = [...products];
    
    // Filtrar por categoría
    if (selectedCategory !== 'all') {
      result = result.filter(product => product.category === selectedCategory);
    }
    
    // Filtrar por término de búsqueda
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(product => 
        product.name.toLowerCase().includes(term) ||
        product.category.toLowerCase().includes(term) ||
        product.subcategory.toLowerCase().includes(term)
      );
    }
    
    setFilteredProducts(result);
    setCurrentPage(1); // Resetear a la primera página al filtrar
  }, [products, selectedCategory, searchTerm]);

  // Función para eliminar un producto
  const handleDeleteProduct = async () => {
    if (!productToDelete) return;
    
    try {
      // In a real implementation, we would delete the product from Firestore
      // const productRef = doc(firestore, 'products', productToDelete.id);
      // await deleteDoc(productRef);
      
      // Update local state
      setProducts(products.filter(p => p.id !== productToDelete.id));
      onClose();
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  // Formatear precio
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS'
    }).format(price);
  };

  // Formatear fecha
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('es-AR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(date);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Gestionar Productos</h1>
        <Button 
          as={Link}
          to="/admin/productos/nuevo"
          color="secondary"
          endContent={<Icon icon="lucide:plus" />}
        >
          Nuevo Producto
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <Input
          placeholder="Buscar productos..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          startContent={<Icon icon="lucide:search" className="text-default-400" />}
          className="w-full md:w-64"
        />
        
        <Dropdown>
          <DropdownTrigger>
            <Button 
              variant="bordered" 
              endContent={<Icon icon="lucide:chevron-down" className="text-sm" />}
            >
              Categoría: {categories.find(c => c.value === selectedCategory)?.name || 'Todas'}
            </Button>
          </DropdownTrigger>
          <DropdownMenu 
            aria-label="Categorías"
            selectedKeys={[selectedCategory]}
            onSelectionChange={(keys) => {
              const selected = Array.from(keys)[0];
              if (typeof selected === 'string') {
                setSelectedCategory(selected);
              }
            }}
            selectionMode="single"
          >
            {categories.map((category) => (
              <DropdownItem key={category.value}>{category.name}</DropdownItem>
            ))}
          </DropdownMenu>
        </Dropdown>
      </div>

      {/* Products Table */}
      <div className="bg-content1 rounded-lg overflow-hidden">
        <Table 
          aria-label="Tabla de productos"
          removeWrapper
          isHeaderSticky
          classNames={{
            th: "bg-content2"
          }}
        >
          <TableHeader>
            <TableColumn>PRODUCTO</TableColumn>
            <TableColumn>CATEGORÍA</TableColumn>
            <TableColumn>PRECIO</TableColumn>
            <TableColumn>FECHA</TableColumn>
            <TableColumn>ACCIONES</TableColumn>
          </TableHeader>
          <TableBody 
            isLoading={isLoading}
            loadingContent={
              <div className="flex justify-center py-8">
                <Icon icon="lucide:loader" className="text-2xl text-secondary animate-spin" />
              </div>
            }
            emptyContent={
              <div className="py-8 text-center">
                <Icon icon="lucide:package-x" className="text-4xl text-default-300 mx-auto mb-2" />
                <p className="text-default-500">No hay productos cargados</p>
                <Button 
                  as={Link}
                  to="/admin/productos/nuevo"
                  color="secondary"
                  className="mt-4"
                  endContent={<Icon icon="lucide:plus" />}
                >
                  Agregar Primer Producto
                </Button>
              </div>
            }
          >
            {currentProducts.map((product) => (
              <TableRow key={product.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-md overflow-hidden">
                      <img 
                        src={product.image || "https://img.heroui.chat/image/food?w=100&h=100&u=1"} 
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <p className="font-medium">{product.name}</p>
                      <p className="text-xs text-default-500">{product.subcategory}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Chip 
                    size="sm" 
                    variant="flat"
                    color={
                      product.category === 'golosinas' ? 'primary' :
                      product.category === 'almacen' ? 'secondary' : 'success'
                    }
                  >
                    {product.category}
                  </Chip>
                </TableCell>
                <TableCell>
                  <div>
                    <p>{formatPrice(product.price)}</p>
                    {product.boxPrice && (
                      <p className="text-xs text-default-500">
                        Caja: {formatPrice(product.boxPrice)}
                      </p>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <p className="text-sm">{formatDate(product.createdAt)}</p>
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button
                      isIconOnly
                      size="sm"
                      variant="light"
                      color="primary"
                      as={Link}
                      to={`/admin/productos/editar/${product.id}`}
                    >
                      <Icon icon="lucide:edit" />
                    </Button>
                    <Button
                      isIconOnly
                      size="sm"
                      variant="light"
                      color="danger"
                      onPress={() => {
                        setProductToDelete(product);
                        onOpen();
                      }}
                    >
                      <Icon icon="lucide:trash" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {filteredProducts.length > 0 && (
        <div className="mt-6 flex justify-center">
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

      {/* Delete Confirmation Modal */}
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Confirmar Eliminación</ModalHeader>
              <ModalBody>
                <p>
                  ¿Estás seguro de que deseas eliminar el producto <strong>{productToDelete?.name}</strong>?
                </p>
                <p className="text-default-500">
                  Esta acción no se puede deshacer.
                </p>
              </ModalBody>
              <ModalFooter>
                <Button variant="light" onPress={onClose}>
                  Cancelar
                </Button>
                <Button color="danger" onPress={handleDeleteProduct}>
                  Eliminar
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};

export default AdminProductsPage;
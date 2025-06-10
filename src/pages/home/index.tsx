import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button, Card, CardBody, Tabs, Tab } from '@heroui/react';
import { Icon } from '@iconify/react';
import { motion } from 'framer-motion';
import { collection, query, where, getDocs, limit } from 'firebase/firestore';
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

const HomePage: React.FC = () => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('golosinas');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        // Corregir la sintaxis para usar Firebase v9
        const productsRef = collection(firestore, 'products');
        const productsQuery = query(
          productsRef,
          where('category', '==', selectedCategory),
          limit(8)
        );
        
        const snapshot = await getDocs(productsQuery);
        
        const products = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        } as Product));
        
        setFeaturedProducts(products);
      } catch (error) {
        console.error('Error fetching products:', error);
        setFeaturedProducts([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [selectedCategory]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-content2 py-16 md:py-24">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center">
          <motion.div 
            className="md:w-1/2 mb-8 md:mb-0"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              <span className="text-secondary">Distribuidora</span> 
              <span className="text-primary"> Sur</span>
            </h1>
            <p className="text-lg mb-6 text-default-700">
              Tu proveedor mayorista de confianza en golosinas, productos de almacén y artículos de limpieza.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button 
                as={Link} 
                to="/productos" 
                color="secondary" 
                size="lg"
                endContent={<Icon icon="lucide:arrow-right" />}
              >
                Ver Productos
              </Button>
              <Button 
                as={Link} 
                to="/como-comprar" 
                variant="bordered" 
                color="primary" 
                size="lg"
              >
                Cómo Comprar
              </Button>
            </div>
          </motion.div>
          
          <motion.div 
            className="md:w-1/2"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <img 
              src="https://img.heroui.chat/image/food?w=600&h=400&u=10" 
              alt="Distribuidora Sur" 
              className="rounded-lg shadow-lg w-full h-auto"
            />
          </motion.div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <motion.h2 
            className="text-2xl md:text-3xl font-bold mb-8 text-center"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Nuestras Categorías
          </motion.h2>
          
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div variants={itemVariants}>
              <Link to="/productos/golosinas">
                <Card className="h-full product-card-hover">
                  <CardBody className="p-0 relative">
                    <img 
                      src="https://img.heroui.chat/image/food?w=400&h=300&u=20" 
                      alt="Golosinas" 
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-6">
                      <h3 className="text-white text-xl font-bold">Golosinas</h3>
                      <p className="text-white/80 mb-2">Alfajores, chocolates, caramelos y más</p>
                      <Button 
                        color="primary" 
                        variant="flat" 
                        size="sm" 
                        endContent={<Icon icon="lucide:arrow-right" />}
                      >
                        Explorar
                      </Button>
                    </div>
                  </CardBody>
                </Card>
              </Link>
            </motion.div>
            
            <motion.div variants={itemVariants}>
              <Link to="/productos/almacen">
                <Card className="h-full product-card-hover">
                  <CardBody className="p-0 relative">
                    <img 
                      src="https://img.heroui.chat/image/food?w=400&h=300&u=21" 
                      alt="Almacén" 
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-6">
                      <h3 className="text-white text-xl font-bold">Almacén</h3>
                      <p className="text-white/80 mb-2">Conservas, pastas, aceites y más</p>
                      <Button 
                        color="primary" 
                        variant="flat" 
                        size="sm" 
                        endContent={<Icon icon="lucide:arrow-right" />}
                      >
                        Explorar
                      </Button>
                    </div>
                  </CardBody>
                </Card>
              </Link>
            </motion.div>
            
            <motion.div variants={itemVariants}>
              <Link to="/productos/limpieza">
                <Card className="h-full product-card-hover">
                  <CardBody className="p-0 relative">
                    <img 
                      src="https://img.heroui.chat/image/food?w=400&h=300&u=22" 
                      alt="Limpieza" 
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-6">
                      <h3 className="text-white text-xl font-bold">Limpieza</h3>
                      <p className="text-white/80 mb-2">Detergentes, lavandina, desinfectantes y más</p>
                      <Button 
                        color="primary" 
                        variant="flat" 
                        size="sm" 
                        endContent={<Icon icon="lucide:arrow-right" />}
                      >
                        Explorar
                      </Button>
                    </div>
                  </CardBody>
                </Card>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-12 md:py-16 bg-content2">
        <div className="container mx-auto px-4">
          <motion.h2 
            className="text-2xl md:text-3xl font-bold mb-6 text-center"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Productos Destacados
          </motion.h2>
          
          <Tabs 
            aria-label="Categorías"
            selectedKey={selectedCategory}
            onSelectionChange={(key) => setSelectedCategory(key as string)}
            className="mb-8"
            color="secondary"
            variant="underlined"
            classNames={{
              tabList: "gap-6 w-full relative rounded-none p-0 border-b border-divider",
              cursor: "w-full bg-secondary",
              tab: "max-w-fit px-0 h-12",
              tabContent: "group-data-[selected=true]:text-secondary"
            }}
          >
            <Tab key="golosinas" title="Golosinas" />
            <Tab key="almacen" title="Almacén" />
            <Tab key="limpieza" title="Limpieza" />
          </Tabs>
          
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <Icon icon="lucide:loader" className="text-4xl text-secondary animate-spin" />
            </div>
          ) : featuredProducts.length > 0 ? (
            <motion.div 
              className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {featuredProducts.map((product) => (
                <motion.div key={product.id} variants={itemVariants}>
                  <ProductCard {...product} />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <div className="text-center py-16">
              <Icon icon="lucide:package-x" className="text-6xl text-default-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No hay productos disponibles</h3>
              <p className="text-default-500 mb-6">
                Aún no se han agregado productos en esta categoría.
              </p>
            </div>
          )}
          
          <div className="text-center mt-8">
            <Button 
              as={Link}
              to={`/productos/${selectedCategory}`}
              color="secondary"
              variant="bordered"
              size="lg"
              endContent={<Icon icon="lucide:arrow-right" />}
            >
              Ver Todos los Productos
            </Button>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <motion.h2 
            className="text-2xl md:text-3xl font-bold mb-12 text-center"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            ¿Por qué elegirnos?
          </motion.h2>
          
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div variants={itemVariants} className="text-center">
              <div className="bg-primary rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Icon icon="lucide:truck" className="text-2xl text-secondary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Entrega Rápida</h3>
              <p className="text-default-600">Entregamos tus pedidos en tiempo récord para que nunca te quedes sin stock.</p>
            </motion.div>
            
            <motion.div variants={itemVariants} className="text-center">
              <div className="bg-primary rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Icon icon="lucide:check-circle" className="text-2xl text-secondary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Calidad Garantizada</h3>
              <p className="text-default-600">Trabajamos con las mejores marcas del mercado para ofrecerte productos de primera calidad.</p>
            </motion.div>
            
            <motion.div variants={itemVariants} className="text-center">
              <div className="bg-primary rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Icon icon="lucide:tag" className="text-2xl text-secondary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Precios Mayoristas</h3>
              <p className="text-default-600">Ofrecemos los mejores precios del mercado para que maximices tus ganancias.</p>
            </motion.div>
            
            <motion.div variants={itemVariants} className="text-center">
              <div className="bg-primary rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Icon icon="lucide:headphones" className="text-2xl text-secondary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Atención Personalizada</h3>
              <p className="text-default-600">Nuestro equipo está siempre disponible para asesorarte y resolver tus dudas.</p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-12 md:py-16 bg-secondary">
        <div className="container mx-auto px-4 text-center">
          <motion.h2 
            className="text-2xl md:text-3xl font-bold mb-4 text-white"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            ¿Listo para hacer tu pedido?
          </motion.h2>
          <motion.p 
            className="text-white/90 mb-8 max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Explora nuestro catálogo completo de productos y realiza tu pedido de forma rápida y sencilla.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Button 
              as={Link}
              to="/productos"
              color="primary"
              size="lg"
              className="font-medium"
              endContent={<Icon icon="lucide:shopping-cart" />}
            >
              Ver Catálogo Completo
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
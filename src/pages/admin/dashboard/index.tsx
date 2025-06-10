import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardBody, Button } from '@heroui/react';
import { Icon } from '@iconify/react';
import { motion } from 'framer-motion';
import { 
  collection, 
  getDocs, 
  query, 
  orderBy, 
  limit, 
  Timestamp 
} from 'firebase/firestore';
import { firestore } from '../../../firebase/config';

interface DashboardStats {
  totalProducts: number;
  categoryCounts: {
    [key: string]: number;
  };
  recentProducts: {
    id: string;
    name: string;
    category: string;
    createdAt: Date;
  }[];
}

const AdminDashboardPage: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalProducts: 0,
    categoryCounts: {},
    recentProducts: []
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      setIsLoading(true);
      try {
        // Get products collection reference
        const productsRef = collection(firestore, 'products');
        
        // Get all products to count total and categories
        const productsSnapshot = await getDocs(productsRef);
        const totalProducts = productsSnapshot.size;
        
        // Count products by category
        const categoryCounts: {[key: string]: number} = {};
        productsSnapshot.docs.forEach(doc => {
          const product = doc.data();
          const category = product.category;
          categoryCounts[category] = (categoryCounts[category] || 0) + 1;
        });
        
        // Get recent products with ordering
        const recentProductsQuery = query(
          productsRef,
          orderBy('createdAt', 'desc'),
          limit(5)
        );
        
        const recentProductsSnapshot = await getDocs(recentProductsQuery);
        
        const recentProducts = recentProductsSnapshot.docs.map(doc => {
          const data = doc.data();
          // Handle Firestore Timestamp conversion
          let createdAt = new Date();
          if (data.createdAt) {
            if (data.createdAt instanceof Timestamp) {
              createdAt = data.createdAt.toDate();
            } else if (data.createdAt.seconds) {
              // Handle potential timestamp format
              createdAt = new Date(data.createdAt.seconds * 1000);
            }
          }
          
          return {
            id: doc.id,
            name: data.name,
            category: data.category,
            createdAt
          };
        });
        
        setStats({
          totalProducts,
          categoryCounts,
          recentProducts
        });
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
        // Use empty data on error
        setStats({
          totalProducts: 0,
          categoryCounts: {},
          recentProducts: []
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  const quickLinks = [
    { 
      title: 'Agregar Producto', 
      icon: 'lucide:plus-circle', 
      color: 'bg-success-100 text-success-600',
      link: '/admin/productos/nuevo'
    },
    { 
      title: 'Gestionar Productos', 
      icon: 'lucide:package', 
      color: 'bg-primary-100 text-primary-600',
      link: '/admin/productos'
    },
    { 
      title: 'Ver Sitio Web', 
      icon: 'lucide:globe', 
      color: 'bg-secondary-100 text-secondary-600',
      link: '/'
    }
  ];

  const categoryColors: {[key: string]: string} = {
    golosinas: 'bg-pink-100 text-pink-600',
    almacen: 'bg-blue-100 text-blue-600',
    limpieza: 'bg-green-100 text-green-600'
  };

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
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <Button 
          as={Link}
          to="/admin/productos/nuevo"
          color="secondary"
          endContent={<Icon icon="lucide:plus" />}
        >
          Nuevo Producto
        </Button>
      </div>

      {/* Quick Links */}
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {quickLinks.map((link, index) => (
          <motion.div key={index} variants={itemVariants}>
            <Link to={link.link}>
              <Card className="hover:shadow-md transition-shadow">
                <CardBody className="p-4">
                  <div className="flex items-center gap-3">
                    <div className={`${link.color} p-3 rounded-lg`}>
                      <Icon icon={link.icon} className="text-xl" />
                    </div>
                    <div>
                      <h3 className="font-medium">{link.title}</h3>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </Link>
          </motion.div>
        ))}
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Total Products */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card>
            <CardBody className="p-6">
              <h2 className="text-lg font-semibold mb-4">Total de Productos</h2>
              
              {isLoading ? (
                <div className="flex justify-center">
                  <Icon icon="lucide:loader" className="text-2xl text-secondary animate-spin" />
                </div>
              ) : (
                <div className="flex items-center gap-4">
                  <div className="bg-primary rounded-full p-3">
                    <Icon icon="lucide:package" className="text-2xl text-secondary" />
                  </div>
                  <div className="text-4xl font-bold">{stats.totalProducts}</div>
                </div>
              )}
              
              <div className="mt-4">
                <Button 
                  as={Link}
                  to="/admin/productos"
                  variant="light"
                  color="primary"
                  endContent={<Icon icon="lucide:arrow-right" />}
                  className="w-full"
                >
                  {stats.totalProducts > 0 ? "Ver todos los productos" : "Agregar productos"}
                </Button>
              </div>
            </CardBody>
          </Card>
        </motion.div>

        {/* Products by Category */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Card>
            <CardBody className="p-6">
              <h2 className="text-lg font-semibold mb-4">Productos por Categoría</h2>
              
              {isLoading ? (
                <div className="flex justify-center">
                  <Icon icon="lucide:loader" className="text-2xl text-secondary animate-spin" />
                </div>
              ) : (
                <div className="space-y-3">
                  {Object.entries(stats.categoryCounts).map(([category, count]) => (
                    <div key={category} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className={`${categoryColors[category] || 'bg-default-100 text-default-600'} p-2 rounded-md`}>
                          <Icon 
                            icon={
                              category === 'golosinas' ? 'lucide:candy' : 
                              category === 'almacen' ? 'lucide:package' : 
                              'lucide:spray-can'
                            } 
                            className="text-lg" 
                          />
                        </div>
                        <span className="capitalize">{category}</span>
                      </div>
                      <span className="font-semibold">{count}</span>
                    </div>
                  ))}
                </div>
              )}
            </CardBody>
          </Card>
        </motion.div>

        {/* Recent Products */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="lg:col-span-1"
        >
          <Card>
            <CardBody className="p-6">
              <h2 className="text-lg font-semibold mb-4">Productos Recientes</h2>
              
              {isLoading ? (
                <div className="flex justify-center">
                  <Icon icon="lucide:loader" className="text-2xl text-secondary animate-spin" />
                </div>
              ) : stats.recentProducts.length > 0 ? (
                <div className="space-y-3">
                  {stats.recentProducts.map((product) => (
                    <Link key={product.id} to={`/admin/productos/editar/${product.id}`}>
                      <div className="flex items-center justify-between hover:bg-content2 p-2 rounded-md transition-colors">
                        <div className="flex items-center gap-2">
                          <div className={`${categoryColors[product.category] || 'bg-default-100 text-default-600'} p-2 rounded-md`}>
                            <Icon 
                              icon={
                                product.category === 'golosinas' ? 'lucide:candy' : 
                                product.category === 'almacen' ? 'lucide:package' : 
                                'lucide:spray-can'
                              } 
                              className="text-lg" 
                            />
                          </div>
                          <div>
                            <div className="font-medium">{product.name}</div>
                            <div className="text-xs text-default-500">{formatDate(product.createdAt)}</div>
                          </div>
                        </div>
                        <Icon icon="lucide:chevron-right" className="text-default-400" />
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="py-8 text-center">
                  <Icon icon="lucide:package-x" className="text-4xl text-default-300 mx-auto mb-2" />
                  <p className="text-default-500">No hay productos cargados</p>
                  <Button 
                    as={Link}
                    to="/admin/productos/nuevo"
                    color="secondary"
                    size="sm"
                    className="mt-4"
                    endContent={<Icon icon="lucide:plus" />}
                  >
                    Agregar Primer Producto
                  </Button>
                </div>
              )}
            </CardBody>
          </Card>
        </motion.div>
      </div>

      {/* Additional Info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <Card>
          <CardBody className="p-6">
            <h2 className="text-lg font-semibold mb-4">Información Útil</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-content2 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Icon icon="lucide:info" className="text-primary" />
                  <h3 className="font-medium">Ayuda</h3>
                </div>
                <p className="text-default-600 text-sm">
                  Para obtener ayuda sobre cómo usar el panel de administración, consulta la documentación o contacta al soporte técnico.
                </p>
              </div>
              
              <div className="bg-content2 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Icon icon="lucide:bell" className="text-secondary" />
                  <h3 className="font-medium">Recordatorios</h3>
                </div>
                <p className="text-default-600 text-sm">
                  Recuerda mantener actualizados los precios y el stock de tus productos para ofrecer información precisa a tus clientes.
                </p>
              </div>
            </div>
          </CardBody>
        </Card>
      </motion.div>
    </div>
  );
};

export default AdminDashboardPage;
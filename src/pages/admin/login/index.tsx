import React, { useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { Card, CardBody, Input, Button, Divider } from '@heroui/react';
import { Icon } from '@iconify/react';
import { motion } from 'framer-motion';
import { useAuth } from '../../../contexts/auth-context';
import Logo from '../../../components/logo';

const AdminLoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { login } = useAuth();
  const history = useHistory();
  const location = useLocation();
  
  // @ts-ignore
  const { from } = location.state || { from: { pathname: "/admin/dashboard" } };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    try {
      await login(email, password);
      history.replace(from);
    } catch (error) {
      setError('Credenciales incorrectas. Por favor, intenta de nuevo.');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-content2 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="w-full">
          <CardBody className="p-8">
            <div className="flex flex-col items-center mb-6">
              <Logo size="lg" />
              <h1 className="text-2xl font-bold mt-4">Panel de Administración</h1>
              <p className="text-default-500 text-center mt-2">
                Inicia sesión para acceder al panel de administración
              </p>
            </div>
            
            {error && (
              <div className="bg-danger-100 text-danger-700 p-3 rounded-lg mb-4 text-center">
                <p>{error}</p>
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                variant="bordered"
                startContent={<Icon icon="lucide:mail" className="text-default-400" />}
                isRequired
              />
              
              <Input
                label="Contraseña"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                variant="bordered"
                startContent={<Icon icon="lucide:lock" className="text-default-400" />}
                isRequired
              />
              
              <Button
                type="submit"
                color="secondary"
                className="w-full"
                isLoading={isLoading}
                endContent={!isLoading && <Icon icon="lucide:log-in" />}
              >
                {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
              </Button>
            </form>
            
            <Divider className="my-6" />
            
            <div className="text-center">
              <Button 
                as="a" 
                href="/" 
                variant="light" 
                color="default"
                startContent={<Icon icon="lucide:arrow-left" />}
              >
                Volver al sitio
              </Button>
            </div>
          </CardBody>
        </Card>
      </motion.div>
    </div>
  );
};

export default AdminLoginPage;

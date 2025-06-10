import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Card, CardBody, Input, Button, Divider } from '@heroui/react';
import { Icon } from '@iconify/react';
import { motion } from 'framer-motion';
import Logo from '../../../components/logo';
import { setupAdminUser } from '../../../utils/admin-setup';

const AdminSetupPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [setupCode, setSetupCode] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const history = useHistory();

  // Este código debería ser secreto y conocido solo por ti
  const SETUP_SECRET_CODE = "distribuidora-sur-2023";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);
    
    // Validaciones básicas
    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      setIsLoading(false);
      return;
    }
    
    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      setIsLoading(false);
      return;
    }
    
    if (setupCode !== SETUP_SECRET_CODE) {
      setError('Código de configuración incorrecto');
      setIsLoading(false);
      return;
    }
    
    try {
      // Crear el usuario administrador
      await setupAdminUser(email, password);
      
      // Si llegamos aquí, el usuario se creó correctamente
      setSuccess('Usuario administrador creado exitosamente. Ahora puedes iniciar sesión.');
      
      // Redireccionar al login después de 3 segundos
      setTimeout(() => {
        history.push('/admin/login');
      }, 3000);
    } catch (error: any) {
      // Manejar errores específicos de Firebase
      if (error.code === 'auth/email-already-in-use') {
        setError('Este email ya está en uso. Intenta con otro o recupera tu contraseña.');
      } else if (error.code === 'auth/invalid-email') {
        setError('El formato del email no es válido.');
      } else if (error.code === 'auth/weak-password') {
        setError('La contraseña es demasiado débil. Usa al menos 6 caracteres.');
      } else if (error.code === 'auth/network-request-failed') {
        setError('Error de conexión. Verifica tu conexión a internet.');
      } else {
        setError(error.message || 'Error al crear el usuario');
      }
    } finally {
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
              <h1 className="text-2xl font-bold mt-4">Configuración Inicial</h1>
              <p className="text-default-500 text-center mt-2">
                Crea tu cuenta de administrador para acceder al panel
              </p>
            </div>
            
            {error && (
              <div className="bg-danger-100 text-danger-700 p-3 rounded-lg mb-4 text-center">
                <p>{error}</p>
              </div>
            )}
            
            {success && (
              <div className="bg-success-100 text-success-700 p-3 rounded-lg mb-4 text-center">
                <p>{success}</p>
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
              
              <Input
                label="Confirmar Contraseña"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                variant="bordered"
                startContent={<Icon icon="lucide:lock" className="text-default-400" />}
                isRequired
              />
              
              <Input
                label="Código de Configuración"
                type="password"
                value={setupCode}
                onChange={(e) => setSetupCode(e.target.value)}
                variant="bordered"
                startContent={<Icon icon="lucide:key" className="text-default-400" />}
                isRequired
              />
              
              <Button
                type="submit"
                color="secondary"
                className="w-full"
                isLoading={isLoading}
                endContent={!isLoading && <Icon icon="lucide:user-plus" />}
              >
                {isLoading ? 'Creando usuario...' : 'Crear Usuario Administrador'}
              </Button>
            </form>
            
            <Divider className="my-6" />
            
            <div className="text-center">
              <Button 
                as="a" 
                href="/admin/login" 
                variant="light" 
                color="default"
                startContent={<Icon icon="lucide:arrow-left" />}
              >
                Volver al inicio de sesión
              </Button>
            </div>
          </CardBody>
        </Card>
      </motion.div>
    </div>
  );
};

export default AdminSetupPage;
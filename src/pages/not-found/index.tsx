import React from 'react';
import { Button } from '@heroui/react';
import { Link } from 'react-router-dom';
import { Icon } from '@iconify/react';
import { motion } from 'framer-motion';

const NotFoundPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="flex flex-col items-center justify-center text-center">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="bg-primary rounded-full w-24 h-24 flex items-center justify-center mb-6">
            <Icon icon="lucide:alert-triangle" className="text-4xl text-secondary" />
          </div>
        </motion.div>
        
        <motion.h1
          className="text-5xl font-bold mb-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          404
        </motion.h1>
        
        <motion.h2
          className="text-2xl font-semibold mb-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          Página no encontrada
        </motion.h2>
        
        <motion.p
          className="text-default-600 mb-8 max-w-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          Lo sentimos, la página que estás buscando no existe o ha sido movida.
        </motion.p>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <Button 
            as={Link}
            to="/"
            color="secondary"
            size="lg"
            endContent={<Icon icon="lucide:home" />}
          >
            Volver al Inicio
          </Button>
        </motion.div>
      </div>
    </div>
  );
};

export default NotFoundPage;

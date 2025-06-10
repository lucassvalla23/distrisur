import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Icon } from '@iconify/react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
}

const Logo: React.FC<LogoProps> = ({ size = 'md' }) => {
  const sizeClasses = {
    sm: 'text-xl',
    md: 'text-2xl',
    lg: 'text-3xl'
  };

  return (
    <Link to="/">
      <motion.div 
        className="flex items-center gap-2"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <div className="bg-primary p-2 rounded-lg">
          <Icon 
            icon="lucide:truck" 
            className={`text-secondary ${sizeClasses[size]}`}
          />
        </div>
        <div className="font-bold">
          <span className="text-secondary">Distribuidora</span>
          <span className="text-primary ml-1">Sur</span>
        </div>
      </motion.div>
    </Link>
  );
};

export default Logo;

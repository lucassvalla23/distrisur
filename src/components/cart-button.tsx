import React, { useState } from 'react';
import { 
  Button, 
  Badge, 
  Popover, 
  PopoverTrigger, 
  PopoverContent,
  Divider
} from '@heroui/react';
import { Icon } from '@iconify/react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../contexts/cart-context';
import CartItem from './cart-item';

const CartButton: React.FC = () => {
  const { items, itemCount, total, clearCart } = useCart();
  const [isOpen, setIsOpen] = useState(false);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS'
    }).format(price);
  };

  return (
    <Popover 
      placement="bottom-end" 
      isOpen={isOpen} 
      onOpenChange={(open) => setIsOpen(open)}
    >
      <PopoverTrigger>
        <Button
          isIconOnly
          variant="light"
          className="relative"
          aria-label="Carrito de compras"
        >
          <Badge 
            content={itemCount} 
            color="secondary" 
            isInvisible={itemCount === 0}
            shape="circle"
          >
            <Icon icon="lucide:shopping-cart" className="text-xl" />
          </Badge>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 max-h-96 overflow-auto">
        <div className="px-1 py-2">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-lg font-semibold">Carrito</h3>
            {items.length > 0 && (
              <Button 
                size="sm" 
                color="danger" 
                variant="light"
                onPress={() => clearCart()}
                startContent={<Icon icon="lucide:trash-2" size={16} />}
              >
                Vaciar
              </Button>
            )}
          </div>
          <Divider className="my-2" />
          
          {items.length === 0 ? (
            <div className="py-8 text-center">
              <Icon icon="lucide:shopping-cart" className="text-4xl text-default-300 mx-auto mb-2" />
              <p className="text-default-500">Tu carrito está vacío</p>
            </div>
          ) : (
            <>
              <AnimatePresence>
                {items.map((item) => (
                  <motion.div
                    key={`${item.id}-${item.isBox ? 'box' : 'unit'}`}
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <CartItem item={item} />
                  </motion.div>
                ))}
              </AnimatePresence>
              
              <Divider className="my-2" />
              
              <div className="mt-4">
                <div className="flex justify-between font-semibold">
                  <span>Total:</span>
                  <span>{formatPrice(total)}</span>
                </div>
                
                <Button 
                  color="secondary" 
                  className="w-full mt-4"
                  onPress={() => {
                    // Aquí iría la lógica para finalizar la compra
                    alert('Funcionalidad de checkout no implementada en este demo');
                    setIsOpen(false);
                  }}
                >
                  Finalizar Compra
                </Button>
              </div>
            </>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default CartButton;

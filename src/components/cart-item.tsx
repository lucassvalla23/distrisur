import React from 'react';
import { Button, Image } from '@heroui/react';
import { Icon } from '@iconify/react';
import { useCart, CartItem as CartItemType } from '../contexts/cart-context';

interface CartItemProps {
  item: CartItemType;
}

const CartItem: React.FC<CartItemProps> = ({ item }) => {
  const { updateQuantity, removeItem } = useCart();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS'
    }).format(price);
  };

  const handleIncrement = () => {
    updateQuantity(item.id, item.quantity + 1, item.isBox);
  };

  const handleDecrement = () => {
    if (item.quantity > 1) {
      updateQuantity(item.id, item.quantity - 1, item.isBox);
    }
  };

  const handleRemove = () => {
    removeItem(item.id, item.isBox);
  };

  const itemPrice = item.isBox ? (item.boxPrice || 0) : item.price;
  const totalPrice = itemPrice * item.quantity;

  return (
    <div className="flex gap-2 py-2 border-b border-default-100 last:border-b-0">
      <div className="w-16 h-16 rounded-md overflow-hidden flex-shrink-0">
        <Image
          removeWrapper
          src={item.image || "https://img.heroui.chat/image/food?w=200&h=200&u=1"}
          alt={item.name}
          className="w-full h-full object-cover"
        />
      </div>
      
      <div className="flex-grow">
        <div className="flex justify-between">
          <h4 className="font-medium text-sm line-clamp-2">{item.name}</h4>
          <Button
            isIconOnly
            size="sm"
            variant="light"
            className="h-6 w-6 min-w-0 p-0"
            onPress={handleRemove}
          >
            <Icon icon="lucide:x" size={14} />
          </Button>
        </div>
        
        <div className="text-xs text-default-500 mb-1">
          {item.isBox ? `Caja (${item.boxQuantity} unidades)` : 'Unidad'}
        </div>
        
        <div className="flex justify-between items-center">
          <div className="flex items-center border rounded-md">
            <Button
              isIconOnly
              size="sm"
              variant="light"
              className="h-6 w-6 min-w-0 p-0"
              onPress={handleDecrement}
              isDisabled={item.quantity <= 1}
            >
              <Icon icon="lucide:minus" size={14} />
            </Button>
            <span className="px-2 text-sm">{item.quantity}</span>
            <Button
              isIconOnly
              size="sm"
              variant="light"
              className="h-6 w-6 min-w-0 p-0"
              onPress={handleIncrement}
            >
              <Icon icon="lucide:plus" size={14} />
            </Button>
          </div>
          
          <div className="text-sm font-medium">
            {formatPrice(totalPrice)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartItem;

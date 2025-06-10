import React, { useState } from 'react';
import { Card, CardBody, CardFooter, Button, Image, Tooltip } from '@heroui/react';
import { Icon } from '@iconify/react';
import { motion } from 'framer-motion';
import { useCart } from '../contexts/cart-context';

interface ProductCardProps {
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

const ProductCard: React.FC<ProductCardProps> = ({
  id,
  name,
  price,
  boxPrice,
  boxQuantity,
  image,
  variants
}) => {
  const { addItem } = useCart();
  const [selectedVariant, setSelectedVariant] = useState(variants && variants.length > 0 ? variants[0] : '');
  const [isBox, setIsBox] = useState(false);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS'
    }).format(price);
  };

  const handleAddToCart = () => {
    const variantName = selectedVariant ? `${name} - ${selectedVariant}` : name;
    
    addItem({
      id,
      name: variantName,
      price,
      boxPrice,
      boxQuantity,
      image,
      quantity: 1,
      isBox
    });
  };

  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="product-card-hover">
        <CardBody className="p-0 overflow-hidden">
          <Image
            removeWrapper
            shadow="none"
            radius="none"
            alt={name}
            className="w-full aspect-square object-cover"
            src={image || "https://img.heroui.chat/image/food?w=300&h=300&u=1"}
          />
        </CardBody>
        <CardBody className="pb-0 pt-3 px-3">
          <h3 className="font-medium text-sm line-clamp-2 h-10">{name}</h3>
          
          {variants && variants.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1">
              {variants.map((variant) => (
                <Button
                  key={variant}
                  size="sm"
                  radius="full"
                  variant={selectedVariant === variant ? "solid" : "bordered"}
                  color={selectedVariant === variant ? "primary" : "default"}
                  className="px-2 py-0 h-6 min-w-0 text-xs"
                  onPress={() => setSelectedVariant(variant)}
                >
                  {variant}
                </Button>
              ))}
            </div>
          )}
        </CardBody>
        <CardFooter className="flex-col items-start pt-2">
          {boxPrice && boxQuantity && (
            <div className="flex justify-between w-full mb-2">
              <Button
                size="sm"
                variant={!isBox ? "solid" : "bordered"}
                color={!isBox ? "primary" : "default"}
                className="flex-1 text-xs"
                onPress={() => setIsBox(false)}
              >
                Unidad: {formatPrice(price)}
              </Button>
              <Button
                size="sm"
                variant={isBox ? "solid" : "bordered"}
                color={isBox ? "primary" : "default"}
                className="flex-1 text-xs"
                onPress={() => setIsBox(true)}
              >
                Caja ({boxQuantity}): {formatPrice(boxPrice)}
              </Button>
            </div>
          )}
          
          <Button
            color="secondary"
            variant="flat"
            radius="sm"
            className="w-full"
            endContent={<Icon icon="lucide:shopping-cart" />}
            onPress={handleAddToCart}
          >
            Agregar
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default ProductCard;

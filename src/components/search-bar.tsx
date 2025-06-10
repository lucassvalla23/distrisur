import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { Input, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from '@heroui/react';
import { Icon } from '@iconify/react';
import { motion } from 'framer-motion';
import { firestore } from '../firebase/config';

interface Product {
  id: string;
  name: string;
  category: string;
  subcategory: string;
}

const SearchBar: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const history = useHistory();

  // Search products when searchTerm changes
  useEffect(() => {
    if (searchTerm.length < 2) {
      setResults([]);
      return;
    }

    setIsLoading(true);
    
    const searchTermLower = searchTerm.toLowerCase();
    
    // Search in Firestore
    const searchProducts = async () => {
      try {
        const productsRef = firestore.collection('products');
        const snapshot = await productsRef
          .orderBy('name')
          .startAt(searchTermLower)
          .endAt(searchTermLower + '\uf8ff')
          .limit(5)
          .get();
        
        const searchResults = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        } as Product));
        
        setResults(searchResults);
      } catch (error) {
        console.error('Error searching products:', error);
      } finally {
        setIsLoading(false);
      }
    };

    // Debounce search
    const timer = setTimeout(() => {
      searchProducts();
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      history.push(`/productos?search=${encodeURIComponent(searchTerm)}`);
      setSearchTerm('');
      setIsOpen(false);
    }
  };

  const handleSelectProduct = (product: Product) => {
    history.push(`/productos/${product.category}/${product.subcategory}?search=${encodeURIComponent(product.name)}`);
    setSearchTerm('');
    setIsOpen(false);
  };

  return (
    <div className="relative w-full max-w-xs">
      <form onSubmit={handleSearch}>
        <Input
          classNames={{
            base: "max-w-full",
            mainWrapper: "h-10",
            input: "text-small",
            inputWrapper: "h-10 bg-content2",
          }}
          placeholder="Buscar productos..."
          size="sm"
          startContent={
            <Icon 
              icon="lucide:search" 
              className="text-default-400 pointer-events-none flex-shrink-0" 
            />
          }
          type="search"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setIsOpen(e.target.value.length >= 2);
          }}
        />
      </form>

      {isOpen && (searchTerm.length >= 2) && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="absolute z-10 w-full mt-1 bg-content1 rounded-lg shadow-lg overflow-hidden"
        >
          {isLoading ? (
            <div className="p-4 text-center text-default-500">
              <Icon icon="lucide:loader" className="animate-spin mr-2" />
              Buscando...
            </div>
          ) : results.length > 0 ? (
            <ul className="py-2">
              {results.map((product) => (
                <li 
                  key={product.id}
                  className="px-4 py-2 hover:bg-content2 cursor-pointer"
                  onClick={() => handleSelectProduct(product)}
                >
                  <div className="flex items-center gap-2">
                    <Icon icon="lucide:package" className="text-default-500" />
                    <span>{product.name}</span>
                  </div>
                  <div className="text-xs text-default-500 ml-6">
                    {product.category} &gt; {product.subcategory}
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="p-4 text-center text-default-500">
              No se encontraron productos
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
};

export default SearchBar;

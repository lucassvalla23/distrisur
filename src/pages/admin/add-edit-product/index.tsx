import React, { useState, useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { 
  Card, 
  CardBody, 
  Input, 
  Button, 
  Textarea, 
  Select, 
  SelectItem, 
  Divider,
  Chip,
  Checkbox
} from '@heroui/react';
import { Icon } from '@iconify/react';
import { motion } from 'framer-motion';
import { 
  doc, 
  getDoc, 
  addDoc, 
  updateDoc, 
  collection, 
  serverTimestamp 
} from 'firebase/firestore';
import { 
  ref, 
  uploadBytes, 
  getDownloadURL 
} from 'firebase/storage';
import { firestore, storage } from '../../../firebase/config';

interface RouteParams {
  id?: string;
}

interface ProductFormData {
  name: string;
  description: string;
  price: string;
  boxPrice: string;
  boxQuantity: string;
  category: string;
  subcategory: string;
  variants: string[];
  image: File | null;
  imageUrl: string;
}

const AdminAddEditProductPage: React.FC = () => {
  const { id } = useParams<RouteParams>();
  const history = useHistory();
  const isEditMode = Boolean(id);
  
  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    description: '',
    price: '',
    boxPrice: '',
    boxQuantity: '',
    category: '',
    subcategory: '',
    variants: [],
    image: null,
    imageUrl: ''
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [newVariant, setNewVariant] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [subcategories, setSubcategories] = useState<string[]>([]);

  // Categorías y subcategorías
  const categories = [
    { 
      label: 'Golosinas', 
      value: 'golosinas',
      subcategories: [
        { label: 'Alfajores', value: 'alfajores' },
        { label: 'Chocolates', value: 'chocolates' },
        { label: 'Caramelos', value: 'caramelos' },
        { label: 'Chupetines', value: 'chupetines' },
        { label: 'Chicles', value: 'chicles' }
      ]
    },
    { 
      label: 'Almacén', 
      value: 'almacen',
      subcategories: [
        { label: 'Conservas', value: 'conservas' },
        { label: 'Pastas', value: 'pastas' },
        { label: 'Aceites', value: 'aceites' },
        { label: 'Arroz', value: 'arroz' },
        { label: 'Legumbres', value: 'legumbres' }
      ]
    },
    { 
      label: 'Limpieza', 
      value: 'limpieza',
      subcategories: [
        { label: 'Detergentes', value: 'detergentes' },
        { label: 'Lavandina', value: 'lavandina' },
        { label: 'Desinfectantes', value: 'desinfectantes' },
        { label: 'Papel', value: 'papel' },
        { label: 'Jabones', value: 'jabones' }
      ]
    }
  ];

  // Cargar datos del producto si estamos en modo edición
  useEffect(() => {
    if (isEditMode && id) {
      setIsLoading(true);
      
      // In a real implementation, we would fetch the product from Firestore
      // const fetchProduct = async () => {
      //   try {
      //     const productRef = doc(firestore, 'products', id);
      //     const productDoc = await getDoc(productRef);
      //     
      //     if (productDoc.exists()) {
      //       const productData = productDoc.data();
      //       setFormData({
      //         name: productData.name || '',
      //         description: productData.description || '',
      //         price: productData.price?.toString() || '',
      //         boxPrice: productData.boxPrice?.toString() || '',
      //         boxQuantity: productData.boxQuantity?.toString() || '',
      //         category: productData.category || '',
      //         subcategory: productData.subcategory || '',
      //         variants: productData.variants || [],
      //         image: null,
      //         imageUrl: productData.image || ''
      //       });
      //       
      //       // Update subcategories based on the category
      //       updateSubcategories(productData.category);
      //     }
      //   } catch (error) {
      //     console.error('Error fetching product:', error);
      //   } finally {
      //     setIsLoading(false);
      //   }
      // };
      // 
      // fetchProduct();
      
      // For the demo, use sample data
      setTimeout(() => {
        const sampleProduct = {
          name: 'Alfajor Milka',
          description: 'Delicioso alfajor de chocolate con relleno de dulce de leche.',
          price: '150',
          boxPrice: '1800',
          boxQuantity: '12',
          category: 'golosinas',
          subcategory: 'alfajores',
          variants: ['Chocolate Negro', 'Chocolate Blanco'],
          imageUrl: 'https://img.heroui.chat/image/food?w=300&h=300&u=1'
        };
        
        setFormData({
          ...sampleProduct,
          image: null
        });
        
        // Update subcategories based on the category
        updateSubcategories(sampleProduct.category);
        
        setIsLoading(false);
      }, 1000);
    }
  }, [id, isEditMode]);

  // Actualizar subcategorías cuando cambia la categoría
  const updateSubcategories = (categoryValue: string) => {
    const category = categories.find(c => c.value === categoryValue);
    if (category) {
      setSubcategories(category.subcategories.map(sc => sc.value));
    } else {
      setSubcategories([]);
    }
  };

  // Manejar cambios en los campos del formulario
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Manejar cambio de categoría
  const handleCategoryChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      category: value,
      subcategory: '' // Resetear subcategoría al cambiar categoría
    }));
    
    updateSubcategories(value);
  };

  // Manejar cambio de subcategoría
  const handleSubcategoryChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      subcategory: value
    }));
  };

  // Manejar carga de imagen
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFormData(prev => ({
        ...prev,
        image: file
      }));
      
      // Crear preview de la imagen
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Agregar nueva variante
  const handleAddVariant = () => {
    if (newVariant.trim() && !formData.variants.includes(newVariant.trim())) {
      setFormData(prev => ({
        ...prev,
        variants: [...prev.variants, newVariant.trim()]
      }));
      setNewVariant('');
    }
  };

  // Eliminar variante
  const handleRemoveVariant = (variant: string) => {
    setFormData(prev => ({
      ...prev,
      variants: prev.variants.filter(v => v !== variant)
    }));
  };

  // Guardar producto
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    try {
      // Validate required fields
      if (!formData.name || !formData.price || !formData.category || !formData.subcategory) {
        alert('Por favor completa todos los campos requeridos');
        setIsSaving(false);
        return;
      }
      
      let imageUrl = formData.imageUrl;
      
      // Upload image to Firebase Storage if a new image is selected
      if (formData.image) {
        try {
          const storageRef = ref(storage, `products/${Date.now()}_${formData.image.name}`);
          const uploadResult = await uploadBytes(storageRef, formData.image);
          imageUrl = await getDownloadURL(uploadResult.ref);
          console.log('Imagen subida correctamente:', imageUrl);
        } catch (imageError) {
          console.error('Error al subir la imagen:', imageError);
          // Continue with default image if upload fails
          imageUrl = formData.imageUrl || 'https://img.heroui.chat/image/food?w=300&h=300&u=1';
        }
      }
      
      const productData = {
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        boxPrice: formData.boxPrice ? parseFloat(formData.boxPrice) : null,
        boxQuantity: formData.boxQuantity ? parseInt(formData.boxQuantity) : null,
        category: formData.category,
        subcategory: formData.subcategory,
        variants: formData.variants,
        image: imageUrl || 'https://img.heroui.chat/image/food?w=300&h=300&u=1',
        updatedAt: serverTimestamp()
      };
      
      if (isEditMode && id) {
        // Update existing product in Firestore
        const productRef = doc(firestore, 'products', id);
        await updateDoc(productRef, productData);
        console.log('Producto actualizado:', productData);
      } else {
        // Create new product in Firestore
        const productsRef = collection(firestore, 'products');
        const newProductRef = await addDoc(productsRef, {
          ...productData,
          createdAt: serverTimestamp()
        });
        console.log('Producto creado con ID:', newProductRef.id);
      }
      
      // Show success message
      alert(isEditMode ? 'Producto actualizado correctamente' : 'Producto agregado correctamente');
      
      // Redirect to products list
      history.push('/admin/productos');
    } catch (error) {
      console.error('Error saving product:', error);
      alert('Error al guardar el producto: ' + (error instanceof Error ? error.message : 'Error desconocido'));
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">
          {isEditMode ? 'Editar Producto' : 'Nuevo Producto'}
        </h1>
        <Button 
          variant="light" 
          color="default"
          onPress={() => history.push('/admin/productos')}
          startContent={<Icon icon="lucide:arrow-left" />}
        >
          Volver
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Icon icon="lucide:loader" className="text-4xl text-secondary animate-spin" />
        </div>
      ) : (
        <Card>
          <CardBody className="p-6">
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Columna 1: Información básica */}
                <div className="lg:col-span-2 space-y-4">
                  <h2 className="text-lg font-semibold">Información del Producto</h2>
                  <Divider className="my-2" />
                  
                  <Input
                    label="Nombre del Producto"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    variant="bordered"
                    isRequired
                  />
                  
                  <Textarea
                    label="Descripción"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    variant="bordered"
                    minRows={3}
                  />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="Precio Unitario ($)"
                      name="price"
                      type="number"
                      value={formData.price}
                      onChange={handleChange}
                      variant="bordered"
                      startContent={
                        <div className="pointer-events-none flex items-center">
                          <span className="text-default-400 text-small">$</span>
                        </div>
                      }
                      isRequired
                    />
                    
                    <Input
                      label="Precio por Caja ($)"
                      name="boxPrice"
                      type="number"
                      value={formData.boxPrice}
                      onChange={handleChange}
                      variant="bordered"
                      startContent={
                        <div className="pointer-events-none flex items-center">
                          <span className="text-default-400 text-small">$</span>
                        </div>
                      }
                    />
                  </div>
                  
                  <Input
                    label="Unidades por Caja"
                    name="boxQuantity"
                    type="number"
                    value={formData.boxQuantity}
                    onChange={handleChange}
                    variant="bordered"
                  />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Select
                      label="Categoría"
                      selectedKeys={formData.category ? [formData.category] : []}
                      onChange={(e) => handleCategoryChange(e.target.value)}
                      variant="bordered"
                      isRequired
                    >
                      {categories.map((category) => (
                        <SelectItem key={category.value} value={category.value}>
                          {category.label}
                        </SelectItem>
                      ))}
                    </Select>
                    
                    <Select
                      label="Subcategoría"
                      selectedKeys={formData.subcategory ? [formData.subcategory] : []}
                      onChange={(e) => handleSubcategoryChange(e.target.value)}
                      variant="bordered"
                      isDisabled={!formData.category}
                      isRequired
                    >
                      {formData.category && categories
                        .find(c => c.value === formData.category)
                        ?.subcategories.map((subcategory) => (
                          <SelectItem key={subcategory.value} value={subcategory.value}>
                            {subcategory.label}
                          </SelectItem>
                        ))}
                    </Select>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium mb-2">Variantes</h3>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {formData.variants.map((variant, index) => (
                        <Chip 
                          key={index}
                          onClose={() => handleRemoveVariant(variant)}
                          variant="flat"
                          color="primary"
                        >
                          {variant}
                        </Chip>
                      ))}
                      
                      {formData.variants.length === 0 && (
                        <p className="text-default-500 text-sm">No hay variantes</p>
                      )}
                    </div>
                    
                    <div className="flex gap-2">
                      <Input
                        placeholder="Agregar variante"
                        value={newVariant}
                        onChange={(e) => setNewVariant(e.target.value)}
                        variant="bordered"
                        size="sm"
                      />
                      <Button 
                        color="primary" 
                        size="sm"
                        isDisabled={!newVariant.trim()}
                        onPress={handleAddVariant}
                      >
                        Agregar
                      </Button>
                    </div>
                  </div>
                </div>
                
                {/* Columna 2: Imagen */}
                <div className="space-y-4">
                  <h2 className="text-lg font-semibold">Imagen del Producto</h2>
                  <Divider className="my-2" />
                  
                  <div className="border-2 border-dashed border-default-200 rounded-lg p-4 text-center">
                    {(imagePreview || formData.imageUrl) ? (
                      <div className="mb-4">
                        <img 
                          src={imagePreview || formData.imageUrl} 
                          alt="Preview" 
                          className="max-h-48 mx-auto rounded-md"
                        />
                      </div>
                    ) : (
                      <div className="py-8">
                        <Icon icon="lucide:image" className="text-4xl text-default-300 mx-auto mb-2" />
                        <p className="text-default-500">No hay imagen seleccionada</p>
                      </div>
                    )}
                    
                    <label className="block">
                      <Button 
                        as="span"
                        variant="flat"
                        color="primary"
                        className="mt-2"
                        startContent={<Icon icon="lucide:upload" />}
                      >
                        Seleccionar Imagen
                      </Button>
                      <input 
                        type="file" 
                        className="hidden" 
                        accept="image/*"
                        onChange={handleImageChange}
                      />
                    </label>
                  </div>
                  
                  <div className="mt-4">
                    <Checkbox defaultSelected>
                      <span className="text-sm">Mostrar en página principal</span>
                    </Checkbox>
                  </div>
                </div>
              </div>
              
              <Divider className="my-6" />
              
              <div className="flex justify-end gap-2">
                <Button 
                  variant="light" 
                  color="default"
                  onPress={() => history.push('/admin/productos')}
                >
                  Cancelar
                </Button>
                <Button 
                  type="submit" 
                  color="secondary"
                  isLoading={isSaving}
                  endContent={!isSaving && <Icon icon="lucide:save" />}
                >
                  {isSaving ? 'Guardando...' : isEditMode ? 'Actualizar Producto' : 'Guardar Producto'}
                </Button>
              </div>
            </form>
          </CardBody>
        </Card>
      )}
    </div>
  );
};

export default AdminAddEditProductPage;
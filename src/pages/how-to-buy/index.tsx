import React from 'react';
import { Card, CardBody, Button, Divider } from '@heroui/react';
import { Icon } from '@iconify/react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const HowToBuyPage: React.FC = () => {
  const steps = [
    {
      icon: "lucide:search",
      title: "Explora nuestro catálogo",
      description: "Navega por nuestras categorías o utiliza el buscador para encontrar los productos que necesitas."
    },
    {
      icon: "lucide:shopping-cart",
      title: "Agrega productos al carrito",
      description: "Selecciona los productos que deseas comprar y haz clic en el botón 'Agregar' que aparece debajo de cada producto. Puedes elegir entre comprar unidades individuales o cajas completas seleccionando la opción correspondiente antes de agregar al carrito."
    },
    {
      icon: "lucide:check-circle",
      title: "Revisa tu pedido",
      description: "Verifica los productos seleccionados, cantidades y precios en tu carrito antes de continuar."
    },
    {
      icon: "lucide:user",
      title: "Completa tus datos",
      description: "Ingresa tu información de contacto y dirección de entrega para procesar tu pedido."
    },
    {
      icon: "lucide:credit-card",
      title: "Elige el método de pago",
      description: "Selecciona entre transferencia bancaria, efectivo contra entrega o pago con tarjeta."
    },
    {
      icon: "lucide:truck",
      title: "Recibe tu pedido",
      description: "Nosotros nos encargamos de entregar tu pedido en la dirección indicada en el tiempo acordado."
    }
  ];

  const faqs = [
    {
      question: "¿Cuál es el pedido mínimo?",
      answer: "El pedido mínimo es de $10,000 para entregas en CABA y Gran Buenos Aires."
    },
    {
      question: "¿Cuánto tiempo tarda en llegar mi pedido?",
      answer: "Las entregas se realizan dentro de las 48 horas hábiles posteriores a la confirmación del pedido para CABA y Gran Buenos Aires. Para envíos al interior, el tiempo puede variar entre 3 y 5 días hábiles."
    },
    {
      question: "¿Qué métodos de pago aceptan?",
      answer: "Aceptamos transferencia bancaria, efectivo contra entrega y tarjetas de crédito/débito."
    },
    {
      question: "¿Realizan envíos a todo el país?",
      answer: "Sí, realizamos envíos a todo el país. El costo de envío varía según la localidad y el volumen del pedido."
    },
    {
      question: "¿Puedo modificar mi pedido una vez realizado?",
      answer: "Puedes modificar tu pedido hasta 2 horas después de haberlo realizado, contactándonos por teléfono o WhatsApp."
    }
  ];

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

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.h1 
        className="text-3xl font-bold mb-2 text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Cómo Comprar
      </motion.h1>
      <motion.p 
        className="text-default-600 text-center mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        Sigue estos sencillos pasos para realizar tu compra
      </motion.p>

      {/* Steps */}
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {steps.map((step, index) => (
          <motion.div key={index} variants={itemVariants}>
            <Card className="h-full">
              <CardBody className="p-6">
                <div className="flex flex-col items-center text-center">
                  <div className="bg-primary rounded-full w-16 h-16 flex items-center justify-center mb-4">
                    <Icon icon={step.icon} className="text-2xl text-secondary" />
                  </div>
                  <div className="bg-secondary text-white rounded-full w-6 h-6 flex items-center justify-center mb-4">
                    {index + 1}
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
                  <p className="text-default-600">{step.description}</p>
                </div>
              </CardBody>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* FAQ Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <Card>
          <CardBody className="p-6">
            <h2 className="text-2xl font-bold mb-6 text-center">Preguntas Frecuentes</h2>
            
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <div key={index}>
                  <div className="flex items-start gap-3 mb-2">
                    <div className="bg-primary rounded-full p-1 mt-1">
                      <Icon icon="lucide:help-circle" className="text-secondary" />
                    </div>
                    <h3 className="font-semibold">{faq.question}</h3>
                  </div>
                  <p className="text-default-600 ml-8 mb-4">{faq.answer}</p>
                  {index < faqs.length - 1 && <Divider className="my-4" />}
                </div>
              ))}
            </div>
          </CardBody>
        </Card>
      </motion.div>

      {/* Call to Action */}
      <motion.div 
        className="mt-12 text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.7 }}
      >
        <h2 className="text-2xl font-bold mb-4">¿Listo para realizar tu pedido?</h2>
        <p className="text-default-600 mb-6 max-w-2xl mx-auto">
          Si tienes alguna duda adicional, no dudes en contactarnos. Estamos aquí para ayudarte.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Button 
            as={Link}
            to="/productos"
            color="secondary"
            size="lg"
            endContent={<Icon icon="lucide:shopping-cart" />}
          >
            Ver Productos
          </Button>
          <Button 
            as={Link}
            to="/contacto"
            variant="bordered"
            color="primary"
            size="lg"
            endContent={<Icon icon="lucide:mail" />}
          >
            Contactar
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

export default HowToBuyPage;
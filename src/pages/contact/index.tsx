import React, { useState } from 'react';
import { 
  Card, 
  CardBody, 
  Input, 
  Textarea, 
  Button, 
  Divider 
} from '@heroui/react';
import { Icon } from '@iconify/react';
import { motion } from 'framer-motion';

const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulación de envío
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      });
      
      // Reset success message after 5 seconds
      setTimeout(() => {
        setIsSubmitted(false);
      }, 5000);
    }, 1500);
  };

  const contactInfo = [
    {
      icon: "lucide:map-pin",
      title: "Dirección",
      content: "Av. Siempreviva 742, Buenos Aires, Argentina"
    },
    {
      icon: "lucide:phone",
      title: "Teléfono",
      content: "+54 9 11 1234-5678"
    },
    {
      icon: "lucide:mail",
      title: "Email",
      content: "info@distribuidorasur.com"
    },
    {
      icon: "lucide:clock",
      title: "Horario de Atención",
      content: "Lunes a Viernes: 9:00 - 18:00"
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
        Contacto
      </motion.h1>
      <motion.p 
        className="text-default-600 text-center mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        Estamos aquí para ayudarte. No dudes en contactarnos.
      </motion.p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Contact Information */}
        <motion.div 
          className="lg:col-span-1"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <Card>
            <CardBody className="p-6">
              <h2 className="text-xl font-semibold mb-4">Información de Contacto</h2>
              <Divider className="mb-4" />
              
              <div className="space-y-6">
                {contactInfo.map((info, index) => (
                  <motion.div 
                    key={index} 
                    className="flex items-start gap-3"
                    variants={itemVariants}
                  >
                    <div className="bg-primary rounded-full p-2 mt-1">
                      <Icon icon={info.icon} className="text-secondary" />
                    </div>
                    <div>
                      <h3 className="font-medium">{info.title}</h3>
                      <p className="text-default-600">{info.content}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
              
              <Divider className="my-6" />
              
              <div>
                <h3 className="font-medium mb-3">Síguenos</h3>
                <div className="flex gap-4">
                  <a 
                    href="https://facebook.com" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="bg-primary rounded-full p-2 hover:bg-secondary transition-colors"
                  >
                    <Icon icon="logos:facebook" className="text-xl" />
                  </a>
                  <a 
                    href="https://instagram.com" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="bg-primary rounded-full p-2 hover:bg-secondary transition-colors"
                  >
                    <Icon icon="logos:instagram-icon" className="text-xl" />
                  </a>
                  <a 
                    href="https://wa.me/5491112345678" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="bg-primary rounded-full p-2 hover:bg-secondary transition-colors"
                  >
                    <Icon icon="logos:whatsapp-icon" className="text-xl" />
                  </a>
                </div>
              </div>
            </CardBody>
          </Card>
        </motion.div>

        {/* Contact Form */}
        <motion.div 
          className="lg:col-span-2"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card>
            <CardBody className="p-6">
              <h2 className="text-xl font-semibold mb-4">Envíanos un Mensaje</h2>
              <Divider className="mb-6" />
              
              {isSubmitted ? (
                <motion.div 
                  className="bg-success-100 text-success-700 p-4 rounded-lg text-center"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <Icon icon="lucide:check-circle" className="text-3xl mx-auto mb-2" />
                  <h3 className="font-medium text-lg">¡Mensaje Enviado!</h3>
                  <p>Gracias por contactarnos. Te responderemos a la brevedad.</p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="Nombre"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      variant="bordered"
                      isRequired
                    />
                    <Input
                      label="Email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      variant="bordered"
                      isRequired
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="Teléfono"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      variant="bordered"
                    />
                    <Input
                      label="Asunto"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      variant="bordered"
                      isRequired
                    />
                  </div>
                  
                  <Textarea
                    label="Mensaje"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    variant="bordered"
                    minRows={5}
                    isRequired
                  />
                  
                  <Button
                    type="submit"
                    color="secondary"
                    className="w-full"
                    isLoading={isSubmitting}
                    endContent={!isSubmitting && <Icon icon="lucide:send" />}
                  >
                    {isSubmitting ? 'Enviando...' : 'Enviar Mensaje'}
                  </Button>
                </form>
              )}
            </CardBody>
          </Card>
        </motion.div>
      </div>

      {/* Map Section */}
      <motion.div 
        className="mt-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <Card>
          <CardBody className="p-0">
            <div className="aspect-[16/9] w-full bg-default-200 relative overflow-hidden">
              {/* Aquí iría un mapa real con la API de Google Maps o similar */}
              <div className="absolute inset-0 flex items-center justify-center bg-content3">
                <div className="text-center">
                  <Icon icon="lucide:map" className="text-6xl text-default-400 mb-2" />
                  <p className="text-default-600">Mapa de ubicación</p>
                </div>
              </div>
            </div>
          </CardBody>
        </Card>
      </motion.div>
    </div>
  );
};

export default ContactPage;

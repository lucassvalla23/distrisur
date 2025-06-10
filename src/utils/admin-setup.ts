import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { collection, doc, setDoc } from "firebase/firestore";
import { firestore } from "../firebase/config";

/**
 * Esta función debe ejecutarse UNA SOLA VEZ para crear el usuario administrador
 * Puedes ejecutarla desde la consola del navegador después de importarla
 * o crear un componente temporal para ejecutarla
 */
export const setupAdminUser = async (email: string, password: string) => {
  try {
    // 1. Crear el usuario con email y contraseña
    const auth = getAuth();
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // 2. Guardar el usuario como administrador en Firestore
    try {
      const adminRef = doc(collection(firestore, "admins"), user.uid);
      await setDoc(adminRef, {
        email: user.email,
        role: "admin",
        createdAt: new Date()
      });
      
      console.log("✅ Usuario administrador creado exitosamente");
      return true;
    } catch (firestoreError: any) {
      console.error("❌ Error al guardar en Firestore:", firestoreError.message);
      // Aún así devolvemos true porque el usuario se creó en Authentication
      return true;
    }
  } catch (error: any) {
    console.error("❌ Error al crear usuario administrador:", error.message);
    throw error; // Lanzamos el error para manejarlo en el componente
  }
};

/**
 * Instrucciones para crear un usuario administrador:
 * 
 * 1. Abre la consola del navegador (F12 o clic derecho -> Inspeccionar)
 * 2. Importa esta función: import { setupAdminUser } from './utils/admin-setup'
 * 3. Ejecuta: setupAdminUser('tucorreo@ejemplo.com', 'tucontraseña')
 * 4. Verifica en la consola que se haya creado correctamente
 * 5. Ahora puedes iniciar sesión con esas credenciales
 */
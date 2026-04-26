import app from "./firebase.config.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "firebase/auth";
import { doc, setDoc, getFirestore } from "firebase/firestore";

const auth = getAuth(app);
const db = getFirestore(app);

// Wrappers para la UI: ocultan la dependencia de 'firebase/auth' a los componentes
export const subscribeToAuthChanges = (callback) => {
    return onAuthStateChanged(auth, callback);
};

export const logoutUser = async () => {
    try {
        await signOut(auth);
        return { success: true };
    } catch (error) {
        console.error("Error signing out:", error);
        return { success: false, error: error.code };
    }
};

export const registerFullUser = async (userData) => {
    try {
        // 1. Crear el usuario en Auth
        const userCredential = await createUserWithEmailAndPassword(
            auth,
            userData.email,
            userData.password
        );

        const user = userCredential.user;

        // 2. Guardar en Firestore usando el UID obtenido
        // Ahora guardamos una lista de direcciones (addresses) en lugar de un string
        await setDoc(doc(db, "users", user.uid), {
            name: userData.name,
            email: userData.email,
            cellphone: userData.cellphone,
            addresses: [userData.address], // Initialize with the registration address
            createdAt: new Date()
        });

        return { success: true, user };
    } catch (error) {
        console.error("Error en el servicio de registro:", error);
        return { success: false, error: error.code };
    }
};

export const loginUser = async (email, password) => {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        return { success: true, user };
    } catch (error) {
        console.error("Error en el servicio de login:", error.code);

        // Mapeo rápido de errores comunes de login
        let errorMessage = "Error al iniciar sesión";
        if (error.code === 'auth/invalid-credential') {
            errorMessage = "Correo o contraseña incorrectos";
        } else if (error.code === 'auth/user-not-found') {
            errorMessage = "El usuario no existe";
        }

        return { success: false, error: errorMessage };
    }
};

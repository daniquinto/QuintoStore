import app from "./firebase.config.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "firebase/auth";
import { doc, setDoc, getFirestore } from "firebase/firestore";

const auth = getAuth(app);
const db = getFirestore(app);

// Wrappers for UI: hide firebase/auth dependency from components
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
        // 1. Create user in Auth
        const userCredential = await createUserWithEmailAndPassword(
            auth,
            userData.email,
            userData.password
        );

        const user = userCredential.user;

        // 2. Save in Firestore using the obtained UID
        await setDoc(doc(db, "users", user.uid), {
            name: userData.name,
            email: userData.email,
            cellphone: userData.cellphone,
            addresses: [userData.address], // Initialize with registration address
            createdAt: new Date()
        });

        return { success: true, user };
    } catch (error) {
        console.error("Registration service error:", error);
        return { success: false, error: error.code };
    }
};

export const loginUser = async (email, password) => {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        return { success: true, user };
    } catch (error) {
        console.error("Login service error:", error.code);

        // Map common login errors to English
        let errorMessage = "Login error";
        if (error.code === 'auth/invalid-credential') {
            errorMessage = "Incorrect email or password";
        } else if (error.code === 'auth/user-not-found') {
            errorMessage = "User does not exist";
        } else if (error.code === 'auth/network-request-failed') {
            errorMessage = "Network error. Please check your connection.";
        }

        return { success: false, error: errorMessage };
    }
};

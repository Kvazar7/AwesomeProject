import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { auth, storage } from '../Сonfig/firebaseConfig';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from 'firebase/auth';

export const uploadPhotoToFirebase = async (photoUri, userId) => {
    try {
        const photoRef = ref(storage, `users/${userId}/avatar.jpg`);
        const response = await fetch(photoUri);
        const blob = await response.blob();
        await uploadBytes(photoRef, blob);
        return await getDownloadURL(photoRef);
    } catch (error) {
        console.error("Error uploading photo:", error);
        throw error;
    }
};

export const handleRegistration = async (email, password, login, photo) => {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        if (photo) {
            const avatarUrl = await uploadPhotoToFirebase(photo, user.uid);
            await updateProfile(user, { photoURL: avatarUrl });
        }
        return user;
    } catch (error) {
        console.error("Error during registration:", error);
        throw error;
    }
};

export const handleLogin = async (email, password) => {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        return userCredential.user;
    } catch (error) {
        console.error("Error during login:", error);
        throw error;
    }
};

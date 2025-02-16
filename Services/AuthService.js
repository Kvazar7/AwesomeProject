import { auth, storage } from '../Сonfig/firebaseConfig';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

export const uploadPhotoToFirebase = async (photoUri, userId) => {
    try {
      const response = await fetch(photoUri);
      
      if (!response.ok) {
          throw new Error(`Failed to fetch the photo URI. Status: ${response.status}`);
      }
      const blob = await response.blob();
      const photoRef = ref(storage, `users/${userId}/avatar.jpg`);
      await uploadBytes(photoRef, blob);
      const downloadURL = await getDownloadURL(photoRef);
      return downloadURL;
    } catch (error) {
      console.error("Error uploading photo to Firebase Storage:", error);
      throw error;
    }
};

export const handleRegistration = async (email, password, login, photo) => {
  if (!login || !email || !password) {
    alert("Please fill in all fields");
    return;
  }
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    let avatarUrl = null;
    if (photo) {
      try {
        avatarUrl = await uploadPhotoToFirebase(photo, user.uid);
      } catch (photoError) {
        console.error("Failed to upload photo:", photoError.message);
        alert("Photo upload failed. User registered without photo.");
      }
    }
    await updateProfile(user, { 
      displayName: login,
      photoURL: avatarUrl });
    return user;
  } catch (error) {
  if (error.code === 'auth/email-already-in-use') {
    alert('Ця електронна адреса вже використовується.');
  } else if (error.code === 'auth/weak-password') {
    alert('Пароль повинен містити щонайменше 6 символів.');
  } else {
    alert('Сталася помилка. Спробуйте ще раз.');
  }
  console.error("Error during registration:", error);
  }
};

export const handleLogin = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    if (error.code === 'auth/invalid-email') {
      alert('Ця електронна адреса не існує.');
    } else if (error.code === 'auth/missing-password') {
      alert('Треба ввести пароль, спробуйте...');
    } else if (error.code === 'auth/invalid-credential') {
      alert('Пароль невірний.');
    } else {
      alert('Сталася помилка. Спробуйте ще раз.');
    }
    console.error("Error during login:", error);
    throw error;
  }
};

export const getUserData = async (user) => {
  try {
    const { displayName, email, photoURL } = user;
    return { displayName, email, photoURL };
  } catch (error) {
    console.error("Error fetching user data:", error);
    throw error;
  }
};
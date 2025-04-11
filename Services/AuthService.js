import { auth, storage } from '../Сonfig/firebaseConfig';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile, getAuth } from 'firebase/auth';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import * as ImagePicker from 'expo-image-picker';

export const uploadPhotoToFirebase = async (photoUri, userId) => {
  try {
    const response = await fetch(photoUri);
    const blob = await response.blob();

    const storageRef = ref(storage, `avatars/${userId}`);
    await uploadBytes(storageRef, blob);

    const downloadURL = await getDownloadURL(storageRef);
    return downloadURL;
  } catch (error) {
    console.error("Error uploading photo to Firebase:", error);
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
    const { uid, displayName, email, photoURL } = user;
    return { 
      userId: uid,
      displayName: displayName || 'Anonymous',
      email: email || 'No email',
      photoURL: photoURL || 'https://www.pngkey.com/png/full/114-1149878_setting-user-avatar-in-specific-size-without-breaking.png' 
    };
  } catch (error) {
    console.error("Error fetching user data:", error);
    throw error;
  }
};

export const delPhoto = async (auth, setPhoto, setUser) => {
  try {
    await updateProfile(auth.currentUser, { photoURL: null });
    setPhoto(null); // Очищаємо локальний стан
    if (setUser) {
      setUser((prevUser) => ({
        ...prevUser,
        photoURL: null,
      }));
    }
    alert("Photo removed successfully!");
  } catch (error) {
    console.error("Failed to delete photo:", error);
    throw error;
  }
};

export const handleChoosePhoto = async (setPhoto, setUser = null, shouldUpload = false) => {
  try {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });
    if (!result.canceled) {
      const uri = result.assets[0].uri;
      setPhoto(uri);
      if (shouldUpload) {
        const auth = getAuth();
        const userId = auth.currentUser?.uid;
        if (userId) {
          // Завантажуємо фото в Firebase Storage
          const downloadURL = await uploadPhotoToFirebase(uri, userId);
          // Оновлюємо профіль користувача
          await updateProfile(auth.currentUser, { photoURL: downloadURL });
          // Оновлюємо контекст користувача, якщо передано setUser
          if (setUser) {
            setUser((prevUser) => ({
              ...prevUser,
              photoURL: downloadURL,
            }));
          }
          alert("Photo updated successfully!");
        }
      }
    }
  } catch (error) {
    console.error("Error choosing photo:", error);
    throw error;
  }
};

export const handleTakePhoto = async (setPhoto, setUser = null, shouldUpload = false) => {
  try {
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });
    if (!result.canceled) {
      const uri = result.assets[0].uri;
      setPhoto(uri);
      if (shouldUpload) {
        const auth = getAuth();
        const userId = auth.currentUser?.uid;
        if (userId) {
          // Завантажуємо фото в Firebase Storage
          const downloadURL = await uploadPhotoToFirebase(uri, userId);
          // Оновлюємо профіль користувача
          await updateProfile(auth.currentUser, { photoURL: downloadURL });
          // Оновлюємо контекст користувача, якщо передано setUser
          if (setUser) {
            setUser((prevUser) => ({
              ...prevUser,
              photoURL: downloadURL,
            }));
          }
          alert("Photo updated successfully!");
        }
      }
    }
  } catch (error) {
    console.error("Error taking photo:", error);
    throw error;
  }
};
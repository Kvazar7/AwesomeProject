import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { collection, addDoc } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const uploadPhotoToFirebase = async (photo, storage) => {
  const photoId = `${Date.now()}.jpg`;
  const photoRef = ref(storage, `postPhotos/${photoId}`);
  const response = await fetch(photo);

  if (!response.ok) {
    throw new Error("Помилка отримання фото");
  }

  const blob = await response.blob();
  await uploadBytes(photoRef, blob);
  return await getDownloadURL(photoRef);
};

export const savePostToAsyncStorage = async (newPost) => {
  const existingPosts = await AsyncStorage.getItem("posts");
  const postsArray = existingPosts ? JSON.parse(existingPosts) : [];
  postsArray.push(newPost);
  await AsyncStorage.setItem("posts", JSON.stringify(postsArray));
};

export const savePostToFirestore = async (newPost, db) => {
  const postsCollection = collection(db, "posts");
  await addDoc(postsCollection, newPost);
};

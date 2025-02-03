import React, { useState, useEffect, useRef } from "react";
import { View, 
        Image, 
        Text, 
        TouchableOpacity, 
        StyleSheet, 
        TextInput, } from 'react-native';
import { Camera, CameraView  } from "expo-camera";
import * as MediaLibrary from "expo-media-library";
import * as Location from 'expo-location';
import uuid from 'react-native-uuid';
import { uploadPhotoToFirebase, savePostToAsyncStorage, savePostToFirestore } from "../Services/CreatPostService"
import { db, storage } from '..//Сonfig/firebaseConfig'; 

const CreatePost = ({navigation}) => {
  const [hasPermission, setHasPermission] = useState(null);
  const cameraRef = useRef(null);
  const [photo, setPhoto] = useState(null);
  const [description, setDescription] = useState(''); 
  const [locationInput, setLocationInput] = useState('');
  const [locationCoord, setLocation] = useState(null);
  const [isLocationFetching, setIsLocationFetching] = useState(false); 

  useEffect(() => {
    (async () => {
      const cameraPermission = await Camera.requestCameraPermissionsAsync();
      const mediaLibraryPermission = await MediaLibrary.requestPermissionsAsync();
      setHasPermission(
        cameraPermission.status === "granted" && mediaLibraryPermission.status === "granted"
      );
    })();
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      clearPost(); 
    });
    return unsubscribe; 
  }, [navigation]);

  const handleTakePhoto = async () => { 
    if (cameraRef.current) { 
      const photo = await cameraRef.current.takePictureAsync(); 
      setPhoto(photo.uri); 
      await MediaLibrary.createAssetAsync(photo.uri); 
    } 
  };

  function getId() {
    return uuid.v4();
  };

  const publishPost = async () => {
    setIsLocationFetching(true);
    try {
      const location = await Location.getCurrentPositionAsync({});
      setLocation(location.coords);
  
      if (photo && description.trim() && locationInput !== "") {
        // Завантаження фото
        const photoURL = await uploadPhotoToFirebase(photo, storage);
  
        // Створення об'єкта поста
        const newPost = {
          id: getId(), // Генерація унікального ID
          photo: photoURL,
          description,
          locationInput,
          locationCoord: location.coords,
        };
  
        // Збереження поста
        await savePostToAsyncStorage(newPost);
        await savePostToFirestore(newPost, db);
  
        navigation.navigate("Posts", { newPost });
      } else {
        alert("Будь ласка, заповніть всі поля.");
      }
    } catch (error) {
      console.error("Помилка збереження постів:", error);
    } finally {
      setIsLocationFetching(false);
    }
  };
  
  const clearPost = () => { 
    setPhoto(null); 
    setDescription(''); 
    setLocationInput(''); 
  };

  if (hasPermission === null) {
    return <Text>Запит доступу...</Text>;
  }
  if (!hasPermission) {
    return <Text>No access to camera</Text>;
  }

    return (
      <View style={styles.contentContainer}>
        <View style={styles.postPicture}>
          {photo ? (
            <Image source={{ uri: photo }} style={styles.photo} />
          ) : (
            <CameraView 
              style={styles.camera} 
              ref={cameraRef} 
              facing="back"
            />
          )}
  
          <TouchableOpacity 
            style={styles.takePhotoIcon} 
            onPress={handleTakePhoto}
          > 
              <Image source={require('../Img/Ellipse.png')} /> 
          </TouchableOpacity>
        </View>
        <Text style={styles.postPicturePlaceholder}>
          { photo ? 'Редагувати фото' : 'Завантажити фото '} 
        </Text>
  
        <View style={styles.discriptionContainer} >
          <TextInput
            style={styles.discription }
            inputMode="text"
            required
            placeholder="Назва..."
            placeholderTextColor="#BDBDBD"
            cursorColor="#BDBDBD"

            onChangeText={setDescription}
            value={description}
            />
          <TextInput
            style={styles.locationDiscription}
            inputMode="text"
            required
            placeholder="Місце..."
            placeholderTextColor="#BDBDBD"
            cursorColor="#BDBDBD"
  
            onChangeText={setLocationInput}
            value={locationInput}
            />
            <View>
              <Image style={styles.locationIcon} source={require('../Img/locationIcon.png')} />
            </View>
  
          <TouchableOpacity 
            style={[
              styles.publishBtn, 
              photo && description && locationInput ? styles.publishBtnReady : {}
            ]}
            onPress={publishPost}
          >
            <Text style={[
              styles.publishBtnText, 
              photo && description && locationInput ? styles.publishBtnTextReady : {}
              ]}
            >
              Опубліковати
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.trashBtn} 
            onPress={clearPost}
          >
            <Image style={styles.trashIcon} source={require('../Img/trash.png')} />
          </TouchableOpacity>
        </View>
      </View>
    );
  };
  
  const styles = StyleSheet.create({
  
    contentContainer: {
      paddingTop: 32,
      paddingLeft: 16,
      paddingRight: 16,
    },
    
    postPicture: {
      marginBottom: 8,
      width: '100%',
      height: undefined,
      aspectRatio: 17/12,
      borderWidth: 1,
      borderColor: '#E8E8E8',
      borderRadius: 8,
      backgroundColor: '#F6F6F6',
      justifyContent: 'center',
      alignItems: 'center',
    },
  
    photo: {
      marginBottom: 8,
      width: '100%',
      height: undefined,
      aspectRatio: 17/13,
      borderWidth: 1,
      borderColor: '#E8E8E8',
      borderRadius: 8,
    },

    camera: {
      flex: 1, 
      width: "100%",
      borderWidth: 1,
      borderColor: '#E8E8E8',
      borderRadius: 8,
    },
  
    takePhotoIcon: {
      position: 'absolute',
      opacity: 0.8,
    },
  
    photoPlaceholder: {
      fontFamily: 'Roboto',
      fontSize: 16,
      fontWeight: '500',
      color: '#BDBDBD',
      top: -75,
    },
  
    postPicturePlaceholder: {
      fontFamily: 'Roboto',
      fontSize: 16,
      fontWeight: '500',
      color: '#BDBDBD',
    },
  
    discription: {
      borderBottomWidth: 1,
      borderBottomColor: '#E8E8E8',
      marginTop: 16,
      padding: 13,
      paddingLeft: 0,
    },
  
    locationDiscription: {
      borderBottomWidth: 1,
      borderBottomColor: '#E8E8E8',
      marginTop: 16,
      paddingLeft: 28,
      padding: 13,
    },
  
    locationIcon: {
      position: 'absolute',
      bottom: 13,
      
    },
  
    publishBtn: {
      marginTop: 43,
      width: '100%',
      height: 51,
      backgroundColor: '#F6F6F6',
      borderRadius: 100,
      justifyContent: 'center',
      alignItems: 'center',
    },
  
    publishBtnReady: {
      marginTop: 43,
      width: '100%',
      height: 51,
      backgroundColor: '#FF6C00',
      borderRadius: 100,
      justifyContent: 'center',
      alignItems: 'center',
    },
  
    publishBtnText: {
      fontFamily: 'Roboto',
      fontSize: 16,
      fontWeight: '400',
      lineHeight: 19,
      letterSpacing: 0.01,
      color: '#BDBDBD',
    },
  
    publishBtnTextReady: {
      fontFamily: 'Roboto',
      fontSize: 16,
      fontWeight: '400',
      lineHeight: 19,
      letterSpacing: 0.01,
      color: '#FFFFFF',
    },
  
    trashBtn: {
      marginTop: 120,
      width: 70,
      height: 40,
      backgroundColor: '#F6F6F6',
      borderRadius: 20,
  
      alignSelf: 'center',
      justifyContent: 'center',
      alignItems: 'center',
    },
  
    trashIcon: {
  
    },
  
  });
  
  export default CreatePost;
  
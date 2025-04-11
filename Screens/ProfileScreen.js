import React, { useState, useEffect, useContext } from "react";
import {  ImageBackground, 
          StyleSheet, 
          Text, 
          View, 
          Image, 
          TouchableOpacity, 
          Platform, 
          StatusBar,
          KeyboardAvoidingView } from 'react-native';
import AsyncStorage from "@react-native-async-storage/async-storage";
// import { useNavigation } from "@react-navigation/native";
import { UserContext } from "../Component/UserContext";
import { getAuth } from "firebase/auth";
import { delPhoto, handleChoosePhoto, handleTakePhoto } from "../Services/AuthService";
import Profile from "../Component/Profile";

const ProfileScreen =({ route, navigation }) => {
//   const navigation = useNavigation;
  const { user, setUser } = useContext(UserContext);
  const [ photo, setPhoto ] = useState(null);
  const { displayName, photoURL } = user || {};
  const auth = getAuth();

  const handleDelPhoto = async () => {
    try {
      await delPhoto(auth, setPhoto, setUser);
      await updateUserContext(); 
    } catch (error) {
      console.error("Error deleting photo:", error);
    }
  };

  const handleLogOut = async (navigation) => {
    try {
      await AsyncStorage.removeItem('session'); 
      navigation.navigate('Login');
    } catch (e) {
      console.error('Failed to log out.', e);
    }
  };

  const loadPhoto = async () => {
    try {
      const savedPhoto = await AsyncStorage.getItem('userPhoto');
      if (savedPhoto) {
        setPhoto(savedPhoto);
      }
    } catch (e) {
      console.error('Failed to load the photo.', e);
    }
  };

  useEffect(() => {
    loadPhoto();
  }, []);

  useEffect(() => {
    setPhoto(photoURL); // Синхронізуємо локальний стан з контекстом
  }, [photoURL]);
  
  return (
    <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.container}
          >
        <ImageBackground
              source={require('../Img/PhotoBG.png')}
              style={styles.backgroundimage}
              >
        <View style={styles.formWrapper}>
            
        <TouchableOpacity 
          style={styles.userPhoto} 
          onPress={() => handleChoosePhoto(setPhoto, setUser, true)}  
          onLongPress={() => handleTakePhoto(setPhoto, setUser, true)}
        >
                {photoURL ? (
                  <Image source={{ uri: photoURL }} style={styles.photo} />
                  ) : (
                  <Text style={styles.photoPlaceholder}>
                    Tap to choose photo,{'\n'}long press to take a photo
                  </Text>
                )}
                {photoURL ? (
                  <TouchableOpacity 
                      style={styles.userPhotoDel}
                      onPress={handleDelPhoto}>
                    <Image source={require('../Img/del.png')} />
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity 
                      style={styles.userPhotoAdd}
                      onPress={() => handleChoosePhoto(setPhoto, setUser, true)}  
                      onLongPress={() => handleTakePhoto(setPhoto, setUser, true)}
                  >
                    <Image source={require('../Img/add.png')} />
                  </TouchableOpacity>
                )}
        </TouchableOpacity>
    
        <TouchableOpacity style={styles.logOutBtn}
          onPress={() => handleLogOut(navigation)}  
        >
          <Image source={require('../Img/log-out.png')} />   
        </TouchableOpacity>
    


            <Text style={styles.header}>{displayName}</Text>

            <Profile route={route} navigation={navigation}/>
            
        </View>
        </ImageBackground>
          <StatusBar style="auto" />
        </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
   
    formWrapper: {
      flex: 1,
      backgroundColor: '#FFFF',
      marginTop: 147,
      borderTopLeftRadius: 25,
      borderTopRightRadius: 25,
      paddingHorizontal: 16,
      paddingTop: 92,
      // paddingBottom: 15,
      alignItems: 'center',
    },
  
    backgroundimage: {
      flex: 1,
      resizeMode: 'cover',
    },
  
    userPhoto: {
      position: 'absolute',
      backgroundColor: '#F6F6F6',
      borderRadius: 16,
      width: 120,
      height: 120,
      top: -60,
      alignSelf: 'center',
      padding: 10,
    },
  
    photoPlaceholder: {
      color: "#BDBDBD",
    },
  
    photo: {
      position: 'absolute',
      width: 120,
      height: 120,
      borderRadius: 16,
    },
  
    userPhotoAdd: {
      top: -5,
      left: 95,
    },
  
    userPhotoDel: {
      top: 65,
      left: 92,
    },
  
    logOutBtn: {
      position: 'absolute',
      top: 22,
      right: 16,
    },
  
    header: {
      fontFamily: 'Roboto',
      fontSize: 30,
      fontWeight: '500',
      lineHeight: 35,
      letterSpacing: 0.01,
    },
  
  });

export default ProfileScreen;
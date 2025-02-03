import React, { useState, useEffect } from "react";
import {  ImageBackground, 
          StyleSheet, 
          Text, 
          View, 
          Image, 
          TouchableOpacity, 
          Platform, 
          StatusBar,
          KeyboardAvoidingView } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from "@react-native-async-storage/async-storage";
// import { useNavigation } from "@react-navigation/native";
import Profile from "../Component/Profile";

const ProfileScreen =({ route, navigation }) => {
//   const navigation = useNavigation;
  const [photo, setPhoto] = useState(null);
  
  const handleChoosePhoto = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });
    if (!result.canceled) {
      const uri = result.assets[0].uri;
      setPhoto(uri);
      savePhoto(uri);
    }
  };

  const handleTakePhoto = async () => {
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });
    if (!result.canceled) {
      const uri = result.assets[0].uri;
      setPhoto(uri);
      savePhoto(uri);
    }
  };

  const savePhoto = async (uri) => {
    try {
      await AsyncStorage.setItem('userPhoto', uri);
      alert('Photo saved successfully!');
    } catch (e) {
      console.error('Failed to save the photo.', e);
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

  const delPhoto = async () => {
    setPhoto(null)
  };

  const handleLogOut = async (navigation) => {
    try {
      await AsyncStorage.removeItem('session'); 
      navigation.navigate('Login');
    } catch (e) {
      console.error('Failed to log out.', e);
    }
  };

  useEffect(() => {
    loadPhoto();
  }, []);
  
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
            
        <TouchableOpacity style={styles.userPhoto} 
              onPress={handleChoosePhoto} 
              onLongPress={handleTakePhoto}>
                {photo ? (
                  <Image source={{ uri: photo }} style={styles.photo} />
                  ) : (
                  <Text style={styles.photoPlaceholder}>Tap to choose photo,{'\n'}long press to take a photo</Text>
                )}
                {photo ? (
                  <TouchableOpacity style={styles.userPhotoDel}
                      onPress={delPhoto}>
                    <Image source={require('../Img/del.png')} />
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity style={styles.userPhotoAdd}
                      onPress={handleChoosePhoto} 
                      onLongPress={handleTakePhoto}>
                    <Image source={require('../Img/add.png')} />
                  </TouchableOpacity>
                )}
        </TouchableOpacity>
    
        <TouchableOpacity style={styles.logOutBtn}
          onPress={() => handleLogOut(navigation)}  
        >
          <Image source={require('../Img/log-out.png')} />   
        </TouchableOpacity>
    
            <Text style={styles.header}>User Name</Text>

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
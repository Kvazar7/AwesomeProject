import React, { useState, useEffect } from "react";
import { 
  View, 
  Image, 
  Text, 
  TouchableOpacity,
  TextInput, 
  StyleSheet, 
  StatusBar } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';

const CreatePost = ({navigation}) => {
  const [photo, setPhoto] = useState(null);
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState(null);
  const [locationInput, setLocationInput] = useState('');

  useEffect(() => {
    (async () => {
      let { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        alert('Sorry, we need camera roll permissions to make this work!');
      }

      let locationStatus = await Location.requestForegroundPermissionsAsync();
      if (locationStatus.status !== 'granted') {
        alert('Permission to access location was denied');
        return;
      }
    })();
  }, []);

  const handleChoosePhoto = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [17, 12],
      quality: 1,
    });
    if (!result.canceled) {
      setPhoto(result.assets[0].uri);
    }
  };

  const handleTakePhoto = async () => {
    let result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      aspect: [17, 12],
      quality: 1,
    });
    if (!result.canceled) {
      setPhoto(result.assets[0].uri);
    }
  };

  const getLocation = async () => {
    let location = await Location.getCurrentPositionAsync({});
    setLocation(location.coords);
    setLocationInput(`Lat: ${location.coords.latitude}, Long: ${location.coords.longitude}`);
  };

  const clearPost = async () => {
    setPhoto(null);
    setDescription('');
    setLocationInput('');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
      <TouchableOpacity style={styles.BackBtn}
          onPress={() => navigation.goBack()}  
        >
          <Image source={require('../Img/arrow-left.png')} />   
        </TouchableOpacity>
        <Text style={styles.headerPageName}>
          Створити публікацію
        </Text>
        
      </View>


    <View style={styles.contentContainer}>

      <TouchableOpacity style={styles.postPicture} onPress={handleChoosePhoto} onLongPress={handleTakePhoto}>
        {photo ? (
          <Image 
            source={{ uri: photo }} 
            style={styles.photo} 
          />
        ) : (
          <Text style={styles.photoPlaceholder}>Клікни щоб обрати фото{'\n'}Утримуй щоб зробити фото</Text>
        )}

        
        <Image style={styles.takePhotoIcon} source={require('../Img/Ellipse.png')} />

      </TouchableOpacity>

      <Text style={styles.postPicturePlaceholder}>
        { photo ? 'Редагувати фото' : 'Завантажити фото '} 
      </Text>

      <View style={styles.discriptionContainer} >
        <TextInput
          style={styles.discription }
          type="text"
          name="discription"
          inputMode="text"
          required
          placeholder="Назва..."
          placeholderTextColor="#BDBDBD"
          cursorColor="#BDBDBD"
          value={description}
          onChangeText={setDescription}
          >
        </TextInput>

        <TextInput
          style={styles.locationDiscription}
          type="text"
          name="location"
          inputMode="text"
          required
          placeholder="Місце..."
          placeholderTextColor="#BDBDBD"
          cursorColor="#BDBDBD"

          onChangeText={setLocationInput}
          value={locationInput}
          >
            
        </TextInput>

          <TouchableOpacity title="Get Location" onPress={getLocation}  >
            <Image style={styles.locationIcon} source={require('../Img/locationIcon.png')} />
          </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.publishBtn, photo, description, locationInput && styles.publishBtnReady]}
          onPress={getLocation} >
          <Text 
            style={[styles.publishBtnText, photo, description, locationInput && styles.publishBtnTextReady]}>
            Опубліковати
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.trashBtn} 
          onPress={clearPost}  >
          <Image style={styles.trashIcon} source={require('../Img/trash.png')} />
        </TouchableOpacity>

      </View>
      
    </View>

    <StatusBar style="auto" />
    </View>
    
  );
};

const styles = StyleSheet.create({
    
  container:{
    flex: 1,
    backgroundColor: '#FFFFFF',
    
  },

  header: {
    height: 88,
    borderBottomWidth: 1,
    borderColor: '#BDBDBD',
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center'

  },

  headerPageName: {
    fontFamily: 'Roboto-Medium',
    fontSize: 17,
    fontWeight: '500',
    lineHeight: 22,
    letterSpacing: 0.41,

    paddingBottom: 11,
  },

  BackBtn: {
    position: 'absolute',
    paddingBottom: 10,
    left: 10,

  },

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
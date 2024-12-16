import React, { useState, useEffect } from "react";
import { View, 
        Image, 
        Text, 
        TouchableOpacity, 
        StyleSheet, 
        TextInput, 
        StatusBar } from 'react-native';
import { Camera, CameraView  } from "expo-camera";
import * as MediaLibrary from "expo-media-library";

const CreatePost = ({navigation}) => {
  const [hasPermission, setHasPermission] = useState(null);
  const [cameraRef, setCameraRef] = useState(null);
  const [photo, setPhoto] = useState(null);
  const [type, setType] = useState(Camera?.Constants?.Type?.back || "back");
  const [description, setDescription] = useState(''); 
  const [location, setLocation] = useState(null);
  const [locationInput, setLocationInput] = useState('');

  useEffect(() => {
    (async () => {
      // console.log("Camera:", Camera);
      // console.log("CameraModule:", CameraModule);
      // console.log("CameraView:", CameraModule.CameraView);

        // const Camera = CameraModule.Camera;
        //   console.log("Camera component:", Camera);
        //   console.log("Camera Constants:", Camera?.Constants);

      if (!Camera.Constants) {
        console.warn("Camera.Constants is undefined.");
      }
      const { status: cameraStatus } = await Camera.requestCameraPermissionsAsync();
      const mediaLibraryStatus = await MediaLibrary.requestPermissionsAsync();

      if (cameraStatus.status !== "granted") {
        console.warn("Camera access not granted.");
      }
      if (mediaLibraryStatus.status !== "granted") {
        console.warn("Media library access not granted.");
      }

      setHasPermission(cameraStatus === "granted" && mediaLibraryStatus.status === "granted");
    })();
  }, []);

  if (hasPermission === null) {
    return <View />;
  }
  if (!hasPermission) {
    return <Text>No access to camera</Text>;
  }

  const handleTakePhoto = async () => { 
    if (cameraRef) { 
      const photo = await cameraRef.takePictureAsync(); 
      setPhoto(photo.uri); 
      await MediaLibrary.createAssetAsync(photo.uri); 
    } 
  };

  // const handleChoosePhoto = async () => { 
  //   'Реалізуйте вибір фото з галереї, якщо потрібно' 
  // };

  const getLocation = async () => {
    let location = await Location.getCurrentPositionAsync({});
    setLocation(location.coords);
    setLocationInput(`Lat: ${location.coords.latitude}, Long: ${location.coords.longitude}`);
  };

  const clearPost = () => { 
    setPhoto(null); 
    setDescription(''); 
    setLocationInput(''); };

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
  
        <View 
          style={styles.postPicture} 
        >
          {photo ? (
            <Image source={{ uri: photo }} style={styles.photo} />
          ) : (
            <CameraView 
              style={styles.camera} 
              type={type} 
              ref={ref => setCameraRef(ref)} 
            >
            </CameraView>
          )}
  
          <TouchableOpacity 
            style={styles.takePhotoIcon} 
            onPress={handleTakePhoto}> 
              <Image source={require('../Img/Ellipse.png')} /> 
          </TouchableOpacity>
  
        </View>
  
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

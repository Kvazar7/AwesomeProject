import React, { useState, useEffect, useContext } from "react";
import {  ImageBackground, 
          StyleSheet, 
          Text, 
          TextInput, 
          View, 
          Image, 
          TouchableOpacity, 
          TouchableWithoutFeedback,
          Platform, 
          StatusBar,
          Keyboard,
          KeyboardAvoidingView } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { auth, storage } from '../Сonfig/firebaseConfig';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { UserContext } from "./UserContext";

// import { useNavigation } from "@react-navigation/native";

const Registration = ({navigation}) => {
  // const navigation = useNavigation;

  const { 
    photo, setPhoto, 
    login, setLogin, 
    email, setEmail, 
    password, setPassword 
  } = useContext(UserContext);

  const [activeField, setActiveField] = useState(null);
  const [isShowKeyboard, setIsShowKeyboard] = useState(true);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

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
      // savePhoto(uri);
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
      // savePhoto(uri);
    }
  };

  const uploadPhotoToFirebase = async (photoUri, userId) => {
    try {

      console.log('Uploading photo. URI:', photoUri);

      const response = await fetch(photoUri);

      console.log('Fetch response:', response);


      if (!response.ok) {
          throw new Error(`Failed to fetch the photo URI. Status: ${response.status}`);
      }

      const blob = await response.blob();

      console.log('Blob created successfully:', blob);


      const photoRef = ref(storage, `users/${userId}/avatar.jpg`);

      await uploadBytes(photoRef, blob);
      const downloadURL = await getDownloadURL(photoRef);
      
      console.log('Photo uploaded successfully. URL:', downloadURL);

      return downloadURL;
    } catch (error) {
      console.error("Error uploading photo to Firebase Storage:", error);
      throw error;
    }
  };

  const handleRegistration = async () => {
    if (!login || !email || !password) {
      alert("Please fill in all fields");
      return;
    }
    try {
      console.log('Starting registration...');

      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      console.log('User created:', user);

      if (photo) {
        try {
          console.log('Uploading photo...');

          const avatarUrl = await uploadPhotoToFirebase(photo, user.uid);

          console.log('Photo uploaded. URL:', avatarUrl);

          await updateProfile(user, { 
            displayName: login,
            photoURL: avatarUrl });
          
          console.log('Profile updated.');
        } catch (photoError) {
          console.error("Failed to upload photo:", photoError.message);
          alert("Photo upload failed. User registered without photo.");
        }
      }
      console.log('User registered:', user);
      navigation.navigate("Home", { username: login });
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
  
  const delPhoto = async () => {
    setPhoto(null)
  };

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  useEffect(() => {
    const showSubscription = Keyboard.addListener('keyboardDidShow', () => {
      setIsShowKeyboard(false);
    });
    const hideSubscription = Keyboard.addListener('keyboardDidHide', () => {
      setIsShowKeyboard(true);
    });

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  const getShowKeyboardStyle = () => {
    return isShowKeyboard ? styles.formWrapper : styles.formWrapperIsActive;
  };

  return (
  <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
      >
    <ImageBackground
          source={require('../Img/PhotoBG.png')}
          style={styles.backgroundimage}
          >
      <View style={ getShowKeyboardStyle() } >
        <TouchableOpacity 
          style={styles.userPhoto} 
          onPress={handleChoosePhoto} 
          onLongPress={handleTakePhoto}
        >
            {photo ? (
              <Image source={{ uri: photo }} style={styles.photo} />
              ) : (
              <Text style={styles.photoPlaceholder}>Tap to choose photo,{'\n'}long press to take a photo</Text>
            )}
            {photo ? (
              <TouchableOpacity 
                style={styles.userPhotoDel}
                onPress={delPhoto}
              >
                <Image source={require('../Img/del.png')} />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity 
                style={styles.userPhotoAdd}
                onPress={handleChoosePhoto} 
                onLongPress={handleTakePhoto}
              >
                <Image source={require('../Img/add.png')} />
              </TouchableOpacity>
            )}
        </TouchableOpacity>

          <Text style={styles.header}>Реєстрація</Text>
          
          <TextInput
            style={[styles.input, activeField === 'login' && styles.activeInput]}
            type="text"
            name="login"
            inputMode="text"
            title="Name may contain only letters, apostrophe, dash and spaces."
            required
            pattern="^[a-zA-Z0-9а-яА-Я]+(([' -][a-zA-Z0-9а-яА-Я ])?[a-zA-Z0-9а-яА-Я]*)*$"
            placeholder="Логин"
            placeholderTextColor="#BDBDBD"
            cursorColor="#FF6C00"

            value={login}
            onChangeText={setLogin}
            onFocus={() => setActiveField('login')}
            onBlur={() => setActiveField(null)}
          />

          <TextInput
            style={[styles.input, activeField === 'email' && styles.activeInput]}
            type="text"
            name="email"
            inputMode="email"
            required
            placeholder="Адреса електронної пошти"
            placeholderTextColor="#BDBDBD"
            cursorColor="#FF6C00"

            value={email}
            onChangeText={setEmail}
            onFocus={() => setActiveField('email')}
            onBlur={() => setActiveField(null)}
          />
          
          <View>
          <TextInput
            style={[styles.input, activeField === 'password' && styles.activeInput]}
            type="text"
            name="password"
            inputMode="text"
            required
            maxLength={25}
            placeholder="Пароль"
            placeholderTextColor="#BDBDBD"
            cursorColor="#FF6C00"

            secureTextEntry={!isPasswordVisible}
            value={password}
            onChangeText={setPassword}
            onFocus={() => setActiveField('password')}
            onBlur={() => setActiveField(null)}
          />
            <TouchableOpacity 
              onPress={togglePasswordVisibility} 
              style={styles.toggleButton}
            >
              <Text style={styles.toggleText}>
                {isPasswordVisible ? 'Приховати' : 'Показати'}
              </Text>
            </TouchableOpacity>
          </View>

          {isShowKeyboard && (
            <>
            <TouchableOpacity 
              style={styles.registerbutton}
              onPress={handleRegistration}  
            >
              <Text style={styles.registerbuttontext}>
                Зареєстуватися
              </Text>
            </TouchableOpacity>

              <Text 
                style={styles.changepagetext}
                onPress={() => navigation.navigate('Login')}
              >
                Вже є акаунт? Увійти
              </Text>
            </>
          )}
                  
      </View>
    </ImageBackground>
      <StatusBar style="auto" />
    </KeyboardAvoidingView>
  </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({

  container: {
    flex: 1,
  },
 
  formWrapper: {
    flex: 1,
    backgroundColor: '#FFFF',
    marginTop: 263,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    paddingHorizontal: 16,
    paddingBottom: 45,
  },

  formWrapperIsActive: {
    flex: 1,
    backgroundColor: '#FFFF',
    marginTop: 147,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    paddingHorizontal: 16,
    justifyContent: "flex-end",
    paddingBottom: 32
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

  header: {
    marginTop: 92,
    marginBottom: 32,
    textAlign: 'center',
    
    fontFamily: 'Roboto-Medium',
    fontSize: 30,
    fontWeight: '500',
    lineHeight: 35,
    letterSpacing: 0.01,
  },

  input: {
    width: 'auto',
    height: 50,
    paddingHorizontal: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#E8E8E8",
    borderRadius: 8,
    backgroundColor: "#F6F6F6",
    fontFamily: 'Roboto',
    fontSize: 16,
    fontWeight: '400',
    lineHeight: 18.75,
  },

  activeInput: {
    borderColor: '#FF6C00',
  },

  toggleButton: {
    position: 'absolute',
    top: 15,
    right: 16,
    pointerEvents: 'auto',
  },

  toggleText: {
    color: '#1B4371',
  },

  registerbutton: {
    marginTop: 43,
    width: '100%',
    height: 51,
    backgroundColor: '#FF6C00',
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },

  registerbuttontext: {
    fontFamily: 'Roboto',
    fontSize: 16,
    fontWeight: '400',
    lineHeight: 19,
    letterSpacing: 0.01,
    color: '#FFFFFF',
  },

  changepagetext: {
    marginTop: 16,
    fontSize: 16,
    fontWeight: '400',
    lineHeight: 19,
    letterSpacing: 0.01,
    color: '#1B4371',
    textAlign: 'center',
  }
});

export default Registration;
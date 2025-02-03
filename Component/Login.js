import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import {  ImageBackground, 
          StyleSheet, 
          Text, 
          TextInput, 
          View, 
          KeyboardAvoidingView,
          TouchableWithoutFeedback,
          Keyboard,
          Platform,
          TouchableOpacity } from 'react-native';
import { handleLogin } from '../Services/AuthService';
// import { useNavigation } from "@react-navigation/native";

const Login = ({ navigation }) => {
  // const navigation = useNavigation;
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const [activeField, setActiveField] = useState(null);
  const [isShowKeyboard, setIsShowKeyboard] = useState(true);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const login = async () => {
    try {
        const user = await handleLogin(email, password );
        console.log('User registered:', user);
        navigation.navigate("Home", { username: login });
    } catch (error) {
        alert("Failed to register. Please try again.");
    }
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
  
  // const handleLogin = async () => {
  //   try {
  //     const userCredential = await signInWithEmailAndPassword(auth, email, password);
  //     console.log('User signed in:', userCredential.user);
  //     navigation.navigate('Home', { username: userCredential.user.email });
  //   } catch (error) {
  //     console.error('Error during login:', error.message);
  //     alert('Invalid login or password');
  //   }
  // };

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

          <View style={ getShowKeyboardStyle() }>
            <Text style={styles.header}>Увійти</Text>
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
                onPress={login}
              >
                <Text
                  style={styles.registerbuttontext}
                  >Увійти
                </Text>
              </TouchableOpacity>

              <Text
                style={styles.changepagetext}
                onPress={() => navigation.navigate('Registration')}
              >
                Немає акаунту? Зареєструватися
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

  backgroundimage: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: 'center',
    
  },  

  formWrapper: {
    flex: 1,
    backgroundColor: '#FFFF',
    marginTop: 323,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    paddingHorizontal: 16,
    paddingBottom: 45,
    
  },

  formWrapperIsActive: {
    flex: 1,
    backgroundColor: '#FFFF',
    marginTop: 273,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    paddingHorizontal: 16,
    justifyContent: "flex-end",
    paddingBottom: 32
  },

  header: {
    marginTop: 32,
    marginBottom: 16,
    paddingVertical: 8,
    
    fontFamily: 'Roboto-Medium',
    fontSize: 30,
    fontWeight: '500',
    lineHeight: 35,
    letterSpacing: 0.01,
    
    textAlign: 'center',
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
    borderColor: '#FF6C00'

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
    marginLeft: 'auto',
    marginTop: 43,
    marginRight: 'auto',
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

export default Login;

import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import { useFonts } from 'expo-font';
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from '@react-navigation/stack';

import LoginScreen from "./Screens/LoginScreen";
import RegistrationScreen from "./Screens/RegistrationScreen";
import HomeScreen from "./Screens/Home";
import ComentsScreen from './Screens/ComentsScreen';
import MapScreen from './Screens/MapScreen';

import { UserProvider } from './Component/UserContext';

const MainStack = createStackNavigator();

export default function App() {

  const [fontsLoaded] = useFonts({
    'Roboto-Regular': require('./src/assets/fonts/Roboto/Roboto-Regular.ttf'),
    'Roboto-Medium': require('./src/assets/fonts/Roboto/Roboto-Medium.ttf'),
    'Roboto-Bold': require('./src/assets/fonts/Roboto/Roboto-Bold.ttf'),
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <UserProvider>
    <View style={styles.container}>
      <NavigationContainer>
        <MainStack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
          <MainStack.Screen name="Login" component={LoginScreen} />
          <MainStack.Screen name="Registration" component={RegistrationScreen} />
          
          <MainStack.Screen name="Home" component={HomeScreen}/>
          <MainStack.Screen name="ComentsScreen" component={ComentsScreen} />
          <MainStack.Screen name="MapScreen" component={MapScreen} />
          
        </MainStack.Navigator>
      </NavigationContainer>
    </View>
    </UserProvider>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
  },

});

import React, { useContext } from "react";
import {  StyleSheet, 
          Text, 
          View, 
          SafeAreaView,
          Image, 
          TouchableOpacity, 
          StatusBar, } from 'react-native';
import Posts from '../Component/Posts';
import { UserContext } from "../Component/UserContext";
import AsyncStorage from "@react-native-async-storage/async-storage";

const PostsScreen = ({ route, navigation }) => {
  const { user } = useContext(UserContext);
  const { displayName, email, photoURL } = user || {};

  const handleLogOut = async (navigation) => {
    try {
      await AsyncStorage.removeItem('session'); 
      navigation.navigate('Login');
    } catch (e) {
      console.error('Failed to log out.', e);
    }
  };

  // Перехід на екран коментарів
  // const handleNavigateToComments = (post) => {
  //   navigation.navigate('ComentsScreen', { post });
  // };

    return (
       <SafeAreaView style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.headerPageName}>
              Публікації
            </Text>
            <TouchableOpacity 
              style={styles.logOutBtn}
              onPress={() => handleLogOut(navigation)}  
            >
              <Image source={require('../Img/log-out.png')} />   
            </TouchableOpacity>
          </View>

          <View style={styles.contentContainer}>
            <View style={styles.userProfileContainer}>
              {photoURL ? (
                <Image source={{ uri: photoURL }} style={styles.photo} />
                ) : (
                  <Image style={styles.userPhoto} />
                )}
                  <View>
                    <Text style={styles.userName}>
                      {displayName}
                    </Text>
                    <Text style={styles.userEmail}>
                      {email}
                    </Text>
                  </View>
            </View>

              <Posts route={route} navigation={navigation} />

          </View>

        <StatusBar style="auto" />
       </SafeAreaView>
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
        lineHeight: 22,
        letterSpacing: 0.41,
        paddingBottom: 11,
      },
    
      logOutBtn: {
        position: 'absolute',
        paddingBottom: 10,
        right: 10,
    
      },

      contentContainer: {
        paddingTop: 32,
        paddingLeft: 16,
        paddingRight: 16,
    
      },
    
      userProfileContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 32,
    
      },
    
      userPhoto: {
        height: 60,
        width: 60,
        borderRadius: 16,
        borderWidth: 0.1,
        borderColor: 'black',
    
        backgroundColor: 'gray',
      },
    
      photo: {
        height: 60,
        width: 60,
        borderRadius: 16,
        borderWidth: 0.1,
        borderColor: 'black',
    
      },
    
      userName: {
        fontFamily: 'Roboto',
        fontSize: 13,
        fontWeight: '700',
        color: '#212121',
        
      },
    
      userEmail: {
        fontFamily: 'Roboto',
        fontSize: 11,
        fontWeight: '400',
        color: '#212121',
        opacity: 0.8,
    
      },
    });

export default PostsScreen;
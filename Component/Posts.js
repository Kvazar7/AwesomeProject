import React, { useContext } from "react";
import {  StyleSheet, 
          Text, 
          View, 
          SafeAreaView,
          Image, 
          TouchableOpacity, 
          StatusBar, } from 'react-native';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { UserContext } from "./UserContext";

const Posts = ({navigation}) => {

  const { photo, login, email } = useContext(UserContext);

  const handleLogOut = async (navigation) => {
    try {
      await AsyncStorage.removeItem('session'); 
      navigation.navigate('Login');
    } catch (e) {
      console.error('Failed to log out.', e);
    }
  };
   
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerPageName}>
          Публікації
        </Text>
        <TouchableOpacity style={styles.logOutBtn}
          onPress={() => handleLogOut(navigation)}  
        >
          <Image source={require('../Img/log-out.png')} />   
        </TouchableOpacity>
      </View>

      <View style={styles.contentContainer}>

        <View style={styles.userProfileContainer}>

        {photo ? (
              <Image source={{ uri: photo }} style={styles.photo} />
              ) : (
              <Image style={styles.userPhoto} />
            )}

          <View>
            <Text style={styles.userName}>
                {login}
            </Text>
            <Text style={styles.userEmail}>
                {email}
            </Text>
          </View>

        </View>

        <View style={styles.postContainer}>

            <Image style={styles.postPicture} >

            </Image>

            <Text style={styles.myComent}>
              Щось - десь

            </Text>

            <View style={styles.discription}>
              <View style={styles.leftPartDiscription}>

                <Image style={styles.comentsIcon} source={require('../Img/noOneCommentIcon.png')} />

           
                <Text style={styles.comentCounter}>
                  100

                </Text>
              </View>

              <TouchableOpacity style={styles.rightPartDiscription}
              onPress={() => navigation.navigate('MapScreen')}
              >

                <Image style={styles.locationIcon} source={require('../Img/locationIcon.png')} />

                <Text style={styles.locationDiscription}>
                 Де воно було

                </Text>
              </TouchableOpacity>

            </View>

        </View>

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

  postContainer: {
    marginTop: 32,

  },

  postPicture: {
    marginBottom: 8,
    width: '100%',
    height: undefined,
    aspectRatio: 17/12,

    borderWidth: 1,
    borderColor: '#E8E8E8',
    borderRadius: 8,

  },

  myComent: {
    fontFamily: 'Roboto',
    fontSize: 16,
    fontWeight: '500',
    color: '#212121',

  },

  discription: {
    marginTop: 8,
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    
  },

  leftPartDiscription: {
    flexDirection: 'row',

  },

  rightPartDiscription: {
    flexDirection: 'row',

  },

  comentsIcon: {
    flexDirection: 'row',
    marginRight: 4,

  },

  locationIcon: {
    alignItems: 'center',
    marginLeft: 10,
    marginRight: 6,
    
  },

  locationDiscription: {
    textDecorationLine: 'underline',
    
  },

});

export default Posts;
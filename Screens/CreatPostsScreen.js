import React from 'react';
import {  StyleSheet, 
  Text, 
  View, 
  SafeAreaView,
  Image, 
  TouchableOpacity, 
  StatusBar, } from 'react-native';
import CreatePost from '../Component/CreatPost';

const CreatePostScreen = ({ navigation }) => {
  return (
  <SafeAreaView style={styles.container}>

    <View style={styles.header}>
      <TouchableOpacity 
        style={styles.BackBtn}
        onPress={() => navigation.goBack()}  
        >
          <Image source={require('../Img/arrow-left.png')} />   
      </TouchableOpacity>
            <Text style={styles.headerPageName}>
              Створити публікацію
            </Text>
    </View>
  
    <CreatePost navigation={navigation} />

    <StatusBar style="auto" />

  </SafeAreaView>
  )
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
    justifyContent: 'center',
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

});

export default CreatePostScreen;
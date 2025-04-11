import React, { useState } from 'react';
import {  StyleSheet, 
    Text, 
    View, 
    SafeAreaView,
    Image, 
    TouchableOpacity, 
    StatusBar, } from 'react-native';
import Coments from '../Component/Coments';
import LoadScreen from '../Component/LoadScreen';

const ComentsScreen = ({ route, navigation }) => {
    const { post } = route.params;
    const [loading, setLoading] = useState(false);

    return (
        <SafeAreaView style={styles.container}>
          {loading && <LoadScreen />}
          <View style={styles.header}>
            <TouchableOpacity 
                style={styles.BackBtn}
                onPress={() => navigation.goBack()}>
                <Image source={require('../Img/arrow-left.png')} />   
            </TouchableOpacity>
                <Text style={styles.headerPageName}>
                    Коментарі
                </Text>
          </View>
          <Image source={{ uri: post.photo }} style={styles.postPicture} />
          <Coments postId={post.id} setLoading={setLoading} />
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

    postPicture: {
      width: '90%',
      height: undefined,
      aspectRatio: 17/12,
      alignSelf: 'center',
      marginTop: 32,
      marginBottom: 32,
      borderRadius: 8,
    },

});

export default ComentsScreen;
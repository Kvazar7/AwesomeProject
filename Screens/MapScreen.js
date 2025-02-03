import React, { useState, useEffect } from "react";
import { SafeAreaView, View, TouchableOpacity, Image, Text, StyleSheet, Dimensions } from "react-native";
import MapView, { Marker } from "react-native-maps";
import Constants from 'expo-constants';

const MapScreen = ({ route, navigation }) => {
  const { latitude, longitude, description } = route.params;
  const apiKey = Constants.expoConfig.extra.googleMapsApiKey;
  
  const [region, setRegion] = useState({ 
    latitude, 
    longitude, 
    latitudeDelta: 0.01, 
    longitudeDelta: 0.01, 
  }); 

  useEffect(() => { 
    setRegion({
      latitude,
      longitude,
      latitudeDelta: 0.01, 
      longitudeDelta: 0.01, 
    });
  }, [latitude, longitude, description]);

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
                    Мапа
                  </Text>
          </View>

      <MapView
        key={`${latitude}-${longitude}`} 
        style={styles.mapStyle}
        apiKey={apiKey}
        initialRegion={region}
        region={region}
        mapType="standard"
        onMapReady={() => console.log("Map is ready")}
      >
        <Marker
          title="Місце зйомки"
          coordinate={{ latitude, longitude }}
          description={ description }
          pinColor="red"
        />
      </MapView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
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

  mapStyle: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
  },
});

export default MapScreen;

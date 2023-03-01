import React, {useEffect, useRef, useState} from 'react';
import MapView, {Marker, PROVIDER_GOOGLE} from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import Geolocation from '@react-native-community/geolocation';
import {Alert, SafeAreaView, Text, View} from 'react-native';

const coords = [
  {
    latitude: -22.6325328,
    longitude: -46.6702308,
  },
  {
    latitude: -23.5640843,
    longitude: -46.6545752,
  },
];

export default function App() {
  const mapRef = useRef<MapView>(null);
  const [userCoords, setUserCoords] = useState(coords[0]);

  function fitPadding() {
    mapRef.current?.fitToCoordinates([coords[0], coords[1]], {
      edgePadding: {top: 100, right: 100, bottom: 100, left: 100},
      animated: true,
    });
  }

  function getCurrentPosition() {
    Geolocation.getCurrentPosition(
      position => {
        setUserCoords({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
        fitPadding();
      },
      (error: {
        code: number;
        message: string;
        PERMISSION_DENIED: number;
        POSITION_UNAVAILABLE: number;
        TIMEOUT: number;
      }) => {
        Alert.alert('Atenção', error.message);
      },
    );
  }

  function requestPermission() {
    Geolocation.requestAuthorization(
      () => {
        getCurrentPosition();
      },
      (error: {message: string}) => {
        Alert.alert('Atenção', error.message);
      },
    );
  }

  useEffect(() => {
    Geolocation.setRNConfiguration({
      skipPermissionRequests: false,
      authorizationLevel: 'whenInUse',
      locationProvider: 'android',
    });

    requestPermission();
  }, []);

  return (
    <SafeAreaView style={{flex: 1}}>
      <View
        style={{padding: 20, alignItems: 'center', justifyContent: 'center'}}>
        <Text style={{fontSize: 24, fontWeight: 'bold'}}>Fiap ROADS</Text>
      </View>
      <MapView
        provider={PROVIDER_GOOGLE}
        ref={mapRef}
        style={{flex: 1}}
        initialRegion={{
          latitude: 37.78825,
          longitude: -122.4324,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}>
        <Marker
          coordinate={coords[0]}
          title={'Olá, usuário'}
          description={'Você está aqui'}
        />
        <Marker
          coordinate={coords[1]}
          title={'FIAP'}
          description={'FIAP está aqui'}
        />
        <MapViewDirections
          origin={coords[0]}
          destination={coords[1]}
          strokeWidth={10}
          strokeColor="red"
          apikey={'AIzaSyD6X1zKZfMpfE4OwqO7qzjWrdCR3NPqmQA'}
        />
      </MapView>
    </SafeAreaView>
  );
}

import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Alert,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { RNCamera } from 'react-native-camera';
import { useCamera } from 'react-native-camera-hooks';

export default function Camera({ navigation, route }) {
  const [dni, fijarDni] = useState(null);
  const [{ cameraRef }, { takePicture }] = useCamera(null);
  const [loading, setLoading] = useState(false);

  const tomarFoto = async () => {
    try {
      // takePicture base64 
      // const data = await takePicture();
      // const filePath = data.uri;
      const foto = await takePicture({ base64: true });
      // console.log(foto.base64);
      // setLoading(true);
      const response = await fetch('http://192.168.1.4/cre/cli/subir_imagen', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          dni: dni,
          file: foto.base64
        })
      });
      const rpt = await response.json();
      // console.log(rpt); 
      if (rpt == 1) {
        // setLoading(false);
        alert('Foto Subida');
      }
      
      Alert.alert('Foto tomada', 'Foto tomada con éxito');
    } catch (error) {
      console.log(error);
    }
  }



  return (
    loading ?
      <View style={[styles.container, styles.horizontal]}>
        <ActivityIndicator />
      </View>
      :
      <View style={styles.body}>
        <RNCamera
          ref={cameraRef}
          type={RNCamera.Constants.Type.back}
          style={styles.preview}
        >
          <View style={styles.inputContendor}>
            <TextInput
              style={styles.input}
              placeholder="Ingresar DNI"
              keyboardType="numeric"
              onChangeText={fijarDni}
            />
            <TouchableOpacity style={styles.button}>
              <Text style={styles.text} onPress={() => tomarFoto()}> ENVIAR </Text>
            </TouchableOpacity>

          </View>
        </RNCamera>
      </View>
  );
}

const styles = StyleSheet.create({
  body: {
    flex: 1,
  },
  preview: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  text: {
    width: 100,
    fontSize: 18,
    color: 'white',
    textAlign: 'center',
    marginBottom: 20,
  },

  input: {
    height: 40,
    width: 200,
    margin: 12,
    borderWidth: 1,
    padding: 10,
    borderColor: 'white',
    alignSelf: 'flex-end',
    backgroundColor: 'white',
  },
});
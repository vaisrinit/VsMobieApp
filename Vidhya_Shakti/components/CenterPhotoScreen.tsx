import Geolocation from '@react-native-community/geolocation';
import React, { useEffect, useState } from 'react';

import {
  Text,
  View,
  Pressable,
  StyleSheet,
  PermissionsAndroid,
} from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import { OrientationLocker, PORTRAIT } from 'react-native-orientation-locker';
import { HttpService } from '../_services/httpservices';
import { Utils } from '../utils/utils';
import {  ActivityIndicator, MD2Colors } from 'react-native-paper';

const CenterPhotoScreen = ({ navigation }: any) => {

  const [isLoading, setIsLoading] = useState(false);
  const http = new HttpService();
  const utils = new Utils();

  const [latitude, setLatitude] = useState(0);
  const [longitude, setLongitude] = useState(0);

  useEffect(() => {
    Geolocation.getCurrentPosition(info => {
      setLatitude(info.coords.latitude);
      setLongitude(info.coords.longitude);
    });
  })

  const takePhoto = async () => {
    let img_base64;
    let decrypted_result: any;
    let image: any = await ImagePicker.openCamera({
      width: 2000,
      height: 2000,
      includeBase64: true,
      cropping: false
    })
    img_base64 = image['data']
    setIsLoading(true)

    let param = {
      latitude: latitude,
      longitude: longitude,
      programme: HttpService.usr.programme_name,
      attendance_date: new Date(),
      userId:HttpService.usr.user_id,
      image:img_base64
    }
    await http.authHttpPostRequest('/attendance/uploadPhoto', param)
      .then(response => response.json())
      .then(text => {
        decrypted_result = utils.decrypt(text.encryptResult)
      })
      .catch(err => console.log(err))
    let result = JSON.parse(decrypted_result);
    if (result.success) {
      navigation.navigate('Home')
    }

    // let param = {
    //   latitude: latitude,
    //   longitude: longitude,
    //   programme: HttpService.usr.programme_name,
    //   attendance_date: new Date(),
    //   userId:HttpService.usr.user_id,
    //   image:image.path
    // }

    // await http.authImageUpload('/attendance/uploadPhoto', param)
    //   .then(response => response.json())
    //   .then(text => {
    //     decrypted_result = utils.decrypt(text.encryptResult)
    //   })
    //   .catch(err => console.log(err))
    // let result = JSON.parse(decrypted_result);
    // console.log(result)
    // if (result.success) {
    //   navigation.navigate('Home')
    // }

    setIsLoading(false)
  }

  const requestCameraPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: "App Camera Permission",
          message: "App needs access to your camera ",
          buttonNeutral: "Ask Me Later",
          buttonNegative: "Cancel",
          buttonPositive: "OK"
        }
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log("Camera permission given");
      } else {
        console.log("Camera permission denied");
      }
    } catch (err) {
      console.warn(err);
    }
  };

  useEffect(() => {
    requestCameraPermission()
  })

  // const openImagePicker = () => {
  //   const options = {
  //     mediaType: 'photo',
  //     includeBase64: false,
  //     maxHeight: 2000,
  //     maxWidth: 2000,
  //   };

  //   launchImageLibrary({
  //     mediaType: 'photo',
  //     includeBase64: false,
  //     maxHeight: 2000,
  //     maxWidth: 2000,
  //   }, (response) => {
  //       console.log(response.assets)
  //   });
  // };



  return (
    <View style={styles.view}>
      <OrientationLocker
        orientation={PORTRAIT}
      />
      <ActivityIndicator animating={isLoading} color={MD2Colors.red800} size='large' />

      <Pressable style={{ margin: 10, padding: 10, backgroundColor: 'green', borderRadius: 20, alignItems: 'center' }} onPress={takePhoto}>
        <Text style={styles.text}>Take Photo</Text>
      </Pressable>
    </View>


  )
}

const styles = StyleSheet.create({
  buttons: {
    margin: 10,
    backgroundColor: "green",
    padding: 10,
    textAlign: "center",
    borderRadius: 20
  },

  view: {
    flex: 1,
    justifyContent: "center"
  },

  text: {
    textAlign: "center",
    color: "white",
    fontSize: 30
  }
});


export default CenterPhotoScreen;

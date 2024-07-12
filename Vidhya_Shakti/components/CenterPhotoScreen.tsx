import Geolocation from '@react-native-community/geolocation';
import React, { useEffect, useState } from 'react';

import {
  Text,
  View,
  Pressable,
  StyleSheet,
  PermissionsAndroid,
  Linking,
  ScrollView,
  Dimensions,
} from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import { OrientationLocker, PORTRAIT } from 'react-native-orientation-locker';
import { HttpService } from '../_services/httpservices';
import { Utils } from '../utils/utils';
import { ActivityIndicator, Card, MD2Colors, Snackbar } from 'react-native-paper';

const CenterPhotoScreen = ({ navigation }: any) => {

  const [isLoading, setIsLoading] = useState(false);
  const http = new HttpService();
  const utils = new Utils();

  const [latitude, setLatitude] = useState(0);
  const [longitude, setLongitude] = useState(0);

  const [message, setMessage] = useState('')
  const [visible, setVisible] = React.useState(false);

  useEffect(() => {
    Geolocation.getCurrentPosition(info => {
      setLatitude(info.coords.latitude);
      setLongitude(info.coords.longitude);
    });
    requestCameraPermission();

  })

  const takePhoto = async () => {
    let decrypted_result: any;
    let image: any;
    try {
      image = await ImagePicker.openCamera({
        cropping: true,
        compressImageQuality: 0.5,
      })
    }
    catch (err) {

    }

    setIsLoading(true)
    if (image) {
      let param = {
        latitude: latitude,
        longitude: longitude,
        programme: HttpService.usr.programme_name,
        attendance_date: new Date(),
        userId: HttpService.usr.user_id,
        ric_id: HttpService.usr.ric_id,
        image: image.path
      }

      await http.authImageUpload('/attendance/uploadPhoto', param)
        .then(response => response.json())
        .then(text => {
          decrypted_result = text

        })
        .catch(err => console.log(err))
      let result = decrypted_result;

      if (result && result.success) {
        navigation.navigate('Home', {
          snackbar: true,
          snackbarMessage: 'Image Upload successful!',
        })
        ImagePicker.clean().then(() => {
        }).catch(e => {

        });
      }
      else {
        let message = result.message
        if (message.includes("unique")) {
          setMessage("Image Already Uploaded for Today!");
          onToggleSnackBar();
        }

      }
    }


    setIsLoading(false)
  }

  const onToggleSnackBar = () => setVisible(!visible);
  const onDismissSnackBar = () => setVisible(false);


  async function requestCameraPermission() {
    const granted = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.CAMERA)
    if (!granted) {
      let permission = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.CAMERA)
      if (permission === "never_ask_again")
        Linking.openSettings()
    }
  }
  const dimensions = Dimensions.get("window");

  return (

    // <View style={styles.view}>
    // <OrientationLocker
    //   orientation={PORTRAIT}
    // />
    // <ActivityIndicator animating={isLoading} color={MD2Colors.red800} size='large' />

    // <Pressable style={{ margin: 10, padding: 10, backgroundColor: 'green', borderRadius: 20, alignItems: 'center' }} onPress={takePhoto}>
    //   <Text style={styles.text}>Take Photo</Text>
    // </Pressable>
    // <Snackbar
    //   visible={visible}
    //   onDismiss={onDismissSnackBar}
    //   action={{
    //     label: 'Close',
    //     onPress: () => {
    //       // Do something
    //     },
    //   }}>
    //   {message}
    // </Snackbar>
    // </View>

    <Card style={{
      flex: 1, flexDirection: 'column', justifyContent: 'flex-start', padding: 15
    }}>

      <ScrollView>
        <OrientationLocker
          orientation={PORTRAIT}
        />
        <ActivityIndicator animating={isLoading} color={MD2Colors.red800} size='large' />
        <View style={{
          flex: 1,
          justifyContent: "center",
          height: dimensions.height - 250
        }}>
        <Pressable style={styles.buttons} onPress={takePhoto}>
          <Text style={styles.text}>Take Photo</Text>
        </Pressable>
      </View>

      <Snackbar
        visible={visible}
        onDismiss={onDismissSnackBar}
      >
        {message}
      </Snackbar>

    </ScrollView >
</Card >


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
  text: {
    textAlign: "center",
    color: "white",
    fontSize: 30
  }
});


export default CenterPhotoScreen;


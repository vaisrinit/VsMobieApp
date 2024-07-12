import React, { useState } from 'react';
import {
  Text,
  Dimensions,
  View,
  Pressable,
  Image,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { Card, TextInput, ActivityIndicator, MD2Colors, Snackbar, IconButton } from 'react-native-paper';
import { Utils } from '../utils/utils';
import { HttpService } from '../_services/httpservices';
import { OrientationLocker, PORTRAIT } from 'react-native-orientation-locker';
import CheckBox from '@react-native-community/checkbox';


const ForgotPassword = ({ navigation }: any) => {
  const utils = new Utils();
  const http = new HttpService();
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [email, setEmail] = React.useState("");
  const [code, setCode] = React.useState("");

  const [password, setPassword] = React.useState("");
  const [cpassword, setCPassword] = React.useState("");


  const [visible, setVisible] = React.useState(false);
  const onToggleSnackBar = () => setVisible(!visible);
  const onDismissSnackBar = () => setVisible(false);
  const dimensions = Dimensions.get("window");
  const [showPassword, setShowPassword] = React.useState(false);

  const [status, setStatus] = useState('Start')


  const sendForgotPasswordEmail = async () => {
    setIsLoading(true);
    let decrypted_result: any;
    let param = {
      email: email
    };
    await http.noAuthHttpPostRequest('/users/sendForgotPasswordEmail', param).then(response => response.json())
      .then(text => {
        decrypted_result = utils.noAuthDecrypt(text)
      })
      .catch(err => console.log(err))
    let result = JSON.parse(decrypted_result);
    if (result.success) {
      if (result.rowCount > 0) {

        setMessage('Verify Code Sent to Email');
        onToggleSnackBar()
        setStatus("Code_Sent")
      }
    } else {
      setMessage(result.message);
      onToggleSnackBar()
    }
    setIsLoading(false);

  }

  const verifyCode = async () => {
    let decrypted_result: any;
    setIsLoading(true);
    let param = {
      email: email,
      type: 'ForgotPassword',
      otp: code
    };
    if (param.otp == '') {
      setMessage('Kindly Enter Code');
      onToggleSnackBar()
    }
    else {
      await http.noAuthHttpPostRequest('/users/validateOTP', param)
        .then(response => response.json())
        .then(text => {
          decrypted_result = utils.noAuthDecrypt(text)
        })
        .catch(err => console.log(err))
      let result = JSON.parse(decrypted_result);
      if (result.success) {
        setMessage(result.message);
        onToggleSnackBar()
        setStatus("Code_Verified");

      } else {
        setMessage(result.message);
        onToggleSnackBar()
      }
    }

    setIsLoading(false);

  }

  const changePassword = async () => {
    let decrypted_result: any;

    setIsLoading(true)
    let param = {
      email: email,
      password: password,
      otp: code
    };
    if (password === cpassword) {
      await http.noAuthHttpPostRequest('/users/changePassword', param)
        .then(response => response.json())
        .then(text => {
          decrypted_result = utils.noAuthDecrypt(text)
        })
        .catch(err => console.log(err))
      let result = JSON.parse(decrypted_result);
      if (result.success && result.rowCount > 0) {
        setMessage(result.message);
        onToggleSnackBar()

        navigation.navigate('Login',
          {
            snackbar: true,
            snackbarMessage: 'Password Changed Successfully!',
          }
        )

      } else {
        setMessage(result.message);
        onToggleSnackBar()
      }
    }
    else {
      setMessage("Confirm password not matched");
      onToggleSnackBar()
    }

    setIsLoading(false);
  }


  return (

    <Card style={{
      flex: 1, flexDirection: 'column', justifyContent: 'flex-start', padding: 50
    }}>
      <Image style={{ alignSelf: 'center', height: 150, width: 200 }} source={require('../assets/Logo.png')}></Image>
      <View>
        <ActivityIndicator animating={isLoading} color={MD2Colors.red800} size='large' />
      </View>

      <OrientationLocker
        orientation={PORTRAIT}
      />

      <View style={{
        height: dimensions.height -200
      }}>

        {status == 'Start' &&
          <View>
            <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#2596be', marginBottom: 10 }}>Email</Text>
            <TextInput
              mode='outlined'
              style={{ fontSize: 18, padding: 3, marginBottom: 15 }}
              textColor='blue'
              outlineStyle={{ borderRadius: 25, borderColor: '#2596be' }}
              value={email}
              placeholder='Enter Email'

              onChangeText={text => setEmail(text)}
            />
          </View>}
        {status == 'Start' && <View style={{ display: 'flex', flexDirection: 'row', width: dimensions.width - 100, justifyContent: 'space-between', marginTop: 10, gap: 10 }}>
          <Pressable onPress={() => { sendForgotPasswordEmail() }}><Text style={{ textAlign: 'center', backgroundColor: 'green', borderRadius: 20, padding: 10, fontSize: 20, width: dimensions.width - 100, color: '#ffffff', fontWeight: 'bold' }} >Send Code</Text></Pressable>
        </View>}

        {status == 'Code_Sent' &&
          <View>
            <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#2596be', marginBottom: 10 }}>Code</Text>
            <TextInput
              mode='outlined'
              style={{ fontSize: 18, padding: 3, marginBottom: 15 }}
              textColor='blue'
              outlineStyle={{ borderRadius: 25, borderColor: '#2596be' }}
              value={code}
              placeholder='Enter Code'

              onChangeText={text => setCode(text)}
            />
          </View>}
        {status == 'Code_Sent' && <View style={{ display: 'flex', flexDirection: 'row', width: dimensions.width - 100, justifyContent: 'space-between', marginTop: 10, gap: 10 }}>
          <Pressable onPress={() => { verifyCode() }}><Text style={{ textAlign: 'center', backgroundColor: 'green', borderRadius: 20, padding: 10, fontSize: 20, width: dimensions.width - 100, color: '#ffffff', fontWeight: 'bold' }} >Verify Code</Text></Pressable>
        </View>}


        {status == 'Code_Verified' &&
          <View>
            <TextInput
              style={{ fontSize: 18, padding: 3, marginBottom: 12 }}
              textColor='blue'
              mode='outlined'
              placeholder='Enter Password'
              secureTextEntry={!showPassword}
              right={<IconButton icon="eye" style={{ borderColor: '#000' }} onPress={() => { /* toggle password visibility */ }} />}
              outlineStyle={{ borderRadius: 25, borderColor: '#2596be' }}
              value={password}
              onChangeText={text => setPassword(text)}
            />
          </View>}
        {status == 'Code_Verified' &&
          <View>
            <TextInput
              style={{ fontSize: 18, padding: 3, marginBottom: 12 }}
              textColor='blue'
              mode='outlined'
              placeholder='Enter Confirm Password'
              secureTextEntry={!showPassword}
              right={<IconButton icon="eye" style={{ borderColor: '#000' }} onPress={() => { /* toggle password visibility */ }} />}
              outlineStyle={{ borderRadius: 25, borderColor: '#2596be' }}
              value={cpassword}
              onChangeText={text => setCPassword(text)}
            />
          </View>}
        {status == 'Code_Verified' &&
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <View>
              <CheckBox
                style={{ marginBottom: 12 }}
                disabled={false}
                value={showPassword}
                onValueChange={(newValue) => setShowPassword(newValue)}
              />
            </View>
            <Text style={{ color: '#6d1bffde', marginBottom: 12, fontSize: 14 }}>Show Password</Text>
          </View>

        }
        {status == 'Code_Verified' && <View style={{ display: 'flex', flexDirection: 'row', width: dimensions.width - 100, justifyContent: 'space-between', marginTop: 10, gap: 10 }}>
          <Pressable onPress={() => { changePassword() }}><Text style={{ textAlign: 'center', backgroundColor: 'green', borderRadius: 20, padding: 10, fontSize: 20, width: dimensions.width - 100, color: '#ffffff', fontWeight: 'bold' }} >Submit</Text></Pressable>
        </View>}




      </View>
      <Snackbar
        visible={visible}
        onDismiss={onDismissSnackBar}
      >
        {message}
      </Snackbar>
    </Card>

  );
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

export default ForgotPassword;

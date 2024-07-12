import React, { useEffect, useState } from 'react';
import {
  Text,
  Dimensions,
  View,
  Pressable,
  Image,
  StyleSheet,
  useColorScheme,
} from 'react-native';
import { Card, TextInput, ActivityIndicator, MD2Colors, Snackbar, IconButton } from 'react-native-paper';
import { Utils } from '../utils/utils';
import { HttpService } from '../_services/httpservices';
import { OrientationLocker, PORTRAIT } from 'react-native-orientation-locker';
import CheckBox from '@react-native-community/checkbox';


const LoginScreen = ({ navigation, route }: any) => {
  const utils = new Utils();
  const http = new HttpService();
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);

  const theme = useColorScheme();
  const isDarkTheme = theme === 'dark';

  const color='red'
  const login = async () => {
    setIsLoading(true);
    let decrypted_result: any;
    if (email != '' && password != '') {
      let param = {
        email: email,
        password: password
      }
      await http.noAuthHttpPostRequest('/users/login', param)
        .then(response => response.json())
        .then(text => {
          decrypted_result = utils.noAuthDecrypt(text)
        })
        .catch(err => console.log(err))
      let result = JSON.parse(decrypted_result);
      if (result.success) {
        http.storeData(result);
        navigation.navigate('Home', {
          snackbar: true,
          snackbarMessage: 'Login Successful!',
        })
      }
      else {
        setMessage('Enter Valid Credentials');
        onToggleSnackBar()
      }
    }
    else {
      setMessage('Please Enter Username & Password');
      onToggleSnackBar()
    }
    setIsLoading(false);
  }

  const [visible, setVisible] = React.useState(false);

  const onToggleSnackBar = () => setVisible(!visible);

  const onDismissSnackBar = () => setVisible(false);

  const dimensions = Dimensions.get("window");

  useEffect(() => {
    if (route.params?.snackbar) {
      setVisible(true);
      setMessage(route.params.snackbarMessage)
    }
    
  }, [route.params]);

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
      <View style={{height:dimensions.height-270}}>
        <View>
          <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#2596be', marginBottom: 10 }}>Username</Text>
          <TextInput
            mode='outlined'
            style={{ fontSize: 18, padding: 3, marginBottom: 15 }}
            textColor={isDarkTheme?'#95ffdd':'blue'}
            outlineStyle={{ borderRadius: 25, borderColor: '#2596be' }}
            value={email}
            placeholder='Enter Username'

            onChangeText={text => setEmail(text)}
          />
        </View>
        <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#2596be', marginBottom: 10 }}>Password</Text>

        <View>
          <TextInput
            style={{ fontSize: 18, padding: 3, marginBottom: 12 }}
            textColor={isDarkTheme?'#95ffdd':'blue'}
            mode='outlined'
            placeholder='Enter Password'
            secureTextEntry={!showPassword}
            right={<IconButton icon="eye" style={{ borderColor: '#000' }} onPress={() => { /* toggle password visibility */ }} />}
            outlineStyle={{ borderRadius: 25, borderColor: '#2596be' }}
            value={password}
            onChangeText={text => setPassword(text)}
          />

        </View>
        <View style={{ justifyContent: 'center', flexDirection: 'column'}}>
          <View style={{ justifyContent: 'flex-start', flexDirection: 'row'}}>
            <CheckBox
              
              disabled={false}
              value={showPassword}
              onValueChange={(newValue) => setShowPassword(newValue)}
            />
             <Text style={{marginTop:5,color:isDarkTheme?'white':'black'}}>Show Password</Text>
          </View>
          
          <View>
            <Text style={{ color: '#ff345d', marginBottom: 12, fontSize: 14,textAlign:'right' }} onPress={() => navigation.navigate('ForgotPassword')}>Reset/Forgot Password</Text>
          </View>
        </View>
        <View style={{ display: 'flex', flexDirection: 'row', width: dimensions.width - 100, justifyContent: 'space-between', gap: 10 }}>
          <Pressable onPress={() => { setEmail(''); setPassword('') }}><Text style={{ textAlign: 'center', backgroundColor: 'green', borderRadius: 20, padding: 10, fontSize: 20, width: dimensions.width - 250, color: '#ffffff', fontWeight: 'bold' }} >Reset</Text></Pressable>
          <Pressable onPress={() => login()}><Text style={{ textAlign: 'center', backgroundColor: 'green', borderRadius: 20, padding: 10, fontSize: 20, width: dimensions.width - 250, color: '#ffffff', fontWeight: 'bold' }} >Login</Text></Pressable>

        </View>

        <Snackbar
          visible={visible}
          onDismiss={onDismissSnackBar}>
          {message}
        </Snackbar>
      </View>

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
export default LoginScreen;

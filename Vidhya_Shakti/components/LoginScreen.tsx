import React, { useState } from 'react';
import {
  Text,
  Dimensions,
  View,
  Pressable,
} from 'react-native';
import { Card, TextInput, ActivityIndicator, MD2Colors, Snackbar } from 'react-native-paper';
import { Utils } from '../utils/utils';
import { HttpService } from '../_services/httpservices';
import { OrientationLocker, PORTRAIT } from 'react-native-orientation-locker';


const LoginScreen = ({ navigation }: any) => {
  const utils = new Utils();
  const http = new HttpService();
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  

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
        navigation.navigate('Home')
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
  return (

    <Card style={{
      flex: 1, flexDirection: 'column', justifyContent: 'center', padding: 50
    }}>
      
      <View>
        <ActivityIndicator animating={isLoading} color={MD2Colors.red800} size='large' />
      </View>
      
      <OrientationLocker
        orientation={PORTRAIT}
      />
      {/* <Image source={require('./assets/Vidya_Shakti_Logo.jpg')}></Image>   */}
      <View>
        <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#2596be', marginBottom: 10 }}>Username</Text>
        <TextInput
          mode='outlined'
          style={{ fontSize: 20, padding: 5, marginBottom: 20 }}
          textColor='blue'
          outlineStyle={{ borderRadius: 20, borderColor: '#2596be' }}
          value={email}
          placeholder='Enter Username'

          onChangeText={text => setEmail(text)}
        />
      </View>
      <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#2596be', marginBottom: 10 }}>Password</Text>

      <View>
        <TextInput
          style={{ fontSize: 20, padding: 5, marginBottom: 20 }}
          textColor='blue'
          mode='outlined'
          placeholder='Enter Password'
          
          secureTextEntry={true}
          outlineStyle={{ borderRadius: 20, borderColor: '#2596be' }}
          value={password}
          onChangeText={text => setPassword(text)}
        />
      </View>
      <View style={{ display: 'flex', flexDirection: 'row', width: dimensions.width - 100, justifyContent: 'space-between', marginTop: 10,gap:10 }}>
        <Pressable onPress={() => {setEmail('');setPassword('')}}><Text style={{ textAlign: 'center', backgroundColor: 'green', borderRadius: 20, padding: 10, fontSize: 20, width: dimensions.width - 250, color: '#ffffff', fontWeight: 'bold' }} >Reset</Text></Pressable>
        <Pressable onPress={() => login()}><Text style={{ textAlign: 'center', backgroundColor: 'green', borderRadius: 20, padding: 10, fontSize: 20, width: dimensions.width - 250, color: '#ffffff', fontWeight: 'bold' }} >Login</Text></Pressable>
      </View>
      <Snackbar
        visible={visible}
        onDismiss={onDismissSnackBar}
        action={{
          label: 'Close',
          onPress: () => {
            // Do something
          },
        }}>
        {message}
      </Snackbar>
    </Card>
    
  );
}


export default LoginScreen;

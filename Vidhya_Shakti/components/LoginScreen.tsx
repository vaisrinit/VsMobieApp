import React, { useState } from 'react';
import {
  Text,
  Dimensions,
  View,
  Pressable,
} from 'react-native';
import {  Card,  TextInput,ActivityIndicator, MD2Colors } from 'react-native-paper';
import { Utils } from '../utils/utils';
import { HttpService } from '../_services/httpservices';
import { OrientationLocker, PORTRAIT } from 'react-native-orientation-locker';


const LoginScreen = ({ navigation }: any) => {
  const utils = new Utils();
  const http = new HttpService();
  const [isLoading,setIsLoading]=useState(false)
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");

  const login = async () => {
    setIsLoading(true);
    console.log('Login')
    let param = {
      email: email,
      password: password
    }
    let decrypted_result: any;
    await http.noAuthHttpPostRequest('/users/login', param)
      .then(response => response.json())
      .then(text => {
        console.log(text)
        decrypted_result = utils.noAuthDecrypt(text)
      })
      .catch(err => console.log(err))
    let result = JSON.parse(decrypted_result);
    http.storeData(result);
    console.log(result)
    if (result.success) {
      navigation.navigate('Home')
    }
    setIsLoading(false);
  }
  
  const dimensions = Dimensions.get("window");
  return (
    
    <Card style={{
      flex: 1, flexDirection: 'column', justifyContent: 'center', padding: 50
    }}>
      <View style={{}}>
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
      <View style={{ display: 'flex', flexDirection: 'row', width: dimensions.width - 100, justifyContent: 'space-between', marginTop: 10 }}>
        <Pressable onPress={() => login()}><Text style={{ textAlign: 'center', backgroundColor: 'green', borderRadius: 20, padding: 10, fontSize: 20, width: dimensions.width - 100, color: '#ffffff', fontWeight: 'bold' }} >Login</Text></Pressable>
      </View>
      
    </Card>
  );
}


export default LoginScreen;

import React, { useEffect, useState } from 'react';
import {
  Text,
  View,
  Pressable,
  StyleSheet,
  ScrollView,
  Dimensions,
} from 'react-native';
import { LANDSCAPE, OrientationLocker, PORTRAIT } from 'react-native-orientation-locker';

import { Button, Card, Snackbar } from 'react-native-paper';

const HomeScreen = ({ navigation, route }: any) => {

  const [visible, setVisible] = React.useState(false);

  const onToggleSnackBar = () => setVisible(!visible);

  const onDismissSnackBar = () => setVisible(false);
  const [message, setMessage] = useState('')

  useEffect(() => {
    if (route.params?.snackbar) {
      setVisible(true);
      setMessage(route.params.snackbarMessage)
    }
  }, [route.params]);

  const dimensions = Dimensions.get("window");

  return (
    <Card style={{
      flex: 1, flexDirection: 'column', justifyContent: 'flex-start', padding: 15
    }}>
      <ScrollView>
        <OrientationLocker
          orientation={PORTRAIT}
        />
        <View>
          <Button style={{ alignItems: 'flex-end' }} onPress={() => { navigation.navigate('Login') }}><Text style={{ fontWeight: 'bold', fontSize: 15 }}>Logout</Text></Button>
        </View>

        <View style={{
          flex: 1,
          justifyContent: "center",
          height: dimensions.height -200
        }}>
          <Pressable style={styles.buttons} onPress={() => navigation.navigate('Attendance')} >
            <Text style={styles.text}>Attendance</Text>
          </Pressable>
          <Pressable style={styles.buttons} onPress={() => navigation.navigate('MCQ')}>
            <Text style={styles.text}>MCQ</Text>
          </Pressable>
          <Snackbar style={{ justifyContent: 'center', alignItems: 'center' }}
            visible={visible}
            onDismiss={onDismissSnackBar}
            duration={2000}
          >
            <View style={{ alignItems: 'center' }}><Text style={{ color: 'orange', fontSize: 18 }}>{message}</Text></View>
          </Snackbar>
        </View>

      </ScrollView >
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



export default HomeScreen;

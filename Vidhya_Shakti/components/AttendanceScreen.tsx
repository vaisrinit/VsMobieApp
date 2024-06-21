import React from 'react';
import {
  Text,
  View,
  Pressable,
  StyleSheet,
} from 'react-native';
import { OrientationLocker, PORTRAIT } from 'react-native-orientation-locker';

const AttendanceScreen = ({ navigation }: any) => {

  return (
    <View style={styles.view}>
      <OrientationLocker
        orientation={PORTRAIT}
      />
      <Pressable style={styles.buttons} onPress={() => navigation.navigate('Photo')}>
        <Text style={styles.text}>Take Photo</Text>
      </Pressable>
      <Pressable style={styles.buttons} onPress={() => navigation.navigate('Short')}>
        <Text style={styles.text}>Short Attendance</Text>
      </Pressable>
      <Pressable style={styles.buttons} onPress={() => navigation.navigate('Long')}>
        <Text style={styles.text}>Long Attendance</Text>
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


export default AttendanceScreen;

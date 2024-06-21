import React from 'react';
import {
  Text,
  View,
  Pressable,
  StyleSheet,
} from 'react-native';
import { LANDSCAPE, OrientationLocker, PORTRAIT } from 'react-native-orientation-locker';

const HomeScreen = ({ navigation }: any) => {

  return (
    <View style={styles.view}>
      <OrientationLocker
        orientation={PORTRAIT}
      />
      <Pressable style={styles.buttons} onPress={() => navigation.navigate('Attendance')} >
        <Text style={styles.text}>Attendance</Text>
      </Pressable>
      <Pressable style={styles.buttons} onPress={() => navigation.navigate('MCQ')}>
        <Text style={styles.text}>MCQ</Text>
      </Pressable>
    </View>
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



export default HomeScreen;

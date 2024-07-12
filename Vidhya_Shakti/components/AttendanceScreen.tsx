import React from 'react';
import {
  Text,
  View,
  Pressable,
  StyleSheet,
  ScrollView,
  Dimensions,
} from 'react-native';
import { OrientationLocker, PORTRAIT } from 'react-native-orientation-locker';
import { Card } from 'react-native-paper';

const AttendanceScreen = ({ navigation }: any) => {
  const dimensions = Dimensions.get("window");
  return (
    <Card style={{
      flex: 1, flexDirection: 'column', justifyContent: 'flex-start', padding: 15
    }}>

      <ScrollView>
        <OrientationLocker
          orientation={PORTRAIT}
        />
        <View style={{
          flex: 1,
          justifyContent: "center",
          height:dimensions.height - 150
        }}>
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

      </ScrollView >
    </Card>



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

  },

  text: {
    textAlign: "center",
    color: "white",
    fontSize: 30
  }
});


export default AttendanceScreen;

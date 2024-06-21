import React from 'react';
import {
  Text,
  Dimensions,
  View,
  Pressable,
  StyleSheet,
} from 'react-native';
import { Avatar, Card, DataTable, Icon, TextInput } from 'react-native-paper';
import { Utils } from '../utils/utils';
import { OrientationLocker, PORTRAIT } from 'react-native-orientation-locker';

const LongAttendanceScreen = ({ navigation }: any) => {

  return (
    <View>
      <OrientationLocker
        orientation={PORTRAIT}
      />
      <Pressable>
        <Text>Short Attendance</Text>
      </Pressable>
      <Pressable>
        <Text>Long Attendance</Text>
      </Pressable>
    </View>
    

  )
}


export default LongAttendanceScreen;

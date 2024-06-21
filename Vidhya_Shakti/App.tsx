import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import LoginScreen from './components/LoginScreen';
import HomeScreen from './components/HomeScreen';
import AttendanceScreen from './components/AttendanceScreen';
import MCQScreen from './components/MCQScreen';
import ShortAttendanceScreen from './components/ShortAttendance';
import LongAttendanceScreen from './components/LongAttendance';
import CenterPhotoScreen from './components/CenterPhotoScreen';
const Stack = createNativeStackNavigator();


function App() {
  return (
    <NavigationContainer>
       <Stack.Navigator initialRouteName='Login'>
         <Stack.Screen name="Login" component={LoginScreen} />

        <Stack.Screen name="Home" component={HomeScreen}/>
        <Stack.Screen name="Attendance" component={AttendanceScreen}/>

        <Stack.Screen name="Photo" component={CenterPhotoScreen}/>
        <Stack.Screen name="Short" component={ShortAttendanceScreen}/>
        <Stack.Screen name="Long" component={LongAttendanceScreen}/>

        <Stack.Screen name="MCQ" component={MCQScreen}/>

      </Stack.Navigator>
    </NavigationContainer>
  )


}

export default App;

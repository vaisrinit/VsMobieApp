import React from 'react';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import LoginScreen from './components/LoginScreen';
import HomeScreen from './components/HomeScreen';
import AttendanceScreen from './components/AttendanceScreen';
import MCQScreen from './components/MCQScreen';
import ShortAttendanceScreen from './components/ShortAttendance';
import LongAttendanceScreen from './components/LongAttendance';
import CenterPhotoScreen from './components/CenterPhotoScreen';
import { Provider as PaperProvider } from 'react-native-paper';
import { Pressable, Text } from 'react-native';
import ForgotPassword from './components/ForgotPassword';
const Stack = createNativeStackNavigator();


function App() {

  return (
    <PaperProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName='Login'>
          <Stack.Screen name="Login" component={LoginScreen} options={{
            title: "Vidhya Shakti",
            headerStyle: {
              backgroundColor: '#ffd417',
            },
            headerTitleStyle: {
              fontWeight: "bold",
              color: 'red',
            },
            headerShown:false
            
          }} />

          <Stack.Screen name="Home" component={HomeScreen} options={{
            title: "Welcome Home",
            headerStyle: {
              backgroundColor: '#ffd417',
            },
          }} />
          <Stack.Screen name="Attendance" component={AttendanceScreen} options={{
            title: "Attendance",
            headerStyle: {
              backgroundColor: '#ffd417',
            }
          }} />

          <Stack.Screen name="Photo" component={CenterPhotoScreen} options={{
            title: "Daily Photo",
            headerStyle: {
              backgroundColor: '#ffd417'
            }
          }} />
          <Stack.Screen name="Short" component={ShortAttendanceScreen} options={{
            title: "Short Attendance",
            headerStyle: {
              backgroundColor: '#ffd417'
            }
          }} />
          <Stack.Screen name="Long" component={LongAttendanceScreen} options={{
            title: "Long Attendance",
            headerStyle: {
              backgroundColor: '#ffd417'
            }
          }} />

          <Stack.Screen name="MCQ" component={MCQScreen} options={{
            title: "MCQ",
            headerStyle: {
              backgroundColor: '#ffd417'
            }
          }} />
          
          <Stack.Screen name="ForgotPassword" component={ForgotPassword} options={{
            title: "Forgot Password",
            headerStyle: {
              backgroundColor: '#ffd417'
            }
          }} />

        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  )


}

export default App;

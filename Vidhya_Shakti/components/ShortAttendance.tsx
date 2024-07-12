import React, { useEffect, useState } from 'react';
import {
  Text,
  View,
  Pressable,
  StyleSheet,
  Platform,
  Dimensions,
} from 'react-native';
import { Card, Snackbar, TextInput } from 'react-native-paper';
import { Utils } from '../utils/utils';
import SelectDropdown from 'react-native-select-dropdown';
import { OrientationLocker, PORTRAIT } from 'react-native-orientation-locker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { HttpService } from '../_services/httpservices';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import Geolocation from '@react-native-community/geolocation';


const ShortAttendanceScreen = ({ navigation }: any) => {

  const utils = new Utils();
  const http = new HttpService();

  const [date, setDate] = useState(new Date())
  const [showPicker, setShowPicker] = useState(false)
  const [attendanceDate, setAttendanceDate] = useState(date.getDate() + '-' + (date.getMonth() + 1) + '-' + date.getFullYear())
  const [grade, setGrade] = useState('');
  const [no_of_male, setMaleCount] = useState(-1);
  const [no_of_female, setFemaleCount] = useState(-1);
  const [message, setMessage] = useState('')
  const [visible, setVisible] = React.useState(false);

  const [latitude, setLatitude] = useState(0);
  const [longitude, setLongitude] = useState(0);


  const onToggleSnackBar = () => setVisible(!visible);
  const onDismissSnackBar = () => setVisible(false);

  const max_date = new Date()

  const toggleDatePicker = () => {
    setShowPicker(!showPicker)
  }
  const grades = ['5th', "6th", "7th", "8th", "9th", "10th", "11th", '12th']

  useEffect(() => {
    Geolocation.getCurrentPosition(info => {
      setLatitude(info.coords.latitude);
      setLongitude(info.coords.longitude);
    });
  })
  const onChange = ({ type }: any, selectedDate: any) => {
    if (type == 'set') {
      const currentDate = selectedDate;
      setDate(currentDate)

      if (Platform.OS == 'android') {
        toggleDatePicker();
        let current_date = currentDate.getDate()
        let current_month = currentDate.getMonth() + 1
        let current_year = currentDate.getFullYear()

        setAttendanceDate(current_date + '-' + current_month + '-' + current_year)
      }
    }
    else {
      toggleDatePicker()
    }
  }

  const submit = async () => {
    if (grade != '' && no_of_female != -1 && no_of_male != -1) {
      let param = {
        attendance_date: date,
        grade: grade,
        no_of_male: no_of_male,
        no_of_female: no_of_female,
        latitude: latitude,
        longitude: longitude,
        ric_id: HttpService.usr.ric_id
      }
      let decrypted_result: any;
      await http.authHttpPostRequest('/attendance/addShortAttendance', param)
        .then(response => response.json())
        .then(text => {
          decrypted_result = utils.decrypt(text.encryptResult)
        })
        .catch(err => console.log(err))
      let result = JSON.parse(decrypted_result);
      if (result.success) {
        navigation.navigate('Home',
          {
            snackbar: true,
            snackbarMessage: 'Short Attendance Submitted Successfully!',
          }
        )
      }
      else {
        let message = result.message
        if (message.includes("unique")) {
          setMessage("Attendance already submitted for this grade today");
          onToggleSnackBar();
        }

      }
    }
    else {
      setMessage("Fill all details");
      onToggleSnackBar();

    }

  }
  const dimensions = Dimensions.get("window");


  return (
    <Card style={{
      flex: 1, flexDirection: 'column', justifyContent: 'flex-start', padding: 15
    }}>
      <View style={{

        height: dimensions.height -100,
        flexDirection: 'column'
      }}>
        <OrientationLocker
          orientation={PORTRAIT}
        />
        <View style={{ justifyContent: 'center', }}>
          {showPicker && (<DateTimePicker
            mode='date'
            display='spinner'
            value={max_date} onChange={onChange} maximumDate={max_date} minimumDate={max_date}></DateTimePicker>)}

          <Pressable style={{ margin: 20 }} onPress={toggleDatePicker}>
            <TextInput mode='outlined' label={'Attendance Date'} value={attendanceDate} onChangeText={setAttendanceDate} editable={false}></TextInput>
          </Pressable>
          <Text style={{ marginLeft: 20, fontSize: 20, fontWeight: 'bold', color: '#8d91db' }}>Class</Text>
          <View style={{ margin: 10, justifyContent: 'center' }}>
            <SelectDropdown
              data={grades}
              onSelect={(selectedItem, index) => {
                setGrade(selectedItem)
              }}
              renderButton={(selectedItem, isOpened) => {
                return (
                  <View style={styles.dropdownButtonStyle}>
                    <View>
                      <Text style={{ color: 'black', fontSize: 20 }}>
                        {selectedItem || 'Select Class'}</Text>
                    </View>
                    <MaterialIcons name='arrow-drop-down' style={{ fontSize: 30, color: 'green' }}></MaterialIcons>
                  </View>
                );
              }}
              renderItem={(item, index, isSelected) => {
                return (
                  <View style={{ ...styles.dropdownItemStyle, ...(isSelected && { backgroundColor: '#D2D9DF' }) }}>
                    <Text style={styles.dropdownItemTxtStyle}>{item}</Text>
                  </View>
                );
              }}
              showsVerticalScrollIndicator={false}
              dropdownStyle={styles.dropdownMenuStyle}
            />
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-evenly' }}>
            <TextInput style={{ width: 150 }} onChangeText={text => setMaleCount(parseInt(text))} outlineColor='blue' activeOutlineColor='green' mode='outlined' keyboardType='number-pad' label={"No of Male"} >

            </TextInput>
            <TextInput style={{ width: 150 }} onChangeText={text => setFemaleCount(parseInt(text))} outlineColor='blue' activeOutlineColor='green' mode='outlined' keyboardType='number-pad' label={"No of Female"}>

            </TextInput>
          </View>


        </View>

        <Pressable style={{ margin: 10, padding: 10, backgroundColor: 'green', borderRadius: 20, alignItems: 'center' }} onPress={() => submit()}>
          <Text style={styles.text}>Submit</Text>
        </Pressable>

      </View>
      <Snackbar
        visible={visible}
        onDismiss={onDismissSnackBar}
      >
        {message}
      </Snackbar>
    </Card>



  )
}

const styles = StyleSheet.create({
  dropdownButtonStyle: {
    // borderColor: '#000000',
    height: 50,
    backgroundColor: '#cacdf4',
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  dropdownButtonTxtStyle: {
    borderColor: '#cacdf4',
    flex: 1,
    fontSize: 18,
    fontWeight: '500',
    color: '#cacdf4',
  },
  dropdownMenuStyle: {
    borderColor: '#cacdf4',
    backgroundColor: '#cacdf4',
    borderRadius: 8,
  },
  dropdownItemStyle: {
    borderColor: '#cacdf4',
    width: '100%',
    flexDirection: 'row',
    paddingHorizontal: 12,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 8,
  },
  dropdownItemTxtStyle: {
    borderColor: '#cacdf4',
    flex: 1,
    fontSize: 18,
    fontWeight: '500',
    color: '#151E26',
  },

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
    fontSize: 20
  }
});


export default ShortAttendanceScreen;

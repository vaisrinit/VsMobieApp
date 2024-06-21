import React, { useEffect, useState } from 'react';
import {
  Text,
  View,
  Pressable,
  StyleSheet,
  Platform,
  PermissionsAndroid
} from 'react-native';
import { TextInput } from 'react-native-paper';
import { Utils } from '../utils/utils';
import SelectDropdown from 'react-native-select-dropdown';
import { OrientationLocker, PORTRAIT } from 'react-native-orientation-locker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { HttpService } from '../_services/httpservices';
import Geolocation from '@react-native-community/geolocation';


const ShortAttendanceScreen = ({ navigation }: any) => {

  const utils = new Utils();
  const http = new HttpService();

  const [date, setDate] = useState(new Date())
  
  const [showPicker, setShowPicker] = useState(false)
  const [attendanceDate, setAttendanceDate] = useState(date.getDate() + '-' + (date.getMonth() + 1) + '-' + date.getFullYear())
  const [grade, setGrade] = useState();
  const [no_of_male, setMaleCount] = useState(0);
  const [no_of_female, setFemaleCount] = useState(0);

  const max_date = new Date()

  const toggleDatePicker = () => {
    setShowPicker(!showPicker)
  }
  const grades = ['Fifth', "Sixth", "Seventh", "Eighth", "Ninth", "Tenth", "Eleventh", 'Twelfth']

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
    let param = {
      attendance_date: date,
      grade: grade,
      no_of_male: no_of_male,
      no_of_female: no_of_female,
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
      navigation.navigate('Home')
    }
  }


  return (
    <View >
      <OrientationLocker
        orientation={PORTRAIT}
      />
      <View style={{ justifyContent: 'center', flexDirection: 'column' }}>
        {showPicker && (<DateTimePicker
          mode='date'
          display='spinner'
          value={max_date} onChange={onChange} maximumDate={max_date} minimumDate={max_date}></DateTimePicker>)}

        <Pressable style={{ margin: 20 }} onPress={toggleDatePicker}>
          <TextInput mode='outlined' label={'Attendance Date'} value={attendanceDate} onChangeText={setAttendanceDate} editable={false}></TextInput>
        </Pressable>
        <Text style={{ marginLeft: 20, fontSize: 20, fontWeight: 'bold' }}>Class</Text>
        <View style={{ margin: 10, justifyContent: 'center' }}>
          <SelectDropdown
            data={grades}
            onSelect={(selectedItem, index) => {
              setGrade(selectedItem)
            }}
            renderButton={(selectedItem, isOpened) => {
              return (
                <View style={styles.dropdownButtonStyle}>
                  <Text style={styles.dropdownButtonTxtStyle}>
                    {selectedItem || 'Select Class'}
                  </Text>
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


  )
}

const styles = StyleSheet.create({
  dropdownButtonStyle: {
    borderColor: '#000000',
    height: 50,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  dropdownButtonTxtStyle: {
    borderColor: '#000000',
    flex: 1,
    fontSize: 18,
    fontWeight: '500',
    color: '#151E26',
  },
  dropdownMenuStyle: {
    borderColor: '#000000',
    backgroundColor: '#E9ECEF',
    borderRadius: 8,
  },
  dropdownItemStyle: {
    borderColor: '#000000',
    width: '100%',
    flexDirection: 'row',
    paddingHorizontal: 12,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 8,
  },
  dropdownItemTxtStyle: {
    borderColor: '#000000',
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

  view: {
    flex: 1,
    justifyContent: "center"
  },

  text: {
    textAlign: "center",
    color: "white",
    fontSize: 20
  }
});


export default ShortAttendanceScreen;

import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Card, DataTable, MD2Colors, Snackbar, TextInput } from 'react-native-paper';
import { Utils } from '../utils/utils';
import { LANDSCAPE, OrientationLocker, PORTRAIT } from 'react-native-orientation-locker';

import { HttpService } from '../_services/httpservices';
import DateTimePicker from '@react-native-community/datetimepicker';
import CheckBox from '@react-native-community/checkbox';
import SelectDropdown from 'react-native-select-dropdown';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Geolocation from '@react-native-community/geolocation';

const LongAttendanceScreen = ({ navigation }: any) => {
  const [selectedStudents, setSelectedStudents] = useState<any[]>([]);
  const [date, setDate] = useState(new Date())

  const [attendanceDate, setAttendanceDate] = useState(date.getDate() + '-' + (date.getMonth() + 1) + '-' + date.getFullYear())

  const grades = ["5th", "6th", "7th", "8th", "9th", "10th", "11th", "12th"];

  const [showPicker, setShowPicker] = useState(false)

  const max_date = new Date()
  let marks: any = []
  const utils = new Utils();
  const http = new HttpService();
  const [isLoading, setIsLoading] = useState(false)

  const [message, setMessage] = useState('')
  const [visible, setVisible] = React.useState(false);
  const onToggleSnackBar = () => setVisible(!visible);
  const onDismissSnackBar = () => setVisible(false);

  const toggleDatePicker = () => {
    setShowPicker(!showPicker)
  }


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



  const fetchStudents = async (grade: any) => {
    setIsLoading(true);
    const response = await http.authHttpPostRequest('/students/getStudentDetailsForCoordinator', { programme: HttpService.usr.programme, ric_id: HttpService.usr.ric_id, grade: grade })
    const data = await response.json();
    const decrypted_resutlt = utils.decrypt(data.encryptResult)
    let result = JSON.parse(decrypted_resutlt).rows
    result = JSON.parse(result);
    result.map((item: any) => {
      item['present'] = true
    })
    setSelectedStudents(result);
    setIsLoading(false);

  };

  const changeStatus = (value: boolean, item: any) => {
    setSelectedStudents(prevStudents => {
      const newStudents = [...prevStudents];
      newStudents[item] = { ...newStudents[item], present: value };
      return newStudents;
    });
  }

  const submit = async () => {
    let decrypted_result: any;
    await http.authHttpPostRequest('/attendance/addLongAttendance', {
      attendance_date: date, data: selectedStudents, latitude: latitude, longitude: longitude, ric_id: HttpService.usr.ric_id

    })
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
          snackbarMessage: 'Long Attendance Submitted Successfully!',
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
  const [latitude, setLatitude] = useState(0);
  const [longitude, setLongitude] = useState(0);


  useEffect(() => {

    Geolocation.getCurrentPosition(info => {
      setLatitude(info.coords.latitude);
      setLongitude(info.coords.longitude);
    });
  }, [])
  return (
    <Card style={{
      flex: 1, flexDirection: 'column', justifyContent: 'flex-start', padding: 15
    }}>
      <ScrollView>
        <View>
          <OrientationLocker
            orientation={PORTRAIT}
          />


          {showPicker && (<DateTimePicker
            mode='date'
            display='spinner'
            value={max_date} onChange={onChange} maximumDate={max_date} minimumDate={max_date}></DateTimePicker>)}

          <Pressable style={{ margin: 20 }} onPress={toggleDatePicker}>
            <TextInput mode='outlined' label={'Attendance Date'} value={attendanceDate} onChangeText={setAttendanceDate} editable={false}></TextInput>
          </Pressable>
          <DataTable>
            <DataTable.Header>
              <DataTable.Cell style={{ justifyContent: 'center' }}><Text style={{ fontSize: 20, color: '#8d91db', fontWeight: 'bold' }}>Grade</Text></DataTable.Cell>
              <DataTable.Cell style={{ justifyContent: 'center' }}>
                <SelectDropdown
                  data={grades}
                  onSelect={(selectedItem, index) => {
                    fetchStudents(selectedItem)

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
              </DataTable.Cell>
            </DataTable.Header>
            <View>
              <ActivityIndicator animating={isLoading} color={MD2Colors.red800} size='large' />
            </View>
            <DataTable.Row>
              <DataTable.Cell style={{ justifyContent: 'center' }}>
                <Text style={{ fontSize: 18, color: '#8d91db', fontWeight: 'bold' }}>Student Name</Text>
              </DataTable.Cell>
              <DataTable.Cell style={{ justifyContent: 'center' }}>
                <Text style={{ fontSize: 18, color: '#8d91db', fontWeight: 'bold' }}>Present</Text>
              </DataTable.Cell>
            </DataTable.Row>
            {selectedStudents.map((item: any, idx: number) => (
              <DataTable.Row key={item.id}>
                <DataTable.Cell style={{ justifyContent: 'center' }}>{item.name}</DataTable.Cell>
                <DataTable.Cell style={{ justifyContent: 'center' }}><CheckBox
                  disabled={false}
                  value={item.present}
                  onValueChange={(newValue) => changeStatus(newValue, idx)}
                /></DataTable.Cell>
              </DataTable.Row>
            ))}

          </DataTable>
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
      </ScrollView>
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
export default LongAttendanceScreen;

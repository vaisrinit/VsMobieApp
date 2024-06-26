import React, { useEffect, useState } from 'react';
import {
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { DataTable, TextInput } from 'react-native-paper';
import { Utils } from '../utils/utils';
import { LANDSCAPE, OrientationLocker, PORTRAIT } from 'react-native-orientation-locker';

import { HttpService } from '../_services/httpservices';
import DateTimePicker from '@react-native-community/datetimepicker';
import CheckBox from '@react-native-community/checkbox';
import SelectDropdown from 'react-native-select-dropdown';

const LongAttendanceScreen = ({ navigation }: any) => {
  const [students, setStudents] = useState([]);
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [date, setDate] = useState(new Date())
  
  const [attendanceDate, setAttendanceDate] = useState(date.getDate() + '-' + (date.getMonth() + 1) + '-' + date.getFullYear())
  
  const grades = ["Fifth", "Sixth", "Seventh", "Eighth", "Ninth", "Tenth", "Eleventh", "Twelfth"];
  const [status, setStatus] = useState(false);
  const [showPicker, setShowPicker] = useState(false)

  const max_date = new Date()
  let marks: any = []
  const utils = new Utils();
  const http = new HttpService();

  useEffect(() => {
    fetchStudents();
  }, [])

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


  const fetchStudents = async () => {
    const response = await http.authHttpPostRequest('/students/getStudentDetailsForCoordinator', { programme: HttpService.usr.programme,ric_id:HttpService.usr.ric_id })
    const data = await response.json();
    const decrypted_resutlt = utils.decrypt(data.encryptResult)
    let result = JSON.parse(decrypted_resutlt).rows
    result = JSON.parse(result);
    setStudents(result);
  };
  return (
    <View style={{ justifyContent: 'center' }}>
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
          <DataTable.Cell>Grade</DataTable.Cell>
          <DataTable.Cell>
            <SelectDropdown
              data={grades}
              onSelect={(selectedItem, index) => {
                let x = students.filter((item: any) => {
                  return item.grade == selectedItem
                })
                setSelectedStudents(x);
              }}
              renderButton={(selectedItem, isOpened) => {
                return (
                  <View style={styles.dropdownButtonStyle}>
                    <Text style={styles.dropdownButtonTxtStyle}>
                      {selectedItem || 'Select Grade'}
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
          </DataTable.Cell>
        </DataTable.Header>
        <DataTable.Row>
          <DataTable.Cell>
            Student Name
          </DataTable.Cell>
          <DataTable.Cell>
            Present
          </DataTable.Cell>
        </DataTable.Row>
        {selectedStudents.map((item: any) => (
          <DataTable.Row key={item.id}>
            <DataTable.Cell>{item.name}</DataTable.Cell>
            <DataTable.Cell><CheckBox
              disabled={false}
              value={status}
              onValueChange={(newValue) => setStatus(newValue)}
            /></DataTable.Cell>
          </DataTable.Row>
        ))}

      </DataTable>
    </View>


  )
}

const styles = StyleSheet.create({
  dropdownButtonStyle: {
    width: 150,
    height: 50,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  dropdownButtonTxtStyle: {
    flex: 1,
    fontSize: 18,
    fontWeight: '500',
    color: '#151E26',
  },
  dropdownButtonArrowStyle: {
    fontSize: 28,
  },
  dropdownButtonIconStyle: {
    fontSize: 28,
    marginRight: 8,
  },
  dropdownMenuStyle: {
    backgroundColor: '#E9ECEF',
    borderRadius: 8,
  },
  dropdownItemStyle: {
    width: '100%',
    flexDirection: 'row',
    paddingHorizontal: 12,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 8,
  },
  dropdownItemTxtStyle: {
    flex: 1,
    fontSize: 18,
    fontWeight: '500',
    color: '#151E26',
  },
  dropdownItemIconStyle: {
    fontSize: 28,
    marginRight: 8,
  },
});
export default LongAttendanceScreen;

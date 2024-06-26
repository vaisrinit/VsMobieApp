import React, { useEffect, useState } from 'react';
import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  Pressable,
} from 'react-native';
import { DataTable, Snackbar, TextInput } from 'react-native-paper';
import { Utils } from '../utils/utils';
import SelectDropdown from 'react-native-select-dropdown';
import { OrientationLocker, LANDSCAPE, PORTRAIT } from "react-native-orientation-locker";
import { HttpService } from '../_services/httpservices';

const MCQScreen = ({ navigation }: any) => {
  const [mcqOptions, setMcqOptions] = useState([]);
  const [selectedMcq, setSelectedMcq] = useState(-1);
  const [message, setMessage] = useState('')

  const [students, setStudents] = useState([]);
  const [selectedStudents, setSelectedStudents] = useState([]);

  const [visible, setVisible] = React.useState(false);

  const onToggleSnackBar = () => setVisible(!visible);

  const onDismissSnackBar = () => setVisible(false);
  let marks: any = []

  const utils = new Utils();
  const http = new HttpService();

  useEffect(() => {
    fetchMcqOptions();
    fetchStudents();
  }, [])

  const fetchMcqOptions = async () => {
    const response = await http.authHttpPostRequest('/mcqs/getMcqDetails', { programme: HttpService.usr.programme })
    const data = await response.json();
    const decrypted_resutlt = utils.decrypt(data.encryptResult)
    let result = JSON.parse(decrypted_resutlt).rows
    result = JSON.parse(result);
    result.map((item: any, idx: any) => {
      let exam_date = new Date(item.date_of_exam);
      let str_exam_date = exam_date.getDate() + "/" + (exam_date.getMonth() + 1) + "/" + exam_date.getFullYear();
      item['label'] = item.grade + "-" + item.subject + "-" + str_exam_date
    })
    setMcqOptions(result);
  };

  const fetchStudents = async () => {
    const response = await http.authHttpPostRequest('/students/getStudentDetailsForCoordinator', { programme: HttpService.usr.programme,ric_id:HttpService.usr.ric_id })
    const data = await response.json();
    const decrypted_resutlt = utils.decrypt(data.encryptResult)
    let result = JSON.parse(decrypted_resutlt).rows
    result = JSON.parse(result);
    setStudents(result);
  };

  const addMark = (mark: any, id: any) => {
    let changed = false;
    marks.map((item: any, idx: any) => {
      if (item.student_id == id) {
        item.mark = parseInt(mark);
        changed = true;
      }
    })
    if (!changed) {
      marks.push({ mark: parseInt(mark), student_id: id })
    }

  }

  const insertMarks = async () => {
    if (marks.length == 0) {
      setMessage("Kindly enter some marks")
      onToggleSnackBar();
    }
    else {
      let param = { mcq_id: selectedMcq, marks: marks }
      const response = await http.authHttpPostRequest('/mcqs/insertMarks', param)
      const data = await response.json();
      const decrypted_resutlt = utils.decrypt(data.encryptResult)
      let result = JSON.parse(decrypted_resutlt)
      if (result.success) {
        navigation.navigate('Home')
      }
    }

  }
  return (
    <ScrollView>
      <OrientationLocker
        orientation={PORTRAIT}
      />
      <View >

        <DataTable>
          <DataTable.Header>
            <DataTable.Cell>MCQ Test</DataTable.Cell>
            <DataTable.Cell>
              <SelectDropdown
                data={mcqOptions}
                onSelect={(selectedItem, index) => {
                  setSelectedMcq(selectedItem.id)
                  let x = students.filter((item: any) => {
                    return item.grade == selectedItem.grade
                  })
                  setSelectedStudents(x);
                }}
                renderButton={(selectedItem, isOpened) => {
                  return (
                    <View style={styles.dropdownButtonStyle}>
                      <Text style={styles.dropdownButtonTxtStyle}>
                        {(selectedItem && selectedItem.label) || 'Select MCQ'}
                      </Text>
                    </View>
                  );
                }}
                renderItem={(item, index, isSelected) => {
                  return (
                    <View style={{ ...styles.dropdownItemStyle, ...(isSelected && { backgroundColor: '#D2D9DF' }) }}>
                      <Text style={styles.dropdownItemTxtStyle}>{item.label}</Text>
                    </View>
                  );
                }}
                showsVerticalScrollIndicator={false}
                dropdownStyle={styles.dropdownMenuStyle}
              />
            </DataTable.Cell>
          </DataTable.Header>
          {selectedStudents.map((item: any) => (
            <DataTable.Row key={item.id}>
              <DataTable.Cell>{item.name}</DataTable.Cell>
              <DataTable.Cell><TextInput onChangeText={(mark) => addMark(mark, item.id)} keyboardType='number-pad'></TextInput></DataTable.Cell>
            </DataTable.Row>
          ))}

        </DataTable>
        <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 20 }}>
          <Pressable onPress={() => insertMarks()}><Text style={{ textAlign: 'center', backgroundColor: 'green', borderRadius: 20, padding: 10, fontSize: 20, color: '#ffffff', fontWeight: 'bold', width: 100 }} >Submit</Text></Pressable>
        </View>

      </View>
      <Snackbar
        visible={visible}
        onDismiss={onDismissSnackBar}
        action={{
          label: 'Close',
          onPress: () => {
            // Do something
          },
        }}>
        {message}
      </Snackbar>
    </ScrollView>

  );
}

const styles = StyleSheet.create({
  dropdownButtonStyle: {
    width: 200,
    height: 50,
    backgroundColor: '#E9ECEF',
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
export default MCQScreen;

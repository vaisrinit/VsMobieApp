import React, { useEffect, useState } from 'react';
import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  Pressable,
  ActivityIndicator,
  useColorScheme,
} from 'react-native';
import { Card, DataTable, MD2Colors, Snackbar, TextInput } from 'react-native-paper';
import { Utils } from '../utils/utils';
import SelectDropdown from 'react-native-select-dropdown';
import { OrientationLocker, LANDSCAPE, PORTRAIT } from "react-native-orientation-locker";
import { HttpService } from '../_services/httpservices';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Geolocation from '@react-native-community/geolocation';

const MCQScreen = ({ navigation }: any) => {
  const [mcqOptions, setMcqOptions] = useState([]);
  const [selectedMcq, setSelectedMcq] = useState(-1);
  const [message, setMessage] = useState('')

  // const [students, setStudents] = useState([]);
  const [selectedStudents, setSelectedStudents] = useState([]);

  const [visible, setVisible] = React.useState(false);
  const [maxMarks, setMaxMarks] = React.useState(0);


  const onToggleSnackBar = () => setVisible(!visible);

  const onDismissSnackBar = () => setVisible(false);
  const [isLoading, setIsLoading] = useState(false)

  const [marks, setMarks] = useState<any[]>([]);


  const utils = new Utils();
  const http = new HttpService();

  const [latitude, setLatitude] = useState(0);
  const [longitude, setLongitude] = useState(0);


  useEffect(() => {
    fetchMcqOptions();

    Geolocation.getCurrentPosition(info => {
      setLatitude(info.coords.latitude);
      setLongitude(info.coords.longitude);
    });
  }, [])

  const fetchMcqOptions = async () => {
    setIsLoading(true);
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
    setIsLoading(false);

  };

  const fetchStudents = async (grade: any) => {
    setIsLoading(true);

    const response = await http.authHttpPostRequest('/students/getStudentDetailsForCoordinator', { programme: HttpService.usr.programme, ric_id: HttpService.usr.ric_id, grade: grade })
    const data = await response.json();
    const decrypted_resutlt = utils.decrypt(data.encryptResult)
    let result = JSON.parse(decrypted_resutlt).rows
    result = JSON.parse(result);
    result.map((item:any)=>{
      delete item.gender;
      delete item.grade;
      delete item.programme_id;
      delete item.ric_id;
      delete item.ric_name;
      item['student_id'] = item.id
      item['marks']=0;
      item['is_error']=false;

    })

    setSelectedStudents(result);

    setIsLoading(false);

  };

  const addMark = (mark: any, idx: any) => {
    let int_mark = parseInt(mark)
    if (int_mark >= 0 && int_mark <= maxMarks) {
      setSelectedStudents(prevStudents => {
        const newStudents: any = [...prevStudents];
        newStudents[idx] = { ...newStudents[idx], marks: int_mark };
        return newStudents;
      });
    }
    else {
      setMessage("Mark has to be between 0 and "+maxMarks)
      onToggleSnackBar();
      setSelectedStudents(prevStudents => {
        const newStudents: any = [...prevStudents];
        newStudents[idx] = { ...newStudents[idx], marks: 0,is_error:true };
        return newStudents;
      });
    }

    console.log(selectedStudents.slice(0,4))
  }


  const insertMarks = async () => {

      let param = { mcq_id: selectedMcq, marks: selectedStudents, latitude: latitude, longitude: longitude }
      const response = await http.authHttpPostRequest('/mcqs/insertMarks', param)
      const data = await response.json();
      const decrypted_resutlt = utils.decrypt(data.encryptResult)
      let result = JSON.parse(decrypted_resutlt)
      navigation.navigate('Home',
        {
          snackbar: true,
          snackbarMessage: 'MCQ Marks Submitted Successfully!',
        }
      )

  }
  const theme = useColorScheme();
  const isDarkTheme = theme === 'dark';

  return (
    <Card style={{
      flex: 1, flexDirection: 'column', justifyContent: 'flex-start', padding: 15
    }}>
      <ScrollView>

        <OrientationLocker
          orientation={PORTRAIT}
        />
        <View >

          <DataTable>
            <DataTable.Header>
              <DataTable.Cell><Text style={{ fontSize: 20, color: '#8d91db', fontWeight: 'bold' }}>MCQ Test</Text></DataTable.Cell>
              <DataTable.Cell style={{ flex: 2 }}>
                <SelectDropdown
                  data={mcqOptions}
                  onSelect={(selectedItem, index) => {
                    setMaxMarks(selectedItem.maximum_marks)
                    setSelectedMcq(selectedItem.id)
                    fetchStudents(selectedItem.grade)

                  }}
                  renderButton={(selectedItem, isOpened) => {

                    return (
                      <View style={styles.dropdownButtonStyle}>
                        <View>
                          <Text style={{ color: 'black', fontSize: 18 }}>
                            {(selectedItem && selectedItem.label) || 'Select MCQ'}
                          </Text>
                        </View>
                        <MaterialIcons name='arrow-drop-down' style={{ fontSize: 30, color: 'green' }}></MaterialIcons>
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
            <View>
              <ActivityIndicator animating={isLoading} color={MD2Colors.red800} size='large' />
            </View>
            <DataTable.Row>
              <DataTable.Cell style={{ justifyContent: 'center' }}>
                <Text style={{ fontSize: 18, color: '#8d91db', fontWeight: 'bold' }}>Student Name</Text>
              </DataTable.Cell>
              <DataTable.Cell style={{ justifyContent: 'center' }}>
                <Text style={{ fontSize: 18, color: '#8d91db', fontWeight: 'bold' }}>Student Marks</Text>
              </DataTable.Cell>
            </DataTable.Row>
            {selectedStudents.map((item: any, idx: any) => (
              <DataTable.Row key={item.id}>
                <DataTable.Cell style={{ justifyContent: 'center' }}>{item.name}</DataTable.Cell>
                <DataTable.Cell style={{ justifyContent: 'center' }}><TextInput value={item.marks?item.marks:0} onChangeText={(mark) => addMark(mark, idx)} keyboardType='number-pad' outlineColor='green' underlineColor={item.is_error ? 'red' : 'green'} activeUnderlineColor={isDarkTheme ? '#95ffdd' : 'blue'} ></TextInput></DataTable.Cell>
              </DataTable.Row>
            ))}

          </DataTable>

          <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 20 }}>
            <Pressable onPress={() => insertMarks()}><Text style={{ textAlign: 'center', backgroundColor: 'green', borderRadius: 20, padding: 10, fontSize: 20, color: '#ffffff', fontWeight: 'bold', width: 100, margin: 12 }} >Submit</Text></Pressable>
          </View>

        </View>

      </ScrollView>
      <Snackbar

        visible={visible}
        onDismiss={onDismissSnackBar}
      >
        {message}
      </Snackbar>
    </Card>


  );
}

const styles = StyleSheet.create({
  dropdownButtonStyle: {
    width: 240,
    height: 50,
    backgroundColor: '#cacdf4',
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
    color: '#cacdf4',
  },
  dropdownButtonArrowStyle: {
    fontSize: 28,
  },
  dropdownButtonIconStyle: {
    fontSize: 28,
    marginRight: 8,
  },
  dropdownMenuStyle: {
    backgroundColor: '#cacdf4',
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

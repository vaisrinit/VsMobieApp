import React, { useEffect, useState, Component } from 'react';
import {
  Text,
  Dimensions,
  View,
  Pressable,
  StyleSheet,
  ScrollView,
  Button
} from 'react-native';
import { Avatar, Card, DataTable, TextInput } from 'react-native-paper';
import { Utils } from '../utils/utils';
import SelectDropdown from 'react-native-select-dropdown';
import { OrientationLocker, PORTRAIT, LANDSCAPE } from "react-native-orientation-locker";
import { HttpService } from '../_services/httpservices';


const MCQScreen = (() => {
  const [data,setData] = useState([{subject:'Science'}])
  const utils = new Utils();
  const http = new HttpService();

  const loadData = async()=> {
    
    const response = await http.authHttpPostRequest('/mcqs/getMcqDetails',{programme:HttpService.usr.programme})
    const data = await response.json()
    const decrypted_resutlt = utils.decrypt(data.encryptResult)
    const result = JSON.parse(decrypted_resutlt).rows
    setData(result);
  }

  useEffect(()=>{
    loadData()
  },[]) 
    return (
      <ScrollView>
        <OrientationLocker
          orientation={LANDSCAPE}
        />
        <View >
            
          <DataTable style={{ padding: 10, width: 700 }}>
            <DataTable.Header>
              <DataTable.Cell>MCQ Test</DataTable.Cell>
              <DataTable.Cell>
                <SelectDropdown
                  data={data}
                  onSelect={(selectedItem, index) => {
                    console.log(selectedItem.subject, index);
                  }}
                  renderButton={(selectedItem, isOpened) => {
                    return (
                      <View style={styles.dropdownButtonStyle}>
                        <Text style={styles.dropdownButtonTxtStyle}>
                          {selectedItem?.subject || 'Select MCQ'}
                        </Text>
                      </View>
                    );
                  }}
                  renderItem={(item, index, isSelected) => {
                    return (
                      <View style={{ ...styles.dropdownItemStyle, ...(isSelected && { backgroundColor: '#D2D9DF' }) }}>
                        <Text style={styles.dropdownItemTxtStyle}>{item.subject}</Text>
                      </View>
                    );
                  }}
                  showsVerticalScrollIndicator={false}
                  dropdownStyle={styles.dropdownMenuStyle}
                />
              </DataTable.Cell>
            </DataTable.Header>

            <DataTable.Row>
              <DataTable.Cell>Student 1</DataTable.Cell>
              <DataTable.Cell><TextInput keyboardType='number-pad' style={{ width: 'auto' }}></TextInput></DataTable.Cell>
            </DataTable.Row>
            <DataTable.Row>
              <DataTable.Cell>Student 1</DataTable.Cell>
              <DataTable.Cell><TextInput keyboardType='number-pad' style={{ width: 'auto' }}></TextInput></DataTable.Cell>
            </DataTable.Row>
            <DataTable.Row>
              <DataTable.Cell>Student 1</DataTable.Cell>
              <DataTable.Cell><TextInput keyboardType='number-pad' style={{ width: 'auto' }}></TextInput></DataTable.Cell>
            </DataTable.Row>
            <DataTable.Row>
              <DataTable.Cell>Student 1</DataTable.Cell>
              <DataTable.Cell><TextInput keyboardType='number-pad' style={{ width: 'auto' }}></TextInput></DataTable.Cell>
            </DataTable.Row>
            <DataTable.Row>
              <DataTable.Cell>Student 1</DataTable.Cell>
              <DataTable.Cell><TextInput keyboardType='number-pad' style={{ width: 'auto' }}></TextInput></DataTable.Cell>
            </DataTable.Row>
            <DataTable.Row>
              <DataTable.Cell>Student 1</DataTable.Cell>
              <DataTable.Cell><TextInput keyboardType='number-pad' style={{ width: 'auto' }}></TextInput></DataTable.Cell>
            </DataTable.Row>
            <DataTable.Row>
              <DataTable.Cell>Student 1</DataTable.Cell>
              <DataTable.Cell><TextInput keyboardType='number-pad' style={{ width: 'auto' }}></TextInput></DataTable.Cell>
            </DataTable.Row>
            <DataTable.Row>
              <DataTable.Cell>Student 1</DataTable.Cell>
              <DataTable.Cell><TextInput keyboardType='number-pad' style={{ width: 'auto' }}></TextInput></DataTable.Cell>
            </DataTable.Row>
            <DataTable.Row>
              <DataTable.Cell>Student 1</DataTable.Cell>
              <DataTable.Cell><TextInput keyboardType='number-pad' style={{ width: 'auto' }}></TextInput></DataTable.Cell>
            </DataTable.Row>
            <DataTable.Row>
              <DataTable.Cell>Student 1</DataTable.Cell>
              <DataTable.Cell><TextInput keyboardType='number-pad' style={{ width: 'auto' }}></TextInput></DataTable.Cell>
            </DataTable.Row>

          </DataTable> 
        </View>

      </ScrollView>

    );
  }
)

const styles = StyleSheet.create({
  dropdownButtonStyle: {
    width: 300,
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

import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import axios from 'axios';

const ProfileScreen = ({ route, navigation }) => {
  const { firstName: initialFirstName, lastName: initialLastName, id, mobileNumber: initialMobileNumber } = route.params;
  const [firstName, setFirstName] = useState(initialFirstName);
  const [lastName, setLastName] = useState(initialLastName);
  const [mobileNumber, setMobileNumber] = useState(initialMobileNumber);

  const password = "Test";
  const updatedBy = 'admin';

  const handleUpdate = async () => {
    if (!firstName || !lastName) {
      Alert.alert('All fields are required');
      return;
    }
  
    try {
      const response = await axios.put(`http://192.168.29.217:3001/update/${id}`, {
        firstName,
        lastName,
        mobileNumber,
        password,
        updatedBy,
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      console.log(response.data);
  
      if (response.status === 200) {
        Alert.alert('Success', 'Profile updated successfully', [
          { text: 'OK', onPress: () => navigation.goBack() },
        ]);
      } else {
        Alert.alert('Error', response.data.message || 'Something went wrong');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
  
      if (error.response) {
        Alert.alert('Error', `Server responded with status ${error.response.status}`);
      } else if (error.request) {
        Alert.alert('Error', 'No response received from server. Please try again later.');
      } else {
        Alert.alert('Error', 'Failed to update profile. Please try again later.');
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>First Name</Text>
      <TextInput
        style={styles.input}
        value={firstName}
        onChangeText={setFirstName}
      />
      <Text style={styles.label}>Last Name</Text>
      <TextInput
        style={styles.input}
        value={lastName}
        onChangeText={setLastName}
      />
      <Text style={styles.label}>Mobile Number</Text>
      <TextInput
        style={styles.input}
        value={mobileNumber}
        onChangeText={setMobileNumber}
        keyboardType="phone-pad"
      />
      <Button title="Update Profile" onPress={handleUpdate} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  label: {
    fontSize: 18,
    marginBottom: 8,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 8,
  },
});

export default ProfileScreen;

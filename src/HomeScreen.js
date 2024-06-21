import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

const WelcomeScreen = ({ route, navigation }) => {
  const { firstName, lastName, mobileNumber , id  } = route.params;

  const handleLogout = () => {
    navigation.navigate('Login');
  };

  const handleProfile = () => {
    navigation.navigate('ProfileScreen', { firstName, lastName, mobileNumber , id });
  };

  const currentTime = new Date();
  let greeting;

  if (currentTime.getHours() < 12) {
    greeting = 'Good Morning';
  } else if (currentTime.getHours() < 18) {
    greeting = 'Good Afternoon';
  } else {
    greeting = 'Good Evening';
  }

  return (
    <View style={styles.container}>
      <View style={styles.logoutContainer}>
        <Button title="Logout" onPress={handleLogout} color="#ff0000" />
      </View>

      <View style={styles.centeredContent}>
        <Text style={styles.greeting}>{`${greeting}, ${firstName} ${lastName}`}</Text>
        <Text style={styles.message}>Welcome to our app!</Text>
        <Button title="Profile" onPress={handleProfile} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
  },
  logoutContainer: {
    position: 'absolute',
    top: 16,
    right: 16,
  },
  centeredContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  greeting: {
    fontSize: 24,
    marginBottom: 12,
  },
  message: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 24,
  },
});

export default WelcomeScreen;

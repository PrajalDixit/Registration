import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
import auth from '@react-native-firebase/auth';
import { LoginManager, AccessToken } from 'react-native-fbsdk-next';
import axios from 'axios';
import { appleAuth } from '@invertase/react-native-apple-authentication';

const LoginScreen = ({ navigation }) => {
  const [mobileNumber, setMobileNumber] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    GoogleSignin.configure({
      webClientId: '726127514714-7gne6jfumlev95e2mgp8ht9o6jg3linc.apps.googleusercontent.com'
    });
  }, []);

  const signIn = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      await GoogleSignin.signOut();
      const userInfo = await GoogleSignin.signIn();
      navigation.navigate('WelcomeScreen', { firstName: userInfo.user.givenName, lastName: userInfo.user.familyName });
    } catch (error) {
      console.error('Google Sign-In error:', error);
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
      } else if (error.code === statusCodes.IN_PROGRESS) {
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
      } else {
      }
    }
  };

  const FacebookLogin = async () => {
    const userInfo = await LoginManager.logInWithPermissions(['public_profile', 'email']);
    navigation.navigate('WelcomeScreen', { firstName: userInfo.user.firstNameName, lastName: userInfo.user.lastName });
    if (result.isCancelled) {
      throw 'User cancelled the login process';
    }
  
    const data = await AccessToken.getCurrentAccessToken();
  
    if (!data) {
      throw 'Something went wrong obtaining access token';
    }
  
    const facebookCredential = auth.FacebookAuthProvider.credential(data.accessToken);
  
    return auth().signInWithCredential(facebookCredential);
  }

  const AppleLogin = async () => {
    // performs login request
    const appleAuthRequestResponse = await appleAuth.performRequest({
      requestedOperation: appleAuth.Operation.LOGIN,
      // Note: it appears putting FULL_NAME first is important, see issue #293
      requestedScopes: [appleAuth.Scope.FULL_NAME, appleAuth.Scope.EMAIL],
    });
  
    // get current authentication state for user
    // /!\ This method must be tested on a real device. On the iOS simulator it always throws an error.
    const credentialState = await appleAuth.getCredentialStateForUser(appleAuthRequestResponse.user);
  
    // use credentialState response to ensure the user is authenticated
    if (credentialState === appleAuth.State.AUTHORIZED) {
      // user is authenticated
    }
  }

  const handleLogin = async () => {
    try {
      const response = await axios.post('http://192.168.29.217:3001/login', {
        mobileNumber,
        password,
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      console.log(response.data);
  
      if (response.status === 200) {
        navigation.navigate('WelcomeScreen', {
          firstName: response.data.firstName,
          lastName: response.data.lastName,
          id: response.data.id,
          mobileNumber: response.data.mobileNumber,
        });
      } else {
        alert(response.data.message || 'Login failed');
      }
    } catch (error) {
      console.error('Error during login:', error);
      alert('Login failed. Please try again.');
    }
  };

  const handleRegister = () => {
    navigation.navigate('RegistrationScreen');
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.card}>
        <Text style={styles.label}>Mobile Number</Text>
        <TextInput
          style={styles.input}
          value={mobileNumber}
          onChangeText={setMobileNumber}
          keyboardType="numeric"
        />
        <Text style={styles.label}>Password</Text>
        <TextInput
          style={styles.input}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        <TouchableOpacity onPress={handleLogin} style={styles.loginButton}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleRegister}>
          <Text style={styles.linkText}>Register</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.socialButtonsContainer}>
        <TouchableOpacity style={styles.googleButton} onPress={signIn}>
          <Text style={styles.buttonText}>Sign in with Google</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.facebookButton} onPress={FacebookLogin}>
          <Text style={styles.buttonText}>Sign in with Facebook</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={AppleLogin} style={styles.loginButton}>
          <Text style={styles.buttonText}>Sign in with Apple</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 16,
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  card: {
    backgroundColor: '#f0f0f0',
    padding: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    marginBottom: 20,
  },
  label: {
    fontSize: 18,
    marginBottom: 8,
    color: '#333',
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 8,
    borderRadius: 4,
  },
  linkText: {
    fontSize: 16,
    color: 'blue',
    textDecorationLine: 'underline',
    marginBottom: 12,
  },
  socialButtonsContainer: {
    alignItems: 'center',
  },
  googleButton: {
    backgroundColor: '#dd4b39',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 4,
    marginBottom: 12,
  },
  facebookButton: {
    backgroundColor: '#3b5998',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 4,
    marginBottom: 12,
  },
  buttonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  loginButton: {
    backgroundColor: '#000',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 4,
    marginBottom: 12,
  }
});

export default LoginScreen;

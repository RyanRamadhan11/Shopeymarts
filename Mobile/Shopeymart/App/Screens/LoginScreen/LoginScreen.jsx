import React, { useState } from 'react';
import { View, Text, TextInput, Image, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import Color from '../../Utils/Color';
import * as WebBrowser from "expo-web-browser";
import { useOAuth } from "@clerk/clerk-expo";
import { useWarmUpBrowser } from "../../hooks/warmUpBrowser";
import axios from 'axios';

import AsyncStorage from '@react-native-async-storage/async-storage';

import { Entypo } from '@expo/vector-icons';
WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen({navigation}) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { startOAuthFlow } = useOAuth({ strategy: "oauth_google" });

  // const navigation = useNavigation();  // Uncomment this line

  useWarmUpBrowser();

  const handleLogin = async () => {
    try {
      const apiUrl = 'http://10.10.100.234:8080/api/auth/login';
  
      const response = await axios.post(apiUrl, {
        username,
        password,
      });
  
      if (response.status === 200) {
        Alert.alert(
          'Login Berhasil',
          'Selamat datang kembali, ' + response.data.data.username + '!',
          [{ text: 'OK', onPress: () => console.log('OK Ditekan') }],
          { cancelable: false }
        );
  
        // Simpan token atau sesi pengguna menggunakan AsyncStorage
        await AsyncStorage.setItem('userToken', response.data.data.token);
        await AsyncStorage.setItem('username', response.data.data.username);
        await AsyncStorage.setItem('role', response.data.data.role);

        // Mendapatkan token dari AsyncStorage dan mencetaknya
        const storedToken = await AsyncStorage.getItem('userToken');
        const storedData = await AsyncStorage.getItem('username');
        console.log('Token yang disimpan:', storedToken);
        console.log('Data yang disimpan:', storedData);
  
         // Redirect ke halaman home screen
         navigation.navigate('Home');
      } else {
        const errorMessage = response.data.message || 'Login Gagal. Silakan coba lagi.';
        Alert.alert(
          'Login Gagal',
          errorMessage,
          [{ text: 'OK', onPress: () => console.log('OK Ditekan') }],
          { cancelable: false }
        );
      }
    } catch (error) {
      console.error('Kesalahan API', error);
      Alert.alert(
        'Error',
        'Terjadi kesalahan. Silakan coba lagi.',
        [{ text: 'OK', onPress: () => console.log('OK Ditekan') }],
        { cancelable: false }
      );
    }
  };
  
  const handleRegister = () => {
    navigation.navigate("register");
  };
  
  const onPress = async () => {
    try {
      const { createdSessionId, signIn, signUp, setActive } = await startOAuthFlow();
      if (createdSessionId) {
        setActive({ session: createdSessionId });
      } else {
      }
    } catch (err) {
      console.error("OAuth error", err);
    }
  };

  return (
    <View style={styles.container}>
    <Image
      source={require('../../../assets/online.png')}
      style={styles.logo}
    />
    <Text style={{textAlign: 'center', paddingBottom: 30, color: '#fff', fontSize: 18, fontFamily: 'outfit-medium'}}>Login Shopeymart</Text>
    <Text style={styles.label}>Username</Text>
    <TextInput
      style={styles.input}
      placeholder="Enter your username"
      onChangeText={(text) => setUsername(text)}
    />
    <Text style={styles.label}>Password</Text>
    <TextInput
      style={styles.input}
      placeholder="Enter your password"
      secureTextEntry
      onChangeText={(text) => setPassword(text)}
    />
    <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
      <Text style={styles.loginButtonText}>Login</Text>
    </TouchableOpacity>

    <TouchableOpacity style={styles.forgotPassword}>
      <Text style={{ color: '#fff', fontSize: 14 }}>Forgot Password?</Text>
    </TouchableOpacity>

    <TouchableOpacity style={styles.button} onPress={onPress}>
      <View style={styles.buttonContent}>
        <Image
          source={require('../../../assets/img/gogle.png')}
          style={styles.googleLogo}
        />
        <Text style={styles.loginWithGoogleText}>Login With Google</Text>
      </View>
    </TouchableOpacity>

    <TouchableOpacity  onPress={handleRegister}>
      <Text style={styles.signUpText}>
        Don't have an account? Sign Up
      </Text>
    </TouchableOpacity>

  </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Color.PRIMARY, // Use your primary color
    padding: 20,
  },
  logo: {
    width: 170,
    height: 170,
    borderRadius: 60,
    marginBottom: 20,
  },
  input: {
    height: 40,
    width: '100%',
    backgroundColor: Color.WHITE,
    color: Color.BLACK,
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
    paddingLeft: 10,
  },
  label: {
    color: Color.WHITE,
    fontSize: 16,
    marginBottom: 5,
    alignSelf: 'flex-start',
  },
  loginButton: {
    backgroundColor: Color.WHITE, // Use your tertiary color
    paddingVertical: 10,
    borderRadius: 5,
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    marginTop: 20,
  },
  loginButtonText: {
    color: Color.PRIMARY,
    fontWeight: 'bol',
    fontSize: 16,
    textAlign: 'center',
    fontFamily: 'outfit-bold'
  },
  forgotPassword: {
    marginTop: 10,
    alignSelf: 'flex-end',
  },
  signUpText: {
    marginTop: 20,
    color: Color.WHITE,
  },
  button: {
    marginTop: 20,
    padding: 15,
    backgroundColor: 'white',
    borderRadius: 5,
    width: '100%',
    flexDirection: 'row', // Make it a row layout
    alignItems: 'center', // Center items vertically
    justifyContent: 'center', // Center items horizontally
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  googleLogo: {
    width: 24,
    height: 24,
    marginRight: 10, // Add margin for spacing
  },
  loginWithGoogleText: {
    textAlign: 'center',
    fontSize: 16,
    color: Color.PRIMARY,
    fontFamily: 'outfit-medium'
  },

});

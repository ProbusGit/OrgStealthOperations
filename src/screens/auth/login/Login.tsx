
import React, { useEffect, useState } from 'react';
import {
  KeyboardAvoidingView,
  ScrollView,
  View,
  Platform,
  Alert,
  StyleSheet,
  BackHandler
} from 'react-native';
import { Button, Divider, TextInput } from 'react-native-paper';
import { Text } from '../../../components/Text/Text';
import theme, { useAppTheme } from '../../../theme';
import Metrics from '../../../theme/metrics/screen';
import { screenNames, RootStackParamList } from '../../../navigation/rootNavigator/types';
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useLoginMutation } from '../../../redux/services/auth/login/LoginApiSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import messaging from '@react-native-firebase/messaging';
import { mmkvKeys } from '../../../common';
import {useAppDispatch, useAppSelector} from '../../../redux/hooks/hooks';

const Login = () => {
  const [userID, setUserID] = useState('');
  const [password, setPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [login, { isLoading }] = useLoginMutation();
  const navigation = useNavigation();

  useEffect(()=>{
    getFCMToken()
  },[])
  const handleLogin = async () => {
    if (!userID || !password) {
      Alert.alert('Error', 'Please enter both username and password.');
      return;
    }

    try {
      console.log('Login attempt with userID:', userID, 'password:', password)
      const response = await login({ userID, password }).unwrap();
      await AsyncStorage.setItem('employeeId', response?.data?.employeeId.toString() || '');
      await AsyncStorage.setItem('userID', userID);
      await AsyncStorage.setItem('password', password);
      await AsyncStorage.setItem('WebUrl', `https://ekstasis.net/area_officer/Home/AppCall/?UserName=${userID}&Password=${password}`);
      await AsyncStorage.setItem('credentials', JSON.stringify({ employeeId: response?.data?.employeeId.toString(), userID, password }));
      navigation.replace(screenNames.myWebView);
    } catch (error) {
      Alert.alert('Error', 'Failed to login. Please check your credentials and try again.');
    }
  };
  async function getFCMToken() {
    try {
      let token = null;
        console.log('authStatus==',)
      token = await messaging().getToken();
      console.log('authStatus= token=', token)

      if (messaging().isDeviceRegisteredForRemoteMessages) {
          await messaging().registerDeviceForRemoteMessages();
          token = await messaging().getToken();
      }
      console.log('token=== abc', token)
      setFcmToken(token)
      const authStatus = await messaging().requestPermission();
      console.log('authStatus===')

      const enabled =
          authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
          authStatus === messaging.AuthorizationStatus.PROVISIONAL;
      if (enabled) {
          console.log('Authorization status:', authStatus);
          //   getFcmToken();
      }
      console.log("FCM Token:", token); // Send to your server
    } catch (error) {
      console.error("Error getting token:", error);
    }
  }

  return (
    <KeyboardAvoidingView behavior="padding" style={{ flex: 1 }}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
        <View style={styles.container}>
          <View style={styles.card}>
            <Text variant="displaySmall" style={styles.title}>Stealth Ops</Text>
            <Text variant="displaySmall" style={styles.loginText}>Login</Text>
            <View style={styles.inputContainer}>
              <TextInput
                mode="flat"
                style={styles.inputText}
                placeholder="UserName"
                value={userID}
                onChangeText={setUserID}
              />
              <TextInput
                mode="flat"
                style={styles.inputText}
                placeholder="Password"
                secureTextEntry={!passwordVisible}
                value={password}
                onChangeText={setPassword}
                right={<TextInput.Icon icon={() => <Ionicons name={passwordVisible ? 'eye-off' : 'eye'} size={20} />} onPress={() => setPasswordVisible(!passwordVisible)} />}
              />
              <Button mode="contained" loading={isLoading} onPress={handleLogin} disabled={isLoading}>Login</Button>
              <Divider />
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.surface,
  },
  title: {
    textAlign: 'center',
    marginTop: '10%',
    color: theme.colors.onBackground,
    fontWeight: '700',
    fontSize: 25,
  },
  loginText: {
    textAlign: 'center',
    marginTop: '10%',
    color: theme.colors.onBackground,
    fontWeight: '900',
  },
  inputContainer: {
    marginTop: 40,
    gap: 20,
    backgroundColor: theme.colors.background,
  },
  inputFieldsContainer: {
    gap: 5,
    backgroundColor: theme.colors.background,
  },
  card: {
    backgroundColor: theme.colors.background,
    width: '85%',
    alignSelf: 'center',
    borderRadius: 26,
    padding: 20,
    // top: -Metrics.screenHeight /76 ,
    marginTop:125,
    borderWidth: 1,
    borderColor: 'grey',
    paddingBottom: 60,
    shadowColor: theme.colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.4,
    shadowRadius: 1,
    elevation: 4,
  },
  inputText: {
    textTransform: 'uppercase',
    backgroundColor: theme.colors.background,
    color: theme.colors.onBackground,
  },
});

export default Login;



































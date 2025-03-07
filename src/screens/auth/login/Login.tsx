
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

import { mmkvKeys } from '../../../common';
import {useAppDispatch, useAppSelector} from '../../../redux/hooks/hooks';

const Login: React.FC = () => {
  const theme = useAppTheme();
  const navigation = useNavigation<RootStackParamList>();

  const [userID, setUserID] = useState('');
  const [password, setPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);

  const [login, { isLoading }] = useLoginMutation();



    useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      // Exit the app when back button is pressed
      BackHandler.exitApp();
      return true;
    });

    // Clean up the event listener when the component is unmounted
    return () => backHandler.remove();
  }, []);



  const handleLogin = async () => {
    if (!userID || !password) {
      Alert.alert('Error', 'Please enter both username and password.');
      return;
    }
  
    console.log('Attempting login with:', { userName: userID, password });
  
    try {
      const response = await login({  userID, password }).unwrap();
      console.log('Login successful', response);
  
      // Save employeeId to AsyncStorage
      await AsyncStorage.setItem('employeeId', response?.data?.employeeId.toString()??'');
      await AsyncStorage.setItem('userID', userID);
      await AsyncStorage.setItem('password', password);
      console.log('Credentials set in AsyncStorage');
  
      Alert.alert('Success', 'Login successful!');
      navigation.navigate(screenNames.myWebView);
    } catch (error) {
      console.error('Login error', error);
      Alert.alert('Error', 'Failed to login. Please check your credentials and try again.');
    }
  };

  

  return (
    <KeyboardAvoidingView
      // behavior={Platform.OS === 'ios' ? 'padding' : undefined}
       behavior="padding"
      style={{ flex: 1 }}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled">
        <View style={styles.container}>
          <View style={styles.card}>
            <Text variant="displaySmall" style={styles.title}>
            Stealth Ops
            </Text>
            <Text variant="displaySmall" style={styles.loginText}>
              Login
            </Text>
            <View style={styles.inputContainer}>
              <View style={styles.inputFieldsContainer}>
                <TextInput
                  mode="flat"
                  style={styles.inputText}
                  placeholder="UserName"
                  value={userID}
                  onChangeText={setUserID}
                  outlineColor={theme.colors.outline}
                />
              </View>
              <View style={styles.inputFieldsContainer}>
                <TextInput
                  mode="flat"
                  style={styles.inputText}
                  placeholder="Password"
                  secureTextEntry={!passwordVisible}
                  value={password}
                  onChangeText={setPassword}
                  outlineColor={theme.colors.outline}
                  right={
                    <TextInput.Icon
                      icon={() => (
                        <Ionicons
                          name={passwordVisible ? 'eye-off' : 'eye'}
                          size={20}
                          color={theme.colors.text}
                        />
                      )}
                      onPress={() => setPasswordVisible(!passwordVisible)}
                    />
                  }
                />
              </View>
              <Button
                mode="contained"
                loading={isLoading}
                onPress={handleLogin}
                disabled={isLoading}>
                Login
              </Button>
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



































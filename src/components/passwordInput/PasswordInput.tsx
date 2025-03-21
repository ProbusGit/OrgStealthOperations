import React, {useState} from 'react';
import {TextInput, TextInputProps} from 'react-native-paper';
import theme, {useAppTheme} from '../../theme';

const PasswordInput = (props: TextInputProps) => {
const theme = useAppTheme();
  const [passwordVisible, setPasswordVisible] = useState<boolean>(false);

  const togglePassword = () => {
    setPasswordVisible(prev => !prev);
  };
  return (
    <TextInput
      mode="outlined"
      placeholder="Password"
      outlineColor={theme.colors.outline}
      {...props}
      secureTextEntry={!passwordVisible}
      right={
        <TextInput.Icon
        color={theme.colors.onBackground}
         style={{opacity:6}}
          icon={passwordVisible ? 'eye-off' : 'eye'}
          onPress={togglePassword}
        />
      }
    />
  );
};

export default PasswordInput;

import React from 'react';
import useStyles from './useStyles';
import { View } from 'react-native';
import { NativeStackHeaderProps } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Text from '../../../../components/Text';
import { useAppTheme } from '../../../../theme';
import { StackHeaderProps, StackNavigationOptions } from '@react-navigation/stack';
import { getHeaderTitle } from '@react-navigation/elements';
import { useNavigation } from '@react-navigation/native';
import { NavigationActionType, screenNames } from '../../types';
import { Badge } from 'react-native-paper';

const Header: React.FC<StackHeaderProps> = ({ navigation, route, options, back }) => {
  const styles = useStyles();
  const theme = useAppTheme();
  const title = getHeaderTitle(options, route.name);

  return (
    <View style={styles.container}>
      {back && (
        <Icon
          name="arrow-left-bold"
          color={theme.colors.onPrimary}
          onPress={() => navigation.goBack()}
          size={32}
        />
      )}
      <Text style={styles.headerText}>{title}</Text>
    </View>
  );
};

export default Header;























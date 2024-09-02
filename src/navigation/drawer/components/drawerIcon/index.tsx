import React, {Children, ReactNode} from 'react';
import useStyles from './useStyles';
import {View} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
type Props = {};

const DrawerIcon = ({color, size, focused}) => {
  const styles = useStyles();
  return (
    <View style={[styles.container, {}]}>
      <Icon name="rupee" size={size} color={'white'} />
    </View>
  );
};

export default DrawerIcon;

import * as React from 'react';
import {Button, View} from 'react-native';
import {createDrawerNavigator} from '@react-navigation/drawer';
import Home from '../../screens/checkin';
import Profile from '../../screens/profile';
import BottomNavigator from '../bottomNavigator';
import {NavigationContainer} from '@react-navigation/native';
import RootNavigator from '../rootNavigator/RootNavigator';
import DrawerContent from './components/drawerContent';
import Icon from 'react-native-vector-icons/FontAwesome';

import DrawerIcon from './components/drawerIcon';
import {useAppTheme} from '../../theme';

const Drawer = createDrawerNavigator();

export default function DrawerNavigator() {
  const theme = useAppTheme();
  return (
    <NavigationContainer>
      <Drawer.Navigator
        screenOptions={{
          drawerType: 'front',
          gestureHandlerProps: {},
        }}
        initialRouteName="Home"
        drawerContent={props => <DrawerContent {...props} />}>
        <Drawer.Screen
          name="Home"
          options={{
            headerShown: false,
            drawerIcon: ({color, size, focused}) => (
              <Icon size={size} name={'home'} />
            ),
          }}
          component={RootNavigator}
        />
      </Drawer.Navigator>
    </NavigationContainer>
  );
}

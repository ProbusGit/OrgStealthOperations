import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import LogoutScreen from '../../screens/logout';
import AutoLoginWebView from '../../components/webView';
import { CommonActions, useNavigation, useRoute } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { BottomNavigation } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import CheckInScreen from '../../screens/checkin';

const Tab = createBottomTabNavigator();

export default function MyComponent() {
  const [userId, setUserId] = useState<string | undefined>(undefined);
  const [homeKey, setHomeKey] = useState(0); // Key to force re-render of AutoLoginWebView

  const navigation = useNavigation();
  const route = useRoute();

  return (
    <Tab.Navigator
      initialRouteName={route.params ? route.params?.nextScreen:'Home'} // Default to Home
      screenOptions={{
        headerShown: false,
      }}
      tabBar={({ navigation, state, descriptors, insets }) => (
        <BottomNavigation.Bar
          navigationState={state}
          safeAreaInsets={insets}
          onTabPress={({ route, preventDefault }) => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (event.defaultPrevented) {
              preventDefault();
            } else {
              if (route.name === 'Home') {
                // Refresh AutoLoginWebView by updating the key
                setHomeKey(prevKey => prevKey + 1);
              }

              if (route.name === 'Profile' && userId) {
                navigation.dispatch({
                  ...CommonActions.navigate(route.name, { userId }),
                  target: state.key,
                });
              } else {
                navigation.dispatch({
                  ...CommonActions.navigate(route.name, route.params),
                  target: state.key,
                });
              }
            }
          }}
          renderIcon={({ route, focused, color }) => {
            const { options } = descriptors[route.key];
            if (options.tabBarIcon) {
              return options.tabBarIcon({ focused, color, size: 24 });
            }

            return null;
          }}
          getLabelText={({ route }) => {
            const { options } = descriptors[route.key];
            return options.tabBarLabel ?? options.title ?? route.title;
          }}
        />
      )}
    >
      <Tab.Screen
        name="Home"
        children={() => <AutoLoginWebView key={homeKey} />} // Force refresh with key
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ color, size }) => <Icon name="home" size={size} color={color} />,
        }}
      />

      <Tab.Screen
        name="Logout"
        component={LogoutScreen}
        options={{
          tabBarLabel: 'Logout',
          tabBarIcon: ({ color, size }) => <Icon name="logout" size={size} color={color} />,
        }}
      />

      <Tab.Screen
        name="CheckIn"
        component={CheckInScreen}
        options={{
          tabBarLabel: 'Check In',
          tabBarIcon: ({ color, size }) => (
            <Icon name="swap-horizontal" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

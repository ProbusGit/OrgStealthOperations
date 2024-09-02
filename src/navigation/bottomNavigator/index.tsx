import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Profile from '../../screens/profile';
import LogoutScreen from '../../screens/logout';
import NotificationScreen from '../../screens/notification';
import AutoLoginWebView from '../../components/webView';
import { CommonActions, useNavigation, useRoute } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text, BottomNavigation } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const Tab = createBottomTabNavigator();

export default function MyComponent() {
  const [userId, setUserId] = useState<string | undefined>(undefined);

  const navigation = useNavigation();
  const route = useRoute();

  // useEffect(() => {
  //   if (route.params?.userId) {
  //     setUserId(route.params.userId);
  //   }
  // }, [route.params?.userId]);

  return (
    <Tab.Navigator
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
            const label =
              options.tabBarLabel !== undefined
                ? options.tabBarLabel
                : options.title !== undefined
                ? options.title
                : route.title;

            return label;
          }}
        />
      )}
    >
      <Tab.Screen
        name="Home"
        component={AutoLoginWebView}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ color, size }) => {
            return <Icon name="home" size={size} color={color} />;
          },
        }}
        // initialParams={{ setUserId }} // Pass the setUserId function to AutoLoginWebView
      />

<Tab.Screen
        name="Logout"
        component={LogoutScreen}
        options={{
          tabBarLabel: 'Logout',
          tabBarIcon: ({ color, size }) => {
            return <Icon name="logout" size={size} color={color} />;
          },
        }}
      />
    
      <Tab.Screen
        name="Notification"
        component={NotificationScreen}
        options={{
          tabBarLabel: 'Notification',
          tabBarIcon: ({ color, size }) => {
            // return <Icon name="account" size={size} color={color} />;
            return<Icon
            name="bell"
            size={size}
            color={color}
            // onPress={() =>
            //   navigation.navigate(screenNames.notificationScreen)
            // }
          />
          

          
          
          },
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

// import React from 'react';
// import useStyles from './useStyles';
// import {View,TouchableOpacity,Image } from 'react-native';
// import {NativeStackHeaderProps} from '@react-navigation/native-stack';
// import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
// import Text from '../../../../components/Text';
// import {useAppTheme} from '../../../../theme';
// import {StackHeaderProps, StackNavigationOptions} from '@react-navigation/stack';
// import {getHeaderTitle} from '@react-navigation/elements';
// import {useNavigation} from '@react-navigation/native';
// import { NavigationActionType, screenNames } from '../../../../navigation/rootNavigator/types';
// // import {useGetNotificationCountQuery} from '../../../../redux/services/notifications';
// import {Badge} from 'react-native-paper';

// const Header: React.FC<StackHeaderProps> = ({ back}) => {
//   const styles = useStyles();
//   const theme = useAppTheme();
//   const navigation = useNavigation<RootStackParamList>();
//   // const title = getHeaderTitle(options, route.name);
//   // const {data: ntfCount} = useGetNotificationCountQuery(null);
//   return (
//     <View style={styles.container}>
//       {back && (
//         <Icon
//           name="chevron-left"
//           color={theme.colors.onPrimary}

//           onPress={() => navigation.goBack()}
//           size={32}
//         />
//       )}
//       <Text style={styles.headerText}>Holi Cross</Text>

//         <View style={styles.notificationContainer}>

//           <Icon
//             name="bell"
//             onPress={() =>    navigation.replace(screenNames.profile)}
//             color={theme.colors.onPrimary}
//             size={32}
//           />
//                 <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
//           <Image
//             source={{ uri: 'https://via.placeholder.com/150' }} // Replace with your profile image URL
//             style={{   width: 32,
//               height: 32,
//               borderRadius: 16,
//               marginLeft: 10,}}
//           />
//         </TouchableOpacity>

//         </View>

//     </View>
//   );
// };

// export default Header;

import React, {useEffect, useState} from 'react';
import {View, TouchableOpacity, Image} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Text from '../../../../components/Text';
import {useAppTheme} from '../../../../theme';
import useStyles from './useStyles';
import {useAppSelector} from '../../../../redux/hooks/hooks';
import {useLazyGetUserDetailsQuery} from '../../../../redux/services/user/userApiSlice';
import {UserDetails} from '../../../../redux/services/user/types';
import {
  RootStackParamList,
  screenNames,
} from '../../../../navigation/rootNavigator/types';

const Header: React.FC<{userId: string}> = ({userId}) => {
  const styles = useStyles();
  const theme = useAppTheme();
  const navigation = useNavigation<RootStackParamList>();
  const {employeeDetails} = useAppSelector(state => state.employee);
  const [userDetails, setUserDetails] = useState<UserDetails>();
  const [getUserDetails, {data: userDetailsResult, isLoading}] =
    useLazyGetUserDetailsQuery();

  useEffect(() => {
    console.log('Employee Details:', employeeDetails);
    console.log('User ID:', userId);
    if (userId) {
      fetchUserDetails();
    } else {
      setUserDetails(employeeDetails);
    }
  }, [employeeDetails, userId]);

  const fetchUserDetails = async () => {
    try {
      const userData = await getUserDetails(userId).unwrap();
      if (userData?.data) {
        setUserDetails(userData.data);
        console.log('User Details:', userData.data);
      }
    } catch (error) {
      console.error('Failed to fetch user details:', error);
    }
  };

  return (
    // <View style={styles.container}>
    <View style={{backgroundColor: theme.colors.primary}}>
      {/* <Text
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: 16,
          backgroundColor: theme.colors.primary,
        }}>
        Welcome
      </Text> */}
      <View>
        <Text
          style={{
            color: theme.colors.onPrimary,
            fontSize: 24,
            marginLeft:10,
            alignItems: 'center',
            marginTop:5
          }}>
          Welcome
        </Text>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
          <Text style={styles.headerText}>{userDetails?.employeeName}</Text>
          <View style={styles.notificationContainer}>
            {/* <Icon
              name="bell"
              // onPress={() => navigation.replace(screenNames.profile)}
              color={theme.colors.onPrimary}
              size={32}
            /> */}
            {/* <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
          <Image
            source={{ uri: 'https://via.placeholder.com/150' }} // Replace with your profile image URL
            style={{
              width: 32,
              height: 32,
              borderRadius: 16,
              marginLeft: 10,
            }}
          />
        </TouchableOpacity> */}
          </View>
        </View>
      </View>
    </View>
  );
};

export default Header;












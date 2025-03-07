import React from 'react';
import {
  ImageBackground,
  Pressable,
  Text,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import useStyles from './useStyles';
// import FastImage from 'react-native-fast-image';
import useHeader from './useHeader';
import {Searchbar} from 'react-native-paper';
import LinearGradient from 'react-native-linear-gradient';
// import greetUser from './greeting';
import {DrawerActions, useNavigation} from '@react-navigation/native';
import { screenNames, NavigationActionType } from '../../navigation/rootNavigator/types';
// import {
//   NavigationActionType,
//   screenNames,
// } from '../navigation/rootNavigator/types';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
// import {no_profile} from '../../assets/images';
import {useMMKV} from 'react-native-mmkv';
import {baseApi} from '../../redux/services/BaseApiSlice';
import {useAppDispatch} from '../../redux/hooks/hooks';
// import {baseApiTags} from '../../common/constants/api/tags';
let ReactNativeForegroundService = Platform.OS === 'android' ? require('@supersami/rn-foreground-service').default : null;
type Props = {};

const Header = (props: Props) => {
  const storage = useMMKV();
  const styles = useStyles();
  // const {employeeDetails, ntfCount} = useHeader();
  // const {message, image} = greetUser();
  const navigation = useNavigation<NavigationActionType>();
  const dispatch = useAppDispatch();
  const handleProfileImagePress = () => {
    // Navigate to the user profile screen, you can pass parameters if needed
    // navigation.navigate(screenNames.profile, {userId: null});
  };

  const handleLogout = () => {
    // dispatch(baseApi.util.invalidateTags(baseApiTags));
    ReactNativeForegroundService.stopAll();
    // Clear MMKV storage
    storage.clearAll();
    // Navigate to the login screen
    navigation.navigate(screenNames.login);
  };

  return (
    <ImageBackground
      blurRadius={0.8}
      style={styles.headerImageBackgroundView}
      imageStyle={styles.headerImage}
  >
      <View style={styles.parentContainer}>
        <View style={styles.headerContainer}>
          <View style={styles.rowLeftContainer}>
            {/* <Icon
              name="menu"
              onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())}
              size={22}
              color={'#ffffff'}
            /> */}
            <View style={styles.userGreetContainer}>
              <Text style={styles.greetText}>fdf</Text>
              {/* <Text style={styles.usernameText}>
                {employeeDetails?.employeeName
                  ? employeeDetails?.employeeName
                  : 'User'}
              </Text> */}
            </View>
          </View>
          <View style={styles.rowRightContainer}>
            <TouchableWithoutFeedback
              onPress={() =>
                navigation.navigate(screenNames.notificationScreen)
              }>
              {/* <View style={styles.bellIconContainer}>
                <Icon name="bell" size={22} color={'#ffffff'} />

                {ntfCount ? (
                  <View style={styles.notificationBadge}>
                    <Text style={styles.notificationText}>{ntfCount}</Text>
                  </View>
                ) : (
                  <></>
                )}
              </View> */}
            </TouchableWithoutFeedback>

            {/* <Pressable onPress={handleProfileImagePress}>
              <FastImage
                resizeMode="cover"
                style={styles.profileImage}
                source={
                  employeeDetails?.photo
                    ? {uri: employeeDetails.photo}
                    : no_profile
                }
              />
            </Pressable> */}

            <TouchableWithoutFeedback onPress={handleLogout}>
              <View style={{}}>
                <Icon name="logout" size={22} color={'#ffffff'} />
              </View>
            </TouchableWithoutFeedback>
          </View>
        </View>
        {/* <Searchbar
          value=""
          mode="view"
          placeholder="Search Employees"
          editable={false}
          style={styles.searchBar}
          inputStyle={styles.searchText}
        /> */}
      </View>
    </ImageBackground>
  );
};

export default Header;

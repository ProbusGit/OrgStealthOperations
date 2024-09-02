import {
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
  DrawerContentComponentProps,
} from '@react-navigation/drawer';
import {Linking, Text, TouchableOpacity, View} from 'react-native';
import useStyles from './useStyle';
import {screenNames} from '../../../rootNavigator/types';
import Icon from 'react-native-vector-icons/FontAwesome';
import {useMMKV} from 'react-native-mmkv';
import {CommonActions} from '@react-navigation/native';
function DrawerContent(props: DrawerContentComponentProps) {
  const storage = useMMKV();
  const handleLogout = () => {
    // Handle logout logic here
    // For example, navigate to the login screen
    storage.clearAll();
    props.navigation.closeDrawer();
    // Reset navigation stack and navigate to login screen
    props.navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{name: screenNames.login}],
      }),
    );
  };
  const styles = useStyles();
  return (
    <DrawerContentScrollView {...props} style={styles.scrollViewContainer}>
      <View style={styles.headerContainer}></View>
      <DrawerItemList {...props} />
      {/* Logout button */}
      <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
        <Icon name="sign-out" size={20} color="#000" />
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </DrawerContentScrollView>
  );
}

export default DrawerContent;

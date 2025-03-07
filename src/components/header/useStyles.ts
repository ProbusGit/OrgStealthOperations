import {StyleSheet} from 'react-native';
import { useAppTheme } from '../../theme';


const useSyles = () => {
  const theme = useAppTheme();
  return StyleSheet.create({
    scrollContainer: {
      flex: 1,
    },
    parentContainer: {
      padding: 20,
    },
    headerImageBackgroundView: {
      width: '100%',
      paddingVertical:10
    },
    
    headerImage: {
      objectFit: 'cover',
      resizeMode: 'contain',
      borderBottomLeftRadius:20,
      borderBottomRightRadius:20
    },
    headerContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 10,
    },
    bellIconContainer: {
      position: 'relative',
    },
    notificationText: {
      color: 'white',
      fontSize: 10,
      fontWeight: 'bold',
    },
    notificationBadge: {
      position: 'absolute',
      top: -5,
      right: -10,
      minWidth: 16,
      height: 16,
      borderRadius: 8,
      backgroundColor: theme.colors.primary,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 3,
    },
 
    rowLeftContainer: {
      flexDirection: 'row',
      gap: 10,
      flex: 1,
      alignItems: 'center',
    },
    rowRightContainer: {
      flexDirection: 'row',
      gap: 15,
      alignItems: 'center',
    },
    userGreetContainer: {
      flexDirection: 'column',
      flex: 1,
    },
    greetText: {
      fontSize: 16,
      color: '#ffffff',
      fontWeight: 'bold',
    },
    usernameText: {
      fontSize: 12,
      color: '#ffffff',
    },
    profileImage: {
      height: 30,
      width: 30,
      borderRadius: 25,
      resizeMode: 'cover',
      borderColor:'white',
      borderWidth:1
    },
    searchBar: {
      borderRadius: 10,
      height: 50,
    },
    searchText: {
      flex: 1,
      alignSelf: 'center',
    },
  });
};
export default useSyles;












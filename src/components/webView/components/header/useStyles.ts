import {StyleSheet} from 'react-native';
import {useAppTheme} from '../../../../theme';

const useStyles = () => {
  const theme = useAppTheme();

  return StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: 5,
      backgroundColor: theme.colors.primary,
    },
    headerText: {
      color: theme.colors.onPrimary,
      fontSize: 20,

      padding: 10,
    },
    notificationContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    badge: {
      position: 'absolute',
      top: -4,
      right: -4,
      backgroundColor: 'blue',
      color: 'white',
      fontSize: 12,
      width: 20,
      height: 20,
      borderRadius: 10,
      justifyContent: 'center',
      alignItems: 'center',
    },
  });
};

export default useStyles;

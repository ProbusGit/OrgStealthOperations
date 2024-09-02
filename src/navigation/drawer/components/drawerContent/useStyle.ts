import {StyleSheet} from 'react-native';
import Metrics from '../../../../theme/metrics/screen';
import {useAppTheme} from '../../../../theme';

const useStyles = () => {
  const theme = useAppTheme();
  return StyleSheet.create({
    headerContainer: {},
    scrollViewContainer: {
      backgroundColor: theme.colors.background,
    },
    logoutButton: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 10,
      paddingHorizontal: 20,
    },
    logoutText: {
      marginLeft: 10,
      fontSize: 16,
    },
  });
};
export default useStyles;

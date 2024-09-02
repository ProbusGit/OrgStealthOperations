import {StyleSheet} from 'react-native';
import {useAppTheme} from '../../theme';

const useStyles = () => {
  const theme = useAppTheme();
  return StyleSheet.create({
    container: {
      position: 'absolute',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 99999,
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: theme.colors.backdrop,
    },
    card: {
      width: 200,
      borderRadius: 10,
      padding: 20,
      justifyContent: 'center',
      backgroundColor: theme.colors.background,
    },
    indicatorContainer: {
      alignItems: 'center',
    },
    text: {
      marginTop: 10,
      fontSize: 16,
      color: theme.colors.onBackground,
      textAlign: 'center',
    },
  });
};
export default useStyles;

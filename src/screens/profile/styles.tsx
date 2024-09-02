import {StyleSheet} from 'react-native';
import Metrics from '../../theme/metrics/screen';
import fontStyles from '../../theme/fonts/fontStyles';
import {useAppTheme} from '../../theme';

const useStyles = () => {
  const theme = useAppTheme();
  return StyleSheet.create({
    container: {
      flex: 1,

      backgroundColor: 'red',
    },
    profileBackgroundContainer: {
      padding: 20,
    },

    headerContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    iconContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },

    profileTextContainer: {
      gap: 5,
    },
    profileIconsContainer: {
      justifyContent: 'space-between',
      flexDirection: 'row',
      gap: 20,
      padding: 10,
    },
    profileIconWrappper: {
      padding: 10,
      backgroundColor: theme.colors.primaryContainer,
      borderRadius: 50,
    },
    headerImg: {
      height: Metrics.screenHeight / 4,
      width: Metrics.screenWidth,
      padding: 10,
    },
    headerActionsContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    userInfoContainer: {
      alignItems: 'flex-start',
      gap: 5,
      margin: 30,
      marginRight: 0,
      flex: 1,
    },
    profileContainer: {
      alignSelf: 'center',
      gap: 10,
      alignItems: 'center',
    },
    userDetailContainer: {
      padding: 50,
      backgroundColor: theme.colors.background,
      gap: 30,
      height: 500,
    },
    userDetailsWrapper: {
      backgroundColor: theme.colors.background,
      flexDirection: 'row',
      gap: 20,
      alignItems: 'center',
    },
    profileWrapper: {
      backgroundColor: 'white',
      top: Metrics.screenHeight / 20,
      width: 150,
      height: 150,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 150 / 2,
    },
    profileImage: {
      width: 140,
      height: 140,
      borderWidth: 2,
      borderColor: theme.colors.onPrimary,
      borderRadius: 140 / 2,
    },
    userInfoContainerWrapper: {
      flexDirection: 'row',
      flex: 1,
    },

    userNameText: {
      color: theme.colors.background,
      fontSize: fontStyles.size.font18,
      fontWeight: '700',
      textAlign: 'center',
    },
    userRoleText: {
      color: '#FFFFFF',
      textAlign: 'center',
    },
    userDetailText: {
      color: theme.colors.onBackground,
    },
    userDepartmentText: {
      color: '#FFFFFF',
    },
    userGradeText: {
      color: '#FFFFFF',
    },

    userDetailsCard: {
      width: '95%',
      backgroundColor: '#FFFFFF',
      padding: 20,
      borderRadius: 30,
      marginTop: 50,
    },
    userDetailsContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    userDetailsTitleText: {
      flex: 1,
      padding: 10,
      fontWeight: 'bold',
    },
    userDetailsValueText: {
      flex: 1,
      padding: 10,
      fontWeight: 'bold',
    },
  });
};

export default useStyles;

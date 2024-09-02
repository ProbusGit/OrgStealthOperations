import {StyleSheet, Dimensions} from 'react-native';
const windowWidth = Dimensions.get('window').width;
const ITEM_CONTAINER_WIDTH = (windowWidth - 40) / 3 - 50; // Adjust as needed
const useStyles = () =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
    modalBackground: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    modalContainer: {
      flex: 1,
      justifyContent: 'flex-end',
      alignItems: 'center',
    },
    card: {
      width: Dimensions.get('window').width,
      backgroundColor: 'white',
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      padding: 20,
      height: Dimensions.get('window').height / 1.4, // 1/3 of the screen height
      position: 'absolute',
      bottom: 0,
    },
    sectionContainer: {
      marginVertical: 10,
    },
    sectionHeader: {
      fontSize: 18,
      fontWeight: 'bold',
      marginHorizontal: 10,
      marginBottom: 5,
      textTransform: 'capitalize',
    },
    sectionDescription: {
      fontSize: 14,
      color: '#888', // Adjust color
      marginHorizontal: 10,
      marginBottom: 10,
      textAlign: 'center', // Center the text
    },
    itemWrapper: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-around',
      paddingHorizontal: 5,
    },
    itemContainer: {
      alignItems: 'center',
      justifyContent: 'center',
      width: '45%',
      marginBottom: 10,
      paddingVertical: 10,
      borderRadius: 8,
      backgroundColor: '#f0f0f0',
    },
    iconContainer: {
      marginBottom: 5,
    },
    itemName: {
      textAlign: 'center',
    },
    cardHeader: {
      marginBottom: 10,
      alignItems: 'center',
    },
    cardTitle: {
      fontSize: 22,
      fontWeight: 'bold',
    },
  });
export default useStyles;

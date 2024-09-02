import {StyleSheet} from 'react-native';

const useStyles = () => {
  const CONTAINER_SIZE = 40;
  const RADIUS = CONTAINER_SIZE / 1.2;
  return StyleSheet.create({
    container: {
     backgroundColor:'#F59C1B',
     width: CONTAINER_SIZE,
     height:CONTAINER_SIZE,
     justifyContent:"center",
     alignItems:'center',
     borderRadius:10,
   
    },
  });
};
export default useStyles;

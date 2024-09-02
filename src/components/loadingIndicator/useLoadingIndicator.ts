import {useEffect, useRef} from 'react';
import {Animated} from 'react-native';
import {LoadingIndicatorProps} from './types';

const useLoadingIndicator = (loading: boolean) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    if (loading) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500, 
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }).start();
    }
  }, [loading]);
  return fadeAnim;
};
export default useLoadingIndicator;

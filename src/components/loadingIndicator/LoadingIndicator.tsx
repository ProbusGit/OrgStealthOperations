import React, {useRef, useEffect} from 'react';
import {View, StyleSheet, Animated} from 'react-native';
import {Card, Text, ActivityIndicator} from 'react-native-paper';
import {LoadingIndicatorProps} from './types';
import useStyles from './useStyles';
import useLoadingIndicator from './useLoadingIndicator';
import { useAppTheme } from '../../theme';

const LoadingIndicator: React.FC<LoadingIndicatorProps> = ({loading, text}) => {
  const styles = useStyles();
  const fadeAnim = useLoadingIndicator(loading);
  const theme=useAppTheme();
  return loading ? (
    <Animated.View style={[styles.container, {opacity: fadeAnim}]}>
      <Card style={styles.card}>
        <View style={styles.indicatorContainer}>
          <ActivityIndicator animating={true} color={theme.colors.primary}/>
          {text && <Text style={styles.text}>{text} ...</Text>}
        </View>
      </Card>
    </Animated.View>
  ) : (
    <></>
  );
};

export default LoadingIndicator;

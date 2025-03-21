import React from 'react';
import useSnackBar from './useSnackBar';
import {Portal, Snackbar} from 'react-native-paper';
import useStyles from './useStyles';
import {SnackBarTypes} from './types';

const SnackBar: React.FC<SnackBarTypes> = () => {
  const {visible, onDismissSnackBar, message} = useSnackBar();
  const styles = useStyles();
  return (
    <Portal>
      <Snackbar
        style={styles.container}
        visible={visible}
        onDismiss={onDismissSnackBar}
        duration={2000}
        action={{
          label: 'Dismiss',
        }}>
        {message}
      </Snackbar>
    </Portal>
  );
};

export default SnackBar;

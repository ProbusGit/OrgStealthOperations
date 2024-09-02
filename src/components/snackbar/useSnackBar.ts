import {useAppDispatch, useAppSelector} from '../../redux/hooks/hooks';
import {toggleSnackBarVisibility} from '../../redux/slices/snackbarSlice';

const useSnackBar = () => {
  const {visible,message} = useAppSelector(state => state.snackBar);
  const dispatch = useAppDispatch();
  const onDismissSnackBar = () => {
    dispatch(toggleSnackBarVisibility());
  };
  return {visible, onDismissSnackBar,message};
};
export default useSnackBar;

import {
  FCMError,
  registerAppWithFCM,
  getToken,
} from '../../../services/firebase/FCMService';
import {
  PermissionError,
  requestUserPermission,
  checkPermission,
} from '../../../services/firebase/permissions';

const handleFirebaseMessage = async (message: any) => {
  // Process the received message
  console.log('Received Firebase message:', message);
};

type ErrorType = FCMError | PermissionError | Error;

const initializeMessaging = async (): Promise<{
  permissionGranted: boolean;
  token: string | null;
  error: ErrorType | null;
}> => {
  try {
    await registerAppWithFCM();
    const permissionStatus = await checkPermission();
    const deviceToken = await getToken();
    return {
      permissionGranted: permissionStatus,
      token: deviceToken,
      error: null,
    };
  } catch (error: any) {
    const errorType =
      error instanceof PermissionError
        ? error
        : error instanceof FCMError
        ? error
        : new Error('Unknown error');
    return {
      permissionGranted: false,
      token: '',
      error: errorType,
    };
  }
};

export default initializeMessaging;

export {handleFirebaseMessage,initializeMessaging};

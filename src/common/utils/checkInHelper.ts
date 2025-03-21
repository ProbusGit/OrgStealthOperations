import Geolocation from 'react-native-geolocation-service';
import DeviceInfo from 'react-native-device-info';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const handleStartDay = async (startDay, trackTimeData, updateForeground, setSnackMessage) => {
  console.log('Start tracking');

  // Fetch employee ID from AsyncStorage
  let employeeId;
  try {
    employeeId = await AsyncStorage.getItem('employeeId');
    if (!employeeId) {
      console.error('No employeeId found in AsyncStorage');
      throw new Error('Employee ID not found');
    }
  } catch (error) {
    console.error('Failed to fetch employeeId from AsyncStorage:', error);
    throw error;
  }

  // Fetch device information
  let deviceInfo;
  try {
    const mid = await DeviceInfo.getUniqueId();
    const mip = await DeviceInfo.getIpAddress();
    deviceInfo = { mid, mip };
  } catch (err) {
    console.error('Failed to fetch device information:', err);
    throw err;
  }

  // Fetch current location
  let location;
  try {
    location = await new Promise((resolve, reject) => {
      Geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude.toString(),
            longitude: position.coords.longitude.toString(),
          });
        },
        (error) => {
          console.error('Failed to fetch location:', error);
          reject(error);
        },
        { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 },
      );
    });
  } catch (error) {
    console.error('Failed to fetch location:', error);
    throw error;
  }

  // Get current time
  const getCurrentTime = () => {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
  };

  const currentDate = new Date();
  const formattedDate = currentDate.toISOString().split('T')[0];
  const formattedTime = getCurrentTime();

  // Prepare payload for API call
  const payload = {
    mid: deviceInfo.mid,
    mip: deviceInfo.mip,
    hR_EMPMAIN_FormId: employeeId,
    inDate: formattedDate,
    inTime: formattedTime,
    inLat: location.latitude,
    inLong: location.longitude,
    status: 'in',
  };
  console.log('Start day payload:', payload);

  // Make API call to start the day
  try {
    const response = await startDay(payload).unwrap();
    console.log('Start day response:', response);
    setSnackMessage('Day started successfully');

    if (trackTimeData) {
      updateForeground(trackTimeData);
    }
  } catch (err) {
    console.error('Error during API call:', err);
    throw err;
  }
};
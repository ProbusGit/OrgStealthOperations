import {useState, useEffect, useCallback} from 'react';
import {findNearest, getDistance, LatLng} from 'geolib';
import Geolocation from '@react-native-community/geolocation';
import {
  promptForEnableLocationIfNeeded,
  isLocationEnabled,
} from 'react-native-android-location-enabler';
import {useGetAttendanceLocationsQuery} from '../../../redux/services/attendance/attendanceApiSlice';
import {
  check,
  request,
  PERMISSIONS,
  openSettings,
} from 'react-native-permissions';
import DeviceInfo from 'react-native-device-info'; // Import DeviceInfo
import {Alert} from 'react-native';
// import {isAndroid, isIos} from '../../utils/config';
import { isAndroid, isIos } from '../utils/config';
import GetLocation from 'react-native-get-location';

interface Location {
  siteid: number;
  locationName: string;
  gpsLat: string;
  gpsLog: string;
  radius: number;
}

interface LocationResponse {
  locations: Location[];
  shiftname: string;
}

interface NearestLocation extends LatLng {
  locationName: string;
  siteid: number;
  radius: number;
}

const useNearestLocation = () => {
  const {data: locationList} =
    useGetAttendanceLocationsQuery<LocationResponse>();
  const [currentLatitude, setCurrentLatitude] = useState<number | null>(null);
  const [currentLongitude, setCurrentLongitude] = useState<number | null>(null);
  const [locationStatus, setLocationStatus] = useState<string>('initial');
  const [isFetchingLocation, setIsFetchingLocation] = useState<boolean>(false);
  const [nearestLocation, setNearestLocation] =
    useState<NearestLocation | null>(null);
  const [distanceFromNearest, setDistanceFromNearest] = useState<number | null>(
    null,
  );
  const [inRange, setInRange] = useState<boolean>(false);
  const [isRecalculating, setIsRecalculating] = useState<boolean>(false);

  const checkAndRequestLocationPermission = async () => {
    try {
      const status = await check(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION); // Use the appropriate permission for your platform

      if (status === 'denied' || status === 'blocked') {
        // Request permission
        await request(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);

        // Check if permission was granted
        const newStatus = await check(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);
        if (newStatus === 'granted') {
          return await checkGpsStatus(); // Check GPS status
        } else if (newStatus === 'blocked') {
          Alert.alert(
            'Location permission is blocked. Please enable it in settings.',
          );
          openSettings(); // Open settings for user to enable location
        }
      } else if (status === 'granted') {
        return await checkGpsStatus(); // Check GPS status
      }
    } catch (error) {
      console.error('Permission error:', error);
    }
    return false;
  };
  async function handleEnabledPressed() {
    if (isAndroid) {
      try {
        const enableResult = await promptForEnableLocationIfNeeded();
        console.log('enableResult', enableResult);
        // The user has accepted to enable the location services
        // data can be :
        //  - "already-enabled" if the location services has been already enabled
        //  - "enabled" if user has clicked on OK button in the popup
      } catch (error: unknown) {
        if (error instanceof Error) {
          console.error(error.message);
          // The user has not accepted to enable the location services or something went wrong during the process
          // "err" : { "code" : "ERR00|ERR01|ERR02|ERR03", "message" : "message"}
          // codes :
          //  - ERR00 : The user has clicked on Cancel button in the popup
          //  - ERR01 : If the Settings change are unavailable
          //  - ERR02 : If the popup has failed to open
          //  - ERR03 : Internal error
        }
      }
    }
  }
  const checkGpsStatus = async () => {
    if (isAndroid) {
      const gpsStatus = await DeviceInfo.isLocationEnabled();
      if (!gpsStatus) {
        await handleEnabledPressed();
        return true;
      }
      return true;
    } else if (isIos) {
      // iOS does not have a direct method for checking GPS status
      // Prompt the user to enable location services
      Alert.alert(
        'GPS is disabled',
        'Please enable location services in settings.',
        [
          {
            text: 'OK',
            onPress: () => {
              // Open the device settings
              openSettings();
            },
          },
        ],
      );

      return false;
    }
    return false;
  };
  const fetchCurrentLocation = useCallback(async () => {
    setIsFetchingLocation(true);
    setLocationStatus('fetching');

    const permissionGranted = await checkAndRequestLocationPermission();
    if (!permissionGranted) {
      setLocationStatus('error');
      setIsFetchingLocation(false);
      return;
    }
    GetLocation.getCurrentPosition({
      enableHighAccuracy: true,
      timeout: 60000,
    })
      .then(location => {
        setCurrentLatitude(location.latitude);
        setCurrentLongitude(location.longitude);
        setLocationStatus('success');
        setIsFetchingLocation(false);
        console.log(location);
      })
      .catch(error => {
        const {code, message} = error;
        console.error(error);
        setLocationStatus('error');
        setIsFetchingLocation(false);
        console.warn(code, message);
      });
  }, []);

  const calculateNearestLocation = useCallback(() => {
    if (
      !locationList ||
      !currentLatitude ||
      !currentLongitude ||
      locationList.locations.length === 0
    ) {
      return;
    }

    // Convert locations to LatLng format
    const locations = locationList.locations.map(location => ({
      latitude: parseFloat(location.gpsLattitude),
      longitude: parseFloat(location.gpsLongitude),
      radius: location.radius,
      locationName: location.locationName,
      siteid: location.siteid,
    }));

    // Find the nearest location
    const nearest = findNearest(
      {latitude: currentLatitude, longitude: currentLongitude},
      locations,
    ) as NearestLocation;

    // Calculate the distance from the nearest location
    const distance = getDistance(
      {latitude: currentLatitude, longitude: currentLongitude},
      {latitude: nearest.latitude, longitude: nearest.longitude},
    );

    // Check if within range
    const isInRange = distance <= nearest.radius;

    // Update state
    setNearestLocation(nearest);
    setDistanceFromNearest(distance);
    setInRange(isInRange);
    setIsRecalculating(false); // Mark recalculation as done
  }, [locationList, currentLatitude, currentLongitude]);

  useEffect(() => {
    // Fetch current location when the hook is mounted
    fetchCurrentLocation();
  }, [fetchCurrentLocation]);

  useEffect(() => {
    // Only calculate nearest location if locationList is available and has locations
    if (locationList && locationList.locations.length > 0) {
      if (currentLatitude !== null && currentLongitude !== null) {
        calculateNearestLocation();
      }
    }
  }, [
    locationList,
    currentLatitude,
    currentLongitude,
    calculateNearestLocation,
  ]);

  const refetch = async () => {
    setIsRecalculating(true);
    await new Promise(resolve => setTimeout(resolve, 100)); // Small delay to ensure state update
    fetchCurrentLocation(); // Fetch updated location
  };

  return {
    nearestLocation,
    distanceFromNearest,
    inRange,
    refetch,
    locationStatus,
    isFetchingLocation,
    isRecalculating,
    currentLatitude,
    currentLongitude,
  };
};

export default useNearestLocation;

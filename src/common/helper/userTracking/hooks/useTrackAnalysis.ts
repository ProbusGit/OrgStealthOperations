import { useEffect, useState } from 'react';
import { getDistance } from 'geolib';
import { useGetTrackDataQuery } from '../../../../redux/services/user/userApiSlice';

// Define the interface for the track data
interface TrackPoint {
  gpsLat: string;
  gpsLog: string;
  logTime: string;
  batteryStatus: number;
}

const useTrackAnalysis = () => {
  const { data: trackData } = useGetTrackDataQuery();
  const [totalDistance, setTotalDistance] = useState<number>(0);
  const [totalDistanceInKm, setTotalDistanceInKm] = useState<number>(0);
  const [averageSpeed, setAverageSpeed] = useState<number>(0);
  const [trackPoints, setTrackPoints] = useState<TrackPoint[]>([]);

  useEffect(() => {
    if (trackData && Array.isArray(trackData) && trackData.length > 0) {
      // Validate and convert trackData to an array of TrackPoint
      const points: TrackPoint[] = trackData
        .filter((point: any) => 
          typeof point.gpsLat === 'string' && 
          typeof point.gpsLog === 'string' && 
          typeof point.logTime === 'string' &&
          !isNaN(parseFloat(point.gpsLat)) && 
          !isNaN(parseFloat(point.gpsLog))
        )
        .map((point: any) => ({
          gpsLat: point.gpsLat,
          gpsLog: point.gpsLog,
          logTime: point.logTime,
          batteryStatus: point.batteryStatus,
        }));

      if (points.length < 2) {
        console.warn('Not enough valid points to calculate distance or speed.');
        return;
      }

      // Set the track points
      setTrackPoints(points);

      // Calculate total distance
      let distance = 0;
      for (let i = 0; i < points.length - 1; i++) {
        distance += getDistance(
          {
            latitude: parseFloat(points[i].gpsLat),
            longitude: parseFloat(points[i].gpsLog),
          },
          {
            latitude: parseFloat(points[i + 1].gpsLat),
            longitude: parseFloat(points[i + 1].gpsLog),
          },
        );
      }
      setTotalDistance(distance);

      // Convert total distance to kilometers
      const distanceInKilometers = distance / 1000;
      setTotalDistanceInKm(distanceInKilometers);

      console.log('Total Distance in Meters:', distance);
      console.log('Total Distance in Kilometers:', distanceInKilometers);

      // Calculate average speed
      if (points.length > 1) {
        let totalTime = 0;
        for (let i = 1; i < points.length; i++) {
          const prevTime = new Date(`1970-01-01T${points[i - 1].logTime}:00Z`);
          const currentTime = new Date(`1970-01-01T${points[i].logTime}:00Z`);
          const timeDifference =
            (currentTime.getTime() - prevTime.getTime()) / 1000; // Time difference in seconds
          if (timeDifference > 0) {
            totalTime += timeDifference;
          }
        }

        if (totalTime > 0) {
          const totalTimeInHours = totalTime / 3600; // Convert seconds to hours
          const speed = distance / totalTimeInHours;
          setAverageSpeed(speed);

          console.log('Total Time in Hours:', totalTimeInHours);
          console.log('Average Speed (meters per hour):', speed);
        } else {
          console.warn('Total time is zero or invalid, cannot calculate average speed.');
        }
      } else {
        console.warn('Not enough points to calculate average speed.');
      }
    }
  }, [trackData]);

  return {
    totalDistance,
    totalDistanceInKm,
    averageSpeed,
    trackPoints,
  };
};

export default useTrackAnalysis;

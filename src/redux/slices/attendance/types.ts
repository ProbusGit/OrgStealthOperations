export interface CheckInOutData {
  // beginTime: string;
  checkInOutDateTime: string;
  // endTime: string;
  // shiftName: string;
  status: "in" | "out"; // Assuming status can only be "in" or "out"
}
export interface LocationData {
  gpsLat: string;
  gpsLog: string;
  locationName: string;
}
export interface AttendanceState {
  checkInOutData: CheckInOutData|null;
  currentLocation:LocationData|null
}

// Define the updated AttendanceLogItem type
export interface AttendanceLogItem {
  CheckInOutDateTime: string;
  CheckInOutLatitude: string;
  CheckInOutLongitude: string;
  CheckInOutDirection: 'in' | 'out';
  Remarks: string | null;
  LocationName: string; // Added LocationName field
  LocationLatitude: string; // Added LocationLatitude field
  LocationLongitude: string; // Added LocationLongitude field
}

// Define the updated AttendanceLogData type
export interface AttendanceLogData {
  data: {
    meta: {
      totalItems: number;
      perPage: number;
      currentPage: number;
      totalPages: number;
    };
    attendanceLog: AttendanceLogItem[];
  };
}

// Define the updated AttendanceLogData type (alternative if list is used)
// export interface AttendanceLogData {
//   list: AttendanceLogItem[];
// }

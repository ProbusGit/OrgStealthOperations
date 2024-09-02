import {Linking} from 'react-native';

export const getBase64Uri = (
  base64String: string,
  mimeType: string = 'image/jpeg',
) => {
  return `data:${mimeType};base64,${base64String}`;
};

const handlePressContactDetails = (
  contactType: string,
  contactValue: string,
) => {
  if (contactType === 'phone') {
    Linking.openURL(`tel:${contactValue}`);
  } else if (contactType === 'email') {
    Linking.openURL(`mailto:${contactValue}`);
  } else if (contactType === 'message') {
    Linking.openURL(`sms:${contactValue}`);
  }
};
function getColorAtIndex(colors: string[] | undefined, index: number, defaultColor: string = "black"): string {
  if (!colors || colors.length === 0) {
    return defaultColor; // Return the default color if the colors array is not present or empty
  }
  
  // Wrap around the index if it's greater than or equal to the length of the colors array
  const normalizedIndex = index % colors.length;
  
  // Ensure the normalized index is positive
  const positiveIndex = normalizedIndex >= 0 ? normalizedIndex : normalizedIndex + colors.length;

  return colors[positiveIndex];
}


function formatTime(isoTime) {
  // Convert the ISO string to a Date object
  const date = new Date(isoTime);

  // Get the time components
  const hours = String(date.getUTCHours()).padStart(2, '0');
  const minutes = String(date.getUTCMinutes()).padStart(2, '0');
  const seconds = String(date.getUTCSeconds()).padStart(2, '0');
  const milliseconds = String(date.getUTCMilliseconds()).padStart(7, '0');

  // Format the time
  return `${hours}:${minutes}:${seconds}.${milliseconds}`;
}

function countDaysBetween(fromDate: Date, toDate: Date): number {
  // Set both dates to the same time (midnight) to ignore time difference
  const fromTime = new Date(fromDate.getFullYear(), fromDate.getMonth(), fromDate.getDate()).getTime();
  const toTime = new Date(toDate.getFullYear(), toDate.getMonth(), toDate.getDate()).getTime();

  // Calculate the difference in milliseconds
  const differenceInMs = toTime - fromTime;

  // Convert milliseconds to days
  const daysDifference = differenceInMs / (1000 * 3600 * 24);

  // Add 1 to the result to include the day itself
  return Math.abs(Math.round(daysDifference)) + 1;
}


function formatDate(date:Date) {
  const formattedDate = `${date.getFullYear()}-${padZero(date.getMonth() + 1)}-${padZero(date.getDate())}`;
  return formattedDate;
}

function padZero(num) {
  return num < 10 ? '0' + num : num;
}
export {handlePressContactDetails,getColorAtIndex,formatTime,countDaysBetween,formatDate};

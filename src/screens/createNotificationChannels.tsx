import notifee, {AndroidImportance} from '@notifee/react-native';
const CHANNEL_IDS = {
  NewMeeting: 'New Meeting',
  MESSAGE: 'message',
  UpdateMeeting: "updateMeeting",
  ALERT: 'alert',
  DEFAULT: 'default',
};

// Function to create notification channels
const createNotificationChannels = async () => {
  await notifee.createChannel({
    id: CHANNEL_IDS.NewMeeting,
    name: 'New',
    importance: AndroidImportance.HIGH,
    vibration: true,
    sound: 'buzzer',
  });

};

export default createNotificationChannels;

export {CHANNEL_IDS};

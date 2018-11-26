import PushNotification from "react-native-push-notification";
// import { PushNotificationIOS } from 'react-native';

const configure = () => {
  PushNotification.configure({
    onRegister() {
      // process token
    },

    onNotification() {
      // process the notification
      // required on iOS only
      //  notification.finish(PushNotificationIOS.FetchResult.NoData);
    },

    permissions: {
      alert: true,
      badge: true,
      sound: true
    },

    popInitialNotification: true,
    requestPermissions: true
  });
};

export { configure };

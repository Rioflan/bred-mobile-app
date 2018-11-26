import React, { PureComponent } from "react";
import {
  View,
  Text,
  Dimensions,
  StyleSheet,
  Platform,
  PermissionsAndroid,
  AsyncStorage
} from "react-native";
import LocationServicesDialogBox from "react-native-android-location-services-dialog-box";
import wifi from "react-native-android-wifi";
import BackgroundTimer from "react-native-background-timer";
import PushNotification from "react-native-push-notification";

const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
  offlineContainer: {
    backgroundColor: "green",
    height: 30,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    width,
    zIndex: 2
  },
  offlineText: { color: "#fff" }
});

function MiniOfflineSign() {
  return (
    <View style={styles.offlineContainer}>
      <Text style={styles.offlineText}>Vous êtes à proximité du bâtiment</Text>
    </View>
  );
}

class OfflineNotice extends PureComponent {
  state = {
    locationGranted: false,
    // Used to know if the user is near or in the building
    wifiLocation: false
  };

  componentWillMount() {
    this.requestLocation();
  }

  componentDidMount() {
    BackgroundTimer.runBackgroundTimer(() => {
      this.fetchWifiList();
    }, 120000);
  }

  componentWillUpdate(nextProps, nextState) {
    const { locationGranted } = this.state;
    if (nextState.locationGranted === true && locationGranted === false) {
      this.requestLocationPermission();
    }
  }

  componentWillUnmount() {
    BackgroundTimer.stopBackgroundTimer();
  }

  requestLocation = async () => {
    try {
      if (Platform.OS === "android")
        LocationServicesDialogBox.checkLocationServicesIsEnabled({
          message:
            "<h2>Use Location?</h2> This app wants to change your device settings:<br/><br/>Use location<br/><br/>",
          ok: "YES",
          cancel: "NO"
        }).then(() => {
          this.setState({ locationGranted: true });
        });
    } catch (err) {
      console.warn(err);
    }
  };

  fetchWifiList = () => {
    wifi.isEnabled(isEnabled => {
      if (isEnabled) {
        wifi.loadWifiList(
          wifiStringList => {
            const wifiArray = JSON.parse(wifiStringList);
            let wifiLocation = false;
            wifiArray.map(element => {
              if (element.SSID.match(this.fetchWifiRegex) !== null) {
                wifiLocation = true;
              }
            });
            this.setState({ wifiLocation });
            if (wifiLocation === true)
              PushNotification.localNotification({
                foreground: false, // BOOLEAN: If the notification was received in foreground or not
                userInteraction: false, // BOOLEAN: If the notification was opened by the user from the notification area or not
                message: "My Notification Message", // STRING: The notification message
                data: {} // OBJECT: The push data
              });
            // After 1s we want to hide the notification
            setTimeout(() => {
              this.setState({ wifiLocation: false });
            }, 4000);
          },
          error => {
            console.log(error);
          }
        );
      } else {
        this.setState({ wifiLocation: false });
      }
    });
  };

  requestLocationPermission = async () => {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
      {
        title: "Wifi networks",
        message: "Merci d'activer votre localisation !"
      }
    );
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      this.fetchWifiList();
    } else {
      console.log("You will not able to retrieve wifi available networks list");
    }
  };

  fetchWifiRegex = async () => {
    const regex = await AsyncStorage.getItem("environment");
    return regex.WIFI_REGEX;
  };

  render() {
    const { wifiLocation } = this.state;

    if (wifiLocation) {
      return <MiniOfflineSign />;
    }
    return null;
  }
}

export default OfflineNotice;

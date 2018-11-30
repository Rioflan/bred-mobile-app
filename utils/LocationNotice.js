import React, { PureComponent } from "react";
import {
  View,
  Text,
  Dimensions,
  StyleSheet,
  Platform,
  PermissionsAndroid,
  AsyncStorage,
  PushNotificationIOS,
  geolocation
} from "react-native";
import Permissions from "react-native-permissions";
import LocationServicesDialogBox from "react-native-android-location-services-dialog-box";
import { NetworkInfo } from "react-native-network-info";
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
    //
    Permissions.request("location").then(() => {
      // Returns once the user has chosen to 'allow' or to 'not allow' access
      // Response is one of: 'authorized', 'denied', 'restricted', or 'undetermined'
      NetworkInfo.getBroadcast(address => {
        console.log(address);
      });
    });
    // BackgroundTimer.runBackgroundTimer(() => {
    this.fetchWifiList();
    // }, 5000);
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

  fetchWifiList = () => {};

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

import React from "react";
import { AsyncStorage, Image, TouchableHighlight, View } from "react-native";
import { createStackNavigator, createTabNavigator } from "react-navigation";
import HomeScreen from "../Components/Home/HomeScreen";
import LoginScreen from "../Components/Login/LoginScreen";
import ProfileScreen from "../Components/Profile/ProfileScreen";
import LeaveScreen from "../Components/Leave/LeaveScreen";
import ScanScreen from "../Components/Scan/ScanScreen";
import PlacesScreen from "../Components/Profile/Places/PlacesScreen";
import UsersScreen from "../Components/Profile/Users/UsersScreen";
import OfflineNotice from "../utils/OfflineNotice";
import logOutPicture from "../assets/logout.png";
// import LocationNotice from "../utils/LocationNotice";

import I18n from "../i18n/i18n";

const NavigationApp = createStackNavigator({
  // Home: { screen: HomeScreen },
  Login: { screen: LoginScreen },
  Profile: {
    screen: createTabNavigator(
      {
        ProfileScreen,
        PlacesScreen,
        UsersScreen
      },
      {
        title: "Places",
        tabBarPosition: "bottom",
        swipeEnabled: true,
        tabBarOptions: {
          labelStyle: {
            fontSize: 10
          },
          showLabel: true,
          showIcon: true,
          activeTintColor: "#5167A4",
          activeBackgroundColor: "rgba(143, 158, 201, 0.4)",
          style: {
            backgroundColor: "#ffffff"
          },
          indicatorStyle: {
            backgroundColor: "white"
          }
        }
      }
    ),
    navigationOptions: ({ navigation }) => ({
      title: "Flex-Office",
      headerTintColor: "black",
      headerLeft: null,
      headerRight: (
        <TouchableHighlight
          onPress={() => {
            AsyncStorage.removeItem("USER");
            navigation.popToTop();
            navigation.navigate("Login");
          }}
        >
          <Image
            source={logOutPicture}
            style={{
              width: 22,
              height: 22,
              margin: 10,
              resizeMode: "contain"
            }}
          />
        </TouchableHighlight>
      )
    })
  },
  Leave: { screen: LeaveScreen },
  Scan: { screen: ScanScreen }
});

const NetInfoWrapper = () => (
  <View style={{ flex: 1 }}>
    <OfflineNotice />
    <NavigationApp />
    {/* <LocationNotice /> */}
  </View>
);

export default NetInfoWrapper;

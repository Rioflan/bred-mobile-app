import React from "react";
import { Image, TouchableHighlight, View } from "react-native";
import { createStackNavigator, createTabNavigator } from "react-navigation";
import LoginScreen from "../Components/Login/LoginScreen";
import ProfileScreen from "../Components/Profile/ProfileScreen";
import LeaveScreen from "../Components/Leave/LeaveScreen";
import SettingsScreen from "../Components/Settings/SettingsScreen";
import PlacesScreen from "../Components/Profile/Places/PlacesScreen";
import UsersScreen from "../Components/Profile/Users/UsersScreen";
import OfflineNotice from "../utils/OfflineNotice";
import profilePicture from "../assets/profile.png";
import logo from "../assets/logo.png";
// import LocationNotice from "../utils/LocationNotice";

const NavigationApp = createStackNavigator({
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
            fontSize: 13,
            margin: 0,
            padding: 0,
            color: "white"
          },
          showLabel: true,
          showIcon: true,
          activeTintColor: "white",
          activeBackgroundColor: "rgba(112, 196, 220, 0.8)",
          style: {
            backgroundColor: "#2E89AD",
            height: 55
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
      headerStyle: {
        backgroundColor: "white",
        borderBottomWidth: 8,
        borderBottomColor: "#2E89AD",
        height: 60
      },
      headerRight: (
        <TouchableHighlight
          onPress={() => {
            navigation.navigate("SettingsScreen");
          }}
        >
          <Image
            source={
              navigation.getParam("photo") &&
              navigation.getParam("photo") !== ""
                ? { uri: navigation.getParam("photo") }
                : profilePicture
            }
            style={{
              width: 30,
              height: 30,
              borderRadius: 15,
              margin: 8,
              resizeMode: "contain"
            }}
          />
        </TouchableHighlight>
      ),
      headerLeft: (
        <Image
          source={logo}
          style={{
            width: 30,
            height: 30,
            margin: 10,
            resizeMode: "contain"
          }}
        />
      )
    })
  },
  Leave: { screen: LeaveScreen },
  SettingsScreen: {
    screen: SettingsScreen,
    navigationOptions: ({ navigation }) => ({
      title: "Flex-Office",
      headerTintColor: "black",
      headerStyle: {
        backgroundColor: "white",
        borderBottomWidth: 8,
        borderBottomColor: "#2E89AD",
        height: 60
      },
      headerRight: (
        <TouchableHighlight
          onPress={() => {
            navigation.navigate("SettingsScreen");
          }}
        >
          <Image
            source={
              navigation.getParam("photo") &&
              navigation.getParam("photo") !== ""
                ? { uri: navigation.getParam("photo") }
                : profilePicture
            }
            style={{
              width: 30,
              height: 30,
              borderRadius: 15,
              margin: 8,
              resizeMode: "contain"
            }}
          />
        </TouchableHighlight>
      )
    })
  }
});

const NetInfoWrapper = () => (
  <View style={{ flex: 1 }}>
    <OfflineNotice />
    <NavigationApp />
    {/* <LocationNotice /> */}
  </View>
);

export default NetInfoWrapper;

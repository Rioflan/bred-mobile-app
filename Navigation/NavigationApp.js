/*
Copyright 2019-2020 BRED Banque Populaire

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/
import React from "react";
import {
  Image,
  TouchableHighlight,
  View,
  Text,
  AsyncStorage,
  Platform
} from "react-native";

import { createStore } from "redux";
import { Provider } from "react-redux";

import devToolsEnhancer from "remote-redux-devtools";

import { createStackNavigator, createBottomTabNavigator } from "react-navigation";
import LinearGradient from "react-native-linear-gradient";
import Icon from "react-native-vector-icons/FontAwesome";
import SplashScreen from "../views/Splash/SplashScreen";
import LoginScreen from "../views/Login/LoginScreen";
import ProfileScreen from "../views/Profile/ProfileScreen";
import SettingsScreen from "../views/Settings/SettingsScreen";
import PlacesScreen from "../views/Places/PlacesScreen";
import UsersScreen from "../views/Users/UsersScreen";
import OfflineNotice from "../utils/OfflineNotice";
import logo from "../assets/logo.png";
import ProfileImage from "./components/ProfileImage";

import reducer, { fetchPhoto } from "./components/reducer";

const store = createStore(reducer, devToolsEnhancer());

const fetchUserPhoto = async () => {
  const userPhoto = await AsyncStorage.getItem("USER");

  fetchPhoto(userPhoto);

  return JSON.parse(userPhoto).photo;
};

export const headerBar = (navigation, goBack = false, rightElement = true) => (
  <View
    style={
      Platform.OS === "ios"
        ? {
            paddingTop: 20 /* only for IOS to give StatusBar Space */,
            backgroundColor: "white",
            height: 80
          }
        : {
            backgroundColor: "white",
            height: 80
          }
    }
  >
    <View
      style={{
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between"
      }}
    >
      {/* Header Left */}
      {goBack ? (
        <TouchableHighlight
          activeOpacity={0.1}
          onPress={() => navigation.goBack()}
        >
          <Icon
            style={{ marginLeft: 20 }}
            name="angle-left"
            size={35}
            color="#2E89AD"
          />
        </TouchableHighlight>
      ) : (
        <Image
          source={logo}
          style={{
            width: 30,
            height: 30,
            margin: 10,
            resizeMode: "contain"
          }}
        />
      )}

      <Text
        style={{
          color: "black",
          fontWeight: "bold",
          fontSize: 20,
          fontFamily: "Raleway"
        }}
      >
        Flex-Office
      </Text>

      {/* Header Right */}
      <TouchableHighlight
        activeOpacity={0.1}
        onPress={() => {
          if (rightElement) {
            navigation.navigate("SettingsScreen");
            fetchUserPhoto();
          }
        }}
      >
        <ProfileImage />
      </TouchableHighlight>
    </View>
    <LinearGradient
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      colors={["#58C0D0", "#468BB6", "#3662A0"]}
      style={{ width: "100%", height: 7 }}
    />
  </View>
);

const NavigationApp = createStackNavigator({
  Splash: {
    screen: SplashScreen,
    navigationOptions: () => ({
      header: null
    })
  },
  Login: { screen: LoginScreen },
  Profile: {
    screen: createBottomTabNavigator(
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
            fontFamily: "Raleway"
          },
          showLabel: true,
          showIcon: true,
          inactiveTintColor: "#3662A0",
          activeTintColor: "#58C0D0",
          backgroundColor: "white", 
          style: {
            backgroundColor: "white",
            height: 50
          },
          indicatorStyle: {
            backgroundColor: "white"
          }
        }
      }
    ),
    navigationOptions: ({ navigation }) => ({
      /* Custom header */
      header: headerBar(navigation)
    })
  },
  SettingsScreen: {
    screen: SettingsScreen,
    navigationOptions: ({ navigation }) => ({
      /* Custom header */
      header: headerBar(navigation, true)
    })
  }
});

const NetInfoWrapper = () => (
  <Provider store={store}>
    <View style={{ flex: 1 }}>
      <OfflineNotice />
      <NavigationApp />
    </View>
  </Provider>
);

export default NetInfoWrapper;

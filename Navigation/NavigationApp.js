import React from 'react'
import { Button, AsyncStorage } from 'react-native';
import { createStackNavigator, createTabNavigator } from 'react-navigation'
import HomeScreen from '../Components/Home/HomeScreen'
import LoginScreen from '../Components/Login/LoginScreen'
import ProfileScreen from '../Components/Profile/ProfileScreen'
import LeaveScreen from '../Components/Leave/LeaveScreen'
import ScanScreen from '../Components/Scan/ScanScreen'
import PlacesScreen from '../Components/Profile/Places/PlacesScreen'
import UsersScreen from '../Components/Profile/Users/UsersScreen'

const NavigationApp = createStackNavigator({
  Home: { screen: HomeScreen },
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
            fontSize: 10,
            },
          showLabel: true,
          showIcon: true,
          activeTintColor: "#5167A4",
          activeBackgroundColor: 'rgba(143, 158, 201, 0.4)',
          style: {
            backgroundColor: '#ffffff',
          },
          indicatorStyle: {
            backgroundColor: 'white'
          }
        }
      }
    ),
    navigationOptions: ({ navigation }) => {
      return {
      title: "Flex-Office",
      headerTintColor: 'black',
      headerRight: <Button
        title="Log Out"
        color= "#5167A4"
        onPress={() => {
          AsyncStorage.removeItem('USER');
          navigation.popToTop();
          navigation.navigate('Login');
        }} />
      }
    }
  },
  Leave: { screen: LeaveScreen },
  Scan: { screen: ScanScreen }
});

export default NavigationApp

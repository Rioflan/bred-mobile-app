// @flow

import React from 'react';
import { View, Button, AsyncStorage } from 'react-native';
import { NavigationScreenProp } from "react-navigation";
import styles from "./HomeScreenStyles";

type Props = {
  navigation: NavigationScreenProp<{}>
};

class HomeScreen extends React.Component<Props> {
  static navigationOptions = {
    title: 'Home'
  };

  componentDidMount() {
    const { navigate } = this.props.navigation;

    AsyncStorage.getItem('USER', (err, result) => {
      if (err || result == null) navigate('Login');
      else {
        const jsonres = JSON.parse(result)
        if (jsonres.place === null || jsonres.place === '') navigate('Profile');
        else navigate('Leave');
      }
    })
  }

  render() {
    return (
      <View style={styles.view}>
      <View style={styles.button_wrapper}>
        <Button
          style={styles.button}
          title="Main Page"
          color="#5167A4"
          onPress={() => this.componentDidMount()}
        />
        </View>
      </View>
    )
  }
}

export default HomeScreen

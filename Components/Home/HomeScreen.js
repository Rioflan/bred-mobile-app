// @flow

import React from "react";
import { AsyncStorage, View } from "react-native";
import { NavigationScreenProp } from "react-navigation";
import styles from "./HomeScreenStyles";

import I18n from "../../i18n/i18n";
import HomeButton from "./components/HomeButton";

type Props = {
  navigation: NavigationScreenProp<{}>
};

class HomeScreen extends React.Component<Props> {
  static navigationOptions = {
    title: I18n.t("home.title")
  };

  componentDidMount() {
    const {
      navigation: { navigate }
    } = this.props;

    AsyncStorage.getItem("USER", (err, result) => {
      if (err || result == null) {
        navigate("Login");
      } else {
        const jsonres = JSON.parse(result);
        if (jsonres.place === null || jsonres.place === "") {
          navigate("Profile");
        } else {
          navigate("Leave");
        }
      }
    });
  }

  render() {
    return (
      <View style={styles.view}>
        <HomeButton onPress={() => this.componentDidMount()} />
      </View>
    );
  }
}

export default HomeScreen;

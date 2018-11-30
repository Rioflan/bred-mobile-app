// @flow

import React from "react";
import { AsyncStorage, View } from "react-native";

import { Text } from "react-native-elements";
import { omit } from "ramda";
import styles from "./LoginScreenStyles";
import server from "../../config/server";
import config from "../../config/api";
import type { Props, State } from "./LoginScreenType";

import I18n from "../../i18n/i18n";
import LoginButton from "./components/LoginButton";
import InputLogin from "./components/InputLogin";

import { checkNavigation } from "../../utils/utils";

class LoginScreen extends React.Component<Props, State> {
  static navigationOptions = {
    title: I18n.t("login.title")
  };

  constructor() {
    super();
    this.state = {
      name: "",
      fname: "",
      id: "",
      place: "",
      debug: "",
      debugField: "",
      remoteDay: "",
      historical: [],
      photo: ""
    };
  }

  componentWillMount() {
    fetch(`${server.address}environment`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "x-access-token": config.token
      }
    })
      .then(res => res.json())
      .then(data => {
        const { LOGIN_REGEX, PLACE_REGEX, WIFI_REGEX } = data;
        const environmentVariable = {
          LOGIN_REGEX,
          PLACE_REGEX,
          WIFI_REGEX
        };
        this.setState({ LOGIN_REGEX });
        AsyncStorage.setItem(
          "environment",
          JSON.stringify(environmentVariable)
        );
      });
    checkNavigation(this);
  }

  fetchLoginRegex = async () => {
    const regex = await AsyncStorage.getItem("environment");
    return regex.LOGIN_REGEX;
  };

  logOut = () => {
    AsyncStorage.removeItem("USER");
  };

  /** This function handle the user login */
  logIn() {
    const { navigation } = this.props;
    const { name, fname, id, LOGIN_REGEX, historical } = this.state;

    if (
      name !== "" &&
      fname !== "" &&
      id !== "" &&
      id.match(LOGIN_REGEX) !== null
    ) {
      const payload = {
        name,
        fname,
        id_user: id,
        id_place: "",
        historical
      };

      fetch(`${server.address}login_user`, {
        method: "POST",
        body: JSON.stringify(payload),
        headers: {
          "Content-Type": "application/json",
          "x-access-token": config.token
        }
      })
        .then(res => res.json())
        .then(data => {
          const redirect: boolean = true;
          if (redirect) {
            console.log(data);
            if (data.user)
              this.setState({
                remoteDay: data.user.remoteDay,
                photo: data.user.photo
              });
            AsyncStorage.setItem(
              "USER",
              JSON.stringify(omit(["debugField"], this.state))
            );
            navigation.navigate("Profile");
          }
        });
    } else {
      this.setState({ debugField: I18n.t("login.debug") });
    }
  }

  render() {
    const { debugField } = this.state;
    return (
      <View style={styles.view}>
        <View style={styles.view_second}>
          <InputLogin
            onChangeText={text => this.setState({ name: text })}
            onChangeText1={text => this.setState({ fname: text })}
            onChangeText2={text => this.setState({ id: text })}
          />
          <LoginButton onPress={() => this.logIn()} />
          <Text style={styles.debug}>{debugField}</Text>
        </View>
      </View>
    );
  }
}

export default LoginScreen;

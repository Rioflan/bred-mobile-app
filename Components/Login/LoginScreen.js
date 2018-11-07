// @flow

import React from "react";
import { View, AsyncStorage } from "react-native";

import {
  Button,
  Card,
  FormInput,
  Text,
  List,
  ListItem,
  SearchBar
} from "react-native-elements";
import { omit } from "ramda";
import styles from './LoginScreenStyles';
import server from '../../config/server';
import config from '../../config/api';
import type { State, Props } from './LoginScreenType';

import { config_regex } from '../../config/regex.json';

import I18n from '../../i18n/i18n';
console.log(I18n.t())
class LoginScreen extends React.Component<Props, State> {
  static navigationOptions = {
    title: I18n.t('login.title')
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
      historical: []
    };
  }

  logOut() {
    AsyncStorage.removeItem("USER");
  }

  /** This function handle the user login */
  logIn() {
    const { navigation } = this.props;

    if (
      this.state.name !== "" &&
      this.state.fname !== "" &&
      this.state.id !== "" &&
      this.state.id.match(config_regex) !== null
    ) {
      const payload = {
        name: this.state.name,
        fname: this.state.fname,
        id_user: this.state.id,
        id_place: '',
        historical: this.state.historical,
      };

      AsyncStorage.setItem("USER", JSON.stringify(this.state));
      fetch(`${server.address}/login_user`, {
        method: "POST",
        body: JSON.stringify(payload),
        headers: {
          "Content-Type": "application/json",
          "x-access-token": config.token
        }
      })
        .catch(err => console.log(err))
        .then(res => res.json())
        .then(data => {
          const redirect: boolean = true;

          if (redirect) {
            AsyncStorage.setItem(
              "USER",
              JSON.stringify(omit("debugField", this.state))
            );
            navigation.goBack();
            navigation.navigate("Profile");
          }
        });
    } else {
      this.setState({ debugField: "Fill all inputs" });
    }
  }

  render() {
    const { debugField } = this.state;
    return (
      <View style={styles.view}>
        <View style={styles.view_second}>
          <FormInput
            style={styles.textInput}
            placeholder={I18n.t('login.name')}
            onChangeText={text => this.setState({ name: text })}
          />

          <FormInput
            style={styles.textInput}
            placeholder={I18n.t('login.surname')}
            onChangeText={text => this.setState({ fname: text })}
          />

          <FormInput
            style={styles.textInput}
            placeholder={I18n.t('login.id')}
            onChangeText={text => this.setState({ id: text })}
          />
          <View style={styles.button_container}>
            <Button
              style={styles.button_login}
              fontWeight="bold"
              borderRadius={15}
              backgroundColor="#5167A4"
              color="#fff"
              title={I18n.t('login.title')}
              onPress={() => this.logIn()}
            />
          </View>

          <Text>{debugField}</Text>
        </View>
      </View>
    );
  }
}

export default LoginScreen;

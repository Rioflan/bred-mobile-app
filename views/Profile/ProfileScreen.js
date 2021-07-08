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
// @flow
/* eslint-disable */
import React from "react";

import { AsyncStorage, ScrollView, View, Text, Alert, KeyboardAvoidingView, Platform } from "react-native";
import socketIOClient from "socket.io-client";

import { NavigationScreenProp } from "react-navigation";
import Icon from "react-native-vector-icons/FontAwesome";
import config from "../../config/api";
import server from "../../config/server";
import regex from "../../config/regex";
import styles from "./ProfileScreenStyles";
import { goTo } from "../../utils/utils";
import I18n from "../../i18n/i18n";

/**
 * List of components
 */
import ManualInsertionCard from "@components/Profile/components/ManualInsertionCard";
import HeaderCard from "@components/Profile/components/HeaderCard";
import QRCodeComponent from "@components/Profile/components/QRCodeComponent";
import LeaveButton from "@components/Profile/components/LeaveButton";

type State = {
  name: string,
  fname: string,
  id: string,
  place: string,
  debug: Array<any> | string,
  isWrongFormatPlace: boolean
};

type Props = {
  navigation: NavigationScreenProp<{}>
};

class ProfileScreen extends React.Component<Props, State> {
  static navigationOptions = ({ navigation }) => {
    return {
      title: I18n.t("profile.title"),
      tabBarIcon: ({ tintColor }) => (
        <Icon name="qrcode" size={23} color={tintColor} />
      )
    };
  };

  constructor() {
    super();
    this.placeInput = "";
    this.socket = socketIOClient(server.sockets);
    this.socket.on('leavePlace', () => this.leavePlace());
    this.state = {
      name: "",
      fname: "",
      id: "",
      place: "",
      isWrongFormatPlace: false,
      focusedScreen: true
    };
  }

  componentDidMount = () => {
    const { navigation } = this.props;
    AsyncStorage.getItem("USER", (err, result) => {
      if (err || result === null) goTo(this, "Login");
      else {
        result = JSON.parse(result);
        if (result.place || result.pool)
          this.socket.emit('checkPlace', result.id, result.place, config._id);
        this.setState(result);
        navigation.setParams(result);
      }
    });
    navigation.addListener('willFocus', () =>
     this.setState({ focusedScreen: true })
   );
   navigation.addListener('willBlur', () =>
     this.setState({ focusedScreen: false })
   );
  };

  DefaultComponent = () => {
    const {
      fname,
      name,
      id,
      isWrongFormatPlace,
      focusedScreen
    } = this.state;

    insertPlace = (placeText) => {
      if (placeText !== "" && placeText.match(regex.placeRegex) !== null) {
        const payload = {
          id_user: id,
          id_place: placeText
        };

        fetch(`${server.address}take_place`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "authorization": `Bearer ${config.token}`
          },
          body: JSON.stringify(payload)
        })
          .then(res => {
            if (res.status === 200) {
              this.setState({
                place: placeText,
                isWrongFormatPlace: false
              });
              this.socket.emit('joinRoom', placeText);
              AsyncStorage.setItem("USER", JSON.stringify(this.state))
            }
            else if (res.status === 500) {
              res.json().then(user => {
                Alert.alert("Impossible", `Place déjà utilisée par : ${user.fname} ${user.name}`);
              })
            }
          });
      } else this.setState({ isWrongFormatPlace: true });
    }

    onSuccess = objectRead => {
      const placeText = objectRead.data;
      insertPlace(placeText);
    };

    return (
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? "padding" : null} enabled>
        <ScrollView style={styles.view} keyboardShouldPersistTaps="handled">
          <HeaderCard fname={fname} name={name} id={id} />
          <View>
            { focusedScreen ? <QRCodeComponent onRead={onSuccess} /> : <View />}
            <ManualInsertionCard
              onChangeText={text => this.placeInput = text.toUpperCase().trim()}
              onSubmitEditing={() => insertPlace(this.placeInput)}
              onPress={() => insertPlace(this.placeInput)}
            />
            {isWrongFormatPlace ? (
              <Text style={styles.debug}>{I18n.t("profile.format")}</Text>
            ) : null}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    );
  };

  LeaveComponent = () => {
    const { place } = this.state;

    return (
      <View
        style={{
          backgroundColor: "white",
          flex: 1,
          justifyContent: "center",
          alignItems: "center"
        }}
      >
        <LeaveButton place={place} onPress={() => this.leavePlace()} />
      </View>
    );
  };

  Content = ({ place }) => {
    if (!place) {
      return <this.DefaultComponent />;
    }
    return <this.LeaveComponent />;
  };

  leavePlace() {
    const { id, place } = this.state;

    const payload: Payload = {
      id_user: id,
      id_place: place
    };

    fetch(`${server.address}leave_place`, {
      method: "POST",
      body: JSON.stringify(payload),
      headers: {
        "Content-Type": "application/json",
        "authorization": `Bearer ${config.token}`
      }
    })
      .then(res => {
        if (res.status === 200) {
          this.setState({
            place: ""
          });
          AsyncStorage.setItem("USER", JSON.stringify(this.state));
          this.socket.emit('leaveRoom', place);
        }
        else if (res.status === 400) {
          res.text().then(message => console.log(message));
        }
      });
  }

  render() {
    const { place } = this.state;

    return <this.Content place={place} />;
  }
}

export default ProfileScreen;

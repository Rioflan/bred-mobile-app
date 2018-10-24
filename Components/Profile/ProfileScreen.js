// @flow
import React from "react";
import {
  Button,
  Card,
  FormInput,
  Text,
  List,
  ListItem
} from "react-native-elements";

import { View, TextInput, AsyncStorage, ScrollView, Image } from "react-native";
import { NavigationScreenProp } from "react-navigation";
import { filter, find, propEq } from "ramda";
import config from "../../config/api";
import server from "../../config/server";
import styles from "./ProfileScreenStyles";
import picProfile from "../../assets/profile.png";
import { sendToServ, getPlaces, goTo } from "../../utils/utils";

type Historical = {
  place_id: string,
  begin: string,
  end: string
};

type State = {
  name: string,
  fname: string,
  id: string,
  place: string,
  historical: Array<Historical>,
  debug: Array<any> | string
};

type Props = {
  navigation: NavigationScreenProp<{}>
};

const profilePic = <Image source={require("../../assets/profile.png")} />;

class ProfileScreen extends React.Component<Props, State> {
  static navigationOptions = {
    title: "Profile",
    tabBarIcon: ({ focused, tintColor }) => (
      <Image
        source={picProfile}
        resizeMode="contain"
        style={{ width: 20, height: 20 }}
      />
    )
  };
  _isMounted = false;

  constructor() {
    super();
    this.state = {
      name: "",
      fname: "",
      id: "",
      place: "",
      debug: "",
      historical: []
    };
  }

  componentDidMount() {
    this._isMounted = true;
    const { id } = this.state;
    AsyncStorage.getItem("USER", (err, result) => {
      if (err || result === null) goTo(this, "Login");
      else {
        if (this._isMounted) this.setState(JSON.parse(result));
        const userId = JSON.parse(result).id;
        fetch(`${server.address}users/${userId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "x-access-token": config.token
          }
        })
          .then(res => res.json()) // transform data to json
          .then(data => {
            if (this._isMounted)
              this.setState({ historical: data[0].historical });
          });
      }
    });
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  render() {
    const navigation = this.props.navigation;
    const { fname, name, id } = this.state;

    return (
      <ScrollView style={styles.view}>
        <View style={styles.view_second}>
          <Text h4 style={styles.text_first}>
            {fname} {name} [{id}]
          </Text>
        </View>

        <Card title="Manual insertion">
          <FormInput
            style={styles.place}
            placeholder="Place"
            onChangeText={text => this.setState({ place: text })}
          />

          <View style={styles.sendContainer}>
            <Button
              fontWeight="bold"
              borderRadius={15}
              backgroundColor="#5167A4"
              color="#fff"
              style={styles.send}
              title="Send"
              onPress={() => getPlaces(this, sendToServ)}
            />
          </View>
        </Card>

        <Card title="Scan QR code">
          <View style={styles.scan_container}>
            <Button
              fontWeight="bold"
              borderRadius={15}
              backgroundColor="#5167A4"
              color="#fff"
              style={styles.scan}
              title="Scan"
              onPress={() => navigation.navigate("Scan")}
            />
          </View>
        </Card>
      </ScrollView>
    );
  }
}

export default ProfileScreen;

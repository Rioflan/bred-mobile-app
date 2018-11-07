// @flow
import React from 'react';

import { View } from 'react-native';
import { AsyncStorage } from 'react-native';
import { Button, Card, Text } from 'react-native-elements';
import config from "../../config/api";
import server from "../../config/server";
import styles from "./LeaveScreenStyles";
import type { State, Props } from "./LeaveScreenType";
import { getPlaces, goTo } from '../../utils/utils';

import I18n from '../../i18n/i18n';

type Historical = {
  place_id: string,
  begin: string,
  end: string,
};

type Payload = {
  name: string,
  fname: string,
  id_user: string,
  id_place: string,
  historical: Array<Historical>
};

class LeaveScreen extends React.Component<Props, State> {
  static navigationOptions = {
    title: I18n.t('leave.title'),
    headerTintColor: 'black',
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
      historical: [],
    };
  }

  leavePlace(ctx) {
    const { name, fname, id, place, historical } = ctx.state;
    ctx = ctx || window;

    const payload = {
      name,
      fname,
      id_user: id,
      id_place: place,
      historical,
    };
    fetch(server.address, {
      method: "POST",
      body: JSON.stringify(payload),
      headers: {
        "Content-Type": "application/json",
        "x-access-token": config.token
      }
    })
      .then(res => {
        if (res.ok) return res.json();
        else ctx.setState({ debug: "ERROR" });
      })
      .then(data => {
        ctx.state.debug = "";
        ctx.state.place = "";
        AsyncStorage.setItem("USER", JSON.stringify(ctx.state));
        goTo(ctx, "Profile");
      });
  }

  componentDidMount() {
    this._isMounted = true;
    AsyncStorage.getItem("USER", (err, result) => {
      if (err || result == null) goTo(this, "Login");
      else {
        if (this._isMounted) this.setState(JSON.parse(result));
        const userId: string = JSON.parse(result).id;
        fetch(`${server.address}users/${userId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "x-access-token": config.token
          }
        })
          .then(res => res.json()) // transform data to json
          .then(data => {
            if (this._isMounted) this.setState({ historical: data[0].historical });
          })
      }
    });
  };

  componentWillUnmount() {
    this._isMounted = false;
  }

  render() {
    const { fname, name, id, place } = this.state;
    return (
      <View>
      <View style={styles.user_view}>
        <Text style={styles.user}>
          {fname}
          {name}[{id}]
        </Text>
      </View>
      <Card style={styles.place_view}>
        <Text style={styles.place}>Place : {place}</Text>
        <Button
          style={styles.button}
          fontWeight="bold"
          borderRadius={15}
          backgroundColor="#5167A4"
          color="#fff"
          title={I18n.t('leave.leave_place')}
          onPress={() => this.leavePlace(this)}
        />
      </Card>
      </View>
    );
  }
}
export default LeaveScreen

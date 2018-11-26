import React from "react";
import wifi from "react-native-android-wifi";
import NavigationApp from "./Navigation/NavigationApp";
import config from "./config/api";
import server from "./config/server";
import { pushNotifications } from "./utils/services/index";

pushNotifications.configure();

export default class App extends React.Component {
  componentWillMount() {
    const payload = {
      email: config.email,
      password: config.password
    };

    fetch(`${server.address}login`, {
      method: "POST",
      body: JSON.stringify(payload),
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then(res => res.json())
      .then(data => {
        config.token = data.token;
        fetch(`${server.address}me`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "x-access-token": config.token
          }
        })
          .then(res => res.json())
          .then(data => {
            config._id = data._id;
          });
      });
  }

  render() {
    return <NavigationApp />;
  }
}

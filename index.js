/** @format */
/* eslint-disable */

import { AppRegistry } from "react-native";
import { YellowBox } from "react-native";
import App from "./App";
import { name as appName } from "./app.json";

// This line prevent weird warning from react-navigation from happening => need a fix !

YellowBox.ignoreWarnings([
  "Warning: _isMounted(...) is deprecated",
  "Module RCTImageLoader"
]);

AppRegistry.registerComponent(appName, () => App);

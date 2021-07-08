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
/** @format */
/* eslint-disable */

import { AppRegistry } from "react-native";
import { YellowBox } from "react-native";
import App from "./App";
import { name as appName } from "./app.json";

// This line prevent weird warning from react-navigation from happening => need a fix !

YellowBox.ignoreWarnings([
  "Warning: isMounted(...) is deprecated",
  "Module RCTImageLoader",
  "Unrecognized WebSocket connection option"
]);

AppRegistry.registerComponent(appName, () => App);

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

import React from "react";
import "isomorphic-fetch";
import { Image, View } from "react-native";
import enzyme, { shallow } from "enzyme";
import { expect } from "chai";
import ReactSixteenAdapter from "enzyme-adapter-react-16";
import LoginScreen from "../../views/Login/LoginScreen";
import LoginButton from "../../Components/Login/LoginButton";
import InputLogin from "../../Components/Login/InputLogin";

jest.mock('react-native-device-info', () => {
  return {
    getVersion: () => 4
  }
})

enzyme.configure({ adapter: new ReactSixteenAdapter() });

const navigation = { navigate: jest.fn(), popToTop: jest.fn(), dispatch: jest.fn() };

it("renders correctly", () => {
  const wrapper = shallow(<LoginScreen navigation={navigation} />);

  wrapper.logIn = jest.fn();
  wrapper.logOut = jest.fn();

  const onPressEvent = jest.fn();

  onPressEvent.mockReturnValue("Link on press invoked");

  // Simulate onPress event on LoginButton component

  wrapper
    .find(LoginButton)
    .first()
    .props()
    .onPress();

  wrapper
    .find(InputLogin)
    .first()
    .props()
    .onSubmitEditing();

  wrapper
    .find(InputLogin)
    .first()
    .props()
    .onChangeText("a");

  wrapper
    .find(InputLogin)
    .first()
    .props()
    .onChangeText1("b");

  wrapper
    .find(InputLogin)
    .first()
    .props()
    .onChangeText2("AA00000");

  const json = jest.fn(() => { return { then: resolve => resolve("test") }});
  const text = jest.fn(() => { return { then: resolve => resolve("test") }});
  fetch = jest.fn(() => { return { then: resolve => resolve({status: 200, json, text }) }});

  wrapper
    .instance()
    .logIn();

  fetch = jest.fn(() => { return { then: jest.fn(resolve => resolve({status: 400, json, text })) }});

  wrapper
    .instance()
    .logIn();

  expect(wrapper.find(Image)).to.have.length(1);
  // expect(wrapper.find(View)).to.have.length(2);
});

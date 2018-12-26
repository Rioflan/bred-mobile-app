import { ScrollView, TouchableOpacity } from "react-native";
import React from "react";
import renderer from "react-test-renderer";
import { expect } from "chai";
import enzyme, { shallow } from "enzyme";
import ReactSixteenAdapter from "enzyme-adapter-react-16";
import UsersScreen from "../../Components/Profile/Users/UsersScreen";
import "isomorphic-fetch";
jest.useFakeTimers();

enzyme.configure({ adapter: new ReactSixteenAdapter() });

const navigation = { navigate: jest.fn(), popToTop: jest.fn() };

it("renders correctly", () => {
  const wrapper = shallow(<UsersScreen navigation={navigation} />);

  const onPressEvent = jest.fn();

  onPressEvent.mockReturnValue("Link on press invoked");

  // Simulate onPress event on TouchableOpacity component

  wrapper
    .find(TouchableOpacity)
    .first()
    .props()
    .onPress();

  expect(wrapper.find(ScrollView)).to.have.length(1);
  expect(wrapper.find(TouchableOpacity)).to.have.length(1);
});

import { ScrollView, TouchableOpacity, View } from "react-native";
import { FormInput, ListItem } from "react-native-elements";
import React from "react";
import { expect } from "chai";
import enzyme, { shallow } from "enzyme";
import ReactSixteenAdapter from "enzyme-adapter-react-16";
import UsersScreen from "../../Components/Profile/Users/UsersScreen";
import ListPlaces from "../../Components/Profile/Users/components/ListPlaces";
import "isomorphic-fetch";
jest.useFakeTimers();

enzyme.configure({ adapter: new ReactSixteenAdapter() });

const navigation = { navigate: jest.fn(), popToTop: jest.fn() };

it("renders correctly", () => {
  const wrapper = shallow(<UsersScreen navigation={navigation} />);

  const users = [
    {
      name: "Test",
      fname: "Test",
      id_place: "TestID",
      photo: ""
    },
    {
      name: "Test2",
      fname: "Test2",
      id_place: "TestID2",
      photo: ""
    }
  ];
  wrapper.setState({ users });

  wrapper.getUsers = jest.fn();

  const onPressEvent = jest.fn();

  onPressEvent.mockReturnValue("Link on press invoked");

  // Simulate onPress event on TouchableOpacity component

  wrapper
    .find(TouchableOpacity)
    .at(0)
    .props()
    .onPress();

  wrapper.componentDidMount = jest.fn();

  // wrapper
  //   .find(FormInput)
  //   .first()
  //   .props()
  //   .onChangeText();

  // wrapper
  //   .find(ListItem)
  //   .first()
  //   .props()
  //   .onChangeText();

  // wrapper
  //   .find(ListPlaces)
  //   .first()
  //   .props()
  //   .handleList();

  // wrapper
  //   .find(ListPlaces)
  //   .first()
  //   .props()
  //   .prop1();

  expect(wrapper.find(ListPlaces).exists()).to.equal(false);

  expect(wrapper.find(ScrollView)).to.have.length(1);
  expect(wrapper.find(TouchableOpacity)).to.have.length(1);
});

import "react-native-permissions";
import React from "react";
import { expect } from "chai";
import Enzyme, { shallow } from "enzyme";
import { ScrollView, Text } from "react-native";
import "react-native-qrcode-scanner";
import Adapter from "enzyme-adapter-react-16";
import ProfileScreen from "../../Components/Profile/ProfileScreen";
import * as mockCamera from "../../__mocks__/react-native-camera";
import ManualInsertionCard from "../../Components/Profile/components/ManualInsertionCard";

Enzyme.configure({ adapter: new Adapter() });

jest.mock("react-native-camera", () => mockCamera);

const navigation = { navigate: jest.fn(), popToTop: jest.fn() };

it("renders correctly", () => {
  const wrapper = shallow(<ProfileScreen navigation={navigation} />);

  const onPressEvent = jest.fn();

  onPressEvent.mockReturnValue("Link on press invoked");

  // Simulate onPress event on ManualInsertionCard component

  wrapper
    .find(ManualInsertionCard)
    .first()
    .props()
    .onPress();

  wrapper
    .find(ManualInsertionCard)
    .first()
    .props()
    .onChangeText();

  expect(wrapper.find(ScrollView)).to.have.length(1);
  expect(wrapper.find(ManualInsertionCard)).to.have.length(1);

  wrapper.setProps({ isWrongFormatPlace: true });
  expect(wrapper.find(Text)).to.have.length(1);
});

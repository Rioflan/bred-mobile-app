import "react-native-permissions";
import React from "react";
import { expect } from "chai";
import Enzyme, { shallow } from "enzyme";
import { ScrollView } from "react-native";
import "react-native-qrcode-scanner";
import Adapter from "enzyme-adapter-react-16";
import ProfileScreen from "../../Components/Profile/ProfileScreen";
import * as mockCamera from "../../__mocks__/react-native-camera";

Enzyme.configure({ adapter: new Adapter() });

jest.mock("react-native-camera", () => mockCamera);

const navigation = { navigate: jest.fn(), popToTop: jest.fn() };

it("renders correctly", () => {
  const wrapper = shallow(<ProfileScreen navigation={navigation} />);

  expect(wrapper.find(ScrollView)).to.have.length(1);
});

import "react-native";
import React from "react";
import { expect } from "chai";
import LinearGradient from "react-native-linear-gradient";
import * as enzyme from "enzyme";
import ReactSixteenAdapter from "enzyme-adapter-react-16";
import LeaveScreen from "../../Components/Leave/LeaveScreen";

enzyme.configure({ adapter: new ReactSixteenAdapter() });

const navigation = { navigate: jest.fn(), popToTop: jest.fn() };

it("renders correctly", () => {
  const wrapper = enzyme.shallow(<LeaveScreen navigation={navigation} />);

  expect(wrapper.find(LinearGradient)).to.have.length(1);
});

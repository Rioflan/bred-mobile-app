import "react-native";
import React from "react";
import * as enzyme from "enzyme";
import ReactSixteenAdapter from "enzyme-adapter-react-16";
import LeaveScreen from "../../Components/Leave/LeaveScreen";

enzyme.configure({ adapter: new ReactSixteenAdapter() });

const navigation = { navigate: jest.fn(), popToTop: jest.fn() };

it("renders correctly", () => {
  enzyme.shallow(<LeaveScreen navigation={navigation} />);
});

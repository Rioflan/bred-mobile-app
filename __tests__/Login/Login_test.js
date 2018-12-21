import "react-native";
import React from "react";
import * as enzyme from "enzyme";
import ReactSixteenAdapter from "enzyme-adapter-react-16";
import LoginScreen from "../../Components/Login/LoginScreen";
import "isomorphic-fetch";

enzyme.configure({ adapter: new ReactSixteenAdapter() });

const navigation = { navigate: jest.fn(), popToTop: jest.fn() };

it("renders correctly", () => {
  enzyme.shallow(<LoginScreen navigation={navigation} />);
});

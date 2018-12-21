import * as enzyme from "enzyme";
import "react-native";
import React from "react";
import ReactSixteenAdapter from "enzyme-adapter-react-16";
import HomeScreen from "../../Components/Home/HomeScreen";

enzyme.configure({ adapter: new ReactSixteenAdapter() });

const navigation = { navigate: jest.fn(), popToTop: jest.fn() };

describe("Testing HomeScreen component", () => {
  it("renders as expected", () => {
    enzyme.shallow(<HomeScreen navigation={navigation} />);
  });
});

import "react-native";
import React from "react";
import renderer from "react-test-renderer";
import LeaveScreen from "../../Components/Leave/LeaveScreen";

const navigation = { navigate: jest.fn(), popToTop: jest.fn() };

it("renders correctly", () => {
  const tree = renderer
    .create(<LeaveScreen navigation={navigation} />)
    .toJSON();
  expect(tree).toMatchSnapshot();
});

import "react-native";
import React from "react";
import renderer from "react-test-renderer";
import LoginScreen from "../../Components/Login/LoginScreen";
import "isomorphic-fetch";

const navigation = { navigate: jest.fn(), popToTop: jest.fn() };

it("renders correctly", () => {
  const tree = renderer
    .create(<LoginScreen navigation={navigation} />)
    .toJSON();
  expect(tree).toMatchSnapshot();
});

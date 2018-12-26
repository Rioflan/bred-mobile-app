import { View } from "react-native";
import React from "react";
import renderer from "react-test-renderer";
import * as enzyme from "enzyme";
import ReactSixteenAdapter from "enzyme-adapter-react-16";
import FindPlacesCard from "../../../Components/Profile/Users/components/FindPlacesCard";

enzyme.configure({ adapter: new ReactSixteenAdapter() });

const users = jest.fn();

it("renders correctly", () => {
  const wrapper = renderer.create(<FindPlacesCard users={users} />).toJSON();
  expect(wrapper).toMatchSnapshot();
});

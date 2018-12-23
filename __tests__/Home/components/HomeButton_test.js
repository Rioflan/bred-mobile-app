import React from "react";
import { View } from "react-native";
import enzyme, { shallow } from "enzyme";
import { expect } from "chai";
import ReactSixteenAdapter from "enzyme-adapter-react-16";
import HomeButton from "../../../Components/Home/components/HomeButton";

enzyme.configure({ adapter: new ReactSixteenAdapter() });

const onPress = jest.fn();

it("renders correctly", () => {
  const wrapper = shallow(<HomeButton onPress={onPress} />);

  expect(wrapper.find(View)).to.have.length(1);
});

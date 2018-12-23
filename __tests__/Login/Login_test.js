import React from "react";
import "isomorphic-fetch";
import { Image, View } from "react-native";
import enzyme, { shallow } from "enzyme";
import { expect } from "chai";
import ReactSixteenAdapter from "enzyme-adapter-react-16";
import LoginScreen from "../../Components/Login/LoginScreen";

enzyme.configure({ adapter: new ReactSixteenAdapter() });

const navigation = { navigate: jest.fn(), popToTop: jest.fn() };

it("renders correctly", () => {
  const wrapper = shallow(<LoginScreen navigation={navigation} />);

  expect(wrapper.find(Image)).to.have.length(1);
  expect(wrapper.find(View)).to.have.length(2);
});

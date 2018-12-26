import "isomorphic-fetch";
import { expect } from "chai";
import { ScrollView } from "react-native";
import React from "react";
import enzyme, { shallow } from "enzyme";
import ReactSixteenAdapter from "enzyme-adapter-react-16";
import PlacesScreen from "../../Components/Profile/Places/PlacesScreen";

enzyme.configure({ adapter: new ReactSixteenAdapter() });

const navigation = { navigate: jest.fn(), popToTop: jest.fn() };

it("renders correctly", () => {
  const wrapper = shallow(<PlacesScreen navigation={navigation} />);

  expect(wrapper.find(ScrollView)).to.have.length(1);
});

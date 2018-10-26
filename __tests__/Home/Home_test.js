import 'react-native';
import React from 'react';
import HomeScreen from '../../Components/Home/HomeScreen';

import renderer from 'react-test-renderer';

const navigation = { navigate: jest.fn(), popToTop: jest.fn() };

it('renders correctly', () => {
  const tree = renderer.create(
    <HomeScreen navigation={navigation} />
    ).toJSON();
  expect(tree).toMatchSnapshot();
});
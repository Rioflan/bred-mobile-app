import 'react-native';
import React from 'react';
import LoginScreen from '../../Components/Login/LoginScreen';

import renderer from 'react-test-renderer';

const navigation = { navigate: jest.fn(), popToTop: jest.fn() };

it('renders correctly', () => {
  const tree = renderer.create(
    <LoginScreen navigation={navigation} />
    ).toJSON();
  expect(tree).toMatchSnapshot();
});
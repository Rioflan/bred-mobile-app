import 'react-native';
import React from 'react';
import ProfileScreen from '../../Components/Profile/ProfileScreen';

import renderer from 'react-test-renderer';

const navigation = { navigate: jest.fn(), popToTop: jest.fn() };

it('renders correctly', () => {
  const tree = renderer.create(
    <ProfileScreen navigation={navigation} />
    ).toJSON();
  expect(tree).toMatchSnapshot();
});
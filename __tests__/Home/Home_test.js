import * as enzyme from 'enzyme';
import 'react-native';
import React from 'react';
import HomeScreen from '../../Components/Home/HomeScreen';
import HomeButton from '../../Components/Home/components/HomeButton';

import renderer from 'react-test-renderer';

import ReactSixteenAdapter from 'enzyme-adapter-react-16';
enzyme.configure({ adapter: new ReactSixteenAdapter() });

const navigation = { navigate: jest.fn(), popToTop: jest.fn() };

describe('Testing HomeScreen component', () => {
  it('renders as expected', () => {

    const wrapper = enzyme.shallow(
      <HomeScreen navigation={navigation} />
    );

    expect(wrapper).toMatchSnapshot();
  });
});
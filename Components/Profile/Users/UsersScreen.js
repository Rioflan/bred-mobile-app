// @flow
import React from 'react';
import {
  Button,
  Card,
  FormInput,
  Text,
  List,
  ListItem,
} from 'react-native-elements';

import {
 View, TextInput, AsyncStorage, ScrollView, Image
} from 'react-native';
import { NavigationScreenProp } from 'react-navigation';
import { filter, find, propEq } from 'ramda';
import config from '../../../config/api';
import server from '../../../config/server';
import styles from '../ProfileScreenStyles';
import picUser from '../../../assets/users.png';

type State = {
  users: Array<any> | string
};

type Props = {
  navigation: NavigationScreenProp<{}>
};

class ProfileScreen extends React.Component<Props, State> {
  static navigationOptions = {
    title: 'Users',
        tabBarIcon: ({}) => {
      return <Image source={picUser} resizeMode="contain" style={{width: 20, height: 20}} />;
    }
  };

  _isMounted = false;

  constructor() {
    super()
    this.state = {
      users: [],
    }
  }

  componentDidMount() {
    const { id } = this.state
    this._isMounted = true;
    this.getUsers();
  }

getUsers() {
    fetch(`${server.address}users/`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'x-access-token': config.token,
      },
    })
      .then(res => res.json()) // transform data to json
      .then((users) => {
        if (this._isMounted) this.setState({ users })
      })
  };

  componentWillUnmount() {
    this._isMounted = false;
  }

  render() {
    const navigation = this.props.navigation
    const { users } = this.state

    return (
      <ScrollView style={styles.view}>
                <Card>
          <View style={styles.emptyPlaces_container}>
            <Button
              fontWeight="bold"
              large={false}
              borderRadius={15}
              backgroundColor="#5167A4"
              color="#fff"
              style={styles.free_places}
              title="Users"
              onPress={this.getUsers.bind(this)}
            />
          </View>
          {users !== [] ? (
            <List containerStyle={{ marginBottom: 20 }}>
              {users.map(
                item => item  ? (
                    <ListItem
                      key={item.id}
                      title={`${item.name} / ${item.fname}`}
                      subtitle={item.id_place}
                    />
                  ) : null
              )}
            </List>
          ) : null}
        </Card>
      </ScrollView>
    );
  }
}

export default ProfileScreen

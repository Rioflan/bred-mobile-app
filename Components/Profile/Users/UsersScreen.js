// @flow
import React from 'react';
import {
  Button,
  Card,
  FormInput,
  Text,
  List,
  ListItem,
  SearchBar,
  FormLabel
} from 'react-native-elements';

import {
 View, TextInput, AsyncStorage, ScrollView, Image,
} from 'react-native';
import { NavigationScreenProp } from 'react-navigation';
import { filter, find, propEq } from 'ramda';
import config from '../../../config/api';
import server from '../../../config/server';
import styles from '../ProfileScreenStyles';
import picUser from '../../../assets/users.png';

import I18n from 'react-native-i18n';

type State = {
  users: Array<any> | string
};

type Props = {
  navigation: NavigationScreenProp<{}>
};

class ProfileScreen extends React.Component<Props, State> {
  static navigationOptions = {
    title: I18n.t('users.title'),
        tabBarIcon: () => {
      return <Image source={picUser} resizeMode="contain" style={{width: 20, height: 20}} />;
    }
  };

  _isMounted = false;

  constructor() {
    super()
    this.state = {
      users: [],
      search: "",
      userName: null,
    }
  }

componentDidMount() {
  const { id } = this.state
  AsyncStorage.getItem("USER", (err, result) => {
      if (err || result === null) goTo(this, "Login");
      else {
        const userName = JSON.parse(result).name;
        const userFName = JSON.parse(result).fname;
        this.setState({ userName: `${userName}/${userFName}` });
      }
  });
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

  _handleSearch = (search) => {
    this.setState({ search })
  };

  _handleList = () => {
    const { users , search } = this.state

    const newT: string | Array<object> = users !== []
      ? users.filter((e) => {
        let finalResult = true
        for (const element in search) {
          if (search[element] !== e.name[element]) {
            finalResult = false
          }
            }
        return finalResult
      })
      : users
    newT.sort((a, b) => {
      if(a.name < b.name) return -1; 
      if(a.name > b.name) return 1; 
      return 0;
    })
    users.sort((a, b) => {
      if(a.name < b.name) return -1;
      if(a.name > b.name) return 1;
      return 0;
    })
    return search === '' ? users : newT
  };

  render() {
    const navigation = this.props.navigation
    const { users } = this.state

    return (
      <ScrollView style={styles.view}>
                <Card>
          <View style={styles.emptyPlaces_container}>
            <Button
              fontWeight="bold"
              iconRight={{ name: 'spinner', type: 'font-awesome' }}
              large={false}
              borderRadius={15}
              backgroundColor="#5167A4"
              color="#fff"
              style={styles.free_places}
              title={I18n.t('users.users')}
              onPress={this.getUsers.bind(this)}
            />
          </View>
            <FormLabel>{I18n.t('users.find')}</FormLabel>
            <FormInput
            onChangeText={this._handleSearch}
            style={{
              backgroundColor: "white",
              marginTop: 10
            }}
            placeholder={I18n.t('users.search_user')}
          />
          {users !== [] && users ? (
            <List containerStyle={{ marginBottom: 20 }}>
              {this._handleList().map(
                item => item && `${item.name}/${item.fname}` !== this.state.userName  ? 
                (
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

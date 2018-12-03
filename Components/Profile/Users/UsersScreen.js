// @flow
/* eslint-disable */
import React from "react";
import { Card, FormInput, FormLabel, ListItem } from "react-native-elements";

import {
  ActivityIndicator,
  AsyncStorage,
  Image,
  ScrollView,
  TouchableOpacity
} from "react-native";
import { append } from "ramda";
import { NavigationScreenProp } from "react-navigation";
import I18n from "react-native-i18n";
import config from "../../../config/api";
import server from "../../../config/server";
import styles from "../ProfileScreenStyles";
import picUser from "../../../assets/users.png";

import { goTo } from "../../../utils/utils";

import FindPlacesCard from "./components/FindPlacesCard";
import ListPlaces from "./components/ListPlaces";

type State = {
  users: Array<any> | string
};

type Props = {
  navigation: NavigationScreenProp<{}>
};

class UsersScreen extends React.Component<Props, State> {
  static navigationOptions = {
    title: I18n.t("users.title"),
    tabBarIcon: () => (
      <Image
        source={picUser}
        resizeMode="contain"
        style={{
          width: 20,
          height: 20
        }}
      />
    )
  };

  _isMounted = false;

  constructor() {
    super();
    this.state = {
      users: [],
      search: "",
      userName: null,
      loading: false
    };
  }

  componentDidMount() {
    const { id } = this.state;
    const { navigation } = this.props;
    this.didFocusListener = navigation.addListener("didFocus", () => {
      this.refreshFriends();
    });
    AsyncStorage.getItem("USER", (err, result) => {
      if (err || result === null) {
        goTo(this, "Login");
      } else {
        const userName = JSON.parse(result).name;
        const userFName = JSON.parse(result).fname;
        const remoteDay = JSON.parse(result).remoteDay;
        const historical = JSON.parse(result).historical;
        const friend = JSON.parse(result).friend;
        const id = JSON.parse(result).id;
        this.setState({
          userName: `${userName}/${userFName}`,
          remoteDay,
          name: JSON.parse(result).name,
          fname: JSON.parse(result).fname,
          historical,
          id,
          friend
        });
      }
    });

    this._isMounted = true;
    this.getUsers();
  }

  componentWillUnmount = () => {
    this._isMounted = false;
  };

  refreshFriends = () => {
    const { users } = this.state;
    const { navigation } = this.props;

    const listOfFriends = navigation.getParam("friendBack");
    this.setState({
      users: listOfFriends ? append(listOfFriends, users) : users
    });
    if (listOfFriends) navigation.setParams({ friendBack: null });
  };

  addFriend = item => {
    const { navigation } = this.props;
    const payload = {
      id_user: this.state.id,
      id: item.id,
      name: item.name,
      fname: item.fname,
      id_place: item.id_place,
      photo: item.photo
    };

    fetch(`${server.address}add_friend`, {
      method: "POST",
      body: JSON.stringify(payload),
      headers: {
        "Content-Type": "application/json",
        "x-access-token": config.token
      }
    })
      .then(res => res.json()) // transform data to json
      .then(friend => {
        const newListOfUSers = this.state.users.filter(e => e.id !== item.id);
        this.setState({
          users: newListOfUSers,
          friend: append(friend, friend.user.friend)
        });
        AsyncStorage.setItem("USER", JSON.stringify(this.state));
        navigation.navigate("SettingsScreen", { friend: friend.user.friend });
      });
  };

  getUsers = () => {
    this.setState({ loading: true });
    fetch(`${server.address}users/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "x-access-token": config.token
      }
    })
      .then(res => res.json()) // transform data to json
      .then(users => {
        if (this._isMounted) {
          // Here we check if users are in the friend list
          const filteredUsers = users.filter(
            word => !this.state.friend.find(e => e.id === word.id)
          );
          this.setState({
            users: this.state.friend.length > 0 ? filteredUsers : users
          });
        }
        this.setState({ loading: false });
      });
  };

  _handleSearch = search => {
    this.setState({ search });
  };

  _handleList = () => {
    const { users, search } = this.state;
    const newT: string | Array<object> =
      users !== []
        ? users.filter(e => {
            let finalResult = true;
            for (const element in search) {
              if (search[element] !== e.name[element]) {
                finalResult = false;
              }
            }
            return finalResult;
          })
        : users;
    newT.sort((a, b) => {
      if (a.name < b.name) return -1;
      if (a.name > b.name) return 1;
      return 0;
    });
    users.sort((a, b) => {
      if (a.name < b.name) return -1;
      if (a.name > b.name) return 1;
      return 0;
    });
    return search === "" ? users : newT;
  };

  // async getFriends (item) {
  //  const value = await AsyncStorage.getItem('friend');
  //  JSON.parse(value).push({name: item.name, fname: item.fname})
  //  AsyncStorage.setItem("friend", JSON.stringify(value))
  //   const payload = {
  //     remoteDay: this.state.remoteDay,
  //     name: this.state.name,
  //     fname: this.state.fname,
  //     historical: this.state.historical,
  //     id_user: this.state.id,
  //     id_place: "",
  //     friends: append({name: item.name, fname: item.fname}, this.state.friends)
  //   }

  //   fetch(`${server.address}`, {
  //     method: 'POST',
  //     body: JSON.stringify(payload),
  //     headers: {
  //       'Content-Type': 'application/json',
  //       'x-access-token': config.token
  //     }
  //   })
  //     .then(res => res.json())
  //     .then(data => {
  //        AsyncStorage.getItem('USER', (err, result) => {
  //          const res = JSON.parse(result);
  //          const friends = append({name: item.name, fname: item.fname}, result.friends)
  //          this.state["friends"] = friends;
  //         AsyncStorage.setItem('USER', JSON.stringify(this.state))
  //         goTo(this, 'FriendScreen')
  //        })
  //     })
  // }

  render() {
    const { users, loading, userName } = this.state;

    return (
      <ScrollView style={styles.view}>
        <Card>
          <FindPlacesCard users={() => this.getUsers} />
          <FormLabel>{I18n.t("users.find")}</FormLabel>
          <FormInput
            onChangeText={() => this._handleSearch}
            style={{
              backgroundColor: "white",
              marginTop: 10
            }}
            placeholder={I18n.t("users.search_user")}
          />
          {users !== [] && users && !loading ? (
            <ListPlaces
              handleList={this._handleList()}
              prop1={item =>
                item && `${item.name}/${item.fname}` !== userName ? (
                  <TouchableOpacity
                    key={item.id}
                    onPress={() => this.addFriend(item)}
                  >
                    <ListItem
                      onPress={() => this.addFriend(item)}
                      title={`${item.name} / ${item.fname}`}
                      subtitle={item.id_place}
                      roundAvatar
                      rightIcon={{ name: "add" }}
                      avatar={{
                        uri:
                          item.photo === ""
                            ? "https://www.drupal.org/files/issues/default-avatar.png"
                            : item.photo
                      }}
                    />
                  </TouchableOpacity>
                ) : null
              }
            />
          ) : (
            <ActivityIndicator
              style={{ marginTop: 20 }}
              size="large"
              color="#5167A4"
            />
          )}
        </Card>
      </ScrollView>
    );
  }
}

export default UsersScreen;

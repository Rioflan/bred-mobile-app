// @flow
/* eslint-disable */
import React from "react";
import { FormInput, ListItem } from "react-native-elements";
import Icon from "react-native-vector-icons/FontAwesome";

import {
  ActivityIndicator,
  AsyncStorage,
  ScrollView,
  TouchableOpacity,
  View
} from "react-native";
import { append, filter, omit } from "ramda";
import { NavigationScreenProp } from "react-navigation";
import I18n from "react-native-i18n";
import config from "../../../config/api";
import server from "../../../config/server";
import styles from "../ProfileScreenStyles";

import { goTo } from "../../../utils/utils";

import ListPlaces from "./components/ListPlaces";

import profileDefaultPic from "../../../assets/profile.png";

type State = {
  users: Array<any> | string
};

type Props = {
  navigation: NavigationScreenProp<{}>
};

class UsersScreen extends React.Component<Props, State> {
  static navigationOptions = {
    title: I18n.t("users.title"),
    tabBarIcon: ({ tintColor }) => (
      <Icon name="users" size={20} color={tintColor} />
    )
  };

  _isMounted = false;

  constructor() {
    super();
    this.state = {
      users: [],
      search: "",
      userName: null,
      loading: false,
      arrayOfFriends: [],
      friendLoading: false,
      friend: []
    };
  }

  componentDidMount = async () => {
    const { id } = this.state;
    const { navigation } = this.props;

    await AsyncStorage.getItem("USER", (err, result) => {
      if (err || result === null) {
        goTo(this, "Login");
      } else {
        const { remoteDay, historical, friend, id } = JSON.parse(result);
        const userName = JSON.parse(result).name;
        const userFName = JSON.parse(result).fname;

        this.setState({
          userName: `${userName}/${userFName}`,
          remoteDay,
          name: JSON.parse(result).name,
          fname: JSON.parse(result).fname,
          historical,
          id,
          friend
        });
        this.fetchFriends();
      }
    });

    this._isMounted = true;
    this.getUsers();
  };

  componentWillUnmount = () => {
    this._isMounted = false;
  };

  addFriend = item => {
    const { users, id, arrayOfFriends, friendLoading } = this.state;
    if (!friendLoading) {
      const newListOfUSers = users.filter(e => e.id !== item.id);
      this.setState({
        users: newListOfUSers,
        arrayOfFriends: append(item, arrayOfFriends),
        friendLoading: true
      });
      const payload = {
        id_user: id,
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
          this.setState({
            friend: append(item, friend.user.friend)
          });
          AsyncStorage.setItem("USER", JSON.stringify(this.state));
          this.setState({ friendLoading: false });
        });
    }
  };

  fetchFriends = () => {
    const { id } = this.state;
    fetch(`${server.address}users/${id}/friends`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "x-access-token": config.token
      }
    })
      .then(res => res.json())
      .then(arrayOfFriends => this.setState({ arrayOfFriends }));
  };

  getUsers = () => {
    const { friend } = this.state;
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
            word => !friend.find(e => e.id === word.id)
          );
          // Here we want to refresh the friend list
          const filteredFriends = users.filter(word =>
            friend.find(e => e.id === word.id)
          );
          this.setState({
            users: friend.length > 0 ? filteredUsers : users,
            arrayOfFriends: filteredFriends
          });
        }
        this.setState({ loading: false });
      });
  };

  _handleSearch = search => {
    this.setState({ search });
    if (search.length >= 3) this.getUsers();
  };

  _handleList = () => {
    const { users, search } = this.state;
    const newT: string | Array<object> =
      users !== []
        ? users.filter(e => {
            let finalResult = true;
            Object.keys(search).forEach(element => {
              if (
                search[element] !== e.name[element] &&
                search[element] !== e.fname[element]
              ) {
                finalResult = false;
              }
            });
            // for (const element in search) {
            //   if (
            //     search[element] !== e.name[element] &&
            //     search[element] !== e.fname[element]
            //   ) {
            //     finalResult = false;
            //   }
            // }
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

  removeFriend = friendToBeRemoved => {
    const { id, arrayOfFriends, friend, users, friendLoading } = this.state;
    const isRemovedUser = userFriend => userFriend.id !== friendToBeRemoved.id;
    this.setState({
      arrayOfFriends: filter(isRemovedUser, arrayOfFriends),
      friend: filter(isRemovedUser, friend),
      users: append(friendToBeRemoved, users)
    });
    if (!friendLoading) {
      this.setState({ friendLoading: true });
      const payload = {
        id_user: id,
        id: friendToBeRemoved.id
      };

      fetch(`${server.address}remove_friend`, {
        method: "POST",
        body: JSON.stringify(payload),
        headers: {
          "Content-Type": "application/json",
          "x-access-token": config.token
        }
      })
        .then(res => res.json()) // transform data to json
        .then(friendUser => {
          AsyncStorage.setItem(
            "USER",
            JSON.stringify(omit(["arrayOfFriends"], this.state))
          );
          this.setState({ friendLoading: false });
        });
    }
  };

  render() {
    const { users, loading, userName, arrayOfFriends } = this.state;

    return (
      <ScrollView style={styles.view}>
        <View style={{ marginLeft: 40, marginRight: 40 }}>
          <View
            style={{
              flex: 1,
              flexDirection: "row",
              justifyContent: "space-around",
              alignItems: "center",
              marginBottom: 10
            }}
          >
            <FormInput
              onChangeText={search => this._handleSearch(search)}
              style={{
                backgroundColor: "white"
              }}
              containerStyle={{ marginTop: 20, marginBottom: 20, width: 220 }}
              placeholder={I18n.t("users.search_user")}
            />
            <TouchableOpacity
              onPress={() => this.getUsers()}
              style={{
                backgroundColor: "#fff",
                shadowOpacity: 0.4,
                shadowRadius: 2,
                shadowColor: "#3662A0",
                shadowOffset: { height: 1, width: 0 },
                borderRadius: 17.5,
                width: 35,
                height: 35,
                flex: 1,
                alignItems: "center",
                justifyContent: "center"
              }}
            >
              <Icon name="arrow-right" size={15} color="#2E89AD" />
            </TouchableOpacity>
          </View>
          {/* <FindPlacesCard users={() => this.getUsers()} /> */}
          {!loading ? (
            <View>
              <View style={{ marginBottom: -22 }}>
                {arrayOfFriends.map(friend => {
                  if (friend)
                    return (
                      <ListItem
                        onPress={() => this.removeFriend(friend)}
                        key={friend.id}
                        title={`${friend.name} / ${friend.fname}`}
                        subtitle={friend.id_place}
                        fontFamily="Raleway"
                        rightIcon={{
                          name: "star",
                          color: "#2E89AD"
                        }}
                        roundAvatar
                        avatar={
                          friend.photo !== ""
                            ? { uri: friend.photo }
                            : profileDefaultPic
                        }
                        avatarStyle={{
                          backgroundColor: "white",
                          width: 33,
                          height: 33,
                          resizeMode: "contain"
                        }}
                      />
                    );
                  return null;
                })}
              </View>
              {users !== [] && users ? (
                <ListPlaces
                  handleList={() => this._handleList()}
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
                          fontFamily="Raleway"
                          roundAvatar
                          rightIcon={{
                            name: "star-border",
                            color: "#2E89AD"
                          }}
                          avatar={
                            item.photo !== ""
                              ? { uri: item.photo }
                              : profileDefaultPic
                          }
                          avatarStyle={{
                            backgroundColor: "white",
                            width: 33,
                            height: 33,
                            resizeMode: "contain"
                          }}
                        />
                      </TouchableOpacity>
                    ) : null
                  }
                />
              ) : null}
            </View>
          ) : (
            <ActivityIndicator
              style={{ marginTop: 40 }}
              size="large"
              color="#2E89AD"
            />
          )}
        </View>
      </ScrollView>
    );
  }
}

export default UsersScreen;

// @flow
/* eslint-disable */

import React, { Component } from "react";
import { AsyncStorage, Text, View, Image, ScrollView } from "react-native";

import { ButtonGroup, Button, ListItem } from "react-native-elements";
import { assoc, filter } from "ramda";
import PhotoUpload from "react-native-photo-upload";
import config from "../../config/api";
import server from "../../config/server";
import { sendToServ, getPlaces, goTo } from "../../utils/utils";
import picProfile from "../../assets/profile.png";

const WEEK_DAYS = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi"];

type Historical = {
  place_id: string,
  begin: string,
  end: string
};

type State = {
  name: string,
  fname: string,
  id: string,
  place: string,
  historical: Array<Historical>,
  debug: Array<any> | string,
  remoteDay: string,
  arrayOfFriends: Array<any>
};

type Props = {
  navigation: NavigationScreenProp<{}>
};

class SettingsScreen extends Component<Props, State> {
  static navigationOptions = {
    title: "Profile",
    headerTintColor: "black",
    tabBarIcon: () => (
      <Image
        source={picProfile}
        resizeMode="contain"
        style={{ width: 20, height: 20 }}
      />
    )
  };

  constructor() {
    super();
    this.state = {
      name: "",
      fname: "",
      id: "",
      selectedIndex: 0,
      photo: "",
      arrayOfFriends: [],
      loadingSave: false
    };
  }

  componentDidMount() {
    const { navigation } = this.props;
    this.didFocusListener = navigation.addListener("didFocus", () => {
      this.refreshFriends();
    });
    AsyncStorage.getItem("USER", (err, result) => {
      if (err || result === null) goTo(this, "Login");
      else {
        this.setState(JSON.parse(result));
        this.setState({
          // map Trouve index du jour
          selectedIndex: WEEK_DAYS.findIndex(
            e => e === JSON.parse(result).remoteDay
          )
        });
        const userId = JSON.parse(result).id;
        fetch(`${server.address}users/${userId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "x-access-token": config.token
          }
        })
          .then(res => res.json()) // transform data to json
          .then(data => {
            this.setState({
              historical: data[0].historical,
              loadingSave: false
            });
            this.fetchFriends();
          });
      }
    });
  }

  componentWillUnmount() {
    this.didFocusListener.remove();
  }

  refreshFriends = () => {
    const { arrayOfFriends } = this.state;
    const { navigation } = this.props;

    const listOfFriends = navigation.getParam("friend") || arrayOfFriends;
    this.setState({
      arrayOfFriends: listOfFriends
    });
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

  removeFriend = friend => {
    const { id, arrayOfFriends } = this.state;
    const { navigation } = this.props;
    const payload = {
      id_user: id,
      id: friend.id
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
        const isRemovedUser = userFriend => userFriend.id !== friend.id;
        this.setState({
          arrayOfFriends: filter(isRemovedUser, arrayOfFriends)
        });
        navigation.setParams({ friend: null });
      });
  };

  updateIndex = selectedIndex => {
    this.setState({ selectedIndex, remoteDay: WEEK_DAYS[selectedIndex] });
  };

  saveRemote = async () => {
    const { id } = this.state;
    this.setState({ loadingSave: true });
    await getPlaces(this, sendToServ);

    // Wait until the photo is uploaded to Cloudinary and the link is provided to perform request
    setTimeout(async () => {
      fetch(`${server.address}users/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "x-access-token": config.token
        }
      })
        .then(res => res.json())
        .then(data => {
          AsyncStorage.setItem(
            "USER",
            JSON.stringify(assoc("photo", data[0].photo, this.state))
          );
          this.setState({ loadingSave: false });
        });
    }, 3000);
  };

  render() {
    const {
      selectedIndex,
      name,
      fname,
      id,
      photo,
      arrayOfFriends,
      loadingSave
    } = this.state;

    return (
      <ScrollView
        style={{
          flex: 1,
          flexDirection: "column"
        }}
      >
        <View
          style={{
            flex: 1,
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            backgroundColor: "white",
            margin: 20,
            height: 100,
            borderRadius: 5
          }}
        >
          <View style={{ marginLeft: 20 }}>
            <Text>
              <Text style={{ fontWeight: "bold" }}>Nom : </Text>
              {name}{" "}
            </Text>
            <Text>
              <Text style={{ fontWeight: "bold" }}>Prenom : </Text>
              {fname}
            </Text>
            <Text>
              <Text style={{ fontWeight: "bold" }}>ID : </Text>
              {id}
            </Text>
          </View>
          <PhotoUpload
            onPhotoSelect={image => {
              if (image) {
                this.setState({ photo: image });
              }
            }}
          >
            <Image
              style={{
                width: 70,
                height: 70,
                borderRadius: 35
              }}
              resizeMode="cover"
              source={{
                uri:
                  photo === ""
                    ? "https://www.drupal.org/files/issues/default-avatar.png"
                    : photo
              }}
            />
          </PhotoUpload>
        </View>

        <Text style={{ fontWeight: "bold", textAlign: "center", margin: 10 }}>
          Télétravail :{" "}
        </Text>
        <ButtonGroup
          onPress={this.updateIndex}
          selectedIndex={selectedIndex}
          buttons={WEEK_DAYS}
        />
        <View
          style={{
            justifyContent: "center",
            alignItems: "center"
          }}
        >
          <Button
            title="ENREGISTRER"
            loading={loadingSave}
            onPress={() => this.saveRemote()}
            titleStyle={{ fontWeight: "700" }}
            buttonStyle={{
              backgroundColor: "#5167A4",
              width: 200,
              height: 45,
              borderColor: "transparent",
              marginTop: 10,
              borderWidth: 0,
              borderRadius: 5
            }}
            containerStyle={{ marginTop: 20 }}
          />
        </View>
        <Text style={{ fontWeight: "bold", textAlign: "center", margin: 10 }}>
          Mon équipe :{" "}
        </Text>
        {arrayOfFriends.map(friend => {
          if (friend)
            return (
              <ListItem
                onPress={() => this.removeFriend(friend)}
                key={friend.id}
                title={`${friend.name} / ${friend.fname}`}
                subtitle={friend.id_place}
                rightIcon={{ name: "remove" }}
                roundAvatar
                avatar={{
                  uri:
                    friend.photo === ""
                      ? "https://www.drupal.org/files/issues/default-avatar.png"
                      : friend.photo
                }}
              />
            );
          return null;
        })}
      </ScrollView>
    );
  }
}

export default SettingsScreen;

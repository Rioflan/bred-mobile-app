// @flow
/* eslint-disable */

import React, { Component } from "react";
import { AsyncStorage, Text, View, Image, ScrollView } from "react-native";

import { ButtonGroup, Button, ListItem } from "react-native-elements";
import { assoc, filter, omit } from "ramda";
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
  static navigationOptions = ({ navigation }) => {
    const { params = {} } = navigation.state;
    return {
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

    AsyncStorage.getItem("USER", (err, result) => {
      if (err || result === null) goTo(this, "Login");
      else {
        this.setState(JSON.parse(result));
        navigation.setParams(JSON.parse(result));
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
          });
      }
    });
  }

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
          flexDirection: "column",
          backgroundColor: "white"
        }}
      >
        <View
          style={{
            backgroundColor: "#F5F5F5",
            flex: 1,
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
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

        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
            marginBottom: 40,
            marginTop: 20
          }}
        >
          <Button
            title="ME DÉCONNECTER"
            icon={{
              name: "power-off",
              type: "font-awesome",
              size: 15,
              color: "white"
            }}
            onPress={() => {
              // LogOut current user
              const { navigation } = this.props;
              AsyncStorage.removeItem("USER");
              navigation.popToTop();
              navigation.navigate("Login");
            }}
            titleStyle={{ fontWeight: "700" }}
            buttonStyle={{
              backgroundColor: "#2E89AD",
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
          Je suis en télétravail :{" "}
        </Text>
        <ButtonGroup
          containerStyle={{ backgroundColor: "#F5F5F5" }}
          selectedTextStyle={{ color: "#2E89AD", fontWeight: "bold" }}
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
              backgroundColor: "#2E89AD",
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
      </ScrollView>
    );
  }
}

export default SettingsScreen;

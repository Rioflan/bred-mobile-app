// @flow
/* eslint-disable */

import React, { Component } from "react";
import {
  AsyncStorage,
  Text,
  View,
  Image,
  ScrollView,
  ActivityIndicator
} from "react-native";

import { ButtonGroup } from "react-native-elements";
import { assoc, omit } from "ramda";
import PhotoUpload from "react-native-photo-upload";
import config from "../../config/api";
import server from "../../config/server";
import { sendToServ, getPlaces, goTo } from "../../utils/utils";
import picProfile from "../../assets/profile.png";

import styles from './SettingsScreenStyles';

// import { Calendar } from "react-native-calendars";
import Modal from "react-native-modal";
import DeconnectionButton from './components/DeconnectionButton';

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

const ProfileDescription = (props: { name: any, fname: any, id: any }) =>
  <View style={{ marginLeft: 20 }}>
    <Text style={{ fontFamily: 'Raleway' }}>
      <Text style={{ fontWeight: 'bold' }}>Nom : </Text>
      {props.name}{' '}
    </Text>
    <Text style={{ fontFamily: 'Raleway' }}>
      <Text style={{ fontWeight: 'bold' }}>Prenom : </Text>
      {props.fname}
    </Text>
    <Text style={{ fontFamily: 'Raleway' }}>
      <Text style={{ fontWeight: 'bold' }}>ID : </Text>
      {props.id}
    </Text>
  </View>


const ModalComponent = (props: { visible: any }) =>
  <Modal
    isVisible={props.visible}
    backdropColor="white"
    animationIn="fadeIn"
  >
    <ActivityIndicator size="large" color="#2E89AD"/>
  </Modal>


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
      loadingSave: false,
      place: ""
    };
  }

  componentDidMount() {
    const { navigation } = this.props;

    AsyncStorage.getItem("USER", (err, result) => {
      if (err || result === null) goTo(this, "Login");
      else {
        this.setState(JSON.parse(result));
        console.log(JSON.parse(result));
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
            JSON.stringify(
              omit(["loadingSave"], assoc("photo", data[0].photo, this.state))
            )
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
      loadingSave
    } = this.state;

    return (
      <ScrollView
        style={styles.scrollViewContainer}
      >
        <View
          style={styles.viewContainer}
        >
          <ModalComponent visible={loadingSave}/>
          <ProfileDescription name={name} fname={fname} id={id}/>
          <PhotoUpload
            onPhotoSelect={image => {
              if (image) {
                this.setState({ photo: image });
                this.saveRemote();
              }
            }}
          >
            <Image
              style={styles.profileImage}
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

        <Text
          style={styles.remoteText}
        >
          Je suis en télétravail :{" "}
        </Text>
        <ButtonGroup
          containerStyle={{ backgroundColor: "#F5F5F5" }}
          selectedTextStyle={{
            color: "#2E89AD",
            fontWeight: "bold"
          }}
          textStyle={{ fontFamily: "Raleway" }}
          onPress={event => {
            this.updateIndex(event);
            this.saveRemote();
          }}
          selectedIndex={selectedIndex}
          buttons={WEEK_DAYS}
        />

        {/* For future purpose */}
        {/* <Calendar /> */}

        <DeconnectionButton onPress={() => {
          // LogOut current user
          const { navigation } = this.props;
          AsyncStorage.removeItem("USER");
          navigation.popToTop();
          navigation.navigate("Login");
        }}/>
      </ScrollView>
    );
  }
}

export default SettingsScreen;

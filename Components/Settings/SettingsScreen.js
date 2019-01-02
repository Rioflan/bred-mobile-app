// @flow

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
import { connect } from "react-redux";
import { assoc, omit } from "ramda";
import PhotoUpload from "react-native-photo-upload";
import Modal from "react-native-modal";
import config from "../../config/api";
import server from "../../config/server";
import { sendToServ, getPlaces, goTo } from "../../utils/utils";
import picProfile from "../../assets/profile.png";

import styles from "./SettingsScreenStyles";

// import { Calendar } from "react-native-calendars";
import DeconnectionButton from "./components/DeconnectionButton";

import { fetchPhoto, logOut } from "../../Navigation/components/reducer";

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

const ProfileDescription = (props: { name: any, fname: any, id: any }) => {
  const { name, fname, id } = props;
  return (
    <View style={{ marginLeft: 20 }}>
      <Text style={{ fontFamily: "Raleway" }}>
        <Text style={{ fontWeight: "bold" }}>Nom : </Text>
        {name}{" "}
      </Text>
      <Text style={{ fontFamily: "Raleway" }}>
        <Text style={{ fontWeight: "bold" }}>Prenom : </Text>
        {fname}
      </Text>
      <Text style={{ fontFamily: "Raleway" }}>
        <Text style={{ fontWeight: "bold" }}>ID : </Text>
        {id}
      </Text>
    </View>
  );
};

const ModalComponent = (props: { visible: any }) => {
  const { visible } = props;
  return (
    <Modal isVisible={visible} backdropColor="white" animationIn="fadeIn">
      <ActivityIndicator size="large" color="#2E89AD" />
    </Modal>
  );
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
          this.props.fetchPhoto(data[0].photo);
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
    const { selectedIndex, name, fname, id, photo, loadingSave } = this.state;

    return (
      <ScrollView style={styles.scrollViewContainer}>
        <View style={styles.viewContainer}>
          <ModalComponent visible={loadingSave} />
          <ProfileDescription name={name} fname={fname} id={id} />
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

        <Text style={styles.remoteText}>Je suis en télétravail : </Text>
        <ButtonGroup
          containerStyle={{ backgroundColor: "#F5F5F5" }}
          buttonStyle={{
            backgroundColor: "white"
          }}
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

        <DeconnectionButton
          onPress={() => {
            // LogOut current user
            const { navigation } = this.props;
            this.props.logOut("");
            AsyncStorage.removeItem("USER");
            navigation.popToTop();
            navigation.navigate("Login");
          }}
        />
      </ScrollView>
    );
  }
}

const mapStateToProps = state => {
  return {
    photo: state.photo
  };
};

const mapDispatchToProps = {
  fetchPhoto,
  logOut
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SettingsScreen);

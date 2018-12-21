/* eslint-disable */

import React, { Component } from "react";
import { Image, AsyncStorage } from "react-native";

class ProfileImage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      photoURI: ""
    };
  }

  componentWillMount() {
    this.fetchUserPhoto();
  }

  fetchUserPhoto = async () => {
    const userPhoto = await AsyncStorage.getItem("USER");
    this.setState({ photoURI: JSON.parse(userPhoto).photo || "" });
  };

  render() {
    const { photoURI } = this.state;

    return (
      <Image
        source={
          photoURI === ""
            ? require("../../assets/profile.png")
            : {
                uri: photoURI
              }
        }
        style={{
          width: 30,
          height: 30,
          borderRadius: 15,
          margin: 8
        }}
      />
    );
  }
}

export default ProfileImage;

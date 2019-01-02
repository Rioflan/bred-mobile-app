/* eslint-disable */

import React, { Component } from "react";
import { Image, AsyncStorage } from "react-native";

import { fetchPhoto } from "./reducer";
import { connect } from "react-redux";

class ProfileImage extends Component {
  constructor(props) {
    super(props);
  }

  componentWillMount() {
    this.fetchUserPhoto();
  }

  fetchUserPhoto = async () => {
    const userPhoto = await AsyncStorage.getItem("USER");

    this.props.fetchPhoto(JSON.parse(userPhoto).photo || "");
  };

  render() {
    const { photo } = this.props;

    return (
      <Image
        source={
          photo === ""
            ? require("../../assets/profile.png")
            : {
                uri: photo
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

const mapStateToProps = state => {
  return {
    photo: state.photo
  };
};

const mapDispatchToProps = {
  fetchPhoto
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ProfileImage);

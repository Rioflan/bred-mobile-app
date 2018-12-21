// @flow
/* eslint-disable */
import React from "react";

import { AsyncStorage, Image, ScrollView, View, Text } from "react-native";
import { NavigationScreenProp } from "react-navigation";
import config from "../../config/api";
import server from "../../config/server";
import styles from "./ProfileScreenStyles";
import { getPlaces, goTo, sendToServ } from "../../utils/utils";
import Icon from "react-native-vector-icons/FontAwesome";
import I18n from "../../i18n/i18n";

/**
 * List of components
 */
import ManualInsertionCard from "./components/ManualInsertionCard";
import HeaderCard from "./components/HeaderCard";
import QRCodeComponent from './components/QRCodeComponent'

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
  isWrongFormatPlace: boolean
};

type Props = {
  navigation: NavigationScreenProp<{}>
};

class ProfileScreen extends React.Component<Props, State> {
  static navigationOptions = ({ navigation }) => {
    return {
      title: I18n.t("profile.title"),
      tabBarIcon: ({ tintColor }) => (
        <Icon name="qrcode" size={23} color={tintColor} />
      )
    };
  };

  _isMounted = false;

  constructor() {
    super();
    this.state = {
      name: "",
      fname: "",
      id: "",
      place: "",
      isWrongFormatPlace: false
    };
  }

  componentDidMount = () => {
    const { navigation } = this.props;
    this._isMounted = true;
    // Fetch environment variables
    this.fetchAppMode();
    AsyncStorage.getItem("USER", (err, result) => {
      if (err || result === null) goTo(this, "Login");
      else {
        if (this._isMounted) {
          this.setState(JSON.parse(result));
          navigation.setParams(JSON.parse(result));
        }
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
            if (this._isMounted) {
              this.setState({ historical: data[0].historical || [] });
            }
          });
      }
    });
  };

  componentWillUnmount() {
    this._isMounted = false;
  }

  onSuccess = e => {
    this.setState({ place: e.data });
    getPlaces(this, sendToServ);
  };

  fetchAppMode = async () => {
    const environment = await AsyncStorage.getItem("environment");
    this.setState({
      PLACE_REGEX: JSON.parse(environment).PLACE_REGEX
    });
  };

  render() {
    const {
      fname,
      name,
      id,
      place,
      PLACE_REGEX,
      isWrongFormatPlace
    } = this.state;

    console.log(this.state);

    return (
      <ScrollView style={styles.view}>
        <HeaderCard fname={fname} name={name} id={id}/>
        <View>
          <QRCodeComponent onRead={this.onSuccess}/>
          <View>
            <ManualInsertionCard
              onChangeText={text => this.setState({ place: text })}
              onPress={() => {
                if (place !== "" && place.match(PLACE_REGEX) !== null) {
                  getPlaces(this, sendToServ);
                } else this.setState({ isWrongFormatPlace: true });
              }}
            />
            {isWrongFormatPlace ? (
              <Text style={styles.debug}>{I18n.t("profile.format")}</Text>
            ) : null}
          </View>
        </View>
        {/* ) : null} */}
      </ScrollView>
    );
  }
}

export default ProfileScreen;

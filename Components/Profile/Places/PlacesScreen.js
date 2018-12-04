// @flow
/* eslint-disable */

import React from "react";
import {
  ButtonGroup,
  FormInput,
  FormLabel,
  List,
  ListItem,
  Text,
  Button
} from "react-native-elements";

import {
  ActivityIndicator,
  AsyncStorage,
  Image,
  ScrollView,
  TouchableOpacity,
  View
} from "react-native";
import { NavigationScreenProp } from "react-navigation";
import config from "../../../config/api";
import server from "../../../config/server";
import styles from "../ProfileScreenStyles";
import picProfile from "../../../assets/place.png";
import { getPlaces, goTo } from "../../../utils/utils";

import I18n from "../../../i18n/i18n";
import ZoneCard from "./components/ZoneCard";
import FetchPlacesButton from "./components/FetchPlacesButton";

const greenZone = () => (
  <Button
    title={`zone verte`}
    buttonStyle={{
      backgroundColor: "green"
    }}
    containerStyle={{ margin: 20 }}
  />
);
const redZone = () => (
  <Button
    title={`zone rouge`}
    buttonStyle={{
      backgroundColor: "red"
    }}
    containerStyle={{ margin: 20 }}
  />
);
const blueZone = () => (
  <Button
    title={`zone bleue`}
    buttonStyle={{
      backgroundColor: "blue"
    }}
    containerStyle={{ margin: 20 }}
  />
);

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
  search?: string,
  historical: Array<Historical>,
  debug: Array<any> | string
};

type Props = {
  navigation: NavigationScreenProp<{}>
};

class PlacesScreen extends React.Component<Props, State> {
  static navigationOptions = {
    title: I18n.t("places.title"),
    tabBarIcon: () => (
      <Image
        source={picProfile}
        resizeMode="contain"
        style={{
          width: 18,
          height: 18
        }}
      />
    )
  };

  _isMounted = false;

  constructor() {
    super();
    this.state = {
      id: "",
      debug: "",
      search: "",
      RERZonechecked: false,
      ForestZonechecked: false,
      MiddleZonechecked: false,
      SouthZonechecked: false,
      selectedFloorIndex: 0,
      loading: false,
      selectedZoneIndex: 0
    };
  }

  componentDidMount() {
    const { id } = this.state;
    this._isMounted = true;
    AsyncStorage.getItem("USER", (err, result) => {
      if (err || result === null) {
        goTo(this, "Login");
      } else {
        if (this._isMounted) this.setState(JSON.parse(result));
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
              this.setState({ historical: data[0].historical });
            }
          });
      }
    });
    getPlaces(this, this.setPlaces);
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  setPlaces = async (ctx: State, json) => {
    const result = json.filter(
      element => element !== null && element.using === false
    );
    ctx.setState({ debug: result });
  };

  updateFloorIndex = selectedFloorIndex => {
    this.setState({ selectedFloorIndex });
  };

  updateZoneIndex = selectedZoneIndex => {
    this.setState({ selectedZoneIndex });
  };

  /** This function is used to attach the current user to a place  */
  getUser = (ctx, element) => {
    if (
      ctx.state.name !== "" &&
      ctx.state.fname !== "" &&
      ctx.state.id !== "" &&
      element.id !== ""
    ) {
      const { name, fname, id, historical, remoteDay } = ctx.state;
      ctx = ctx || window;

      const payload = {
        name,
        fname,
        id_user: id,
        id_place: element.id,
        historical,
        remoteDay
      };
      fetch(server.address, {
        method: "POST",
        body: JSON.stringify(payload),
        headers: {
          "Content-Type": "application/json",
          "x-access-token": config.token
        }
      })
        .then(res => res.json())
        .then(data => {
          const redirect = !(payload.id_place == element.id && element.using);
          if (redirect) {
            AsyncStorage.setItem(
              "USER",
              JSON.stringify({
                name: payload.name,
                fname: payload.fname,
                id: payload.id_user,
                place: payload.id_place,
                debug: ctx.state.debug,
                historical: ctx.state.historical,
                remoteDay: ctx.state.remoteDay
              })
            );
            goTo(ctx, "Leave");
          }
        });
    }
  };

  handleList = () => {
    const {
      debug,
      search,
      selectedFloorIndex,
      RERZonechecked,
      ForestZonechecked,
      MiddleZonechecked,
      SouthZonechecked
    } = this.state;

    const floor = selectedFloorIndex === 0 ? 3 : 4;

    const newT: string | Array<object> =
      debug !== ""
        ? debug.filter(e => {
            let finalResult = true;

            // Check the current selected floor
            if (e.id[0] != floor) finalResult = false;

            // Check the current selected zone
            if (
              (RERZonechecked && e.id[1] != 3) ||
              (ForestZonechecked && e.id[1] != 1) ||
              (MiddleZonechecked && e.id[1] != 5) ||
              (SouthZonechecked && e.id[1] != 4)
            ) {
              finalResult = false;
            }

            for (const element in search) {
              if (search[element] !== e.id[element]) {
                finalResult = false;
              }
            }
            return finalResult;
          })
        : debug;
    return newT;
  };

  handleSearch = search => {
    this.setState({ search });
  };

  render() {
    const { navigation } = this.props;
    const {
      debug,
      selectedFloorIndex,
      loading,
      RERZonechecked,
      ForestZonechecked,
      SouthZonechecked,
      MiddleZonechecked,
      selectedZoneIndex
    } = this.state;
    const FloorIndex = ["3ème étage", "4ème étage"];

    const buttonsZone = [
      { element: greenZone },
      { element: blueZone },
      { element: redZone }
    ];
    return (
      <ScrollView style={styles.view}>
        {/* <Card>
          <FormLabel>{I18n.t("places.find")}</FormLabel>
          <FormInput
            onChangeText={this.handleSearch}
            placeholder={I18n.t("places.search_place")}
          />
        </Card> */}

        {/* <ZoneCard
          checked={RERZonechecked}
          onPress={() => this.setState({ RERZonechecked: !RERZonechecked })}
          checked1={ForestZonechecked}
          onPress1={() =>
            this.setState({ ForestZonechecked: !ForestZonechecked })
          }
          checked2={SouthZonechecked}
          onPress2={() =>
            this.setState({ SouthZonechecked: !SouthZonechecked })
          }
          checked3={MiddleZonechecked}
          onPress3={() =>
            this.setState({ MiddleZonechecked: !MiddleZonechecked })
          }
        /> */}

        <View style={{ margin: 40 }}>
          <Text
            h4
            style={{
              textAlign: "center",
              fontSize: 16,
              fontWeight: "bold",
              marginBottom: 20
            }}
          >
            {I18n.t("places.floor")}
          </Text>
          <ButtonGroup
            onPress={this.updateFloorIndex}
            selectedIndex={selectedFloorIndex}
            selectedButtonStyle={{
              backgroundColor: "#2E89AD"
            }}
            buttonStyle={{
              backgroundColor: "white",
              borderColor: "#2E89AD",
              borderWidth: 2,
              borderRadius: 3
            }}
            containerStyle={{
              height: 30
            }}
            selectedTextStyle={{ color: "white" }}
            textStyle={{ color: "black" }}
            buttons={FloorIndex}
          />
          <View
            style={{
              flex: 1,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-around"
            }}
          >
            {/* Zone button group */}
            {/* <ButtonGroup
              onPress={this.updateZoneIndex}
              selectedIndex={selectedZoneIndex}
              selectedTextStyle={{ color: "white", fontWeight: "bold" }}
              textStyle={{ color: "white" }}
              buttons={buttonsZone}
            /> */}
          </View>
          <FetchPlacesButton
            onPress={() => getPlaces(this, this.setPlaces, null, true)}
          />
        </View>
        <Text
          h4
          style={{
            textAlign: "center",
            fontSize: 16,
            fontWeight: "bold"
          }}
        >
          Places disponibles
        </Text>
        <View style={{ margin: 40 }}>
          {debug !== "" && debug && !loading ? (
            <List containerStyle={{ marginBottom: 20 }}>
              {this.handleList().map(
                place =>
                  place ? (
                    <TouchableOpacity
                      key={place.id}
                      onPress={() => getPlaces(this, this.getUser, place)}
                    >
                      <ListItem key={place.id} title={place.id} />
                    </TouchableOpacity>
                  ) : (
                    "There is no free place for the moment !"
                  )
              )}
            </List>
          ) : (
            <ActivityIndicator
              style={{ marginTop: 20 }}
              size="large"
              color="#2E89AD"
            />
          )}
        </View>
      </ScrollView>
    );
  }
}

export default PlacesScreen;

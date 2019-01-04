// @flow
/* eslint-disable */
import React from "react";
import { ButtonGroup, List, ListItem, Text, Card } from "react-native-elements";
import Icon from "react-native-vector-icons/FontAwesome";

import {
  ActivityIndicator,
  AsyncStorage,
  ScrollView,
  TouchableOpacity,
  View,
  FlatList
} from "react-native";
import { NavigationScreenProp } from "react-navigation";
import config from "../../../config/api";
import server from "../../../config/server";
import styles from "../ProfileScreenStyles";
import { getPlaces, goTo } from "../../../utils/utils";

import I18n from "../../../i18n/i18n";
import LottieView from "lottie-react-native";

/**
 * List of components
 */
import FetchPlacesButton from "./components/FetchPlacesButton";

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
    tabBarIcon: ({ tintColor }) => (
      <Icon name="search" size={20} color={tintColor} />
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
      const { name, fname, id, historical, remoteDay, photo } = ctx.state;

      ctx = ctx || window;

      const payload = {
        name,
        fname,
        id_user: id,
        id_place: element.id,
        historical,
        remoteDay,
        photo
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
          const redirect = !(payload.id_place === element.id && element.using);
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
                remoteDay: ctx.state.remoteDay,
                photo: ctx.state.photo
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

            Object.keys(search).forEach(element => {
              if (search[element] !== e.id[element]) {
                finalResult = false;
              }
            });
            return finalResult;
          })
        : debug;
    return newT;
  };

  handleSearch = search => {
    this.setState({ search });
  };

  render() {
    const {
      debug,
      selectedFloorIndex,
      loading,
      selectedZoneIndex
    } = this.state;
    const FloorIndex = ["3ème étage", "4ème étage"];

    const ZoneIndex = ["Zone verte", "Zone bleue", "Zone rouge"];

    // if (this.state.historical)
    //   console.log(
    //     this.state.historical.slice(
    //       Math.max(this.state.historical.length - 5, 1)
    //     )
    //   );
    return (
      <ScrollView style={styles.view}>
        <View
          style={{
            padding: 25,
            borderRadius: 10,
            backgroundColor: "white",
            margin: 20,
            shadowOpacity: 0.4,
            shadowRadius: 2,
            shadowColor: "#3662A0",
            shadowOffset: { height: 1, width: 0 }
          }}
        >
          <ButtonGroup
            onPress={this.updateFloorIndex}
            selectedIndex={selectedFloorIndex}
            buttonStyle={{
              backgroundColor: "white",
              borderColor: "#2E89AD"
            }}
            containerStyle={{
              height: 30,
              borderRadius: 5
            }}
            selectedTextStyle={{ color: "#2E89AD", fontWeight: "bold" }}
            textStyle={{ color: "black", fontFamily: "Raleway" }}
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
            <ButtonGroup
              onPress={this.updateZoneIndex}
              containerStyle={{
                height: 30,
                width: 300,
                shadowOpacity: 0.4,
                shadowRadius: 2,
                shadowColor: "#3662A0",
                shadowOffset: { height: 1, width: 0 },
                borderRadius: 5
              }}
              selectedIndex={selectedZoneIndex}
              buttonStyle={{
                backgroundColor: "white",
                borderColor: "#2E89AD"
              }}
              selectedTextStyle={{ color: "#2E89AD", fontWeight: "bold" }}
              textStyle={{ color: "black", fontFamily: "Raleway" }}
              buttons={ZoneIndex}
            />
          </View>
          {/* <GradientBtn /> */}
        </View>
        <View
          style={{
            flex: 1,
            justifyContent: "space-around",
            alignItems: "center",
            flexDirection: "row"
          }}
        >
          <FetchPlacesButton
            onPress={() => getPlaces(this, this.setPlaces, null, true)}
          />
        </View>
        {/* <Text
          h4
          style={{
            textAlign: "center",
            fontSize: 16,
            fontWeight: "bold",
            fontFamily: "Raleway"
          }}
        >
          Places disponibles
        </Text> */}
        <View style={{ marginTop: 5, marginLeft: 35, marginRight: 35 }}>
          {debug !== "" && debug && !loading ? (
            <FlatList
              data={this.handleList()}
              keyExtractor={(item, index) => index.toString()}
              contentContainerStyle={{
                justifyContent: "space-between",
                alignItems: "center",
                width: 300
              }}
              style={{
                marginBottom: 20
              }}
              numColumns={3}
              // columnWrapperStyle={{ width: 200 }}
              renderItem={place =>
                place ? (
                  <TouchableOpacity
                    key={place.item.id}
                    // onPress={() => getPlaces(this, this.getUser, place)}
                  >
                    <Card
                      key={place.item.id}
                      title={place.item.id}
                      fontFamily="Raleway"
                      containerStyle={{
                        borderRadius: 10,
                        height: 70
                      }}
                      dividerStyle={{ display: "none" }}
                      // rightIcon={<Icon name="plus" size={20} color="#2E89AD" />}
                    >
                      <Icon
                        styl={{ textAlign: "center" }}
                        name="circle"
                        size={15}
                        color={
                          place.item.id[1] === "1"
                            ? "green"
                            : place.item.id[1] === "3"
                              ? "blue"
                              : "red"
                        }
                      />
                    </Card>
                  </TouchableOpacity>
                ) : (
                  "There is no free place for the moment !"
                )
              }
            />
          ) : (
            // <ActivityIndicator
            //   style={{ marginTop: 20 }}
            //   size="large"
            //   color="#2E89AD"
            // />
            <View
              style={{
                backgroundColor: "white",
                flex: 1,
                justifyContent: "center",
                alignItems: "center"
              }}
            >
              {" "}
              <LottieView
                style={{ height: 80, width: 80, marginTop: 30 }}
                source={require("../../../assets/loading.json")}
                autoPlay
                loop
              />
            </View>
          )}
        </View>
      </ScrollView>
    );
  }
}

export default PlacesScreen;

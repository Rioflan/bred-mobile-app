// @flow
import React from 'react';
import {
  Button,
  Card,
  FormInput,
  Text,
  List,
  ListItem,
  SearchBar,
  CheckBox,
  ButtonGroup,
  FormLabel,
} from 'react-native-elements';

import {
 View, TextInput, AsyncStorage, ScrollView, Image 
} from 'react-native';
import { NavigationScreenProp } from 'react-navigation';
import { filter, find, propEq } from 'ramda';
import config from '../../../config/api';
import server from '../../../config/server';
import styles from '../ProfileScreenStyles';
import picProfile from '../../../assets/place.png';
import { getPlaces, goTo } from '../../../utils/utils';

import I18n from '../../../i18n/i18n';

type Historical = {
  place_id: string,
  begin: string,
  end: string,
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

class ProfileScreen extends React.Component<Props, State> {
  static navigationOptions = {
    title: I18n.t('places.title'),
    tabBarIcon: ({ focused, tintColor }) => (
      <Image
        source={picProfile}
        resizeMode="contain"
        style={{ width: 18, height: 18 }}
      />
    )
  };
  _isMounted = false;

  constructor() {
    super();
    this.state = {
      name: "",
      fname: "",
      id: "",
      place: "",
      debug: "",
      search: "",
      historical: [],
      BlueZonechecked: false,
      RedZonechecked: false,
      GreenZonechecked: false,
      selectedFloorIndex: 0
    };
  }

  componentDidMount() {
    const { id } = this.state;
    this._isMounted = true;
    AsyncStorage.getItem("USER", (err, result) => {
      if (err || result === null) goTo(this, "Login");
      else {
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
            if (this._isMounted)
              this.setState({ historical: data[0].historical });
          });
      }
    });
    getPlaces(this, this.setPlaces);
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  async setPlaces(ctx: State, json) {
    const result = json.filter(
      element => element !== null && element.using === false
    );
    ctx.setState({ debug: result });
  }

  _handleSearch = search => {
    this.setState({ search });
  };

  _handleList = () => {
    const { debug, search, selectedFloorIndex } = this.state;

    const floor = selectedFloorIndex === 0 ? 3 : 4;

    const newT: string | Array<object> =
      debug !== ""
        ? debug.filter(e => {
            let finalResult = true;
            if (e.id[0] != floor) finalResult = false;
            for (const element in search) {
              if (search[element] !== e.id[element] ) {
                finalResult = false;
              }
            }
            return finalResult;
          })
        : debug;
    return newT;
  };

  updateFloorIndex = selectedFloorIndex => {
    this.setState({ selectedFloorIndex });
  };

  /** This function is used to attach the current user to a place  */
  getUser(ctx, element) {
    if (
      ctx.state.name !== "" &&
      ctx.state.fname !== "" &&
      ctx.state.id !== "" &&
      element.id !== ""
    ) {
      const { name, fname, id, historical } = ctx.state;
      ctx = ctx || window;

      const payload = {
        name,
        fname,
        id_user: id,
        id_place: element.id,
        historical
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
          let redirect: boolean = true;
          payload.id_place == element.id && element.using
            ? (redirect = false)
            : null;
          if (redirect) {
            AsyncStorage.setItem(
              "USER",
              JSON.stringify({
                name: payload.name,
                fname: payload.fname,
                id: payload.id_user,
                place: payload.id_place,
                debug: ctx.state.debug,
                historical: ctx.state.historical
              })
            );
            goTo(ctx, "Leave");
          }
        });
    }
  }

  render() {
    const navigation = this.props.navigation;
    const { fname, name, id, debug, selectedFloorIndex } = this.state;
    const FloorIndex = [3, 4];

    return (
      <ScrollView style={styles.view}>
        <Card>
          <View style={styles.emptyPlaces_container}>
            <Button
              iconRight={{ name: 'spinner', type: 'font-awesome' }}
              fontWeight="bold"
              large={false}
              borderRadius={15}
              backgroundColor="#5167A4"
              color="#fff"
              style={styles.free_places}
              title={I18n.t('places.free_places')}
              onPress={() => getPlaces(this, this.setPlaces)}
            />
          </View>
          <FormLabel>{I18n.t('places.find')}</FormLabel>
          <FormInput
            onChangeText={this._handleSearch}
            style={{
              backgroundColor: "white",
              marginTop: 10
            }}
            placeholder={I18n.t('places.search_place')}
          />
        </Card>
        <Card>
          <Text h4 style={{ textAlign: "center", fontSize: 16 }}>
            {I18n.t('places.zone')}
          </Text>
          <CheckBox
            center
            title={I18n.t('places.blue_zone')}
            checkedIcon="dot-circle-o"
            checkedColor="#5167A4"
            uncheckedIcon="circle-o"
            checked={this.state.BlueZonechecked}
            onPress={() =>
              this.setState({ BlueZonechecked: !this.state.BlueZonechecked })
            }
          />
          <CheckBox
            center
            title={I18n.t('places.red_zone')}
            checkedIcon="dot-circle-o"
            checkedColor="#5167A4"
            uncheckedIcon="circle-o"
            checked={this.state.RedZonechecked}
            onPress={() =>
              this.setState({ RedZonechecked: !this.state.RedZonechecked })
            }
          />
          <CheckBox
            center
            title={I18n.t('places.green_zone')}
            checkedIcon="dot-circle-o"
            checkedColor="#5167A4"
            uncheckedIcon="circle-o"
            checked={this.state.GreenZonechecked}
            onPress={() =>
              this.setState({ GreenZonechecked: !this.state.GreenZonechecked })
            }
          />
        </Card>
        <Card>
          <Text h4 style={{ textAlign: "center", fontSize: 16 }}>
            {I18n.t('places.floor')}
          </Text>
          <ButtonGroup
            onPress={this.updateFloorIndex}
            selectedIndex={selectedFloorIndex}
            buttons={FloorIndex}
          />
        </Card>
        <Card>
          {debug !== "" && debug ? (
            <List containerStyle={{ marginBottom: 20 }}>
              {this._handleList().map(
                place =>
                  place ? (
                    <ListItem
                      onPress={() => getPlaces(this, this.getUser, place)}
                      key={place.id}
                      title={place.id}
                    />
                  ) : (
                    "There is no free place for the moment !"
                  )
              )}
            </List>
          ) : null}
        </Card>
      </ScrollView>
    );
  }
}

export default ProfileScreen

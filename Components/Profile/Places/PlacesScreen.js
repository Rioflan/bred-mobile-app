// @flow
import React from 'react'
import {
  ButtonGroup,
  Card,
  FormInput,
  FormLabel,
  List,
  ListItem,
  Text
} from 'react-native-elements'

import { ActivityIndicator, AsyncStorage, Image, ScrollView, TextInput, View, TouchableOpacity } from 'react-native'
import { NavigationScreenProp } from 'react-navigation'
import config from '../../../config/api'
import server from '../../../config/server'
import styles from '../ProfileScreenStyles'
import picProfile from '../../../assets/place.png'
import { getPlaces, goTo } from '../../../utils/utils'

import I18n from '../../../i18n/i18n'
import ZoneCard from './components/ZoneCard'
import FetchPlacesButton from './components/FetchPlacesButton'

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
    title: I18n.t('places.title'),
    tabBarIcon: ({ focused, tintColor }) => (
      <Image
        source={picProfile}
        resizeMode="contain"
        style={{
          width: 18,
          height: 18
        }}
      />
    )
  }

  _isMounted = false

  constructor() {
    super()
    this.state = {
      name: '',
      fname: '',
      id: '',
      place: '',
      debug: '',
      search: '',
      historical: [],
      RERZonechecked: false,
      ForestZonechecked: false,
      MiddleZonechecked: false,
      SouthZonechecked: false,
      selectedFloorIndex: 0,
      loading: false
    }
  }

  componentDidMount() {
    const { id } = this.state
    this._isMounted = true
    AsyncStorage.getItem('USER', (err, result) => {
      if (err || result === null) {
        goTo(this, 'Login')
      } else {
        if (this._isMounted) this.setState(JSON.parse(result))
        const userId = JSON.parse(result).id
        fetch(`${server.address}users/${userId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'x-access-token': config.token
      }
    })
          .then(res => res.json()) // transform data to json
          .then((data) => {
            if (this._isMounted) {
              this.setState({ historical: data[0].historical })
            }
          })
      }
    })
    getPlaces(this, this.setPlaces)
  }

  componentWillUnmount() {
    this._isMounted = false
  }

  async setPlaces(ctx: State, json) {
    const result = json.filter(
      element => element !== null && element.using === false
    )
    ctx.setState({ debug: result })
  }

  _handleSearch = (search) => {
    this.setState({ search })
  }

  _handleList = () => {
    const { 
    debug,
    search,
    selectedFloorIndex,
    RERZonechecked,
    ForestZonechecked,
    MiddleZonechecked,
    SouthZonechecked
    } = this.state

    const floor = selectedFloorIndex === 0 ? 3 : 4

    const newT: string | Array<object> = debug !== ''
      ? debug.filter((e) => {
        let finalResult = true

      // Check the current selected floor
        if (e.id[0] != floor) finalResult = false

      // Check the current selected zone
        if (
          (RERZonechecked && e.id[1] != 3) || 
          (ForestZonechecked && e.id[1] != 1) || 
          (MiddleZonechecked && e.id[1] != 5) || 
          (SouthZonechecked && e.id[1] != 4)) finalResult = false

        for (const element in search) {
          if (search[element] !== e.id[element]) {
            finalResult = false
          }
        }
        return finalResult
      })
      : debug
    return newT
  }

  updateFloorIndex = (selectedFloorIndex) => {
    this.setState({ selectedFloorIndex })
  }

  /** This function is used to attach the current user to a place  */
  getUser(ctx, element) {
    if (
      ctx.state.name !== '' &&
      ctx.state.fname !== '' &&
      ctx.state.id !== '' &&
      element.id !== ''
    ) {
      const {
        name, fname, id, historical, isRemote
      } = ctx.state
      ctx = ctx || window

      const payload = {
        name,
        fname,
        id_user: id,
        id_place: element.id,
        historical,
        isRemote
      }
      fetch(server.address, {
        method: 'POST',
        body: JSON.stringify(payload),
        headers: {
          'Content-Type': 'application/json',
          'x-access-token': config.token
        }
      })
        .then(res => res.json())
        .then((data) => {
          let redirect: boolean = true
          payload.id_place == element.id && element.using
            ? (redirect = false)
            : null
          if (redirect) {
            AsyncStorage.setItem(
              'USER',
              JSON.stringify({
                name: payload.name,
                fname: payload.fname,
                id: payload.id_user,
                place: payload.id_place,
                debug: ctx.state.debug,
                historical: ctx.state.historical,
                isRemote: ctx.state.isRemote
              })
            )
            goTo(ctx, 'Leave')
          }
        })
    }
  }

  render() {
    const navigation = this.props.navigation
    const {
      fname,
      name,
      id,
      debug,
      selectedFloorIndex,
      loading,
      RERZonechecked,
      ForestZonechecked,
      SouthZonechecked,
      MiddleZonechecked,
      isRemote
    } = this.state
    const FloorIndex = [3, 4]

    return (
      <ScrollView style={styles.view}>
        <Card>
          <FormLabel>{I18n.t('places.find')}</FormLabel>
          <FormInput
            onChangeText={this._handleSearch}
            placeholder={I18n.t('places.search_place')}
          />
        </Card>
        <ZoneCard
          checked={RERZonechecked}
          onPress={() => this.setState({ RERZonechecked: !RERZonechecked })}
          checked1={ForestZonechecked}
          onPress1={() => this.setState({ ForestZonechecked: !ForestZonechecked })}
          checked2={SouthZonechecked}
          onPress2={() => this.setState({ SouthZonechecked: !SouthZonechecked })}
          checked3={MiddleZonechecked}
          onPress3={() => this.setState({ MiddleZonechecked: !MiddleZonechecked })}
        />
        <Card>
          <Text
            h4
            style={{
              textAlign: 'center',
              fontSize: 16
            }}
          >
            {I18n.t('places.floor')}
          </Text>
          <ButtonGroup
            onPress={this.updateFloorIndex}
            selectedIndex={selectedFloorIndex}
            buttons={FloorIndex}
          />
          <FetchPlacesButton
            onPress={() => getPlaces(this, this.setPlaces, null, true)
            }
          />
        </Card>
        <Card>
          {debug !== '' && debug && !loading ? (
            <List containerStyle={{ marginBottom: 20 }}>
              {this._handleList()
                .map(
                  place => (place ? (
                    <TouchableOpacity onPress={() => 
                    AsyncStorage.getItem('USER', (err, result) => {
                      if (JSON.parse(result).isRemote === false) return getPlaces(this, this.getUser, place)
                    })}>
                      <ListItem
                        key={place.id}
                        title={place.id}
                      />
                      </TouchableOpacity>
                    ) : (
                      'There is no free place for the moment !'
                    )
                  ))}
            </List>
          ) : (
            <ActivityIndicator
              style={{ marginTop: 20 }}
              size="large"
              color="#5167A4"
            />
          )}
        </Card>
      </ScrollView>
    )
  }
}

export default PlacesScreen

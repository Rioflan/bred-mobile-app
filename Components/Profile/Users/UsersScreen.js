// @flow
import React from 'react'
import { Card, FormInput, FormLabel, ListItem } from 'react-native-elements'

import { ActivityIndicator, AsyncStorage, Image, ScrollView, TextInput, View } from 'react-native'
import { NavigationScreenProp } from 'react-navigation'
import config from '../../../config/api'
import server from '../../../config/server'
import styles from '../ProfileScreenStyles'
import picUser from '../../../assets/users.png'

import I18n from 'react-native-i18n'
import FindPlacesCard from './components/FindPlacesCard'
import ListPlaces from './components/ListPlaces'

type State = {
  users: Array<any> | string
};

type Props = {
  navigation: NavigationScreenProp<{}>
};

class UsersScreen extends React.Component<Props, State> {
  static navigationOptions = {
    title: I18n.t('users.title'),
    tabBarIcon: () => {
      return <Image source={picUser} resizeMode="contain" style={{
        width: 20,
        height: 20
      }}/>
    }
  }

  _isMounted = false

  constructor() {
    super()
    this.state = {
      users: [],
      search: '',
      userName: null,
      loading: false
    }
  }

  componentDidMount() {
    const { id } = this.state
    AsyncStorage.getItem('USER', (err, result) => {
      if (err || result === null) {
        goTo(this, 'Login')
      } else {
        const userName = JSON.parse(result).name
        const userFName = JSON.parse(result).fname
        this.setState({ userName: `${userName}/${userFName}` })
      }
    })
    this._isMounted = true
    this.getUsers()
  }

  getUsers() {
    this.setState({ loading: true })
    fetch(`${server.address}users/`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'x-access-token': config.token
      }
    })
      .then(res => res.json()) // transform data to json
      .then((users) => {
        if (this._isMounted) this.setState({ users })
        this.setState({ loading: false })
      })
  };

  componentWillUnmount() {
    this._isMounted = false
  }

  _handleSearch = (search) => {
    this.setState({ search })
  }

  _handleList = () => {
    const { users, search } = this.state

    const newT: string | Array<object> = users !== []
      ? users.filter((e) => {
        let finalResult = true
        for (const element in search) {
          if (search[element] !== e.name[element]) {
            finalResult = false
          }
        }
        return finalResult
      })
      : users
    newT.sort((a, b) => {
      if (a.name < b.name) return -1
      if (a.name > b.name) return 1
      return 0
    })
    users.sort((a, b) => {
      if (a.name < b.name) return -1
      if (a.name > b.name) return 1
      return 0
    })
    return search === '' ? users : newT
  }

  render() {
    const navigation = this.props.navigation
    const { users, loading } = this.state

    return (
      <ScrollView style={styles.view}>
        <Card>
          <FindPlacesCard users={this.getUsers.bind(this)}/>
          <FormLabel>{I18n.t('users.find')}</FormLabel>
          <FormInput
            onChangeText={this._handleSearch}
            style={{
              backgroundColor: 'white',
              marginTop: 10
            }}
            placeholder={I18n.t('users.search_user')}
          />
          {users !== [] && users && !loading ? (
            <ListPlaces handleList={this._handleList()}
                        prop1={item => item && `${item.name}/${item.fname}` !== this.state.userName ?
                          (
                            <ListItem
                              rightIcon={{
                                name: item.id_place ? 'toggle-on' : 'toggle-off',
                                type: 'font-awesome'
                              }}
                              key={item.id}
                              title={`${item.name} / ${item.fname}`}
                              subtitle={item.id_place}
                            />
                          ) : null}/>
          ) : <ActivityIndicator style={{ marginTop: 20 }} size="large" color="#5167A4"/>}
        </Card>
      </ScrollView>
    )
  }
}

export default UsersScreen

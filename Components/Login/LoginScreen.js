// @flow

import React from 'react'
import { AsyncStorage, View } from 'react-native'

import { Text } from 'react-native-elements'
import { omit } from 'ramda'
import styles from './LoginScreenStyles'
import server from '../../config/server'
import config from '../../config/api'
import type { Props, State } from './LoginScreenType'

import { config_regex } from '../../config/regex.json'

import I18n from '../../i18n/i18n'
import LoginButton from './components/LoginButton'
import InputLogin from './components/InputLogin'

class LoginScreen extends React.Component<Props, State> {
  static navigationOptions = {
    title: I18n.t('login.title')
  }

  constructor() {
    super()
    this.state = {
      name: '',
      fname: '',
      id: '',
      place: '',
      debug: '',
      debugField: '',
      historical: []
    }
  }

  logOut() {
    AsyncStorage.removeItem('USER')
  }

  /** This function handle the user login */
  logIn() {
    const { navigation } = this.props

    if (
      this.state.name !== '' &&
      this.state.fname !== '' &&
      this.state.id !== '' &&
      this.state.id.match(config_regex) !== null
    ) {
      const payload = {
        name: this.state.name,
        fname: this.state.fname,
        id_user: this.state.id,
        id_place: '',
        historical: this.state.historical
      }

      
      fetch(`${server.address}login_user`, {
        method: 'POST',
        body: JSON.stringify(payload),
        headers: {
          'Content-Type': 'application/json',
          'x-access-token': config.token
        }
      })
        .catch(err => console.log(err))
        .then(res => res.json())
        .then(data => {
          const redirect: boolean = true
          if (redirect) {
            if (data.user) this.setState({ isRemote: data.user.isRemote })
            AsyncStorage.setItem(
              'USER',
              JSON.stringify(omit('debugField', this.state))
            )
            navigation.goBack()
            navigation.navigate('Profile')
          }
        })
    } else {
      this.setState({ debugField: I18n.t('login.debug') })
    }
  }

  render() {
    const { debugField } = this.state
    return (
      <View style={styles.view}>
        <View style={styles.view_second}>
          <InputLogin onChangeText={text => this.setState({ name: text })}
                      onChangeText1={text => this.setState({ fname: text })}
                      onChangeText2={text => this.setState({ id: text })}/>
          <LoginButton onPress={() => this.logIn()}/>

          <Text style={styles.debug}>{debugField}</Text>
        </View>
      </View>
    )
  }
}

export default LoginScreen

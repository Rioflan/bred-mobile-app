// @flow

import React, { Component } from 'react';
import { AsyncStorage } from 'react-native';
import {
 AppRegistry, Text, TouchableOpacity, Linking 
} from 'react-native';
import QRCodeScanner from 'react-native-qrcode-scanner';
import config from '../../config/api';
import server from '../../config/server';
import styles from './ScanScreenStyles';
import { sendToServ, getPlaces, goTo } from '../../utils/utils';

import I18n from '../../i18n/i18n';

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
  historical: Array<Historical>,
  debug: Array<any> | string
};

type Props = {
  navigation: NavigationScreenProp<{}>
};

class ScanScreen extends Component<Props, State> {
  static navigationOptions = {
    title: 'Scan',
    headerTintColor: 'black',
  };

  constructor() {
    super()
    this.state = {
      name: '',
      fname: '',
      id: '',
      place: '',
      debug: '',
      historical: [],
    }
  }

  componentDidMount() {
    const { id } = this.state
    AsyncStorage.getItem('USER', (err, result) => {
      if (err || result === null) goTo(this, 'Login');
      else {
        this.setState(JSON.parse(result))
        const userId = JSON.parse(result).id
        fetch(`${server.address}users/${userId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'x-access-token': config.token,
          },
        })
          .then(res => res.json()) // transform data to json
          .then((data) => {
            this.setState({ historical: data[0].historical })
          });
      }
    })
  }

  onSuccess = (e) => {
    this.setState({ place: e.data })
    getPlaces(this, sendToServ)
  };

  render() {
    return (
      <QRCodeScanner
        onRead={this.onSuccess.bind(this)}
        topContent={<Text style={styles.centerText}>{I18n.t('scan.scan_qr_code')}</Text>}
      />
    )
  }
}

export default ScanScreen

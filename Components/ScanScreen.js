'use strict';

import React, { Component } from 'react';
import { AsyncStorage } from 'react-native';
import config from '../config/api';
import server from '../config/server';


import {
  AppRegistry,
  StyleSheet,
  Text,
  TouchableOpacity,
  Linking,
} from 'react-native';

import QRCodeScanner from 'react-native-qrcode-scanner';

class ScanScreen extends Component {
  static navigationOptions = {
    title: 'Scan',
  };

  constructor(){
    super();
    this.state = {
      name: '',
      fname: '',
      id:'',
      place:'',
      debug:'',
    }
  }

  componentDidMount(){
    AsyncStorage.getItem('USER', (err, result) => {
      if(err || result == null)
        this.goTo('Login');
      else {
        this.setState(JSON.parse(result));
      }
    });
  }

  goTo(str) {
    const navigation = this.props.navigation;
    navigation.popToTop();
    navigation.navigate(str);
  }

  onSuccess(e) {
    this.setState( { place:e.data });
    this.getPlaces(this, this.sendToServ);
  }

    sendToServ(ctx, json) {
      if(ctx.state.name != '' && ctx.state.fname != '' && ctx.state.id != '' && ctx.state.place != '')
      {
        var ctx = ctx || window;

        var payload = {
            name: ctx.state.name,
            fname: ctx.state.fname,
            id_user: ctx.state.id,
            id_place: ctx.state.place
        };

        fetch(server.address, {
          method: "POST",
          body: JSON.stringify(payload),
          headers: {
            "Content-Type": "application/json",
            "x-access-token": config.token
          }
        })
        .then(function(res){
          return res.json();
        })
        .then(function(data){
          var redirect = true;
          json.forEach(function(element){
            if(payload.id_place == element.id && element.using)
              redirect = false;
          });
          if(redirect)
          {
            ctx.state.debug = 'Wellcome';
            AsyncStorage.setItem('USER', JSON.stringify(ctx.state));

            ctx.goTo('Leave');
          }
        })
      }
    }

    getPlaces(ctx, fn) {
      ctx = ctx || window;

      fetch(server.address + "places/", {
        method: "GET",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          "x-access-token": config.token
        }
      })
      .then(function(res){ return res.json(); })//transform data to json
      .then(function(data)
      {
        fn(ctx, data);
      });
    }

  render() {
    return (
      <QRCodeScanner
        onRead={this.onSuccess.bind(this)}
        topContent={
          <Text style={styles.centerText}>
            Scan the QR code.
          </Text>
        }
      />
    );
  }
}

const styles = StyleSheet.create({
  centerText: {
    flex: 1,
    fontSize: 18,
    padding: 32,
    color: '#777',
  },
  textBold: {
    fontWeight: '500',
    color: '#000',
  },
  buttonText: {
    fontSize: 21,
    color: 'rgb(0,122,255)',
  },
  buttonTouchable: {
    padding: 16,
  },
});

export default ScanScreen;

// @flow
import React from 'react';
import {
AsyncStorage,
} from 'react-native';

import { filter, find, propEq } from 'ramda';
import config from '../config/api';
import server from '../config/server';

/** This function is used to send a new place to the server */

export const sendToServ = (ctx, json) => {
  if (
    ctx.state.name !== "" &&
    ctx.state.fname !== "" &&
    ctx.state.id !== "" &&
    ctx.state.place !== "" &&
    ctx.state.historical !== []
  ) {
    const { name, fname, id, place, historical } = ctx.state;
    ctx = ctx || window;

    const payload = {
      name,
      fname,
      id_user: id,
      id_place: place,
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
        let redirect = true;
        json.map(
          element =>
            payload.id_place == element.id && element.using
              ? (redirect = false)
              : null
        );
        if (redirect) {
          AsyncStorage.setItem("USER", JSON.stringify(ctx.state));

          goTo(ctx, "Leave");
        }
      });
  }
};

export const goTo = (ctx, str: string) => {
    const navigation = ctx.props.navigation;
    navigation.popToTop();
    navigation.navigate(str);
  }

/** This function is used to get the places from the server */

export const getPlaces = (ctx, fn, element = null) => {
    ctx = ctx || window;

    fetch(`${server.address}places/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "x-access-token": config.token
      }
    })
      .then(res => res.json()) // transform data to json
      .then(data => {
        if (element) {
          fn(ctx, element);
        } else {
          fn(ctx, data);
        }
      });
  }

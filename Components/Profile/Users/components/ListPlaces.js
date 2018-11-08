import { List } from 'react-native-elements'
import React from 'react'

const ListPlaces = (props: { handleList: any, prop1: (any) => null }) => {
  return <List containerStyle={{ marginBottom: 20 }}>
    {props.handleList
      .map(
        props.prop1
      )}
  </List>
}

export default ListPlaces

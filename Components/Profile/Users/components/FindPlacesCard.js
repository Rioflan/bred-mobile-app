import { View } from 'react-native'
import styles from '../../ProfileScreenStyles'
import { Button } from 'react-native-elements'
import I18n from 'react-native-i18n'
import React from 'react'
import ListPlaces from './ListPlaces'

const FindPlacesCard = (props: { users: any }) => {
  return <View style={styles.emptyPlaces_container}>
    <Button
      fontWeight="bold"
      iconRight={{
        name: 'sync',
        type: 'font-awesome5'
      }}
      large={false}
      borderRadius={15}
      backgroundColor="#5167A4"
      color="#fff"
      style={styles.free_places}
      title={I18n.t('users.users')}
      onPress={props.users}
    />
  </View>
}

export default FindPlacesCard

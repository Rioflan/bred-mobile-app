import { View } from 'react-native'
import styles from '../ProfileScreenStyles'
import { Text } from 'react-native-elements'
import React from 'react'
import LoginButton from '../../Login/components/LoginButton'

const HeaderCard = (props: { fname: any, name: any, id: any }) => {
  return <View style={styles.view_second}>
    <Text h4 style={styles.text_first}>
      {props.fname} {props.name} [{props.id}]
    </Text>
  </View>
}

export default HeaderCard

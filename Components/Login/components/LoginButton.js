import { View } from 'react-native'
import styles from '../LoginScreenStyles'
import { Button } from 'react-native-elements'
import I18n from '../../../i18n/i18n'
import React from 'react'
import InputLogin from './InputLogin'

const LoginButton = (props: { onPress: () => void }) => {
  return <View style={styles.button_container}>
    <Button
      style={styles.button_login}
      fontWeight="bold"
      borderRadius={15}
      backgroundColor="#5167A4"
      color="#fff"
      title={I18n.t('login.title')}
      onPress={props.onPress}
    />
  </View>
}

export default LoginButton

import { Button, View } from 'react-native'
import styles from '../HomeScreenStyles'
import I18n from '../../../i18n/i18n'
import React from 'react'

const HomeButton = (props: { onPress: () => void }) => {
  return (
    <View style={styles.button_wrapper}>
      <Button
        style={styles.button}
        title={I18n.t('home.main_page')}
        color="#5167A4"
        onPress={props.onPress}
      />
    </View>)
}

export default HomeButton

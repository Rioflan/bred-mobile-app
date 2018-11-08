import { View } from 'react-native'
import { FormInput } from 'react-native-elements'
import styles from '../LoginScreenStyles'
import I18n from '../../../i18n/i18n'
import React from 'react'
import LeaveButton from '../../Leave/components/LeaveButton'

const InputLogin = (props: { onChangeText: (any) => void, onChangeText1: (any) => void, onChangeText2: (any) => void }) => {
  return <View>
    <FormInput
      style={styles.textInput}
      placeholder={I18n.t('login.name')}
      onChangeText={props.onChangeText}
    />

    <FormInput
      style={styles.textInput}
      placeholder={I18n.t('login.surname')}
      onChangeText={props.onChangeText1}
    />

    <FormInput
      style={styles.textInput}
      placeholder={I18n.t('login.id')}
      onChangeText={props.onChangeText2}
    />
  </View>
}

export default InputLogin

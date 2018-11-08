import { Button, Card } from 'react-native-elements'
import I18n from '../../../i18n/i18n'
import { View } from 'react-native'
import styles from '../ProfileScreenStyles'
import React from 'react'
import ManualInsertionCard from './ManualInsertionCard'

const QRCodeCard = (props: { onPress: () => any }) => {
  return <Card title={I18n.t('profile.scan_qr_code')}>
    <View style={styles.scan_container}>
      <Button
        fontWeight="bold"
        borderRadius={15}
        backgroundColor="#5167A4"
        color="#fff"
        style={styles.scan}
        title={I18n.t('profile.scan')}
        onPress={props.onPress}
      />
    </View>
  </Card>
}

export default QRCodeCard

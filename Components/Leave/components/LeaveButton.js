import { Button, Card, Text } from 'react-native-elements'
import styles from '../LeaveScreenStyles'
import I18n from '../../../i18n/i18n'
import React from 'react'
import HomeButton from '../../Home/components/HomeButton'

const LeaveButton = (props: { place: any, onPress: () => void }) => (
  <Card style={styles.place_view}>
    <Text style={styles.place}>Place :{props.place}</Text>
    <Button
      style={styles.button}
      fontWeight="bold"
      borderRadius={15}
      backgroundColor="#5167A4"
      color="#fff"
      title={I18n.t('leave.leave_place')}
      onPress={props.onPress}
    />
  </Card>
)

export default LeaveButton

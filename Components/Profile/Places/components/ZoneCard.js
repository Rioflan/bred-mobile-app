import { Card, CheckBox } from 'react-native-elements'
import I18n from '../../../../i18n/i18n'
import React from 'react'
import FetchPlacesButton from './FetchPlacesButton'

const ZoneCard = (props: {
  checked: any,
  onPress: () => void,
  checked1: any,
  onPress1: () => void,
  checked2: any,
  onPress2: () => void,
  checked3: any,
  onPress3: () => void,
}) => (
  <Card>
    <CheckBox
      center
      title={I18n.t('places.rer_zone')}
      checkedIcon="dot-circle-o"
      checkedColor="#5167A4"
      uncheckedIcon="circle-o"
      checked={props.checked}
      onPress={props.onPress}
    />
    <CheckBox
      center
      title={I18n.t('places.forest_zone')}
      checkedIcon="dot-circle-o"
      checkedColor="#5167A4"
      uncheckedIcon="circle-o"
      checked={props.checked1}
      onPress={props.onPress1}
    />
    <CheckBox
      center
      title={I18n.t('places.south_zone')}
      checkedIcon="dot-circle-o"
      checkedColor="#5167A4"
      uncheckedIcon="circle-o"
      checked={props.checked2}
      onPress={props.onPress2}
    />
    <CheckBox
      center
      title={I18n.t('places.middle_zone')}
      checkedIcon="dot-circle-o"
      checkedColor="#5167A4"
      uncheckedIcon="circle-o"
      checked={props.checked3}
      onPress={props.onPress3}
    />
  </Card>
)

export default ZoneCard

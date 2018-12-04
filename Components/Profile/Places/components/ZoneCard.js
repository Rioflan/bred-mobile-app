import { Card, CheckBox } from "react-native-elements";
import React from "react";
import I18n from "../../../../i18n/i18n";

const ZoneCard = (props: {
  checked: any,
  onPress: () => void,
  checked1: any,
  onPress1: () => void,
  checked2: any,
  onPress2: () => void,
  checked3: any,
  onPress3: () => void
}) => {
  const {
    checked,
    onPress,
    checked1,
    onPress1,
    checked2,
    onPress2,
    checked3,
    onPress3
  } = props;
  return (
    <Card>
      <CheckBox
        center
        title={I18n.t("places.rer_zone")}
        checkedIcon="dot-circle-o"
        checkedColor="#2E89AD"
        uncheckedIcon="circle-o"
        checked={checked}
        onPress={onPress}
      />
      <CheckBox
        center
        title={I18n.t("places.forest_zone")}
        checkedIcon="dot-circle-o"
        checkedColor="#2E89AD"
        uncheckedIcon="circle-o"
        checked={checked1}
        onPress={onPress1}
      />
      <CheckBox
        center
        title={I18n.t("places.south_zone")}
        checkedIcon="dot-circle-o"
        checkedColor="#2E89AD"
        uncheckedIcon="circle-o"
        checked={checked2}
        onPress={onPress2}
      />
      <CheckBox
        center
        title={I18n.t("places.middle_zone")}
        checkedIcon="dot-circle-o"
        checkedColor="#2E89AD"
        uncheckedIcon="circle-o"
        checked={checked3}
        onPress={onPress3}
      />
    </Card>
  );
};

export default ZoneCard;

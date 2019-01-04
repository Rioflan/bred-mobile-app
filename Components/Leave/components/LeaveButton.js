import React from "react";
import { Button } from "react-native-elements";
import { View } from "react-native";
import styles from "../LeaveScreenStyles";
import I18n from "../../../i18n/i18n";

const LeaveButton = (props: { place: any, onPress: () => void }) => {
  const { onPress, place } = props;
  return (
    <View style={styles.place_view}>
      <Button
        style={styles.button}
        fontWeight="bold"
        fontFamily="Raleway"
        buttonStyle={{
          width: 180,
          height: 180,
          backgroundColor: "#fff",
          shadowOpacity: 0.4,
          shadowRadius: 2,
          shadowColor: "#3662A0",
          shadowOffset: { height: 1, width: 0 }
        }}
        borderRadius={100}
        color="#468BB6"
        backgroundColor="#fff"
        title={`${I18n.t("leave.leave_place")}
        ${place}`}
        onPress={onPress}
      />
    </View>
  );
};

export default LeaveButton;

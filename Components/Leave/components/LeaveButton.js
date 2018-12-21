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
          borderWidth: 0.5,
          borderColor: "#fff",
          width: 200,
          height: 200
        }}
        borderRadius={100}
        color="white"
        backgroundColor="transparent"
        title={`${I18n.t("leave.leave_place")}
        ${place}`}
        onPress={onPress}
      />
    </View>
  );
};

export default LeaveButton;

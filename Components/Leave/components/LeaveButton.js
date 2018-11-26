import React from "react";
import { Button, Card, Text } from "react-native-elements";
import styles from "../LeaveScreenStyles";
import I18n from "../../../i18n/i18n";

const LeaveButton = (props: { place: any, onPress: () => void }) => {
  const { onPress, place } = props;
  return (
    <Card style={styles.place_view}>
      <Text style={styles.place}>Place :{place}</Text>
      <Button
        style={styles.button}
        fontWeight="bold"
        borderRadius={15}
        backgroundColor="#5167A4"
        color="#fff"
        title={I18n.t("leave.leave_place")}
        onPress={onPress}
      />
    </Card>
  );
};

export default LeaveButton;

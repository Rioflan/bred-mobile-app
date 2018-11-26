import { Button, Card, FormInput } from "react-native-elements";
import { View } from "react-native";
import React from "react";
import I18n from "../../../i18n/i18n";
import styles from "../ProfileScreenStyles";

const ManualInsertionCard = (props: {
  onChangeText: any => void,
  onPress: () => void
}) => {
  const { onChangeText, onPress } = props;
  return (
    <Card title={I18n.t("profile.manual_insertion")}>
      <FormInput
        style={styles.place}
        placeholder={I18n.t("profile.place")}
        onChangeText={onChangeText}
      />

      <View style={styles.sendContainer}>
        <Button
          fontWeight="bold"
          borderRadius={15}
          backgroundColor="#5167A4"
          color="#fff"
          style={styles.send}
          title={I18n.t("profile.send")}
          onPress={onPress}
        />
      </View>
    </Card>
  );
};

export default ManualInsertionCard;

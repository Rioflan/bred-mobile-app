import { Button, FormInput } from "react-native-elements";
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
    <View
      style={{
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        margin: 15
      }}
    >
      <FormInput
        inputStyle={{ width: 100 }}
        style={styles.place}
        placeholder={I18n.t("profile.place")}
        onChangeText={onChangeText}
      />
      <Button
        fontWeight="bold"
        borderRadius={15}
        backgroundColor="#2E89AD"
        color="#fff"
        style={styles.send}
        title={I18n.t("profile.send")}
        onPress={onPress}
      />
    </View>
  );
};

export default ManualInsertionCard;

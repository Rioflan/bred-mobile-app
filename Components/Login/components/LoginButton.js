import { View } from "react-native";
import { Button } from "react-native-elements";
import React from "react";
import styles from "../LoginScreenStyles";
import I18n from "../../../i18n/i18n";

const LoginButton = (props: { onPress: () => void }) => {
  const { onPress } = props;
  return (
    <View style={styles.button_container}>
      <Button
        style={styles.button_login}
        fontWeight="bold"
        borderRadius={15}
        backgroundColor="#5167A4"
        color="#fff"
        title={I18n.t("login.title")}
        onPress={onPress}
      />
    </View>
  );
};

export default LoginButton;

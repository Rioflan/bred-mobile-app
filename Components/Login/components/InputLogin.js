import { View } from "react-native";
import { FormInput } from "react-native-elements";
import React from "react";
import styles from "../LoginScreenStyles";
import I18n from "../../../i18n/i18n";

const InputLogin = (props: {
  onChangeText: any => void,
  onChangeText1: any => void,
  onChangeText2: any => void
}) => {
  const { onChangeText, onChangeText1, onChangeText2 } = props;
  return (
    <View>
      <FormInput
        containerStyle={{ marginTop: 10 }}
        style={styles.textInput}
        placeholder={I18n.t("login.name")}
        onChangeText={onChangeText}
      />

      <FormInput
        containerStyle={{ marginTop: 10 }}
        style={styles.textInput}
        placeholder={I18n.t("login.surname")}
        onChangeText={onChangeText1}
      />

      <FormInput
        containerStyle={{ marginTop: 10 }}
        style={styles.textInput}
        placeholder={I18n.t("login.id")}
        onChangeText={onChangeText2}
      />
    </View>
  );
};

export default InputLogin;

import { Button, View } from "react-native";
import React from "react";
import styles from "../HomeScreenStyles";
import I18n from "../../../i18n/i18n";

const HomeButton = (props: { onPress: () => void }) => {
  const { onPress } = props;
  return (
    <View style={styles.button_wrapper}>
      <Button
        style={styles.button}
        title={I18n.t("home.main_page")}
        color="#2E89AD"
        onPress={onPress}
      />
    </View>
  );
};

export default HomeButton;

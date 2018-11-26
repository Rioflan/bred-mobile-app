import { View } from "react-native";
import { Button } from "react-native-elements";
import React from "react";
import styles from "../../ProfileScreenStyles";
import I18n from "../../../../i18n/i18n";

const FetchPlacesButton = (props: { onPress: () => void }) => {
  const { onPress } = props;
  return (
    <View style={styles.emptyPlaces_container}>
      <Button
        iconRight={{
          name: "sync",
          type: "font-awesome5"
        }}
        fontWeight="bold"
        large={false}
        borderRadius={15}
        backgroundColor="#5167A4"
        color="#fff"
        style={styles.free_places}
        title={I18n.t("places.free_places")}
        onPress={onPress}
      />
    </View>
  );
};

export default FetchPlacesButton;

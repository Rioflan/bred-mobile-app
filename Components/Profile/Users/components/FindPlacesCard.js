import { View } from "react-native";
import { Button } from "react-native-elements";
import I18n from "react-native-i18n";
import React from "react";
import styles from "../../ProfileScreenStyles";

const FindPlacesCard = (props: { users: any }) => {
  const { users } = props;
  return (
    <View style={styles.emptyPlaces_container}>
      <Button
        fontWeight="bold"
        iconRight={{
          name: "sync",
          type: "font-awesome5"
        }}
        large={false}
        borderRadius={15}
        backgroundColor="#2E89AD"
        color="#fff"
        style={styles.free_places}
        title={I18n.t("users.users")}
        onPress={users}
      />
    </View>
  );
};

export default FindPlacesCard;

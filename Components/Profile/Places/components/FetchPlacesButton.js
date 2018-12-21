import React from "react";
import { View, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import styles from "./styles/FetchPlacesButtonStyle";

const FetchPlacesButton = (props: { onPress: () => void }) => {
  const { onPress } = props;
  return (
    <View style={styles.view}>
      <TouchableOpacity onPress={onPress} style={styles.container}>
        <Icon name="arrow-right" size={15} color="#2E89AD" />
      </TouchableOpacity>
    </View>
  );
};

export default FetchPlacesButton;

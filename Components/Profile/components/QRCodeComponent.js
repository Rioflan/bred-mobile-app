import React from "react";
// import { NavigationEvents } from "react-navigation";
import QRCodeScanner from "react-native-qrcode-scanner";
import { Text } from "react-native";
import I18n from "../../../i18n/i18n";

const QRCodeComponent = (props: { onRead: e => any }) => {
  const { onRead } = props;
  return (
    <QRCodeScanner
      onRead={onRead}
      showMarker
      markerStyle={{
        height: 250,
        width: 250,
        borderWidth: 2,
        borderColor: "white",
        backgroundColor: "transparent"
      }}
      topContent={
        <Text
          style={{
            marginBottom: 15,
            fontFamily: "Raleway"
          }}
        >
          {I18n.t("scan.scan_qr_code")}
        </Text>
      }
    />
  );
};

export default QRCodeComponent;

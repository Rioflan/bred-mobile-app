import React from 'react'
import QRCodeScanner from 'react-native-qrcode-scanner'
import { Text } from 'react-native'
import I18n from '../../../i18n/i18n'

const QRCodeComponent = (props: { onRead: (e) => any }) => {
  const { onRead } = props;
  return <QRCodeScanner
    onRead={onRead}
    topContent={
      <Text style={{
        marginBottom: 15,
        fontFamily: 'Raleway'
      }}>
        {I18n.t('scan.scan_qr_code')}
      </Text>
    }
  />
}

export default QRCodeComponent;

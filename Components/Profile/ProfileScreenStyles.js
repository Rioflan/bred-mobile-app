import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  view: {
    flex: 1,
    flexDirection: 'column'
  },
  view_second: {
    backgroundColor: 'white',
    borderRadius: 5,
    borderColor: '#5167A4',
    borderWidth: 2,
    height: 50,
    margin: 20,
  },
  text_first: {
    textAlign: 'center',
    color: '#5167A4',
    margin: 5,
    marginTop: 8,
    fontSize: 20,
  },
  view_third: {
    borderRadius: 4,
    borderWidth: 0.5,
  },
  place: {},
  sendContainer: {
    marginRight: 50,
    marginLeft: 50,
    marginTop: 20,
  },
  view_fourth: {
    marginTop: 20,
    borderRadius: 4,
    borderWidth: 0.5,
  },
  scanQRCode: {
    marginLeft: 10,
    marginTop: 20,
  },
  scan_container: {
    margin: 20,
    marginRight: 50,
    marginLeft: 50,
    justifyContent: 'flex-end'
  },
  view_fifth: {
    marginTop: 20,
    borderRadius: 4,
    borderWidth: 0.5,
  },
  emptyPlaces_container: {
    marginLeft: 50,
    marginRight: 50,
  },
  send: {},
  scan: {},
  logOut: {},
  free_places: {
    marginTop: 20,
  },
  places: {
    fontSize: 15,
  }
})

# **flex-rn-client** [![Build Status](https://app.bitrise.io/app/8ba0832124e4cdf2/status.svg?token=HTfEgn2kTcAN_FI2qXEqeQ&branch=feature/refactoring)](https://app.bitrise.io/app/8ba0832124e4cdf2)
[![Coverage Status](https://coveralls.io/repos/github/ayshiff/flex-rn-client/badge.svg?branch=feature%2Fadd-test-coverage)](https://coveralls.io/github/ayshiff/flex-rn-client?branch=feature%2Fadd-test-coverage)

Simple mobile client in React-Native for **flex-server** project

# Steps to follow

## Installing dependencies

You will need Node, Watchman, the React Native command line interface, and Xcode.

While you can use any editor of your choice to develop your app, you will need to install Xcode in order to set up the necessary tooling to build your React Native app for iOS.

### Node, Watchman

We recommend installing Node and Watchman using Homebrew. Run the following commands in a Terminal after installing Homebrew:
```
brew install node
brew install watchman
```

If you have already installed Node on your system, make sure it is Node 8.3 or newer.

Watchman is a tool by Facebook for watching changes in the filesystem. It is highly recommended you install it for better performance.

### The React Native CLI

Node comes with npm, which lets you install the React Native command line interface.

Run the following command in a Terminal:
```npm install -g react-native-cli```

### Xcode

The easiest way to install Xcode is via the Mac App Store. Installing Xcode will also install the iOS Simulator and all the necessary tools to build your iOS app.

If you have already installed Xcode on your system, make sure it is version 9.4 or newer.

#### Command Line Tools

You will also need to install the Xcode Command Line Tools. Open Xcode, then choose "Preferences..." from the Xcode menu. Go to the Locations panel and install the tools by selecting the most recent version in the Command Line Tools dropdown.

## Running your React Native application

Run ```react-native run-ios``` inside your React Native project folder:
```
cd flex-rn-client
npm install
react-native run-ios
```

Make sure you have filled the config files with your API :
(Follow these steps to have your server working :
[flex-rn-server](https://github.com/ayshiff/flex-server)) 

For `api.json`:

```
{
  "email": "",
  "password': "",
  "token': "",
  "_id': ""
}
```

And for `server.json`:

```
{
  "address": ""
}
```

You can also add a `.env` file at the root of the project and pass variables as environment variables.


## Generating Signed APK

For Android deployment: 

See the **[current doc](https://facebook.github.io/react-native/docs/signed-apk-android)**


# Project Structure

```
.
├── App.js
├── Components
│   ├── Home
│   │   ├── HomeScreen.js
│   │   └── HomeScreenStyles.js
│   ├── Leave
│   │   ├── LeaveScreen.js
│   │   ├── LeaveScreenStyles.js
│   │   └── LeaveScreenType.js
│   ├── Login
│   │   ├── LoginScreen.js
│   │   ├── LoginScreenStyles.js
│   │   └── LoginScreenType.js
│   ├── Profile
│   │   ├── Places
│   │   │   └── PlacesScreen.js
│   │   ├── ProfileScreen.js
│   │   ├── ProfileScreenStyles.js
│   │   └── Users
│   │       └── UsersScreen.js
│   └── Scan
│       ├── ScanScreen.js
│       └── ScanScreenStyles.js
├── Navigation
│   └── NavigationApp.js
├── utils
│   └── utils.js
├── README.md
├── android
├── app.json
├── config
│   ├── api.js
│   └── server.js
├── index.js
├── ios
├── package-lock.json
├── package.json
└── yarn.lock
```

# List of commands

- start: "node node_modules/react-native/local-cli/cli.js start",
- test: "jest",
- lint: "eslint Components",
- pretty: "prettier --semi false --print-width 100 --single-quote--trailing-comma all --write \"Components/\*_/_.js\"",
- flow: "flow",
- lint:fix: "eslint Components/ --fix"

The project uses [FLow](https://flow.org/) for type checking. Feel free to increase the type checking coverage by adding some tests 👍.

The project also use [ESlint](https://eslint.org/) and [Prettier](https://prettier.io/). You can see lint warnings / errors by running    
`npm run lint`.


# Current State

| Screen components | State                                                                | Props      | API routes         | Flow support |
| ------------------ | -------------------------------------------------------------------- | ---------- | ------------------ | ------------ |
| Home               |                                                                      | navigation |                    | [x]           |
| Login              | `name:string ,fname:string, id: string, place: string, search: Array<object>, debug: Array<any>, historical: Array<object>` | navigation | /login_user        | [x]           |
| Profile            | `name:string ,fname:string, id: string, place: string, search: Array<object>, debug: Array<any>, historical: Array<object>` | navigation | GET /places POST / | [x]           |
| Scan               | `name:string ,fname:string, id: string, place: string, search: Array<object>, debug: Array<any>, historical: Array<object>` | navigation | GET /places        | []           |
| Leave              | `name:string ,fname:string, id: string, place: string, search: Array<object>, debug: Array<any>, historical: Array<object>` | navigation | POST /             | [x]           |

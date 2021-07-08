
[![Build Status](https://app.bitrise.io/app/8ba0832124e4cdf2/status.svg?token=HTfEgn2kTcAN_FI2qXEqeQ&branch=feature/refactoring)](https://app.bitrise.io/app/8ba0832124e4cdf2)
[![Coverage Status](https://coveralls.io/repos/github/ayshiff/flex-rn-client/badge.svg?branch=master)](https://coveralls.io/github/ayshiff/flex-rn-client?branch=master)
[![CircleCI](https://circleci.com/gh/ayshiff/flex-rn-client.svg?style=svg)](https://circleci.com/gh/ayshiff/flex-rn-client)
![Flex-Office](assets/Presentation.jpg?raw=true)

Simple mobile client in React-Native for [**flex-server**](https://github.com/BREDFactory/flex-server) project

# Steps to follow

## Apple Developer Account

Since you want your project running on iOS, you must have a Mac computer and an Apple Developer account to get the certificates to sign your code before deploying it.

In the Apple Dev Center

* Declare your app

* Create two certificates :

  * Development : *iOS App Development* type

  * Production : *App Store and Ad Hoc* type

* Declare your App Id

* Declare all the phone UDID on which you may want to install for testing through AdHoc Distribution

* Create three provisioning profiles :

  * Dev Profile

  * AdHoc Distribution Profile

  * App Store Distribution Profile


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

Watchman is a tool edited by Facebook for watching changes in the filesystem. It is highly recommended to install it for better performance.

### The React Native CLI

Node comes with the package manager npm, which lets you install the React Native command line interface.

Run the following command in a Terminal:

```npm install -g react-native-cli```

### Xcode

The easiest way to install Xcode is via the Mac App Store. Installing Xcode will also install the iOS Simulator and all the necessary tools to build your iOS app.

If you have already installed Xcode on your system, make sure it is version 9.4 or newer.

*Legacy Build System* :

Select File -> Project/Workspace Setting. You will see a Build System option to select the Legacy Build System as shown below

![xcode build setting](https://i.stack.imgur.com/hdaJu.png)

#### Command Line Tools

You will also need to install the Xcode Command Line Tools. Open Xcode, then choose "Preferences..." from the Xcode menu. Go to the Locations panel and install the tools by selecting the most recent version in the Command Line Tools dropdown.

## Download and install the project :

```$ git clone https://github.com/BREDFactory/flex-rn-client.git```

Set the FLEX_HOME environment variable

```$ export FLEX_HOME=/YOUR/PROJECT/PATH```

or run in the root folder

```$ export FLEX_HOME=${PWD}```

Check it

```
$ echo $FLEX_HOME
/YOUR/PROJECT/PATH
```

Make build script executable :
```
$ chmod +x ./scripts/build.sh
```

## FlexOffice Server Configuration

Make sure you have filled your API environment files by editing the ```.env``` file :
(Follow these steps to have your server working :
[flex-rn-server](https://github.com/ayshiff/flex-server))

In Flex Client, be sure to have four files in the `config` directory :

`server.json`

`api.json`

`regex.json`

`places.json`

Fill in your server address in `server.json` file :

```
{
  "address": "https://myapp.herokuapp.com/"
}
```

You'll add also the access token provided by Heroku :

Fill in your api credentials in `api.json` file :

```
{
    "email": "",
    "password": "",
    "token": "1e98765x-4683-3fc7-0000-1234567890ac",
    "_id": ""
}
```

(For android deployment use ```10.0.2.2``` for the host)

Fill in your regexes in `regex.json` file :

```
{
    "idRegex": "^[A-Z]{2}[0-9]{5}$",
    "placeRegex": "^[3-4]{1}[-]{1}[0-9]{2}$"
}
```

You also have to configure environment variables of the *flex server* project.
`CONFIG_REGEX`, `PLACE_REGEX`, `WIFI_REGEX`

Fill in your place filters in `places.json` file :

```
{
    "zoneCodes": ["A", "B", "C"],
    "sideIndexUpper": ["FRONT", "MIDDLE", "BACK"],
    "floorIndex": ["5th floor", "6th floor"],
    "zoneIndex": ["Zone 1", "Zone 2", "Zone 3"],
    "sideIndex": ["Front", "Middle", "Back"],
}
```

## Running your React Native iOS application in the Simulator

Run ```react-native run-ios``` inside your React Native project folder:
```
cd flex-rn-client
npm install
react-native run-ios
```

## Running your React Native application on a real Device


1. If you've just cloned the project, in Terminal, run on the project root directory
```
yarn install
```
2. Go to ios folder and open Xcode project
```
open FlexOffice.xcodeproj
```
3. In Xcode, use dev certificate for targets (main and test)

* Use your provisioning profile

* Change the FlexOffice Scheme Run Build Configuration from 'Debug' to 'Release'

* Clear your project and "Derived Data" Build


4. Modify App Delegate implementation :
```
FlexOfficeDelegate.m
--------------------
- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  NSURL *jsCodeLocation;

#ifdef DEBUG
  jsCodeLocation = [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index" fallbackResource:nil];
#else
  jsCodeLocation = [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];
#endif
  (...)
  return YES;
}

```

5. In Xcode, select FlexOffice target and go to *Build Phases*
Extend the *Bundle React Native code and images* and fill in the *NODE_BINARY* variable :

To know which version of node binary you use, type in Terminal :

```
$ which node
```
And copy/paste the result to the NODE_BINARY variable.
Ex:

```
export NODE_BINARY=/usr/local/opt/node@8/bin/node
../node_modules/react-native/scripts/react-native-xcode.sh
```

6. Run your project :

You should see a new Terminal window appear for Metro Bundler.

7. Deployment :
You have to generate the archive and launch this command :

```xcodebuild -exportArchive -archivePath ${ARCHIVE_PATH} \```

```-exportPath ${EXPORT_PATH} \```

```-exportOptionsPlist ${ARCHIVE_PLIST_PATH}/Info.plist```

We add a bash script which archive and create the .ipa in ```archive``` folder :

If you have set the ```FLEX_HOME``` Environment variable (see [Download and install the project](#download-and-install-the-project) )

You could run ./scripts/build.sh to automatically build, archive, export the archive.

```
$ ./scripts/build.sh
```

## Generating Signed APK

For Android deployment:

See the **[current doc](https://facebook.github.io/react-native/docs/signed-apk-android)**

Note: the current version of `react-native` is not patched and you need to add :

```
classpath 'com.android.tools.build:gradle:3.0.0'
distributionUrl=https://services.gradle.org/distributions/gradle-4.1-all.zip
android.enableAapt2=false
```

It will fix the issue with `uncompiled PNG file passed as argument. Must be compiled first into .flat file.. error`.

Inside `gradle.properties`.
(This is a temporary fix and it will be fixed in the most recents versions of react-native !)


# ScreenShots

![Flex-Office](assets/flexoffice.png?raw=true)

# Project Structure
```
.
├── App.js
├── Components
│   ├── Leave
│   │   ├── LeaveScreen.js
│   │   ├── LeaveScreenStyles.js
│   │   ├── LeaveScreenType.js
│   │   └── components
│   │       └── LeaveButton.js
│   ├── Login
│   │   ├── LoginScreen.js
│   │   ├── LoginScreenStyles.js
│   │   ├── LoginScreenType.js
│   │   └── components
│   │       ├── InputLogin.js
│   │       └── LoginButton.js
│   ├── Profile
│   │   ├── Places
│   │   │   ├── PlacesScreen.js
│   │   │   └── components
│   │   │       ├── FetchPlacesButton.js
│   │   │       ├── ZoneCard.js
│   │   │       └── styles
│   │   │           └── FetchPlacesButtonStyle.js
│   │   ├── ProfileScreen.js
│   │   ├── ProfileScreenStyles.js
│   │   ├── Users
│   │   │   ├── UsersScreen.js
│   │   │   └── components
│   │   │       ├── FindPlacesCard.js
│   │   │       ├── ListPlaces.js
│   │   │       └── styles
│   │   │           └── FindPlacesCardStyle.js
│   │   ├── animation.json
│   │   └── components
│   │       ├── HeaderCard.js
│   │       ├── ManualInsertionCard.js
│   │       ├── QRCodeCard.js
│   │       ├── QRCodeComponent.js
│   │       └── styles
│   │           ├── HeaderCardStyle.js
│   │           ├── ManualInsertionCardStyle.js
│   │           └── QRCodeCardStyle.js
│   └── Settings
│       ├── SettingsScreen.js
│       ├── SettingsScreenStyles.js
│       └── components
│           ├── DeconnectionButton.js
│           └── styles
│               └── DeconnectionButtonStyle.js
├── Navigation
│   ├── NavigationApp.js
│   └── components
│       ├── ProfileImage.js
│       └── reducer.js
├── README.md
├── __tests__
├── utils
│   ├── OfflineNotice.js
│   ├── services
│   │   ├── index.js
│   │   └── pushNotification.js
│   └── utils.js
├── android
├── app.json
├── config
│   ├── api.json
│   ├── regex.json
│   └── server.json
├── index.js
├── ios
├── package-lock.json
├── package.json
├── views
│   ├── Leave
│   │   ├── LeaveScreen.js
│   │   ├── LeaveScreenStyles.js
│   │   └── LeaveScreenType.js
│   ├── Login
│   │   ├── LoginScreen.js
│   │   ├── LoginScreenStyles.js
│   │   └── LoginScreenType.js
│   ├── Places
│   │   └── PlacesScreen.js
│   ├── Profile
│   │   ├── ProfileScreen.js
│   │   └── ProfileScreenStyles.js
│   ├── Settings
│   │   ├── SettingsScreen.js
│   │   └── SettingsScreenStyles.js
│   └── Users
│       └── UsersScreen.js
└── yarn.lock
```

# List of commands

- start:

```node node_modules/react-native/local-cli/cli.js start```

- test:

```jest```

- lint:

```eslint Components```

- pretty:

```prettier --semi false --print-width 100 --single-quote--trailing-comma all --write \"Components/\*_/_.js\"```

- flow:

```flow```

- lint:fix:

```eslint Components/ --fix```

The project uses [Flow](https://flow.org/) for type checking. Feel free to increase the type checking coverage by adding some tests 👍.

The project also uses [ESlint](https://eslint.org/) and [Prettier](https://prettier.io/). You can see lint warnings / errors by running
`npm run lint`.


# Current State

| Screen components | State                                                                | Props      | API routes         | Flow support |
| ------------------ | -------------------------------------------------------------------- | ---------- | ------------------ | ------------ |
| Home               |                                                                      | navigation |                    | [x]           |
| Login              | `name:string ,fname:string, id: string, place: string, search: Array<object>, debug: Array<any>, historical: Array<object>` | navigation | /login_user        | [x]           |
| Profile            | `name:string ,fname:string, id: string, place: string, search: Array<object>, debug: Array<any>, historical: Array<object>` | navigation | GET /places POST / | [x]           |
| Scan               | `name:string ,fname:string, id: string, place: string, search: Array<object>, debug: Array<any>, historical: Array<object>` | navigation | GET /places        | []           |
| Leave              | `name:string ,fname:string, id: string, place: string, search: Array<object>, debug: Array<any>, historical: Array<object>` | navigation | POST /             | [x]           |

# TROUBLESHOOTINGS
1. iOS : When running from Xcode, the app crashes just after the launchscreen

```
"undefined is not an object(evaluating 'RNFSFileTypeRegular')"
```

RESOLUTION :
Run this command on project root in Terminal :
```
$ react-native link react-native
```

2. iOS : When building in Xcode, Metro bundler failed :
```
"Cannot find module './assets/empty-module.js"
```

RESOLUTION : cf. https://github.com/yarnpkg/yarn/issues/2206 : you may check whether your .yarnclean containing a line assets. If yes, delete that line and do ```rm -rf node_modules && yarn``` to see if this fixes your issue. This helped me.

3. If during Step 6, you have :
Unable to resolve module `./images/star.png` from `/Users/canatac/RNProjects/flex-rn-client/node_modules/react-native-elements/src/rating/Rating.js`: The module `./images/star.png` could not be found from `/Users/canatac/RNProjects/flex-rn-client/node_modules/react-native-elements/src/rating/Rating.js`. Indeed, none of these files exist:

  * `star.png`
  * `/Users/canatac/RNProjects/flex-rn-client/node_modules/react-native-elements/src/rating/images/star.png/index(.native||.ios.js|.native.js|.js|.ios.json|.native.json|.json)`

```
$ rm -rf node_modules
$ rm .yarnclean
$ yarn
$ react-native bundle --entry-file index.js --platform ios --dev false --bundle-output ios/main.jsbundle --assets-dest ios
```

4. mainjs.bundle is not found

There's probably a problem the correct node binary
You can manually finish the last step of *Bundle React Native code and images*

  * In Terminal, launch following command :

```
react-native bundle --entry-file index.js --platform ios --dev false --bundle-output ios/main.jsbundle --assets-dest ios
```


  * Then copy ```ios/main.jsbundle``` file to :
```/Users/<USERNAME>/Library/Developer/Xcode/DerivedData/FlexOffice-XXX/Build/Products/Release-iphoneos/FlexOffice.app/```
import * as React from "react";
import { Platform } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";

import { createStore, applyMiddleware } from "redux";
import { Provider } from "react-redux";
import thunkMiddleware from "redux-thunk";
import reducer from "./reducers";

import OneSignal from "react-native-onesignal";
import Login from "./screens/login";
import Signup from "./screens/signup";
import Main from "./screens/main";
import CreatePost from "./screens/createPost";
import MySettings from "./screens/settings";
import UpdateBio from "./screens/updateBio";
import SettingsDeleteAccount from "./screens/settingsDeleteAccount";
import SettingsUpdatePassword from "./screens/settingsUpdatePassword";
import SettingsMirrorReflection from "./screens/settingsMirrorReflection";
import ResetPassword1 from "./screens/resetPassword1";
import ResetPassword2 from "./screens/resetPassword2";
import ResetPassword3 from "./screens/resetPassword3";
import NotificationsAllPosts from "./screens/notificationsAllPosts";
import NotificationsMyPosts from "./screens/notificationsMyPosts";
import ShowQuote from "./screens/showQuote";
import ReportQuote from "./screens/reportQuote";
import FindFriends from "./screens/findFriends";
import UserPage from "./screens/userPage";
import BuildPage from "./screens/buildsPage";
import ReportUser from "./screens/reportUser";
import ReportConfirmation from "./screens/reportConfirmation";
import ReportReflection from "./screens/reportReflection";
import BeaconPageQuotes from "./screens/beaconPageQuotes";
import BeaconPageReflection from "./screens/beaconPageReflection";
import SplashScreen from "./screens/splashscreen";
import ContactUs from "./screens/contactus";
import BuildMainPage from "./screens/buildMainPage";
import PushNotification from "react-native-push-notification";
import NotifService from "./func/notificationService";

import { MenuProvider } from "react-native-popup-menu";

const middleware = applyMiddleware(thunkMiddleware);
const store = createStore(reducer, middleware);
const Stack = createStackNavigator();

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      notificationFlag: true,
      isSubscribed: false,
    };

    this.notif = new NotifService(
      this.onRegister.bind(this),
      this.onNotif.bind(this)
    );

    // var d1 = new Date('February 2, 2021 12:00:00');
    // var d2 = new Date('February 4, 2021 12:00:00');
    // var d3 = new Date('February 6, 2021 12:00:00');

    // PushNotification.localNotificationSchedule({
    //   message: "Hey how is your day going?",
    //   date: d1,
    //   allowWhileIdle: true,
    //   repeatType: "week",
    //   channelId: "default-channel-id",
    //   largeIcon: "",
    // });

    //   PushNotification.localNotificationSchedule({
    //     message: "Anything new with you 💜",
    //     date: d2,
    //     allowWhileIdle: true,
    //     repeatType: "week",
    //     channelId: "default-channel-id",
    //     largeIcon: "",
    //   });

    //   PushNotification.localNotificationSchedule({
    //     message: "Thumbs up 👍, thumbs down 👎 or maybe something in between? Let us know how is your day going!",
    //     date: d3,
    //     allowWhileIdle: true,
    //     repeatType: "week",
    //     channelId: "default-channel-id",
    //     largeIcon: "",
    //   });
  }

  componentDidMount() {
    this.init();
    // let d1 = new Date(Date.now() + 5 * 1000);

    // setInterval(() => {
    //   var a = new Date();
    //   var b = new Date();
    //   b.setHours(15, 43, 0, 0);

    //   if (b - a < 0) {
    //     if (this.state.notificationFlag == true) {
    //       PushNotification.localNotificationSchedule({
    //         message: "Anything new with you 💜",
    //         date: d1,
    //         allowWhileIdle: true,
    //         repeatType: "week",
    //         channelId: "default-channel-id",
    //         largeIcon: "",
    //       });
    //     }
    //     this.setState({ notificationFlag: false });
    //   } else {
    //     this.setState({ notificationFlag: true });
    //   }
    // }, 1000);
  }

  init = async () => {
    /* O N E S I G N A L   S E T U P */
    Platform.OS === "ios"
      ? OneSignal.setAppId("ed89b83a-a66b-42f1-b255-bc04ba3eb303")
      : OneSignal.setAppId("7622a398-d4d2-4c94-b402-eecef800c786");
    OneSignal.setLogLevel(6, 0);
    OneSignal.setRequiresUserPrivacyConsent(false);
    OneSignal.promptForPushNotificationsWithUserResponse((response) => {
      this.OSLog("Prompt response:", response);
    });

    /* O N E S I G N A L  H A N D L E R S */
    OneSignal.setNotificationWillShowInForegroundHandler(
      (notifReceivedEvent) => {
        this.OSLog(
          "OneSignal: notification will show in foreground:",
          notifReceivedEvent
        );
        let notif = notifReceivedEvent.getNotification();

        const button1 = {
          text: "Cancel",
          onPress: () => {
            notifReceivedEvent.complete();
          },
          style: "cancel",
        };

        const button2 = {
          text: "Complete",
          onPress: () => {
            notifReceivedEvent.complete(notif);
          },
        };

        Alert.alert("Complete notification?", "Test", [button1, button2], {
          cancelable: true,
        });
      }
    );
    OneSignal.setNotificationOpenedHandler((notification) => {
      this.OSLog("OneSignal: notification opened:", notification);
    });
    OneSignal.setInAppMessageClickHandler((event) => {
      this.OSLog("OneSignal IAM clicked:", event);
    });
    OneSignal.addEmailSubscriptionObserver((event) => {
      this.OSLog("OneSignal: email subscription changed: ", event);
    });
    OneSignal.addSubscriptionObserver((event) => {
      this.OSLog("OneSignal: subscription changed:", event);
      this.setState({ isSubscribed: event.to.isSubscribed });
    });
    OneSignal.addPermissionObserver((event) => {
      this.OSLog("OneSignal: permission changed:", event);
    });

    const deviceState = await OneSignal.getDeviceState();
    this.setState({
      isSubscribed: deviceState.isSubscribed,
    });
  };

  OSLog = (message, optionalArg) => {
    if (optionalArg) {
      message = message + JSON.stringify(optionalArg);
    }

    console.log(message);

    let consoleValue;

    if (this.state.consoleValue) {
      consoleValue = this.state.consoleValue + "\n" + message;
    } else {
      consoleValue = message;
    }
    this.setState({ consoleValue });
  };

  onRegister(token) {
    console.log(token);
  }

  onNotif(notif) {
    console.log(notif);
  }

  render() {
    return (
      <MenuProvider>
        <Provider store={store}>
          <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
              <Stack.Screen name="SplashScreen" component={SplashScreen} />
              <Stack.Screen name="Login" component={Login} />
              <Stack.Screen name="Signup" component={Signup} />
              <Stack.Screen name="Main" component={Main} />
              <Stack.Screen name="CreatePost" component={CreatePost} />
              <Stack.Screen name="Settings" component={MySettings} />
              <Stack.Screen name="UpdateBio" component={UpdateBio} />
              <Stack.Screen
                name="SettingsDeleteAccount"
                component={SettingsDeleteAccount}
              />
              <Stack.Screen
                name="SettingsUpdatePassword"
                component={SettingsUpdatePassword}
              />
              <Stack.Screen
                name="SettingsMirrorReflection"
                component={SettingsMirrorReflection}
              />
              <Stack.Screen name="ResetPassword1" component={ResetPassword1} />
              <Stack.Screen name="ResetPassword2" component={ResetPassword2} />
              <Stack.Screen name="ResetPassword3" component={ResetPassword3} />
              <Stack.Screen
                name="NotificationsAllPosts"
                component={NotificationsAllPosts}
              />
              <Stack.Screen
                name="NotificationsMyPosts"
                component={NotificationsMyPosts}
              />
              <Stack.Screen name="ShowQuote" component={ShowQuote} />
              <Stack.Screen name="ReportQuote" component={ReportQuote} />
              <Stack.Screen name="FindFriends" component={FindFriends} />
              <Stack.Screen name="UserPage" component={UserPage} />
              <Stack.Screen name="BuildPage" component={BuildPage} />
              <Stack.Screen name="ReportUser" component={ReportUser} />
              <Stack.Screen name="buildMainPage" component={BuildMainPage} />
              <Stack.Screen
                name="ReportConfirmation"
                component={ReportConfirmation}
              />
              <Stack.Screen
                name="BeaconPageQuotes"
                component={BeaconPageQuotes}
              />
              <Stack.Screen
                name="BeaconPageReflection"
                component={BeaconPageReflection}
              />
              <Stack.Screen
                name="ReportReflection"
                component={ReportReflection}
              />
              <Stack.Screen name="ContactUs" component={ContactUs} />
            </Stack.Navigator>
          </NavigationContainer>
        </Provider>
      </MenuProvider>
    );
  }
}

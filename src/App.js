import * as React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";

import { createStore, applyMiddleware } from "redux";
import { Provider } from "react-redux";
import thunkMiddleware from "redux-thunk";
import reducer from "./reducers";

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

import { MenuProvider } from "react-native-popup-menu";
import { registerUser } from "./actions/user";

const middleware = applyMiddleware(thunkMiddleware);
const store = createStore(reducer, middleware);
const Stack = createStackNavigator();

export default class App extends React.Component {
  constructor(props) {
    super(props);

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

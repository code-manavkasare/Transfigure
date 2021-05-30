import React from "react";
import {
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Text,
  Image,
  Alert,
  SafeAreaView,
  Dimensions,
  ScrollView,
  Platform,
} from "react-native";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { updateKey, translateText, registerUser } from "../actions/user";
import { Header, Icon } from "react-native-elements";
import Beacon from "react-native-vector-icons/MaterialCommunityIcons";
import moment from "moment";
import GestureRecognizer, {
  swipeDirections,
} from "react-native-swipe-gestures";
import MyFooter from "../components/centerComp";
import { fetchSettingsInfo } from "../func/userSettings";

import PushNotification from "react-native-push-notification";
import NotifService from "../func/notificationService";

import OneSignal from "react-native-onesignal";

class Main extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      email: "",
      password: "",
      day: moment().format("dddd"),
      firstName: "",
      currentCardIndex: 1,
      buttonTexts: [
        this.props.translateText("main.i_learnt"),
        this.props.translateText("main.i_achived"),
        this.props.translateText("main.i_tried"),
      ],
      notificationFlag: true,
      isSubscribed: false,
    };

    this.notif = new NotifService(
      this.onRegister.bind(this),
      this.onNotif.bind(this)
    );
  }

  init = async () => {
    /* O N E S I G N A L   S E T U P */
    if (Platform.OS === "ios") {
      OneSignal.setAppId("ed89b83a-a66b-42f1-b255-bc04ba3eb303");
    } else {
      OneSignal.setAppId("7622a398-d4d2-4c94-b402-eecef800c786");
    }
    OneSignal.promptForPushNotificationsWithUserResponse((response) => {
      this.OSLog("Prompt response:", response);
    });
    OneSignal.setLogLevel(6, 0);
    OneSignal.setRequiresUserPrivacyConsent(true);
    OneSignal.provideUserConsent(true);

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
  async componentDidMount() {
    setTimeout(() => this.init(), 3000);

    let resp = await fetchSettingsInfo(this.props.user.authKey);
    let name = "USER'S";
    if (resp) {
      name = resp.firstName.toUpperCase() + "'s";
    }
    this.setState({ firstName: name });
  }
  post() {
    this.props.navigation.navigate("CreatePost", {
      title: this.state.buttonTexts[this.state.currentCardIndex],
    });
  }

  showCard() {
    let chosenCard = this.state.currentCardIndex;
    let img = "";
    switch (chosenCard) {
      case 0:
        img = require("../images/lightBulb.png");
        break;
      case 1:
        img = require("../images/achievement.png");
        break;
      case 2:
        img = require("../images/mountain.png");
        break;
      default:
        break;
    }
    return (
      <View style={styles.inputBox}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Icon
            name="angle-left"
            type="font-awesome-5"
            size={50}
            color="#3f32d2"
            onPress={() => {
              this.onSwipeRight(0);
            }}
          />
          <View
            style={{ width: "90%", alignItems: "center", alignSelf: "center" }}
          >
            <Image
              source={img}
              style={{ width: "70%", height: "70%" }}
              resizeMode="stretch"
            />
            <TouchableOpacity
              style={styles.curvedButton}
              onPress={() => {
                this.post();
              }}
            >
              <Text style={{ color: "white", fontSize: 20 }}>
                {this.state.buttonTexts[this.state.currentCardIndex]}
              </Text>
            </TouchableOpacity>
          </View>
          <Icon
            name="angle-right"
            type="font-awesome-5"
            size={50}
            color="#3f32d2"
            onPress={() => {
              this.onSwipeLeft(1);
            }}
          />
        </View>
      </View>
    );
  }

  onSwipeLeft(val) {
    if (this.state.currentCardIndex < 2) {
      this.setState({ currentCardIndex: this.state.currentCardIndex + 1 });
    }
  }
  onSwipeRight(val) {
    if (this.state.currentCardIndex > 0) {
      this.setState({ currentCardIndex: this.state.currentCardIndex - 1 });
    }
  }

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <GestureRecognizer
          onSwipeLeft={(state) => {
            this.onSwipeLeft(state);
          }}
          onSwipeRight={(state) => this.onSwipeRight(state)}
          style={{ flex: 1 }}
        >
          <View style={styles.circle} />

          <View
            style={{
              flexDirection: "row",
              marginHorizontal: "5%",
              marginTop: Platform.OS !== "ios" ? 50 : 20,
              justifyContent: "space-between",
            }}
          >
            <Icon
              name="plus"
              type="antdesign"
              size={30}
              color="white"
              backgroundColor="#6a5df5"
              style={{ borderRadius: 50 }}
              onPress={() => this.props.navigation.navigate("CreatePost")}
            />
            {/* <Beacon name="lighthouse" size={50} color="#f07c4a"/> */}
            <Image
              source={require("../images/przezroczyste.png")}
              style={{
                width: parseInt(Dimensions.get("window").width * 0.3),
                height: parseInt(Dimensions.get("window").height * 0.2),
                alignSelf: "center",
                marginTop: "-8%",
                backgroundColor: "transparent",
              }}
              resizeMode="cover"
            />
            <Icon
              name="cog"
              type="font-awesome"
              size={30}
              color="white"
              onPress={() => this.props.navigation.navigate("Settings")}
            />
          </View>
          <View style={{ marginTop: "-5%", alignItems: "center" }}>
            <Text style={{ color: "white", fontSize: 30, fontWeight: "bold" }}>
              {this.state.firstName}
            </Text>
            <Text style={{ color: "white", fontSize: 27 }}>
              {this.state.day.toUpperCase()}{" "}
              {this.props.translateText("main.legacy")}
            </Text>
          </View>

          {this.showCard()}
        </GestureRecognizer>

        <MyFooter parentProps={this.props} />
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#3f32d2",
    flex: 1,
  },
  circle: {
    position: "absolute",
    alignSelf: "center",
    width: "120%",
    height: "50%",
    bottom: "0%",
    borderTopRightRadius: 150,
    borderTopLeftRadius: 150,
    backgroundColor: "#f5f5f5",
  },
  inputBox: {
    marginTop: "5%",
    alignSelf: "center",
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    alignItems: "center",
    backgroundColor: "white",
    width: "90%",
    height: "50%",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.51,
    shadowRadius: 13.16,
    elevation: 20,
  },
  curvedButton: {
    width: "70%",
    marginTop: "5%",
    elevation: 30,
    backgroundColor: "#3f32d2",
    height: "20%",
    justifyContent: "center",
    alignItems: "center",
    borderBottomRightRadius: parseInt(
      Dimensions.get("window").height * 0.2 * 0.4
    ),
    borderTopLeftRadius: parseInt(Dimensions.get("window").height * 0.2 * 0.4),
  },
});

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({ updateKey, translateText }, dispatch);
};

const mapStateToProps = (state) => {
  return {
    user: state.user,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Main);

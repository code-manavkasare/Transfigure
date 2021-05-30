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
  Settings,
  ScrollView,
  Switch,
  Platform,
} from "react-native";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { updateKey, translateText } from "../actions/user";
import { Header, Icon, Overlay, Input, Avatar } from "react-native-elements";
import Beacon from "react-native-vector-icons/MaterialCommunityIcons";
import moment from "moment";
import MyFooter from "../components/centerComp";
import ParsedText from "react-native-parsed-text";
import { RadioButton } from "react-native-paper";
import ImagePicker from "react-native-image-picker";
import { reportQuote } from "../func/quotes";

import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from "react-native-popup-menu";

class ReportConfirmation extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  componentDidMount() {}

  showUpperText() {
    if (this.props.route.params.type == "user") {
      return (
        <Text
          style={{
            alignSelf: "center",
            fontSize: 20,
            marginTop: "2%",
            color: "#f07c4a",
            fontWeight: "bold",
          }}
        >
          {this.props.translateText("report.report_user")}
        </Text>
      );
    }
    if (this.props.route.params.type == "quote") {
      return (
        <Text
          style={{
            alignSelf: "center",
            fontSize: 20,
            marginTop: "2%",
            color: "#f07c4a",
            fontWeight: "bold",
          }}
        >
          {this.props.translateText("report.report_quote")}
        </Text>
      );
    }
    if (this.props.route.params.type == "reflection") {
      return (
        <Text
          style={{
            alignSelf: "center",
            fontSize: 20,
            marginTop: "2%",
            color: "#f07c4a",
            fontWeight: "bold",
          }}
        >
          {this.props.translateText("report.report_reflection")}
        </Text>
      );
    }
    if (this.props.route.params.type == "contactus") {
      return (
        <Text
          style={{
            alignSelf: "center",
            fontSize: 20,
            marginTop: "2%",
            color: "#f07c4a",
            fontWeight: "bold",
          }}
        >
          {this.props.translateText("beacon.contact_support")}
        </Text>
      );
    }
  }
  render() {
    let text1 = this.props.translateText("report.report_Sent");
    let text2 = `${this.props.translateText("report.we_will_review")} ${
      this.props.route.params.type
    }.${this.props.translateText("report.thanks_your_feedback")}.`;
    if (this.props.route.params.type == "contactus") {
      text1 = this.props.translateText("report.message_sent");
      text2 = this.props.translateText("report.we_will_review_message");
    }
    return (
      <SafeAreaView style={styles.container}>
        <View style={{ flex: 1 }}>
          <View style={styles.upperPart}>
            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              <Icon
                name="arrowleft"
                type="antdesign"
                size={30}
                color="white"
                backgroundColor="#6a5df5"
                style={{ borderRadius: 50 }}
                onPress={() => {
                  this.props.navigation.goBack();
                }}
              />
              {/* <Beacon name="lighthouse" size={50} color="#f07c4a"/> */}
              <Image
                source={require("../images/przezroczyste.png")}
                style={{
                  width: parseInt(Dimensions.get("window").width * 0.2),
                  height: parseInt(Dimensions.get("window").height * 0.1),
                  alignSelf: "center",
                  marginTop: "-2%",
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
            {this.showUpperText()}
          </View>

          <View
            style={{
              borderWidth: 2,
              borderColor: "#00802d",
              backgroundColor: "#cef2d7",
              marginTop: "5%",
              alignSelf: "center",
              alignItems: "center",
              width: "90%",
              borderRadius: 10,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                marginTop: "5%",
                alignItems: "center",
              }}
            >
              <Icon
                name="check"
                type="entypo"
                size={20}
                color="white"
                style={{
                  borderRadius: 10,
                  overflow: "hidden",
                  backgroundColor: "#00db3c",
                }}
              />
              <Text
                style={{
                  color: "#00802d",
                  marginLeft: "5%",
                  fontWeight: "bold",
                  fontSize: 20,
                }}
              >
                {text1}
              </Text>
            </View>
            <Text
              style={{
                color: "#00802d",
                textAlign: "center",
                paddingVertical: "10%",
                marginHorizontal: "5%",
                fontSize: 18,
              }}
            >
              {text2}
            </Text>
          </View>

          <TouchableOpacity
            onPress={() => {
              this.props.navigation.pop(2);
            }}
            style={{
              backgroundColor: "#3f32d2",
              flexDirection: "row",
              borderRadius: 20,
              width: "60%",
              padding: 8,
              justifyContent: "center",
              alignSelf: "center",
              marginTop: "13%",
              alignItems: "center",
            }}
          >
            <Icon
              name="chevron-with-circle-right"
              type="entypo"
              size={20}
              color="white"
            />
            <Text style={{ color: "white", marginLeft: "5%", fontSize: 20 }}>
              {this.props.translateText("report.continue")}
            </Text>
          </TouchableOpacity>
        </View>

        <MyFooter parentProps={this.props} />
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#f5f5f5",
    flex: 1,
  },
  circle: {
    position: "absolute",
    alignSelf: "center",
    width: "100%",
    height: "75%",
    bottom: "0%",
    backgroundColor: "#f5f5f5",
  },
  inputBox: {
    marginTop: "1%",
    alignSelf: "center",
    borderRadius: 10,
    alignItems: "center",
    backgroundColor: "white",
    width: "95%",
    height: "75%",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.51,
    shadowRadius: 13.16,
    elevation: 20,
  },
  upperPart: {
    height: "20%",
    backgroundColor: "#3f32d2",
    paddingTop: "5%",
    paddingHorizontal: "5%",
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.51,
    shadowRadius: 13.16,
    elevation: 20,
    marginTop: Platform.OS !== "ios" ? 30 : 0,
  },
  curvedButton: {
    width: "80%",
    marginTop: "5%",
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

export default connect(mapStateToProps, mapDispatchToProps)(ReportConfirmation);

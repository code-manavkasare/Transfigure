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
import { reportUser } from "../func/findUsers";
import { contactUsFunc } from "../func/userSettings";

import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from "react-native-popup-menu";

class ContactUs extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      bgColor: "black",
      inputText: "",
      chosenColor: "black",
      message: "",
    };
  }
  componentDidMount() {}

  async handleContactUs() {
    if (this.state.message != "") {
      let resp = await contactUsFunc(
        this.props.user.authKey,
        this.state.message
      );
      if (resp) {
        this.props.navigation.navigate("ReportConfirmation", {
          type: "contactus",
        });
      } else {
        Alert.alert(
          "Failed!",
          this.props.translateText("beacon.something_wrong")
        );
      }
    }
  }
  render() {
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
            <Text
              style={{
                alignSelf: "center",
                fontSize: 18,
                marginTop: "2%",
                color: "#f07c4a",
                fontWeight: "bold",
              }}
            >
              {this.props.translateText("beacon.contact_support")}
            </Text>
          </View>
          <View
            style={{
              alignSelf: "center",
              alignItems: "center",
              marginTop: "2%",
              width: "90%",
              elevation: 20,
              height: "75%",
              backgroundColor: "white",
              borderRadius: 10,
            }}
          >
            <Icon
              name="email"
              type="material-community"
              size={50}
              color="green"
            />
            <ParsedText
              style={{
                color: "black",
                fontSize: 16,
                marginHorizontal: "2%",
                textAlign: "center",
                fontWeight: "bold",
              }}
              childrenProps={{ allowFontScaling: true }}
            >
              {this.props.translateText("beacon.please_type_message")}
            </ParsedText>

            <TextInput
              placeholder={this.props.translateText("beacon.write_message")}
              value={this.state.message}
              onChangeText={(value) => this.setState({ message: value })}
              multiline={true}
              style={{
                borderWidth: 3,
                width: "90%",
                height: "20%",
                borderColor: "#3f32d2",
                marginTop: "5%",
              }}
            />

            <TouchableOpacity
              onPress={() => {
                this.handleContactUs();
              }}
              style={{
                backgroundColor: "green",
                flexDirection: "row",
                borderRadius: 20,
                width: "60%",
                padding: 8,
                justifyContent: "center",
                alignSelf: "center",
                marginTop: "3%",
              }}
            >
              <Icon name="flag" type="font-awesome" size={20} color="white" />
              <Text
                style={{ color: "white", marginLeft: "2%", fontWeight: "bold" }}
              >
                {this.props.translateText("beacon.submit")}
              </Text>
            </TouchableOpacity>
          </View>
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

export default connect(mapStateToProps, mapDispatchToProps)(ContactUs);

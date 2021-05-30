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
import {
  loginUser,
  updateEmail,
  updatePassword,
  updateKey,
  updateUuid,
  translateText,
} from "../actions/user";
import AsyncStorage from "@react-native-community/async-storage";

import { Header, Icon, Overlay, Input, Avatar } from "react-native-elements";
import Beacon from "react-native-vector-icons/MaterialCommunityIcons";
import moment from "moment";
import MyFooter from "../components/centerComp";
import ParsedText from "react-native-parsed-text";
import { RadioButton } from "react-native-paper";
import ImagePicker from "react-native-image-picker";
import { deleteUserAccount } from "../func/userSettings";

class SettingsDeleteAccount extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      bgColor: "black",
      inputText: "",
      chosenColor: "black",
      avatarUri: "",
      displayName: "",
      displayTitle: "",
      biography: "",
      radioChecked: 0,
      deleteReason: "",
      reasons: [
        this.props.translateText("settingsDeleteAccount.concerned_data"),
        this.props.translateText(
          "settingsDeleteAccount.trouble_getting_started"
        ),
        this.props.translateText("settingsDeleteAccount.privacy_concern"),
        this.props.translateText(
          "settingsDeleteAccount.receiving_unwanted_contact"
        ),
      ],
    };
  }
  componentDidMount() {}

  async handleDelete() {
    let myreason = 0;
    if (this.state.radioChecked < 4) {
      myreason = this.state.reasons[this.state.radioChecked];
    } else {
      myreason = this.state.deleteReason;
    }
    let resp = await deleteUserAccount(this.props.user.authKey, myreason);
    if (resp) {
      this.props.updateEmail("");
      this.props.updatePassword("");
      this.props.updateKey("");
      this.props.updateUuid("");
      await AsyncStorage.removeItem("UserAccount");
      this.props.navigation.reset({
        index: 0,
        routes: [{ name: "Login" }],
      });
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
                size={50}
                color="white"
                backgroundColor="#6a5df5"
                style={{ borderRadius: 50 }}
                onPress={() => {
                  this.props.navigation.navigate("Settings");
                }}
              />
              {/* <Beacon name="lighthouse" size={50} color="#f07c4a"/> */}
              <Image
                source={require("../images/przezroczyste.png")}
                style={{
                  width: parseInt(Dimensions.get("window").width * 0.2),
                  height: parseInt(Dimensions.get("window").height * 0.1),
                  marginTop: "-2%",
                }}
                resizeMode="cover"
              />

              <Beacon name="lighthouse" size={50} color="#3f32d2" />
            </View>
            <Text
              style={{
                alignSelf: "center",
                fontSize: 20,
                marginTop: "2%",
                color: "#f07c4a",
                fontWeight: "bold",
              }}
            >
              {this.props.translateText("settingsDeleteAccount.delete_account")}
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
            <Icon name="warning" type="entypo" size={50} color="red" />
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
              {this.props.translateText("settingsDeleteAccount.delete_text")}
            </ParsedText>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                alignSelf: "flex-start",
              }}
            >
              <RadioButton
                value={0}
                status={this.state.radioChecked === 0 ? "checked" : "unchecked"}
                onPress={() => {
                  this.setState({ radioChecked: 0 });
                }}
                color="#3f32d2"
              />
              <Text style={{ fontSize: 15 }}>{this.state.reasons[0]}</Text>
            </View>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                alignSelf: "flex-start",
              }}
            >
              <RadioButton
                value={1}
                status={this.state.radioChecked === 1 ? "checked" : "unchecked"}
                onPress={() => {
                  this.setState({ radioChecked: 1 });
                }}
                color="#3f32d2"
              />
              <Text style={{ fontSize: 15 }}>{this.state.reasons[1]}</Text>
            </View>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                alignSelf: "flex-start",
              }}
            >
              <RadioButton
                value={2}
                status={this.state.radioChecked === 2 ? "checked" : "unchecked"}
                onPress={() => {
                  this.setState({ radioChecked: 2 });
                }}
                color="#3f32d2"
              />
              <Text style={{ fontSize: 15 }}>{this.state.reasons[2]}</Text>
            </View>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                alignSelf: "flex-start",
              }}
            >
              <RadioButton
                value={3}
                status={this.state.radioChecked === 3 ? "checked" : "unchecked"}
                onPress={() => {
                  this.setState({ radioChecked: 3 });
                }}
                color="#3f32d2"
              />
              <Text style={{ fontSize: 15 }}>{this.state.reasons[3]}</Text>
            </View>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                alignSelf: "flex-start",
              }}
            >
              <RadioButton
                value={4}
                status={this.state.radioChecked === 4 ? "checked" : "unchecked"}
                onPress={() => {
                  this.setState({ radioChecked: 4 });
                }}
                color="#3f32d2"
              />
              <Text style={{ fontSize: 15 }}>Other</Text>
            </View>

            <TextInput
              placeholder={this.props.translateText(
                "settingsDeleteAccount.delete_reason_text"
              )}
              value={this.state.deleteReason}
              onChangeText={(value) => this.setState({ deleteReason: value })}
              multiline={true}
              style={{
                borderWidth: 3,
                width: "90%",
                height: "20%",
                borderColor: "#3f32d2",
                marginTop: "5%",
              }}
              editable={this.state.radioChecked == 4}
            />
            <TouchableOpacity
              style={{
                backgroundColor: "#ff4714",
                flexDirection: "row",
                borderRadius: 20,
                width: "60%",
                padding: 8,
                justifyContent: "space-around",
                alignSelf: "center",
                marginTop: "3%",
              }}
              onPress={() => {
                this.handleDelete();
              }}
            >
              <Icon name="trash-2" type="feather" size={20} color="white" />
              <Text
                style={{ color: "white", marginLeft: "2%", fontWeight: "bold" }}
              >
                {this.props.translateText(
                  "settingsDeleteAccount.delete_account"
                )}
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
  return bindActionCreators(
    {
      updateKey,
      loginUser,
      updateEmail,
      updatePassword,
      updateUuid,
      translateText,
    },
    dispatch
  );
};

const mapStateToProps = (state) => {
  return {
    user: state.user,
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SettingsDeleteAccount);

import React from "react";
import {
  View,
  TextInput,
  StyleSheet,
  TouchableWithoutFeedback,
  Keyboard,
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
import { updatePassword, fetchSettingsInfo } from "../func/userSettings";

import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from "react-native-popup-menu";

class SettingsUpdatePassword extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      bgColor: "black",
      inputText: "",
      chosenColor: "black",
      avatarUri: "",
      oldPassVis: true,
      oldPassword: "",
      newPassVis: true,
      newPassword: "",
      confnewPassVis: true,
      confnewPassword: "",
      warnText: "",
    };
  }
  async componentDidMount() {
    await this.getInformation();
  }
  async getInformation() {
    //we will fetch everything
    let resp = await fetchSettingsInfo(this.props.user.authKey);
    if (resp) {
      this.setState({ avatarUri: resp.avatarURI });
    }
  }

  showAvatar() {
    if (this.state.avatarUri == "") {
      let img = require("../images/defaultAvatar.jpg");
      return (
        <Avatar
          size={50}
          source={img}
          rounded
          onPress={() => {
            this.props.navigation.navigate("UpdateBio");
          }}
        />
      );
    } else {
      let myuri = this.state.avatarUri;
      return (
        <Avatar
          size={50}
          source={{ uri: myuri }}
          rounded
          onPress={() => {
            this.props.navigation.navigate("UpdateBio");
          }}
        />
      );
    }
  }
  async updatePass() {
    let newPas = this.state.newPassword;
    let newPasConf = this.state.confnewPassword;
    if (newPas == newPasConf && this.state.oldPassword != "" && newPas != "") {
      let resp = await updatePassword(
        this.props.user.authKey,
        this.state.oldPassword,
        newPas
      );
      if (resp == true) {
        this.setState({
          oldPassword: "",
          newPassword: "",
          confnewPassword: "",
          warnText: "",
        });
        this.props.navigation.goBack();
      }
      if (resp == 1) {
        this.setState({
          warnText: this.props.translateText(
            "settingsUpdatePassword.different_old_password"
          ),
        });
      }
    } else {
      if (newPas != newPasConf) {
        this.setState({
          warnText: this.props.translateText(
            "settingsUpdatePassword.password_doesn't_match"
          ),
        });
      }
      if (newPas == "" || this.state.oldPassword == "" || newPasConf == "") {
        this.setState({
          warnText: this.props.translateText(
            "settingsUpdatePassword.fields_can't_empty"
          ),
        });
      }
    }
  }
  renderWarnText() {
    if (this.state.warnText != "") {
      return <Text>{this.state.warnText}</Text>;
    } else {
      return null;
    }
  }

  render() {
    return (
      <TouchableWithoutFeedback
        onPress={() => {
          Keyboard.dismiss();
        }}
      >
        <SafeAreaView style={styles.container}>
          <View style={{ flex: 1 }}>
            <View style={styles.upperPart}>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <Icon
                  name="arrowleft"
                  type="antdesign"
                  size={50}
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

                {this.showAvatar()}
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
                CHANGE PASSWORD
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
                paddingTop: "5%",
              }}
            >
              <Input
                placeholder={this.props.translateText(
                  "settingsUpdatePassword.enter_old_password"
                )}
                leftIcon={{
                  type: "entypo",
                  name: "lock",
                  onPress: () => {
                    this.setState({ oldPassVis: !this.state.oldPassVis });
                  },
                }}
                value={this.state.oldPassword}
                onChangeText={(value) => this.setState({ oldPassword: value })}
                secureTextEntry={this.state.oldPassVis}
                inputContainerStyle={{
                  borderWidth: 2,
                  width: "90%",
                  alignSelf: "center",
                }}
              />
              <Input
                placeholder={this.props.translateText(
                  "settingsUpdatePassword.enter_new_password"
                )}
                leftIcon={{
                  type: "entypo",
                  name: "lock",
                  onPress: () => {
                    this.setState({ newPassVis: !this.state.newPassVis });
                  },
                }}
                value={this.state.newPassword}
                onChangeText={(value) => this.setState({ newPassword: value })}
                secureTextEntry={this.state.newPassVis}
                inputContainerStyle={{
                  borderWidth: 2,
                  width: "90%",
                  alignSelf: "center",
                }}
              />
              {this.renderWarnText()}
              <Input
                placeholder={this.props.translateText(
                  "settingsUpdatePassword.confirm_new_password"
                )}
                leftIcon={{
                  type: "entypo",
                  name: "lock",
                  onPress: () => {
                    this.setState({
                      confnewPassVis: !this.state.confnewPassVis,
                    });
                  },
                }}
                value={this.state.confnewPassword}
                onChangeText={(value) =>
                  this.setState({ confnewPassword: value })
                }
                secureTextEntry={this.state.confnewPassVis}
                inputContainerStyle={{
                  borderWidth: 2,
                  width: "90%",
                  alignSelf: "center",
                }}
              />
              <TouchableOpacity
                onPress={() => {
                  this.updatePass();
                }}
                style={{
                  backgroundColor: "#3f32d2",
                  marginTop: "10%",
                  flexDirection: "row",
                  borderRadius: 20,
                  width: "60%",
                  padding: 8,
                  justifyContent: "center",
                }}
              >
                <Icon name="check" type="antdesign" size={20} color="white" />
                <Text
                  style={{
                    color: "white",
                    marginLeft: "2%",
                    fontWeight: "bold",
                  }}
                >
                  {this.props.translateText("updateBio.update.en")}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <MyFooter parentProps={this.props} />
        </SafeAreaView>
      </TouchableWithoutFeedback>
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

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SettingsUpdatePassword);

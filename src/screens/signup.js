import React from "react";
import {
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Text,
  Image,
  Alert,
  SafeAreaView,
  Linking,
  Dimensions,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView,
  Platform,
} from "react-native";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { updateKey, registerUser, translateText } from "../actions/user";
import { Input, Icon } from "react-native-elements";
import ParsedText from "react-native-parsed-text";
import { HelperText } from "react-native-paper";

class Signup extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confPassword: "",
      alertText: "",
    };
  }

  componentDidMount() {
    console.disableYellowBox = true;
  }
  handlePressTerms() {
    Linking.canOpenURL(
      "https://www.websitepolicies.com/policies/view/rrpx4LOY"
    ).then((supported) => {
      if (supported) {
        Linking.openURL(
          "https://www.websitepolicies.com/policies/view/rrpx4LOY"
        );
      } else {
        console.log(
          "Don't know how to open URI: " +
            "https://www.websitepolicies.com/policies/view/rrpx4LOY"
        );
      }
    });
  }
  handlePressData() {
    Linking.canOpenURL(
      "https://www.websitepolicies.com/policies/view/4utbA6dc"
    ).then((supported) => {
      if (supported) {
        Linking.openURL(
          "https://www.websitepolicies.com/policies/view/4utbA6dc"
        );
      } else {
        console.log(
          "Don't know how to open URI: " +
            "https://www.websitepolicies.com/policies/view/4utbA6dc"
        );
      }
    });
  }

  validateEmail(text) {
    let reg = /^(([^<>()\[\]\\.,;:\s@”]+(\.[^<>()\[\]\\.,;:\s@”]+)*)|(“.+”))@((\[[0–9]{1,3}\.[0–9]{1,3}\.[0–9]{1,3}\.[0–9]{1,3}])|(([a-zA-Z\-0–9]+\.)+[a-zA-Z]{2,}))$/;
    return reg.test(text);
  }
  async handleRegister() {
    //first we check the password    ///add first name last name
    let newemail = this.state.email.replace(/\s+/g, "");
    newemail = newemail.toLowerCase();
    let newfirst = this.state.firstName.replace(/\s+/g, "");
    let newlast = this.state.lastName.replace(/\s+/g, "");

    this.setState({ email: newemail, firstName: newfirst, lastName: newlast });

    if (
      this.state.confPassword == this.state.password &&
      this.state.password.length > 7 &&
      this.validateEmail(newemail) &&
      newfirst != "" &&
      newlast != ""
    ) {
      let resp = await this.props.registerUser(this.state);

      if (resp.success) {
        Alert.alert("Sucess!", "We have sent you confirmation link");
      } else {
        if (resp.reason == 0) {
          Alert.alert("Failed", "Email already exists");
        }
        if (resp.reason == 1) {
          Alert.alert("Failed", "Server error");
        }
        if (resp.reason == 2) {
          Alert.alert("Failed", "Wrong field content");
        }
        if (resp.reason == 3) {
          Alert.alert("Failed", "Email is banned");
        }
      }
    } else {
      if (this.state.confPassword != this.state.password) {
        this.setState({ alertText: "Please confirm your password" });
      }
      if (this.state.password.length <= 7) {
        this.setState({
          alertText: "Password must have at least 8 characters",
        });
        console.log(this.state);
      }
      if (!this.validateEmail(this.state.email)) {
        this.setState({ alertText: "Please put valid email" });
      }
      if (newfirst == "") {
        this.setState({ alertText: "Fields can't be empty" });
      }
      if (newlast == "") {
        this.setState({ alertText: "Fields can't be empty" });
      }
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
          <View style={styles.circle} />
          <View style={styles.iconStyle}>
            <Text style={{ color: "white", fontSize: 30 }}>
              {this.props.translateText("login.transfigure")}
            </Text>
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

            <Text style={{ color: "white", fontSize: 20, fontWeight: "bold" }}>
              {this.props.translateText("signup.create_an_account")}
            </Text>
          </View>
          <View style={styles.inputBox}>
            <HelperText
              type="info"
              visible={true}
              style={{ padding: 0, textAlign: "center" }}
            >
              {this.state.alertText}
            </HelperText>
            <View
              style={{
                flexDirection: "row",
                borderWidth: 1,
                borderColor: "black",
                marginVertical: "2%",
                alignItems: "center",
                width: "80%",
                alignSelf: "center",
              }}
            >
              <Icon
                name="user"
                type="entypo"
                size={30}
                color="black"
                style={{ marginLeft: "3%" }}
              />
              <TextInput
                placeholder={this.props.translateText("signup.first_name")}
                value={this.state.firstName}
                secureTextEntry={false}
                onChangeText={(value) => this.setState({ firstName: value })}
                style={{ fontSize: 20, width: "80%", alignSelf: "center" }}
              />
            </View>
            <View
              style={{
                flexDirection: "row",
                borderWidth: 1,
                borderColor: "black",
                marginVertical: "2%",
                alignItems: "center",
                width: "80%",
                alignSelf: "center",
              }}
            >
              <Icon
                name="user"
                type="entypo"
                size={30}
                color="black"
                style={{ marginLeft: "3%" }}
              />
              <TextInput
                placeholder={this.props.translateText("signup.last_name")}
                value={this.state.lastName}
                secureTextEntry={false}
                onChangeText={(value) => this.setState({ lastName: value })}
                style={{ fontSize: 20, width: "80%", alignSelf: "center" }}
              />
            </View>
            <View
              style={{
                flexDirection: "row",
                borderWidth: 1,
                borderColor: "black",
                marginVertical: "2%",
                alignItems: "center",
                width: "80%",
                alignSelf: "center",
              }}
            >
              <Icon
                name="at-sign"
                type="feather"
                size={30}
                color="black"
                style={{ marginLeft: "3%" }}
              />
              <TextInput
                placeholder={this.props.translateText("signup.your_email")}
                value={this.state.email}
                secureTextEntry={false}
                onChangeText={(value) => this.setState({ email: value })}
                style={{ fontSize: 20, width: "80%", alignSelf: "center" }}
              />
            </View>
            <View
              style={{
                flexDirection: "row",
                borderWidth: 1,
                borderColor: "black",
                marginVertical: "2%",
                alignItems: "center",
                width: "80%",
                alignSelf: "center",
              }}
            >
              <Icon
                name="lock"
                type="entypo"
                size={30}
                color="black"
                style={{ marginLeft: "3%" }}
              />
              <TextInput
                placeholder={this.props.translateText("signup.password")}
                value={this.state.password}
                secureTextEntry={true}
                onChangeText={(value) => this.setState({ password: value })}
                style={{ fontSize: 20, width: "80%", alignSelf: "center" }}
              />
            </View>
            <View
              style={{
                flexDirection: "row",
                borderWidth: 1,
                borderColor: "black",
                marginVertical: "2%",
                alignItems: "center",
                width: "80%",
                alignSelf: "center",
              }}
            >
              <Icon
                name="lock"
                type="entypo"
                size={30}
                color="black"
                style={{ marginLeft: "3%" }}
              />
              <TextInput
                placeholder={this.props.translateText(
                  "signup.confirm_password"
                )}
                value={this.state.confPassword}
                secureTextEntry={true}
                onChangeText={(value) => this.setState({ confPassword: value })}
                style={{ fontSize: 20, width: "80%", alignSelf: "center" }}
              />
            </View>
          </View>
          <TouchableOpacity
            style={styles.buttonLogin}
            onPress={() => {
              this.handleRegister();
            }}
          >
            <Text style={{ color: "white", fontSize: 25 }}>
              {this.props.translateText("signup.signup")}
            </Text>
          </TouchableOpacity>

          <View style={styles.signup}>
            <ParsedText
              style={{
                color: "black",
                fontSize: 13,
                marginHorizontal: "2%",
                textAlign: "center",
              }}
              parse={[
                {
                  pattern: /terms of service/,
                  style: { color: "orange" },
                  onPress: this.handlePressTerms,
                },
                {
                  pattern: /data policy/,
                  style: { color: "orange" },
                  onPress: this.handlePressData,
                },
              ]}
              childrenProps={{ allowFontScaling: true }}
            >
              {this.props.translateText("signup.signup_text")}
            </ParsedText>
          </View>
        </SafeAreaView>
      </TouchableWithoutFeedback>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    flex: 1,
  },
  circle: {
    alignSelf: "center",
    position: "absolute",
    width: "100%",
    height: "70%",
    borderBottomRightRadius: 100,
    borderBottomLeftRadius: 100,
    backgroundColor: "#3f32d2",
  },
  buttonLogin: {
    marginTop: "-5%",
    width: "50%",
    borderRadius: 25,
    backgroundColor: "#3f32d2",
    padding: 5,
    alignItems: "center",
    alignSelf: "center",
    elevation: 25,
  },
  iconStyle: {
    alignItems: "center",
    alignSelf: "center",
    top: "0%",
    elevation: 20,
  },
  signup: {
    marginTop: "5%",
    alignItems: "center",
  },
  inputBox: {
    alignSelf: "center",
    marginTop: "5%",
    borderRadius: 10,
    backgroundColor: "white",
    width: "85%",
    height: "58%",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.51,
    shadowRadius: 13.16,
    elevation: 20,
  },
});

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(
    { updateKey, registerUser, translateText },
    dispatch
  );
};

const mapStateToProps = (state) => {
  return {
    user: state.user,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Signup);

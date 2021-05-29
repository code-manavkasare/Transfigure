import AsyncStorage from "@react-native-community/async-storage";
import React from "react";
import {
  Dimensions,
  Image,
  Linking,
  Platform,
  SafeAreaView,
  ScrollView,
  Share,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import CountryPicker from "react-native-country-picker-modal";
import { Avatar, Icon, Overlay } from "react-native-elements";
import Entypo from "react-native-vector-icons/Entypo";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import {
  setLanguage,
  translateText,
  updateEmail,
  updateKey,
  updatePassword,
  updateUuid,
} from "../actions/user";
import MyFooter from "../components/centerComp";
import {
  countryToTimezone,
  getCountryFlag,
  timezoneToTimeOffset,
} from "../func/countryToFlag";
import {
  fetchSettingsInfo,
  notificationToggle,
  onesignalNotificationToggle,
  updateInfo,
} from "../func/userSettings";

class MySettings extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      bgColor: "black",
      inputText: "",
      chosenColor: "black",
      boldOn: 0,
      italicOn: 0,
      biggerFontOn: 0,
      shareWith: "Everyone",
      showPersonal: 0,
      showCountry: 0,
      countryAndFlag: "",
      private: false,
      countryPickerVisible: false,
      avatarUri: "",
      overlayVis: false,
      langVisible: false,
      chosenEdit: "",
      countryShort: "",
      timeZone: "",
      keepSignedIn: null,
      notificationEnabled: null,
      username: "",
      usernameConfirmed: "",
      email: "",
      emailConfirmed: "",
    };
  }

  async componentDidMount() {
    console.disableYellowBox = true;
    await this.getInformation();
    await this.checkStorage();
  }

  async checkStorage() {
    if (this.state.keepSignedIn == null) {
      //first fetch
      try {
        let value = await AsyncStorage.getItem("UserAccount");
        if (value !== null) {
          let myObjValue = JSON.parse(value);
          if (myObjValue.keepsignedin == 1) {
            myObjValue.keepsignedin = true;
          } else {
            myObjValue.keepsignedin = false;
          }
          if (myObjValue.notificationEnabled) {
            myObjValue.notificationEnabled = true;
          } else {
            myObjValue.notificationEnabled = false;
          }
          this.setState({
            keepSignedIn: myObjValue.keepsignedin,
            notificationEnabled: myObjValue.notificationEnabled,
          });
        } else {
          this.setState({ keepSignedIn: true, notificationEnabled: true });
        }
      } catch (error) {
        console.log(error);
      }
    }
  }
  async getLocalInfo() {
    if (!this.state.keepSignedIn) {
      try {
        let myObj = {
          authKey: this.props.user.authKey,
          uuID: this.props.user.uuID,
          keepsignedin: 1,
          notificationEnabled: this.state.notificationEnabled,
        };
        await AsyncStorage.setItem("UserAccount", JSON.stringify(myObj));
        this.setState({ keepSignedIn: true });
      } catch (error) {
        // Error retrieving data
        console.log(error);
      }
    } else {
      try {
        let myObj = {
          authKey: this.props.user.authKey,
          uuID: this.props.user.uuID,
          keepsignedin: 0,
          notificationEnabled: this.state.notificationEnabled,
        };

        await AsyncStorage.setItem("UserAccount", JSON.stringify(myObj));
        this.setState({ keepSignedIn: false });
      } catch (error) {
        // Error retrieving data
        console.log(error);
      }
    }
  }

  async notificationToggle() {
    if (!this.state.notificationEnabled) {
      try {
        let myObj = {
          authKey: this.props.user.authKey,
          uuID: this.props.user.uuID,
          keepsignedin: this.state.keepSignedIn,
          notificationEnabled: 1,
        };
        await AsyncStorage.setItem("UserAccount", JSON.stringify(myObj));
        this.setState({ notificationEnabled: true });
        let resp = await notificationToggle(this.props.user.authKey, true);
        await onesignalNotificationToggle(false);
      } catch (error) {
        // Error retrieving data
        console.log(error);
      }
    } else {
      try {
        let myObj = {
          authKey: this.props.user.authKey,
          uuID: this.props.user.uuID,
          keepsignedin: this.state.keepSignedIn,
          notificationEnabled: 0,
        };

        await AsyncStorage.setItem("UserAccount", JSON.stringify(myObj));
        this.setState({ notificationEnabled: false });
        let resp = await notificationToggle(this.props.user.authKey, false);
        await onesignalNotificationToggle(true);
        console.log(resp, "resp");
      } catch (error) {
        // Error retrieving data
        console.log(error);
      }
    }
  }

  async getInformation() {
    //we will fetch everything
    let resp = await fetchSettingsInfo(this.props.user.authKey);
    if (resp) {
      let flag = getCountryFlag(resp.countryShort);
      let offset = timezoneToTimeOffset(resp.timezone);
      this.setState({
        usernameConfirmed: resp.username,
        emailConfirmed: resp.email,
        countryAndFlag: flag + resp.countryLong,
        timeZone: resp.timezone,
        private: resp.private,
        avatarUri: resp.avatarURI,
      });
    }
  }
  async updateInformation() {
    let field = this.state.chosenEdit;
    let value = this.state[field];
    let resp = await updateInfo(this.props.user.authKey, field, value);
    if (resp) {
      let confirmedField = field + "Confirmed";
      this.setState({
        overlayVis: !this.state.overlayVis,
        [confirmedField]: this.state[field],
      });
    }
  }
  showPersonalInformation() {
    if (this.state.showPersonal) {
      return (
        <View style={{ backgroundColor: "#d6d6d6", paddingHorizontal: "5%" }}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginHorizontal: "5%",
            }}
          >
            <Icon name="user" type="entypo" size={20} color="black" />
            <Text style={{ marginLeft: "2%" }}>
              {this.props.translateText("setting.username")}:
            </Text>
            <Text style={{ marginLeft: "2%", color: "blue" }}>
              {this.state.usernameConfirmed}
            </Text>
            <Icon
              name="pencil"
              type="evilicon"
              size={20}
              color="blue"
              onPress={() => {
                this.setState({ overlayVis: true, chosenEdit: "username" });
              }}
            />
          </View>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginHorizontal: "5%",
            }}
          >
            <Icon name="mail" type="entypo" size={20} color="black" />
            <Text style={{ marginLeft: "2%" }}>
              {this.props.translateText("setting.email")}:
            </Text>
            <Text style={{ marginLeft: "2%", color: "blue" }}>
              {this.state.emailConfirmed}
            </Text>
            <Icon
              name="pencil"
              type="evilicon"
              size={20}
              color="blue"
              onPress={() => {
                this.setState({ overlayVis: true, chosenEdit: "email" });
              }}
            />
          </View>
        </View>
      );
    }
  }

  handleLanguage = () => {
    console.log(this.props.user.languageCode, "this.props.user.languageCode");
    if (this.props.user.languageCode === "en") {
      return "English";
    }
    if (this.props.user.languageCode === "fr") {
      return "French";
    }
    if (this.props.user.languageCode === "ge") {
      return "German";
    }
    if (this.props.user.languageCode === "sp") {
      return "Spanish";
    }
    if (this.props.user.languageCode === "it") {
      return "Italian";
    }
    if (this.props.user.languageCode === "po") {
      return "Polish";
    }
  };

  async onSelectCountry(country) {
    let tmzone = countryToTimezone(country.cca2);

    let up1 = await updateInfo(
      this.props.user.authKey,
      "countryShort",
      country.cca2
    );
    let up2 = await updateInfo(this.props.user.authKey, "timezone", tmzone);
    let up3 = await updateInfo(
      this.props.user.authKey,
      "countryLong",
      country.name
    );
    if (up1 && up2 && up3) {
      await this.getInformation();
      this.setState({ countryPickerVisible: false });
    }
  }
  showCountry() {
    if (this.state.showCountry) {
      return (
        <View style={{ backgroundColor: "#d6d6d6", paddingHorizontal: "5%" }}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginHorizontal: "5%",
            }}
          >
            <Icon
              name="map-marker"
              type="font-awesome"
              size={20}
              color="black"
            />
            <Text style={{ marginLeft: "2%" }}>
              {this.props.translateText("setting.country")}:
            </Text>
            <Text style={{ marginLeft: "2%", color: "blue" }}>
              {this.state.countryAndFlag}
            </Text>
            <Icon
              name="pencil"
              type="evilicon"
              size={20}
              color="blue"
              onPress={() => {
                this.setState({
                  countryPickerVisible: !this.state.countryPickerVisible,
                });
              }}
            />
          </View>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginHorizontal: "5%",
            }}
          >
            <Icon
              name="map-clock"
              type="material-community"
              size={20}
              color="black"
            />
            <Text style={{ marginLeft: "2%" }}>
              {this.props.translateText("setting.timezone")}:
            </Text>
            <Text style={{ marginLeft: "2%", color: "blue" }}>
              {this.state.timeZone}
            </Text>
          </View>
        </View>
      );
    }
  }
  showArrow(which) {
    if (this.state[which]) {
      return <Icon name="down" type="antdesign" size={30} color="#6a5df5" />;
    } else {
      return <Icon name="right" type="antdesign" size={30} color="#6a5df5" />;
    }
  }
  editOverlay() {
    let myText = this.state.chosenEdit;

    return (
      <Overlay
        isVisible={this.state.overlayVis}
        onBackdropPress={() => {
          this.setState({ overlayVis: !this.state.overlayVis });
        }}
        overlayStyle={{
          width: "90%",
          justifyContent: "center",
          height: "40%",
          alignItems: "center",
        }}
      >
        <Text style={{ fontSize: 20 }}>Edit {myText}</Text>
        <TextInput
          placeholder={
            `${this.props.translateText("setting.your")}` + " " + myText
          }
          value={this.state[myText]}
          onChangeText={(value) => this.setState({ [myText]: value })}
          multiline={false}
          style={{
            borderWidth: 3,
            width: "90%",
            height: "30%",
            borderColor: "#3f32d2",
            marginTop: "5%",
            fontSize: 20,
          }}
        />
        <TouchableOpacity
          onPress={() => {
            this.updateInformation();
          }}
          style={{
            backgroundColor: "#3f32d2",
            flexDirection: "row",
            borderRadius: 20,
            width: "60%",
            padding: 8,
            justifyContent: "center",
            alignSelf: "center",
            marginTop: "5%",
            alignItems: "center",
          }}
        >
          <Icon name="check" type="entypo" size={20} color="white" />
          <Text style={{ color: "white", marginLeft: "5%", fontSize: 20 }}>
            {this.props.translateText("setting.accept")}
          </Text>
        </TouchableOpacity>
      </Overlay>
    );
  }

  async setPrivate() {
    let resp = await updateInfo(
      this.props.user.authKey,
      "private",
      !this.state.private
    );
    if (resp) {
      this.setState({ private: !this.state.private });
    }
  }

  showCardAccount() {
    return (
      <View style={{ width: "100%", marginTop: "5%" }}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginBottom: "3%",
          }}
        >
          <Icon name="user" type="entypo" size={30} color="#6a5df5" />
          <Text
            style={{
              color: "#6a5df5",
              fontSize: 25,
              fontWeight: "bold",
              marginLeft: "2%",
            }}
          >
            {this.props.translateText("setting.account")}
          </Text>
        </View>
        <View
          style={{
            backgroundColor: "white",
            borderLeftWidth: 7,
            borderLeftColor: "blue",
            borderRadius: 20,
          }}
        >
          <TouchableOpacity
            onPress={() => {
              this.setState({ showPersonal: !this.state.showPersonal });
            }}
            style={{ paddingBottom: "2%" }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                marginHorizontal: "5%",
              }}
            >
              <Text style={{ fontWeight: "bold" }}>
                {this.props.translateText("setting.personal_information")}
              </Text>
              {this.showArrow("showPersonal")}
            </View>
          </TouchableOpacity>
          {this.showPersonalInformation()}

          <TouchableOpacity
            onPress={() => {
              this.setState({ showCountry: !this.state.showCountry });
            }}
            style={{ paddingBottom: "2%" }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                marginHorizontal: "5%",
              }}
            >
              <Text style={{ fontWeight: "bold" }}>
                {this.props.translateText("setting.country_and_timezone")}
              </Text>
              {this.showArrow("showCountry")}
            </View>
          </TouchableOpacity>
          {this.showCountry()}

          <View
            style={{
              justifyContent: "space-between",
              flexDirection: "row",
              paddingBottom: "5%",
              marginRight: "5%",
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginHorizontal: "5%",
              }}
            >
              <Text style={{ fontWeight: "bold" }}>
                {this.props.translateText("setting.language")}
              </Text>
              <TouchableOpacity
                onPress={() => this.setState({ langVisible: true })}
              >
                <Text
                  style={{
                    backgroundColor: "blue",
                    color: "white",
                    borderRadius: 10,
                    padding: 2,
                    marginLeft: "5%",
                  }}
                >
                  {this.handleLanguage()}
                </Text>
              </TouchableOpacity>
            </View>
            {/* <Icon name='pencil' type='evilicon' size={30} color='blue'  onPress={()=>{console.log('dada')}} /> */}
          </View>
          <TouchableOpacity
            style={{ marginLeft: "5%", paddingBottom: "5%" }}
            onPress={() => {
              this.props.navigation.navigate("SettingsDeleteAccount");
            }}
          >
            <Text style={{ color: "#f07c4a" }}>
              {this.props.translateText("setting.delete_account")}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
  handleLinkToPrivacy() {
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
  handleLinkToAbout() {
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

  showCardPrivacy() {
    return (
      <View style={{ width: "100%", marginTop: "5%" }}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginBottom: "3%",
          }}
        >
          <Icon
            name="security"
            type="material-community"
            size={30}
            color="#6a5df5"
          />
          <Text
            style={{
              color: "#6a5df5",
              fontSize: 25,
              fontWeight: "bold",
              marginLeft: "2%",
            }}
          >
            {this.props.translateText("setting.privacy_security")}
          </Text>
        </View>
        <View
          style={{
            backgroundColor: "white",
            borderLeftWidth: 7,
            borderLeftColor: "blue",
            borderRadius: 20,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              marginHorizontal: "5%",
              paddingBottom: "5%",
              alignItems: "center",
              paddingTop: "2%",
            }}
          >
            <Text style={{ fontWeight: "bold" }}>
              {this.props.translateText("setting.private_account")}
            </Text>
            <Switch
              trackColor={{ false: "gray", true: "blue" }}
              onValueChange={() => {
                this.setPrivate();
              }}
              value={this.state.private}
            />
          </View>

          <TouchableOpacity
            onPress={() => {
              this.props.navigation.navigate("SettingsUpdatePassword");
            }}
            style={{
              paddingBottom: "2%",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              marginLeft: "5%",
            }}
          >
            <Text style={{ fontWeight: "bold" }}>
              {this.props.translateText("setting.change_password")}
            </Text>
          </TouchableOpacity>

          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              marginHorizontal: "5%",
              alignItems: "center",
              paddingTop: "2%",
            }}
          >
            <Text style={{ fontWeight: "bold" }}>
              {this.props.translateText("setting.auto_sign_in")}
            </Text>
            {this.state.keepSignedIn === null ? null : (
              <Switch
                trackColor={{ false: "gray", true: "blue" }}
                onValueChange={() => {
                  this.getLocalInfo();
                }}
                value={this.state.keepSignedIn}
              />
            )}
          </View>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              marginHorizontal: "5%",
              paddingBottom: "5%",
              alignItems: "center",
              paddingTop: "2%",
            }}
          >
            <Text style={{ fontWeight: "bold" }}>
              {this.props.translateText("setting.notification")}
            </Text>
            {this.state.notificationEnabled === null ? null : (
              <Switch
                trackColor={{ false: "gray", true: "blue" }}
                onValueChange={() => {
                  this.notificationToggle();
                }}
                value={this.state.notificationEnabled}
              />
            )}
          </View>
          <TouchableOpacity
            style={{ marginLeft: "5%", paddingBottom: "5%" }}
            onPress={() => {
              this.handleLinkToPrivacy();
            }}
          >
            <Text style={{ fontWeight: "bold" }}>
              {this.props.translateText("setting.privacy_security_help")}
            </Text>
          </TouchableOpacity>
          {/* <TouchableOpacity style={{marginLeft:'5%',paddingBottom:'5%'}} onPress={()=>{this.handleLinkToAbout()}}>
                      <Text style={{fontWeight:'bold'}}>About Us</Text>
                  </TouchableOpacity> */}
          <TouchableOpacity
            style={{ marginLeft: "5%", paddingBottom: "5%" }}
            onPress={() => {
              this.props.navigation.navigate("ContactUs");
            }}
          >
            <Text style={{ fontWeight: "bold" }}>
              {this.props.translateText("setting.contact_support")}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  showCardPreferences() {
    return (
      <View style={{ width: "100%", marginTop: "5%" }}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginBottom: "3%",
          }}
        >
          <Icon name="cog" type="font-awesome" size={30} color="#6a5df5" />
          <Text
            style={{
              color: "#6a5df5",
              fontSize: 25,
              fontWeight: "bold",
              marginLeft: "2%",
            }}
          >
            {this.props.translateText("setting.preferences")}
          </Text>
        </View>
        <View
          style={{
            backgroundColor: "white",
            borderLeftWidth: 7,
            borderLeftColor: "blue",
            borderRadius: 20,
          }}
        >
          {/* <View style={{flexDirection:'row',alignItems:'center',justifyContent:'space-between',marginHorizontal:'5%',paddingBottom:'5%',alignItems:'center',paddingTop:'2%'}}>
                          <Text style={{fontWeight:'bold'}}>Dark Mode</Text>
                          <Switch
                            trackColor={{ false: "gray", true: "blue" }}
                            onValueChange={()=>{this.setState({privateOn:!this.state.privateOn})}}
                            value={this.state.privateOn}
                            />
                      </View> */}
          {/* <View style={{flexDirection:'row',alignItems:'center',justifyContent:'space-between',marginHorizontal:'5%',paddingBottom:'5%',alignItems:'center',paddingTop:'2%'}}>
                          <Text style={{fontWeight:'bold'}}>Notifications</Text>
                          <Switch
                            trackColor={{ false: "gray", true: "blue" }}
                            onValueChange={()=>{this.setState({privateOn:!this.state.privateOn})}}
                            value={this.state.privateOn}
                            />
                      </View> */}

          <TouchableOpacity
            onPress={() => {
              this.props.navigation.navigate("SettingsMirrorReflection");
            }}
            style={{
              paddingVertical: "5%",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              marginLeft: "5%",
            }}
          >
            <Text style={{ fontWeight: "bold" }}>
              {this.props.translateText(
                "setting.change_default_mirror_reflection"
              )}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
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
  renderCountryPicker() {
    if (this.state.countryPickerVisible) {
      return (
        <CountryPicker
          onSelect={(val) => {
            this.onSelectCountry(val);
          }}
          visible={this.state.countryPickerVisible}
          onClose={() => {
            this.setState({ countryPickerVisible: false });
          }}
          containerButtonStyle={{ width: "0%" }}
          withAlphaFilter={true}
          withFilter={true}
        />
      );
    } else {
      return null;
    }
  }
  async handleLogout() {
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

  onShare = async () => {
    try {
      const result = await Share.share({
        message:
          Platform.OS === "ios"
            ? "https://apps.apple.com/us/app/transfigure/id1561333788"
            : "https://play.google.com/store/apps/details?id=com.thetransfigure&ref=producthunt",
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      alert(error.message);
    }
  };

  languageOverlay() {
    return (
      <Overlay
        isVisible={this.state.langVisible}
        onBackdropPress={() => {
          this.setState({ langVisible: !this.state.langVisible });
        }}
        overlayStyle={{
          width: "80%",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text style={{ marginBottom: 10 }}>Select a language</Text>
        <TouchableOpacity
          style={{ height: 30, justifyContent: "center" }}
          onPress={async () => {
            this.props.setLanguage("en");
            this.setState({ langVisible: false });
            await AsyncStorage.setItem(
              "UserLanguage",
              JSON.stringify({ lang: "en" })
            );
          }}
        >
          <Text>English</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{ height: 30, justifyContent: "center" }}
          onPress={async () => {
            this.props.setLanguage("fr");
            this.setState({ langVisible: false });
            await AsyncStorage.setItem(
              "UserLanguage",
              JSON.stringify({ lang: "fr" })
            );
          }}
        >
          <Text>French</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{ height: 30, justifyContent: "center" }}
          onPress={async () => {
            this.props.setLanguage("ge");
            this.setState({ langVisible: false });
            await AsyncStorage.setItem(
              "UserLanguage",
              JSON.stringify({ lang: "ge" })
            );
          }}
        >
          <Text>German</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{ height: 30, justifyContent: "center" }}
          onPress={async () => {
            this.props.setLanguage("sp");
            this.setState({ langVisible: false });
            await AsyncStorage.setItem(
              "UserLanguage",
              JSON.stringify({ lang: "sp" })
            );
          }}
        >
          <Text>Spanish</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{ height: 30, justifyContent: "center" }}
          onPress={async () => {
            this.props.setLanguage("it");
            this.setState({ langVisible: false });
            await AsyncStorage.setItem(
              "UserLanguage",
              JSON.stringify({ lang: "it" })
            );
          }}
        >
          <Text>Italian</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{ height: 30, justifyContent: "center" }}
          onPress={async () => {
            this.props.setLanguage("po");
            this.setState({ langVisible: false });
            await AsyncStorage.setItem(
              "UserLanguage",
              JSON.stringify({ lang: "po" })
            );
          }}
        >
          <Text>Polish</Text>
        </TouchableOpacity>
      </Overlay>
    );
  }

  render() {
    return (
      <SafeAreaView style={styles.container}>
        {this.languageOverlay()}
        {this.renderCountryPicker()}
        <View style={{ flex: 1 }}>
          {this.editOverlay()}
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
                marginTop: "1%",
                color: "#f07c4a",
                fontWeight: "bold",
              }}
            >
              {this.props.translateText("setting.setting_text")}
            </Text>
          </View>
          <ScrollView
            contentContainerStyle={{ width: "90%", marginLeft: "5%" }}
          >
            {this.showCardAccount()}
            {this.showCardPrivacy()}
            {this.showCardPreferences()}
            <View style={{ flexDirection: "row", width: "100%" }}>
              <TouchableOpacity
                onPress={() => this.onShare()}
                style={{
                  backgroundColor: "#ff4714",
                  marginTop: "10%",
                  marginRight: "5%",
                  marginBottom: "10%",
                  flexDirection: "row",
                  borderRadius: 20,
                  alignItems: "center",
                  width: "40%",
                  padding: 8,
                  justifyContent: "center",
                }}
              >
                <Entypo name="share" size={20} color="white" />
                <Text style={{ color: "white", marginLeft: "2%" }}>
                  {this.props.translateText("setting.share")}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  this.handleLogout();
                }}
                style={{
                  backgroundColor: "#ff4714",
                  marginTop: "10%",
                  marginRight: "5%",
                  marginBottom: "10%",
                  flexDirection: "row",
                  borderRadius: 20,
                  alignItems: "center",
                  width: "40%",
                  padding: 8,
                  justifyContent: "center",
                  alignSelf: "flex-end",
                }}
              >
                <Icon
                  name="logout"
                  type="antdesign"
                  size={20}
                  color="white"
                  style={{ transform: [{ rotateY: "180deg" }] }}
                />
                <Text style={{ color: "white", marginLeft: "2%" }}>
                  {this.props.translateText("setting.logout")}
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
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
      updateEmail,
      updatePassword,
      updateUuid,
      translateText,
      setLanguage,
    },
    dispatch
  );
};

const mapStateToProps = (state) => {
  return {
    user: state.user,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(MySettings);

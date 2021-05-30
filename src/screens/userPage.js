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
import {
  loginUser,
  updateEmail,
  updatePassword,
  getNotifications,
  getAllQuotes,
  translateText,
} from "../actions/user";
import {
  Header,
  Icon,
  Overlay,
  Avatar,
  ListItem,
  Input,
} from "react-native-elements";
import { sendCode } from "../func/resetpassword";
import { getOneUser, reportUser } from "../func/findUsers";
import {
  getFriends,
  getNewFriends,
  sendFriendRequest,
  removeFriend,
} from "../func/friends";
import { getUserQuotes } from "../func/quotes";
import Beacon from "react-native-vector-icons/MaterialCommunityIcons";
import MyFooter from "../components/centerComp";
import Spinner from "react-native-loading-spinner-overlay";
import { Thumbnail, Badge } from "native-base";
import moment from "moment";
import { Svg, Polyline, Circle, parse } from "react-native-svg";
import Calendars from "../components/calendars";
import { getAvatar } from "../func/userSettings";

class UserPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: 0,
      username: "",
      isFriend: false,
      sentFriendRequest: false,
      loading: false,
      filteredQuotes: [],
      avatarURI: "",
      buildsLength: 0,
      quotesLength: 0,
    };
  }

  async componentDidMount() {
    console.log("here");
    this.fetchUser();
  }

  capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }
  async fetchUser() {
    //
    this.setState({ loading: true });
    let respuser = await getOneUser(
      this.props.user.authKey,
      this.props.route.params.uuID
    );
    console.log(respuser, "respuser", this.props.route);
    let user = "";
    let ava = "";
    if (respuser) {
      user = respuser.user;
      ava = respuser.avatar;
    }
    let myFriends = await getFriends(this.props.user.authKey);
    let username =
      this.capitalizeFirstLetter(user.firstName) +
      " " +
      this.capitalizeFirstLetter(user.lastName);
    let areWeFriends = false;
    let sentFriendRequest = false;
    for (let i = 0; i < myFriends.length; i++) {
      if (myFriends[i].uuID == user.uuID) {
        if (myFriends[i].accepted == true) {
          areWeFriends = true;
        } else {
          sentFriendRequest = true;
        }
      }
    }
    console.log(this.props.user.authKey, this.props.route.params.uuID, "test");
    let resp = await getUserQuotes(
      this.props.user.authKey,
      this.props.route.params.uuID
    );

    let filteredQuotes = [];
    let quolength = 0;
    let builength = 0;
    if (resp) {
      filteredQuotes = resp.quotes;
      quolength = resp.quotesLength;
      builength = resp.buildsLength;
    }

    this.setState({
      user: user,
      username: username,
      avatarURI: ava,
      isFriend: areWeFriends,
      sentFriendRequest: sentFriendRequest,
      loading: false,
      filteredQuotes: filteredQuotes,
      buildsLength: builength,
      quotesLength: quolength,
    });
  }
  showAvatar(ava) {
    if (ava == "" || ava == false) {
      let img = require("../images/defaultAvatar.jpg");
      return (
        <Thumbnail
          resizeMode="stretch"
          source={img}
          style={{
            marginTop: "-13%",
            width: "30%",
            height: parseInt(Dimensions.get("window").width * 0.3),
            borderRadius: parseInt(Dimensions.get("window").width * 0.15),
            borderWidth: 10,
            borderColor: "white",
            alignSelf: "center",
          }}
        />
      );
    } else {
      let myuri = ava;
      return (
        <Thumbnail
          resizeMode="stretch"
          source={{ uri: myuri }}
          style={{
            width: parseInt(Dimensions.get("window").width * 0.3),
            height: parseInt(Dimensions.get("window").width * 0.3),
            borderRadius: parseInt(Dimensions.get("window").width * 0.15),
            borderWidth: 5,
            borderColor: "white",
            alignSelf: "center",
            elevation: 100,
            marginBottom: "2%",
          }}
        />
      );
    }
  }
  async handleAddFriend() {
    ///we need to change this.We need to check if he is in our friends
    this.setState({ loading: true });
    let resp = await sendFriendRequest(
      this.props.user.authKey,
      this.props.route.params.uuID
    );
    if (resp == true) {
      await this.fetchUser();
    }
    this.setState({ loading: false });
  }
  async handleRemoveFriend() {
    ///we need to change this.We need to check if he is in our friends
    this.setState({ loading: true });
    let resp = await removeFriend(
      this.props.user.authKey,
      this.props.route.params.uuID
    );
    if (resp == true) {
      await this.fetchUser();
    }
    this.setState({ loading: false });
  }

  showInsides(ourProfile) {
    console.log(this.state.user, "ourProfile");
    return (
      <ScrollView
        contentContainerStyle={{ paddingBottom: "5%" }}
        style={{ marginTop: "2%" }}
      >
        <View
          style={{
            alignSelf: "center",
            width: "96%",
            elevation: 20,
            backgroundColor: "white",
            borderRadius: 10,
            paddingBottom: "5%",
          }}
        >
          {this.showAvatar(this.state.avatarURI)}
          <View
            style={{
              marginTop: "5%",
              justifyContent: "flex-start",
              marginHorizontal: "5%",
            }}
          >
            <Text
              style={{ fontSize: 20, fontWeight: "bold", color: "#3f32d2" }}
            >
              {this.props.translateText("userPage.about")}{" "}
              {this.state.username.split(" ")[0].toUpperCase()}
            </Text>
            <Text
              style={{ fontSize: 15 }}
              numberOfLines={4}
              adjustsFontSizeToFit
            >
              {this.state.user.about}
            </Text>
            {ourProfile === false ? this.showInsideFriendButton() : null}
          </View>
        </View>
        <View
          style={{
            alignSelf: "center",
            width: "96%",
            elevation: 20,
            backgroundColor: "white",
            marginTop: "5%",
            borderRadius: 10,
            justifyContent: "center",
          }}
        >
          <View
            style={{
              marginHorizontal: "10%",
              flexDirection: "row",
              justifyContent: "space-between",
              paddingVertical: "5%",
            }}
          >
            <View>
              <Text
                style={{
                  fontSize: 20,
                  fontWeight: "bold",
                  color: "green",
                  textAlign: "center",
                }}
              >
                {this.state.user.friends.length}
              </Text>
              <Text style={{ textAlign: "center", fontSize: 17 }}>
                {this.props.translateText("userPage.friends")}
              </Text>
            </View>
            <View>
              <Text
                style={{
                  fontSize: 20,
                  fontWeight: "bold",
                  color: "green",
                  textAlign: "center",
                }}
              >
                {this.state.buildsLength}
              </Text>
              <Text style={{ textAlign: "center", fontSize: 17 }}>
                {this.props.translateText("userPage.builds")}
              </Text>
            </View>
            <View>
              <Text
                style={{
                  fontSize: 20,
                  fontWeight: "bold",
                  color: "green",
                  textAlign: "center",
                }}
              >
                {this.state.quotesLength}
              </Text>
              <Text style={{ textAlign: "center", fontSize: 17 }}>
                {this.props.translateText("userPage.quotes")}
              </Text>
            </View>
          </View>
        </View>
        <View
          style={{
            alignSelf: "center",
            width: "96%",
            elevation: 20,
            backgroundColor: "white",
            marginTop: "5%",
            borderRadius: 10,
          }}
        >
          <View
            style={{ alignSelf: "center", width: "90%", marginVertical: "5%" }}
          >
            <Text
              style={{ fontSize: 20, fontWeight: "bold", color: "#3f32d2" }}
            >
              {this.props.translateText("userPage.recent_builds")}
            </Text>
            <Calendars
              uuID={this.state.user.uuID}
              height={0.2}
              width={0.96 * 0.9}
              quotes={this.state.filteredQuotes}
              parentProps={this.props}
              small={false}
              withMonth={false}
            />
          </View>
        </View>
      </ScrollView>
    );
  }
  showInsideFriendButton() {
    if (this.state.isFriend) {
      return (
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            marginTop: "5%",
          }}
        >
          <TouchableOpacity
            style={{
              backgroundColor: "#ff4714",
              padding: 10,
              borderRadius: 20,
              flexDirection: "row",
              alignSelf: "center",
            }}
            onPress={() => {
              this.handleRemoveFriend();
            }}
          >
            <Icon name="add-user" type="entypo" size={20} color="white" />
            <Text
              style={{
                fontSize: 20,
                fontWeight: "bold",
                color: "white",
                marginLeft: "5%",
              }}
            >
              {this.props.translateText("userPage.unfriend")}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              flexDirection: "row",
              alignSelf: "center",
              marginLeft: "10%",
              alignItems: "center",
            }}
            onPress={() => {
              this.props.navigation.navigate("ReportUser", {
                userID: this.props.route.params.uuID,
              });
            }}
          >
            <Icon name="flag" type="font-awesome" size={20} color="#ff4714" />
            <Text
              style={{
                fontSize: 20,
                fontWeight: "bold",
                color: "#ff4714",
                marginLeft: "5%",
              }}
            >
              {this.props.translateText("userPage.report")}
            </Text>
          </TouchableOpacity>
        </View>
      );
    } else {
      return this.showAddFriendButton();
    }
  }

  showAddFriendButton() {
    if (this.state.sentFriendRequest) {
      return (
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            marginTop: "5%",
          }}
        >
          <View
            style={{
              backgroundColor: "gray",
              padding: 10,
              borderRadius: 20,
              flexDirection: "row",
              alignSelf: "center",
            }}
          >
            <Icon name="add-user" type="entypo" size={20} color="white" />
            <Text
              style={{
                fontSize: 20,
                fontWeight: "bold",
                color: "white",
                marginLeft: "5%",
              }}
            >
              {this.props.translateText("userPage.request_sent")}
            </Text>
          </View>
          <TouchableOpacity
            style={{
              flexDirection: "row",
              alignSelf: "center",
              marginLeft: "10%",
              alignItems: "center",
            }}
            onPress={() => {
              this.props.navigation.navigate("ReportUser", {
                userID: this.props.route.params.uuID,
              });
            }}
          >
            <Icon name="flag" type="font-awesome" size={20} color="#ff4714" />
            <Text
              style={{
                fontSize: 20,
                fontWeight: "bold",
                color: "#ff4714",
                marginLeft: "5%",
              }}
            >
              {this.props.translateText("userPage.report")}
            </Text>
          </TouchableOpacity>
        </View>
      );
    } else {
      return (
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            marginTop: "5%",
          }}
        >
          <TouchableOpacity
            style={{
              backgroundColor: "#3f32d2",
              padding: 10,
              borderRadius: 20,
              flexDirection: "row",
              alignSelf: "center",
            }}
            onPress={() => {
              this.handleAddFriend();
            }}
          >
            <Icon name="add-user" type="entypo" size={20} color="white" />
            <Text
              style={{
                fontSize: 20,
                fontWeight: "bold",
                color: "white",
                marginLeft: "5%",
              }}
            >
              {this.props.translateText("userPage.add_friend")}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              flexDirection: "row",
              alignSelf: "center",
              marginLeft: "10%",
              alignItems: "center",
            }}
            onPress={() => {
              this.props.navigation.navigate("ReportUser", {
                userID: this.props.route.params.uuID,
              });
            }}
          >
            <Icon name="flag" type="font-awesome" size={20} color="#ff4714" />
            <Text
              style={{
                fontSize: 20,
                fontWeight: "bold",
                color: "#ff4714",
                marginLeft: "5%",
              }}
            >
              {this.props.translateText("userPage.report")}
            </Text>
          </TouchableOpacity>
        </View>
      );
    }
  }

  showContent() {
    //check if user is our friend
    console.log(this.state.user);
    if (this.state.user != 0) {
      if (this.state.user.uuID != this.props.user.uuID) {
        if (!this.state.user.private) {
          return this.showInsides(false);
        } else {
          if (this.state.isFriend) {
            return this.showInsides(false);
          } else {
            return (
              <View
                style={{
                  alignSelf: "center",
                  width: "96%",
                  height: "65%",
                  alignItems: "center",
                  justifyContent: "center",
                  elevation: 20,
                  backgroundColor: "white",
                  marginTop: "2%",
                  borderRadius: 10,
                }}
              >
                {this.showAvatar(this.state.avatarURI)}
                <View
                  style={{
                    alignSelf: "center",
                    borderWidth: 2,
                    borderRadius: 27.5,
                  }}
                >
                  <Icon
                    name="lock"
                    type="entypo"
                    size={50}
                    color="black"
                    style={{
                      borderWidth: 5,
                      borderColor: "white",
                      borderRadius: 25,
                    }}
                  />
                </View>
                <Text style={{ fontSize: 20, fontWeight: "bold" }}>
                  {this.props.translateText("userPage.private_account_text")}
                </Text>
                <Text style={{ fontSize: 15, textAlign: "center" }}>
                  {this.props.translateText("userPage.become_friend_with")}{" "}
                  {this.state.username.split(" ")[0]}{" "}
                  {this.props.translateText("userPage.to_see_their_post")}
                </Text>
                {this.showAddFriendButton()}
              </View>
            );
          }
        }
      } else {
        return this.showInsides(true);
      }
    } else {
      return null;
    }
  }
  render() {
    return (
      <SafeAreaView style={styles.container}>
        <Spinner
          visible={this.state.loading}
          textContent={"Loading..."}
          textStyle={{ color: "white" }}
        />
        <View style={{ flex: 1 }}>
          <View style={styles.upperPart}>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                paddingHorizontal: "5%",
              }}
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
                  marginTop: "-4%",
                  backgroundColor: "transparent",
                }}
                resizeMode="cover"
              />

              <Icon
                name="cog"
                type="font-awesome"
                size={30}
                color="white"
                onPress={() => {
                  this.props.navigation.navigate("Settings");
                }}
              />
            </View>
            <View
              style={{
                alignSelf: "center",
                marginVertical: "2%",
                alignItems: "center",
              }}
            >
              <Text
                style={{ fontSize: 20, fontWeight: "bold", color: "white" }}
              >
                {this.state.username}
              </Text>
              <Text style={{ fontSize: 17, color: "white" }}>
                {this.state.user.displayTitle}
              </Text>
            </View>
          </View>

          {this.showContent()}
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
    width: "110%",
    height: "70%",
    top: "0%",
    borderBottomRightRadius: 150,
    borderBottomLeftRadius: 150,
    backgroundColor: "#3f32d2",
  },
  upperPart: {
    backgroundColor: "#3f32d2",
    paddingTop: "5%",
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
  buttonLogin: {
    width: "50%",
    bottom: "4%",
    borderRadius: 25,
    backgroundColor: "#3f32d2",
    padding: 10,
    alignItems: "center",
    elevation: 25,
  },
  buttonSignup: {
    width: "100%",
    marginTop: "2%",
    bottom: "4%",
    borderRadius: 25,
    backgroundColor: "#3f32d2",
    padding: 5,
    alignItems: "center",
    elevation: 25,
  },
  iconStyle: {
    alignItems: "center",
    position: "absolute",
    top: "2%",
    elevation: 20,
  },
  signup: {
    position: "absolute",
    top: "88%",
    alignItems: "center",
  },
  inputBox: {
    marginTop: "40%",
    borderRadius: 10,
    justifyContent: "center",
    backgroundColor: "white",
    width: "80%",
    height: "30%",
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
    {
      loginUser,
      updateEmail,
      updatePassword,
      getNotifications,
      getAllQuotes,
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

export default connect(mapStateToProps, mapDispatchToProps)(UserPage);

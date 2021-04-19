import React from "react";
import {
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
  SafeAreaView,
  Dimensions,
  ScrollView,
  Text,
  Platform
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
import { Header, Icon, Overlay, Avatar, Input } from "react-native-elements";
import { sendCode } from "../func/resetpassword";
import { getOneUser } from "../func/findUsers";
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
import { Thumbnail, Badge, Container, Content } from "native-base";
import moment from "moment";
import { Svg, Polyline, Circle, parse } from "react-native-svg";
import Calendars from "../components/calendars";
import MonthSelectorCalendar from "react-native-month-selector";

class BuildPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      pickFriendVis: false,
      quotes: null,
      myFriends: [],
      myFriendsCopy: [],
      searchFriendMyFriends: "",
      chooseMonthOverlayVis: false,
      chosenMonth: "",
    };
  }

  async componentDidMount() {
    console.disableYellowBox = true;

    this.setState({ loading: true });
    await this.fetchUser();
    await this.fetchMyFriends();

    this.setState({ loading: false, chosenMonth: moment() });
  }

  capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }
  async getFullQuotes(uuID) {
    let quotes = null;
    let resp = await getUserQuotes(this.props.user.authKey, uuID);
    console.log(resp, 'test')
    if (resp) {
      quotes = resp.quotes;
    }

    this.setState({ quotes: quotes });
  }
  async fetchUser() {
    let username = "";
    console.log('here here', this.props.user)
    if (this.props.route.params != undefined) {
      let resp = await getOneUser(
        this.props.user.authKey,
        this.props.route.params.uuID
      );
      let user = "";
      if (resp) {
        user = resp.user;
        await this.getFullQuotes(this.props.route.params.uuID);
        username =
          this.capitalizeFirstLetter(user.firstName) +
          " " +
          this.capitalizeFirstLetter(user.lastName);
      }
    } else {
      let repo = await getOneUser(
        this.props.user.authKey,
        this.props.user.uuID
      );
      let me = "";
      if (repo) {
        me = repo.user;
        await this.getFullQuotes(this.props.user.uuID);
        username =
          this.capitalizeFirstLetter(me.firstName) +
          " " +
          this.capitalizeFirstLetter(me.lastName);
      }
    }
    this.setState({ username: username });
  }
  async fetchMyFriends() {
    let friends = await getFriends(this.props.user.authKey);
    let filteredFriends = [];
    for (let i = 0; i < friends.length; i++) {
      if (friends[i].accepted == true) {
        let ourFriend = "";
        let ava64 = "";
        let respfriend = await getOneUser(
          this.props.user.authKey,
          friends[i].uuID
        );
        if (respfriend) {
          ourFriend = respfriend.user;
          ava64 = respfriend.avatar;
          let name =
            this.capitalizeFirstLetter(ourFriend.firstName) +
            " " +
            this.capitalizeFirstLetter(ourFriend.lastName);
          let newObj = {
            name: name,
            uuID: friends[i].uuID,
            title: ourFriend.displayTitle,
            avatarURI: ava64,
          };
          filteredFriends.push(newObj);
        }
      }
    }

    this.setState({
      myFriends: filteredFriends,
      myFriendsCopy: filteredFriends,
    });
  }
  filterFriends(searchWord) {
    let filteredFriends = [];
    let chosenFriend;
    if (searchWord != "") {
      searchWord = searchWord.toLowerCase();
      for (let i = 0; i < this.state.myFriendsCopy.length; i++) {
        chosenFriend = this.state.myFriendsCopy[i].name.toLowerCase();
        if (chosenFriend.includes(searchWord)) {
          filteredFriends.push(this.state.myFriendsCopy[i]);
        }
      }
      this.setState({ myFriends: filteredFriends });
    } else {
      this.setState({ myFriends: this.state.myFriendsCopy });
    }
  }
  showAvatar(ava) {
    if (ava == "" || ava == false) {
      let img = require("../images/defaultAvatar.jpg");
      return (
        <Thumbnail
          square
          source={img}
          style={{ borderRadius: 10, borderWidth: 3, borderColor: "black" }}
        />
      );
    } else {
      let myuri = ava;
      return (
        <Thumbnail
          square
          source={{ uri: myuri }}
          style={{ borderRadius: 10, borderWidth: 3, borderColor: "black" }}
        />
      );
    }
  }
  showUpperBar() {
    return (
      <TouchableOpacity
        style={{
          width: "96%",
          alignSelf: "center",
          flexDirection: "row",
          justifyContent: "space-between",
          paddingHorizontal: "5%",
          backgroundColor: "#000945",
          borderRadius: 10,
          marginTop: "2%",
          padding: "2%",
        }}
        onPress={() => {
          this.setState({ pickFriendVis: !this.state.pickFriendVis });
        }}
      >
        <Text style={{ fontSize: 20, fontWeight: "bold", color: "white" }}>
          {this.state.username}
        </Text>
        <Icon
          name="user-friends"
          type="font-awesome-5"
          size={30}
          color="white"
          backgroundColor="#6a5df5"
          style={{ borderRadius: 50 }}
        />
      </TouchableOpacity>
    );
  }
  renderOneFriend(item, index) {
    return (
      <TouchableOpacity
        style={{ margin: "2.5%", flexDirection: "row", alignItems: "center" }}
        key={index}
        onPress={() => {
          this.setState(
            { pickFriendVis: !this.state.pickFriendVis, username: item.name },
            async () => {
              await this.getFullQuotes(item.uuID);
            }
          );
        }}
      >
        {this.showAvatar(item.avatarURI)}
        <View style={{ marginLeft: "5%" }}>
          <Text
            style={{ fontSize: 20, fontWeight: "bold" }}
            numberOfLines={1}
            adjustsFontSizeToFit
          >
            {item.name}
          </Text>
          <Text style={{ fontStyle: "italic", fontSize: 15, color: "gray" }}>
            {item.title}
          </Text>
        </View>
      </TouchableOpacity>
    );
  }

  pickFriendOverlay() {
    return (
      <Overlay
        isVisible={this.state.pickFriendVis}
        onBackdropPress={() => {
          this.setState({ pickFriendVis: !this.state.pickFriendVis });
        }}
        overlayStyle={{ width: "90%", height: "80%" }}
      >
        <View
          style={{
            alignSelf: "center",
            borderBottomWidth: 1,
            width: "100%",
            alignItems: "center",
            flexDirection: "row",
            justifyContent: "center",
            backgroundColor: "#000945",
          }}
        >
          <View
            style={{
              flexDirection: "row",
              borderWidth: 1,
              borderColor: "#000945",
              borderRadius: 20,
              marginVertical: "2%",
              alignItems: "center",
              backgroundColor: "#f2f8ff",
            }}
          >
            <Icon
              name="magnifying-glass"
              type="foundation"
              size={30}
              color="#000945"
              style={{ marginLeft: "3%" }}
            />
            <TextInput
              placeholder={this.props.translateText("beacon.find_friend")}
              value={this.state.searchFriendMyFriends}
              onChangeText={(value) =>
                this.setState({ searchFriendMyFriends: value }, () => {
                  this.filterFriends(value);
                })
              }
              style={{ fontSize: 20, width: "60%", alignSelf: "center" }}
            />
          </View>
          <Icon
            name="cancel"
            type="material"
            size={50}
            color="#f2f8ff"
            style={{ marginLeft: "2%", elevation: 20 }}
            onPress={() => {
              this.setState(
                {
                  searchPressedFindFriends: !this.state
                    .searchPressedFindFriends,
                  searchFriendMyFriends: "",
                  pickFriendVis: !this.state.pickFriendVis,
                },
                () => {
                  this.filterFriends("");
                }
              );
            }}
          />
        </View>
        <ScrollView>
          {this.state.myFriends.map((item, i) => this.renderOneFriend(item, i))}
        </ScrollView>
      </Overlay>
    );
  }
  showCallendar() {
    if (this.state.quotes != null) {
      return (
        <Calendars
          width={0.96 * 0.9}
          quotes={this.state.quotes}
          parentProps={this.props}
          small={false}
          withMonth={true}
          chosenMonth={this.state.chosenMonth}
          uuID={this.props.user.uuID}
        />
      );
    } else {
      return null;
    }
  }
  showChooseMonthOverlay() {
    if (this.state.chosenMonth != "") {
      return (
        <Overlay
          isVisible={this.state.chooseMonthOverlayVis}
          onBackdropPress={() => {
            this.setState({
              chooseMonthOverlayVis: !this.state.chooseMonthOverlayVis,
            });
          }}
          overlayStyle={{ width: "90%", height: "50%" }}
        >
          <MonthSelectorCalendar
            selectedDate={this.state.chosenMonth}
            onMonthTapped={(date) =>
              this.setState({
                chosenMonth: date,
                chooseMonthOverlayVis: !this.state.chooseMonthOverlayVis,
              })
            }
          />
        </Overlay>
      );
    } else {
      return null;
    }
  }
  showInsideButton() {
    if (this.state.chosenMonth) {
      let Rcircle = parseInt(
        Dimensions.get("window").width * 0.96 * 0.9 * (1 / 2)
      );
      let month = this.state.chosenMonth.format("MMMM");
      let year = this.state.chosenMonth.year();
      return (
        <TouchableOpacity
          style={{ top: -Rcircle, marginTop: "-5%", flexDirection: "row" }}
          onPress={() => {
            this.setState({
              chooseMonthOverlayVis: !this.state.chooseMonthOverlayVis,
            });
          }}
        >
          <Text
            style={{
              fontSize: 16,
              borderWidth: 1,
              borderRightWidth: 0,
              borderTopLeftRadius: 5,
              borderBottomLeftRadius: 5,
              padding: 4,
            }}
          >
            {month.toUpperCase()}
          </Text>
          <Text
            style={{
              fontSize: 16,
              borderWidth: 1,
              borderTopRightRadius: 5,
              borderBottomRightRadius: 5,
              padding: 4,
            }}
          >
            {year}
          </Text>
        </TouchableOpacity>
      );
    } else {
      return null;
    }
  }
  showSmallerCallendars() {
    if (this.state.quotes != null) {
      return (
        <View
          style={{
            borderTopWidth: 1,
            borderColor: "gray",
            alignItems: "center",
          }}
        >
          <View
            style={{ flexDirection: "row", justifyContent: "space-evenly" }}
          >
            <Svg>
              <Calendars
                width={0.96 * 0.25}
                quotes={this.state.quotes}
                parentProps={this.props}
                small={true}
                uuID={this.props.user.uuID}
              />
              <Calendars
                width={0.96 * 0.25}
                quotes={this.state.quotes}
                parentProps={this.props}
                small={true}
                uuID={this.props.user.uuID}
              />
              <Calendars
                width={0.96 * 0.25}
                quotes={this.state.quotes}
                parentProps={this.props}
                small={true}
                uuID={this.props.user.uuID}
              />
            </Svg>
          </View>
        </View>
      );
    } else {
      return null;
    }
  }
  render() {
    console.log(this.props, 'user props')
    return (
      <SafeAreaView style={styles.container}>
        {this.pickFriendOverlay()}
        {this.showChooseMonthOverlay()}
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
                onPress={() => {
                  this.props.navigation.navigate("Settings");
                }}
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
              BUILDS
            </Text>
          </View>
          <View
            style={{
              alignSelf: "center",
              marginTop: "-5%",
              width: "96%",
              borderRadius: 10,
              backgroundColor: "#e0ecff",
              height: "75%",
              elevation: 20,
              alignItems: "center",
            }}
          >
            {this.showUpperBar()}

            {this.showCallendar()}

            {this.showInsideButton()}

            {/* <Text style={{fontSize:17,fontWeight:'bold',marginLeft:'10%',alignSelf:'flex-start',color:'gray'}}>Past Builds</Text> */}
            {/* {this.showSmallerCallendars()} */}
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
    width: "110%",
    height: "70%",
    top: "0%",
    borderBottomRightRadius: 150,
    borderBottomLeftRadius: 150,
    backgroundColor: "#3f32d2",
  },
  upperPart: {
    height: "25%",
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
    marginTop: Platform.OS !== 'ios' ? 30 : 0
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

export default connect(mapStateToProps, mapDispatchToProps)(BuildPage);

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
import { getOneUser } from "../func/findUsers";
import { getFriends, getNewFriends, sendFriendRequest } from "../func/friends";
import {
  likeQuote,
  dislikeQuote,
  likeComment,
  dislikeComment,
  replyToComment,
  replyToQuote,
} from "../func/quotes";
import Beacon from "react-native-vector-icons/MaterialCommunityIcons";
import MyFooter from "../components/centerComp";
import Spinner from "react-native-loading-spinner-overlay";
import { Thumbnail, Badge } from "native-base";
import moment from "moment";

class FindFriends extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      findFriends: 0,
      friendList: [],
      searchFriend: "",
      searchPressed: false,
      friendListCopy: [],
      loading: false,
      searchPressedFindFriends: false,
      searchFriendMyFriends: "",
      newFriendsList: [],
      skip: 0,
    };
  }

  async componentDidMount() {
    this.setState({ loading: true });
    let resp = await getFriends(this.props.user.authKey);
    await this.fetchNewFriends();
    this.setState({ friendList: resp, friendListCopy: resp, loading: false });
  }
  async fetchNewFriends() {
    let respNew = await getNewFriends(
      this.props.user.authKey,
      this.state.skip,
      this.state.searchFriendMyFriends.toLowerCase()
    );
    let transformedArray = [];
    let iterator = 0;
    for (let i = 0; i < Math.ceil(respNew.length / 2); i++) {
      if (iterator + 1 < respNew.length) {
        transformedArray.push([respNew[iterator], respNew[iterator + 1]]);
      } else {
        transformedArray.push([respNew[iterator], 0]);
      }
      iterator += 2;
    }

    if (transformedArray.length == 0 && this.state.skip > 0) {
      this.setState({
        newFriendsList: this.state.newFriendsList,
        skip: this.state.skip - 4,
      });
    } else {
      this.setState({ newFriendsList: transformedArray });
    }
  }
  capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }
  renderFindFriends() {
    return (
      <View>
        <View
          style={{
            width: "96%",
            backgroundColor: "white",
            elevation: 20,
            alignSelf: "center",
            marginTop: "2%",
            borderRadius: 10,
            marginBottom: "2%",
            paddingBottom: "2%",
            height: "82%",
          }}
        >
          {this.renderSearchBarFindFriends()}
          {this.renderScrollViewFindFriends()}
        </View>
      </View>
    );
  }
  showAvatar(ava) {
    console.log(ava);
    if (ava == "" || ava == false) {
      let img = require("../images/defaultAvatar.jpg");
      return <Thumbnail source={img} />;
    } else {
      let myuri = ava;
      return <Thumbnail source={{ uri: myuri }} />;
    }
  }
  showRow(item, key) {
    if (this.state.friendList.length > 0 && item.accepted == true) {
      let fullname = item.name.split(" ");
      let name =
        this.capitalizeFirstLetter(fullname[0]) +
        " " +
        this.capitalizeFirstLetter(fullname[1]);
      let spacer = 1;
      this.state.friendList.length - 1 === key ? (spacer = 0) : (spacer = 1);
      return (
        <View style={{ borderBottomWidth: spacer }} key={key}>
          <TouchableOpacity
            style={{
              borderColor: "gray",
              flexDirection: "row",
              alignSelf: "center",
              alignItems: "center",
              marginHorizontal: "2%",
              width: "90%",
              paddingVertical: "1%",
            }}
            onPress={() => {
              this.props.navigation.navigate("UserPage", { uuID: item.uuID });
            }}
          >
            {this.showAvatar(item.avatarURI)}
            <Text style={{ fontSize: 20, marginLeft: "5%" }}>{name}</Text>
          </TouchableOpacity>
        </View>
      );
    } else {
      return null;
    }
  }
  async handlesendFriendRequest(uuID) {
    this.setState({ loading: true });

    let resp = await sendFriendRequest(this.props.user.authKey, uuID);
    if (resp) {
      await this.fetchNewFriends();
      let respnew = await getFriends(this.props.user.authKey);
      this.setState({ friendList: respnew, friendListCopy: respnew });
    }
    this.setState({ loading: false });
  }
  showBottomAvatarButton(uuID) {
    let bottomText = this.props.translateText("friend.add_friend");
    let buttonColor = "#3f32d2";
    let action = 0;
    for (let i = 0; i < this.state.friendListCopy.length; i++) {
      if (
        uuID == this.state.friendListCopy[i].uuID &&
        this.state.friendListCopy[i].accepted == false
      ) {
        bottomText = this.props.translateText("friend.req_sent");
        buttonColor = "gray";
        action = 1;
      }
    }

    if (action == 0) {
      return (
        <TouchableOpacity
          style={{
            backgroundColor: buttonColor,
            width: "100%",
            alignItems: "center",
            flexDirection: "row",
            justifyContent: "center",
            borderBottomLeftRadius: 10,
            borderBottomRightRadius: 10,
          }}
          onPress={() => {
            this.handlesendFriendRequest(uuID);
          }}
        >
          <Icon name="add-user" type="entypo" size={20} color="white" />
          <Text
            style={{
              fontSize: 18,
              color: "white",
              textAlign: "center",
              marginLeft: "2%",
            }}
          >
            {bottomText}
          </Text>
        </TouchableOpacity>
      );
    } else {
      return (
        <View
          style={{
            backgroundColor: buttonColor,
            width: "100%",
            alignItems: "center",
            flexDirection: "row",
            justifyContent: "center",
            borderBottomLeftRadius: 10,
            borderBottomRightRadius: 10,
          }}
        >
          <Icon name="add-user" type="entypo" size={20} color="white" />
          <Text
            style={{
              fontSize: 18,
              color: "white",
              textAlign: "center",
              marginLeft: "2%",
            }}
          >
            {bottomText}
          </Text>
        </View>
      );
    }
  }
  showFriendIcon(item) {
    let name =
      this.capitalizeFirstLetter(item.firstName) +
      " " +
      this.capitalizeFirstLetter(item.lastName);

    return (
      <View
        style={{
          width: "40%",
          alignItems: "center",
          marginHorizontal: "2.5%",
          borderWidth: 1,
          marginTop: "5%",
          borderRadius: 10,
        }}
      >
        <TouchableOpacity
          style={{ alignItems: "center", paddingVertical: "2%" }}
          onPress={() => {
            this.props.navigation.navigate("UserPage", { uuID: item.uuID });
          }}
        >
          {this.showAvatar(item.avatarURI)}
          <Text
            numberOfLines={1}
            adjustsFontSizeToFit
            style={{ textAlign: "center", fontWeight: "bold", fontSize: 20 }}
          >
            {name}
          </Text>
        </TouchableOpacity>
        {this.showBottomAvatarButton(item.uuID)}
      </View>
    );
  }
  showRowFindFriends(item, key) {
    if (this.state.newFriendsList.length > 0) {
      //we should change here

      if (item[1] != 0) {
        return (
          <View
            key={key}
            style={{
              flexDirection: "row",
              alignSelf: "center",
              alignItems: "center",
            }}
          >
            {this.showFriendIcon(item[0])}
            {this.showFriendIcon(item[1])}
          </View>
        );
      } else {
        return (
          <View
            key={key}
            style={{
              flexDirection: "row",
              alignSelf: "center",
              alignItems: "center",
            }}
          >
            {this.showFriendIcon(item[0])}
          </View>
        );
      }
    } else {
      return null;
    }
  }
  filterFriends(searchWord) {
    let filteredFriends = [];
    let chosenFriend;
    if (searchWord != "") {
      searchWord = searchWord.toLowerCase();
      for (let i = 0; i < this.state.friendListCopy.length; i++) {
        chosenFriend = this.state.friendListCopy[i].name.toLowerCase();
        if (chosenFriend.includes(searchWord)) {
          filteredFriends.push(this.state.friendListCopy[i]);
        }
      }
      this.setState({ friendList: filteredFriends });
    } else {
      this.setState({ friendList: this.state.friendListCopy });
    }
  }
  async fetchFriends() {
    await this.fetchNewFriends();
  }

  renderSearchBarFindFriends() {
    // searchPressed
    if (this.state.searchPressedFindFriends) {
      return (
        <View
          style={{
            alignSelf: "center",
            borderBottomWidth: 1,
            width: "100%",
            alignItems: "center",
            flexDirection: "row",
            justifyContent: "center",
          }}
        >
          <View
            style={{
              flexDirection: "row",
              borderWidth: 1,
              borderColor: "#3f32d2",
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
              color="#3f32d2"
              style={{ marginLeft: "3%" }}
            />
            <TextInput
              placeholder={this.props.translateText("friend.find_new_friend")}
              value={this.state.searchFriendMyFriends}
              onChangeText={(value) =>
                this.setState({ searchFriendMyFriends: value, skip: 0 }, () => {
                  this.fetchFriends();
                })
              }
              style={{ fontSize: 20, width: "60%", alignSelf: "center" }}
            />
          </View>
          <Icon
            name="cancel"
            type="material"
            size={50}
            color="#ff4714"
            style={{ marginLeft: "2%", elevation: 20 }}
            onPress={() => {
              this.setState(
                {
                  searchPressedFindFriends: !this.state
                    .searchPressedFindFriends,
                  searchFriendMyFriends: "",
                },
                () => {
                  this.fetchFriends();
                }
              );
            }}
          />
        </View>
      );
    } else {
      return (
        <View
          style={{
            width: "100%",
            alignSelf: "center",
            alignItems: "center",
            flexDirection: "row",
            borderBottomWidth: 1,
            paddingVertical: "2%",
            paddingHorizontal: "5%",
            justifyContent: "space-between",
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Text
              style={{ color: "#3f32d2", fontSize: 15, fontWeight: "bold" }}
            >
              {this.props.translateText("friend.suggest_friend")}
            </Text>
          </View>
          <Icon
            name="magnifying-glass"
            type="foundation"
            size={30}
            color="#3f32d2"
            onPress={() => {
              this.setState({
                searchPressedFindFriends: !this.state.searchPressedFindFriends,
              });
            }}
          />
        </View>
      );
    }
  }
  renderSearchBar() {
    // searchPressed
    if (this.state.searchPressed) {
      return (
        <View
          style={{
            alignSelf: "center",
            borderBottomWidth: 1,
            width: "100%",
            alignItems: "center",
            flexDirection: "row",
            justifyContent: "center",
          }}
        >
          <View
            style={{
              flexDirection: "row",
              borderWidth: 1,
              borderColor: "#3f32d2",
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
              color="#3f32d2"
              style={{ marginLeft: "3%" }}
            />
            <TextInput
              placeholder={this.props.translateText("friend.find_your_friend")}
              value={this.state.searchFriend}
              onChangeText={(value) =>
                this.setState(
                  { searchFriend: value },
                  this.filterFriends(value)
                )
              }
              style={{ fontSize: 20, width: "60%", alignSelf: "center" }}
            />
          </View>
          <Icon
            name="cancel"
            type="material"
            size={50}
            color="#ff4714"
            style={{ marginLeft: "2%", elevation: 20 }}
            onPress={() => {
              this.setState({
                searchPressed: !this.state.searchPressed,
                searchFriend: "",
                friendList: this.state.friendListCopy,
              });
            }}
          />
        </View>
      );
    } else {
      let myFriendsLength = 0;
      for (let i = 0; i < this.state.friendListCopy.length; i++) {
        if (this.state.friendListCopy[i].accepted == true) {
          myFriendsLength += 1;
        }
      }
      return (
        <View
          style={{
            width: "100%",
            alignSelf: "center",
            alignItems: "center",
            flexDirection: "row",
            borderBottomWidth: 1,
            paddingVertical: "2%",
            paddingHorizontal: "5%",
            justifyContent: "space-between",
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Text
              style={{ color: "#3f32d2", fontSize: 15, fontWeight: "bold" }}
            >
              {this.props.translateText("friend.all_friends")}
            </Text>
            <Badge
              style={{
                marginLeft: "5%",
                backgroundColor: "#3f32d2",
                justifyContent: "center",
              }}
            >
              <Text
                style={{ fontSize: 15, color: "white", fontWeight: "bold" }}
              >
                {myFriendsLength}
              </Text>
            </Badge>
          </View>
          <Icon
            name="magnifying-glass"
            type="foundation"
            size={30}
            color="#3f32d2"
            onPress={() => {
              this.setState({ searchPressed: !this.state.searchPressed });
            }}
          />
        </View>
      );
    }
  }
  renderScrollView() {
    if (this.state.friendList.length > 0) {
      return (
        <ScrollView>
          {this.state.friendList.map((item, i) => this.showRow(item, i))}
        </ScrollView>
      );
    } else {
      if (this.state.loading == false) {
        return (
          <Text
            style={{ fontSize: 20, alignSelf: "center", fontWeight: "bold" }}
          >
            {this.props.translateText("friend.no_matches")}
          </Text>
        );
      } else {
        return null;
      }
    }
  }
  renderScrollViewFindFriends() {
    if (this.state.newFriendsList.length > 0) {
      return (
        <ScrollView>
          {this.state.newFriendsList.map((item, i) =>
            this.showRowFindFriends(item, i)
          )}
          <TouchableOpacity
            style={{
              alignSelf: "center",
              alignItems: "center",
              backgroundColor: "#3f32d2",
              padding: 10,
              borderRadius: 10,
              marginTop: "5%",
            }}
            onPress={() => {
              this.setState({ skip: this.state.skip + 4 }, () => {
                this.fetchFriends();
              });
            }}
          >
            <Text style={{ fontSize: 20, color: "white" }}>
              {this.props.translateText("friend.load_more")}
            </Text>
          </TouchableOpacity>
        </ScrollView>
      );
    } else {
      if (this.state.loading == false) {
        return (
          <Text
            style={{ fontSize: 20, alignSelf: "center", fontWeight: "bold" }}
          >
            {this.props.translateText("friend.no_matches")}
          </Text>
        );
      } else {
        return null;
      }
    }
  }

  renderMyFriends() {
    return (
      <View>
        <View
          style={{
            width: "96%",
            backgroundColor: "white",
            elevation: 20,
            alignSelf: "center",
            marginTop: "2%",
            borderRadius: 10,
            marginBottom: "2%",
            paddingBottom: "2%",
            height: "82%",
          }}
        >
          {this.renderSearchBar()}
          {this.renderScrollView()}
        </View>
      </View>
    );
  }
  renderContent() {
    if (this.state.findFriends) {
      return (
        <TouchableWithoutFeedback
          onPress={() => {
            Keyboard.dismiss();
          }}
        >
          {this.renderFindFriends()}
        </TouchableWithoutFeedback>
      );
    } else {
      return this.renderMyFriends();
    }
  }
  showButtons() {
    let colors = ["white", "#3f32d2"];
    let dummy = "";
    let dummy1 = "";
    if (!this.state.findFriends) {
      dummy = colors[0];
      colors[0] = colors[1];
      colors[1] = dummy;
    }
    return (
      <View
        style={{
          width: "90%",
          alignSelf: "center",
          flexDirection: "row",
          justifyContent: "space-between",
          marginTop: "2%",
        }}
      >
        <TouchableOpacity
          style={{
            backgroundColor: colors[0],
            elevation: 20,
            flexDirection: "row",
            padding: 10,
            borderRadius: 20,
            alignItems: "center",
          }}
          onPress={() => {
            this.setState({ findFriends: 0 });
          }}
        >
          <Icon
            name="account-group"
            type="material-community"
            size={30}
            color={colors[0]}
            backgroundColor={colors[1]}
            style={{ borderRadius: 10 }}
          />
          <Text style={{ color: colors[1], marginLeft: "5%", fontSize: 15 }}>
            {this.props.translateText("friend.my_friends")}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            backgroundColor: colors[1],
            elevation: 20,
            flexDirection: "row",
            padding: 10,
            borderRadius: 20,
            alignItems: "center",
          }}
          onPress={() => {
            this.setState({ findFriends: 1 });
          }}
        >
          <Icon
            name="account-search"
            type="material-community"
            size={30}
            color={colors[1]}
            backgroundColor={colors[0]}
            style={{ borderRadius: 10 }}
          />
          <Text style={{ color: colors[0], marginLeft: "5%", fontSize: 15 }}>
            {this.props.translateText("friend.find_friend")}
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <Spinner
          visible={this.state.loading}
          textContent={this.props.translateText("beacon.loading")}
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
          </View>
          {this.showButtons()}
          {this.renderContent()}
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
    height: "15%",
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

export default connect(mapStateToProps, mapDispatchToProps)(FindFriends);

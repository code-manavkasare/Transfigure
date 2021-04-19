import React from "react";
import {
  View,
  TextInput,
  StyleSheet,
  Text,
  TouchableOpacity,
  Image,
  Alert,
  SafeAreaView,
  Dimensions,
  Settings,
  ScrollView,
  Switch,
  FlatList,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { Badge } from "native-base";
import {
  updateKey,
  getNotifications,
  handleFriendRequest,
  deleteNotification,
  translateText,
} from "../actions/user";
import { Header, Icon, Overlay, Input, Avatar } from "react-native-elements";
import Beacon from "react-native-vector-icons/MaterialCommunityIcons";
import moment from "moment";
import MyFooter from "../components/centerComp";
import Spinner from "react-native-loading-spinner-overlay";
import {
  likeQuote,
  dislikeQuote,
  getRandomQuote,
  fetchrecentlySearched,
  addRecentlySearched,
  deleteRecentlySearched,
  addremovefavorites,
} from "../func/quotes";
import { getOneUser } from "../func/findUsers";
import { getFont } from "../components/chosenfonts";
import { getAvatar } from "../func/userSettings";

import {
  Container,
  Content,
  List,
  ListItem,
  Left,
  Body,
  Right,
  Thumbnail,
} from "native-base";

class BeaconPageQuotes extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      notifications: [],
      loading: false,
      quoteOffset: 0,
      currentQuote: null,
      searchWord: "",
      currentUser: null,
      doWeLikeIt: false,
      recentlySearched: [],
      avatarURI: "",
      isFavorite: false,
    };
  }

  async componentDidMount() {
    console.disableYellowBox = true;
    this.setState({ loading: true });
    await this.fetchQuote();
    this.setState({ loading: false });
  }
  capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  async getRecentlySearched() {
    let resp = await fetchrecentlySearched(this.props.user.authKey);
    this.setState({ recentlySearched: resp });
  }
  async deleteRecentSearch(word) {
    let resp = await deleteRecentlySearched(this.props.user.authKey, word);
    if (resp) {
      await this.getRecentlySearched();
    }
  }
  async addRecentSearched() {
    if (this.state.searchWord != "") {
      let resp = await addRecentlySearched(
        this.props.user.authKey,
        this.state.searchWord
      );
      if (resp) {
        await this.getRecentlySearched();
      }
    }
  }
  async fetchQuote() {
    if (this.state.quoteOffset > -1) {
      let resp = await getRandomQuote(
        this.props.user.authKey,
        this.state.quoteOffset,
        this.state.searchWord
      );
      let user = null;
      let avBase64 = null;

      console.log("fetch quote")

      if (resp != null
        && (
        ((resp.quote.quoteText[0] == '\u0022') && (resp.quote.quoteText[resp.quote.quoteText.length-1] == '\u0022'))||
        ((resp.quote.quoteText[0] == '\u0027') && (resp.quote.quoteText[resp.quote.quoteText.length-1] == '\u0027'))||
        ((resp.quote.quoteText[0] == '\u2018') && (resp.quote.quoteText[resp.quote.quoteText.length-1] == '\u2019'))||
        ((resp.quote.quoteText[0] == '\u201C') && (resp.quote.quoteText[resp.quote.quoteText.length-1] == '\u201D'))||
        ((resp.quote.quoteText[0] == '\u201E') && (resp.quote.quoteText[resp.quote.quoteText.length-1] == '\u201F'))
      )
      ) {

        console.log((resp.quote.quoteText[resp.quote.quoteText.length-1]))
        console.log(resp.quote.quoteText[0])

        user = resp.currentUser;

        avBase64 = resp.currentUser.avatarURI;
        this.setState(
          {
            currentQuote: resp.quote,
            currentUser: user,
            avatarURI: avBase64,
            loading: false,
            isFavorite: resp.favorite,
          },
          () => {
            this.checkIfLiked();
          }
        );
      }

       if (resp != null
        && !(
        ((resp.quote.quoteText[0] == '\u0022') && (resp.quote.quoteText[resp.quote.quoteText.length-1] == '\u0022'))||
        ((resp.quote.quoteText[0] == '\u0027') && (resp.quote.quoteText[resp.quote.quoteText.length-1] == '\u0027'))||
        ((resp.quote.quoteText[0] == '\u2018') && (resp.quote.quoteText[resp.quote.quoteText.length-1] == '\u2019'))||
        ((resp.quote.quoteText[0] == '\u201C') && (resp.quote.quoteText[resp.quote.quoteText.length-1] == '\u201D'))||
        ((resp.quote.quoteText[0] == '\u201E') && (resp.quote.quoteText[resp.quote.quoteText.length-1] == '\u201F'))
      )
      ) { 
        
        this.setState({ quoteOffset: this.state.quoteOffset + 1 }, async () => {

          await this.fetchQuote();
        });
      }

       if (resp == null && this.state.quoteOffset > 0) {
        this.setState({ quoteOffset: this.state.quoteOffset - 1 }, async () => {
          await this.fetchQuote();

        });
      }
    } else {
      this.setState({ quoteOffset: this.state.quoteOffset + 1 }, async () => {

        await this.fetchQuote();
      });
    }

    await this.getRecentlySearched();
  }
  checkIfLiked() {
    let liked = false;
    if (this.state.currentQuote != null) {
      for (let i = 0; i < this.state.currentQuote.likedBy.length; i++) {
        if (this.state.currentQuote.likedBy[i] == this.props.user.uuID) {
          liked = true;
        }
      }
      this.setState({ doWeLikeIt: liked });
    }
  }
  async fetchFromInside() {
    this.setState({ loading: true });
    await this.fetchQuote();
    this.setState({ loading: false });
  }
  showFilterQuotes() {
    return (
      <View
        style={{
          backgroundColor: "white",
          marginTop: "5%",
          width: "96%",
          alignSelf: "center",
          alignItems: "center",
          borderRadius: 20,
          elevation: 20,
        }}
        key={1}
      >
        <View style={{ paddingVertical: "4%" }}>
          <Text
            style={{
              fontSize: 13,
              fontWeight: "bold",
              alignSelf: "flex-start",
            }}
          >
            {this.props.translateText("beacon.filter_quotes")}
          </Text>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              alignSelf: "flex-start",
            }}
          >
            <View
              style={{
                flexDirection: "row",
                borderWidth: 1,
                borderColor: "#000945",
                borderRadius: 10,
                marginTop: "2%",
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
                placeholder={this.props.translateText("beacon.search")}
                value={this.state.searchWord}
                onChangeText={(value) =>
                  this.setState(
                    { searchWord: value, quoteOffset: 0 },
                    async () => {
                      await this.fetchQuote();
                    }
                  )
                }
                style={{ fontSize: 20, width: "70%" }}
              />
            </View>
            <Icon
              name="cancel"
              type="material"
              size={50}
              color="#ff4714"
              style={{ marginLeft: "2%", alignSelf: "center" }}
              onPress={() => {
                this.setState({ searchWord: "", quoteOffset: 0 }, async () => {
                  await this.fetchQuote();
                });
              }}
            />
          </View>
        </View>
      </View>
    );
  }
  showText() {
    let fixedFontFamily = "";
    let iosFonts = getFont("ios");
    if (Platform.OS == "ios") {
      if (iosFonts.includes(this.state.currentQuote.style.fontFamily)) {
        //one of the IOS fonts
        fixedFontFamily = this.state.currentQuote.style.fontFamily;
      } else {
        fixedFontFamily = "system font";
      }
    } else {
      fixedFontFamily = this.state.currentQuote.style.fontFamily;
    }

    let textStyle = {
      fontSize: 15,
      color: this.state.currentQuote.style.color,
      fontStyle: "normal",
      fontWeight: "normal",
      textAlign: "justify",
      fontFamily: fixedFontFamily,
    };
    if (this.state.currentQuote.style.fontWeight != "") {
      textStyle.fontWeight = "bold";
    }
    if (this.state.currentQuote.style.fontSize != "") {
      textStyle.fontSize = 20;
    }
    if (this.state.currentQuote.style.fontStyle != "") {
      textStyle.fontStyle = "italic";
    }
    return (
      <View
        style={{
          width: "90%",
          backgroundColor: "#dedbfe",
          borderRadius: 10,
          padding: "5%",
        }}
      >
        <Text style={textStyle}>
          {this.renderText(this.state.currentQuote.quoteText)}
        </Text>
      </View>
    );
  }

  renderText(text) {
    // console.log(text, "test");
    // text = text.replace(/\”/g, "").replace(/\„/g, "").replace(/\’/g, "");
    return text;
  }

  async handleRespect(type) {
    //0 like,1 dislike
    let resp = null;
    if (type) {
      resp = await likeQuote(
        this.props.user.authKey,
        this.state.currentQuote.quoteID
      );
    } else {
      resp = await dislikeQuote(
        this.props.user.authKey,
        this.state.currentQuote.quoteID
      );
    }
    if (resp) {
      await this.fetchQuote();
    }
  }
  showRespects() {
    return (
      <View
        style={{
          flexDirection: "row",
          marginHorizontal: "10%",
          marginTop: "2%",
          justifyContent: "space-between",
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Icon name="heart" type="font-awesome" size={15} color="gray" />
          <Text style={{ color: "gray", marginLeft: "2%", fontSize: 15 }}>
            {this.state.currentQuote.likes}{" "}
            {this.props.translateText("beacon.respects")}
          </Text>
        </View>
        <TouchableOpacity
          onPress={() => {
            this.props.navigation.navigate("ShowQuote", {
              quoteID: this.state.currentQuote.quoteID,
            });
          }}
        >
          <Text style={{ color: "#3f32d2", fontSize: 15 }}>
            {this.props.translateText("beacon.full_quote")}
          </Text>
        </TouchableOpacity>
      </View>
    );
  }
  showRespectButton() {
    if (!this.state.doWeLikeIt) {
      return (
        <TouchableOpacity
          style={{
            flexDirection: "row",
            alignItems: "center",
            alignSelf: "flex-start",
          }}
          onPress={() => {
            this.handleRespect(1);
          }}
        >
          <Icon name="heart" type="font-awesome" size={20} color="#3f32d2" />
          <Text
            style={{
              color: "#3f32d2",
              marginLeft: "5%",
              fontSize: 20,
              fontWeight: "bold",
            }}
          >
            {this.props.translateText("beacon.respect")}
          </Text>
        </TouchableOpacity>
      );
    } else {
      return (
        <TouchableOpacity
          style={{
            flexDirection: "row",
            alignItems: "center",
            alignSelf: "flex-start",
          }}
          onPress={() => {
            this.handleRespect(0);
          }}
        >
          <Icon name="dislike1" type="antdesign" size={20} color="red" />
          <Text
            style={{
              color: "red",
              marginLeft: "5%",
              fontSize: 20,
              fontWeight: "bold",
            }}
          >
            {this.props.translateText("beacon.dislike")}
          </Text>
        </TouchableOpacity>
      );
    }
  }
  showButtons() {
    return (
      <View
        style={{
          flexDirection: "row",
          marginTop: "8%",
          justifyContent: "space-between",
          marginHorizontal: "15%",
        }}
      >
        {this.showRespectButton()}
        <TouchableOpacity
          style={{
            flexDirection: "row",
            alignItems: "center",
            alignSelf: "flex-end",
          }}
          onPress={() => {
            this.props.navigation.navigate("ReportQuote", {
              quoteID: this.state.currentQuote.quoteID,
            });
          }}
        >
          <Icon name="flag" type="font-awesome" size={20} color="red" />
          <Text
            style={{
              color: "red",
              marginLeft: "5%",
              fontSize: 20,
              fontWeight: "bold",
            }}
          >
            {this.props.translateText("beacon.report")}
          </Text>
        </TouchableOpacity>
      </View>
    );
  }
  showAvatar() {
    if (this.state.avatarURI == "" || this.state.avatarURI == false) {
      let img = require("../images/defaultAvatar.jpg");
      return (
        <TouchableOpacity
          style={{ borderRadius: 10 }}
          onPress={() => {
            this.props.navigation.navigate("UserPage", {
              uuID: this.state.currentUser.uuID,
            });
          }}
        >
          <Thumbnail style={{ borderRadius: 10 }} square source={img} />
        </TouchableOpacity>
      );
    } else {
      let myuri = this.state.avatarURI;
      return (
        <TouchableOpacity
          style={{ borderRadius: 10 }}
          onPress={() => {
            this.props.navigation.navigate("UserPage", {
              uuID: this.state.currentUser.uuID,
            });
          }}
        >
          <Thumbnail
            style={{ borderRadius: 10 }}
            square
            source={{ uri: myuri }}
          />
        </TouchableOpacity>
      );
    }
  }
  async handleAddFavorite() {
    let resp = await addremovefavorites(
      this.props.user.authKey,
      this.state.currentQuote.quoteID
    );
    if (resp) {
      await this.fetchQuote();
    }
  }

  showQuote() {
    if (this.state.currentUser != null) {
      let username =
        this.capitalizeFirstLetter(this.state.currentUser.firstName) +
        " " +
        this.capitalizeFirstLetter(this.state.currentUser.lastName[0]) +
        ".";
      return (
        <View
          style={{
            backgroundColor: "white",
            marginTop: "5%",
            width: "96%",
            alignSelf: "center",
            borderRadius: 20,
            elevation: 20,
            paddingVertical: "5%",
          }}
          key={2}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              margin: "5%",
              marginTop: 0,
              justifyContent: "space-between",
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignSelf: "flex-start",
                alignItems: "center",
              }}
            >
              {this.showAvatar()}
              <View style={{ marginLeft: "5%" }}>
                <Text
                  style={{ color: "black", fontSize: 20, fontWeight: "bold" }}
                >
                  {username}
                </Text>
                <Text style={{ color: "black", fontSize: 15 }}>
                  {this.state.currentUser.displayTitle}
                </Text>
              </View>
            </View>
            {/* <TouchableOpacity onPress={()=>{this.handleAddFavorite()}} style={{flexDirection:'row',alignItems:'center'}}>
                    {this.state.isFavorite===true ? <Icon name='star' type='entypo' size={20} color='#3f32d2' />:<Icon name='star-outlined' type='entypo' size={20} color='#3f32d2' /> }
                    
                    <Text style={{color:'#3f32d2',fontSize:20,textAlign:'right'}}>FAVORITE</Text>
                </TouchableOpacity> */}
          </View>
          <View
            style={{
              margin: "5%",
              marginBottom: "0%",
              flexDirection: "row",
              alignItems: "center",
              alignSelf: "center",
            }}
          >
            <Icon
              name="angle-left"
              type="font-awesome-5"
              size={50}
              color="#3f32d2"
              style={{ marginRight: "5%" }}
              onPress={() => {
                this.setState(
                  { quoteOffset: this.state.quoteOffset - 1 },
                  async () => {
                    await this.fetchFromInside();
                  }
                );
              }}
            />
            {this.showText()}
            <Icon
              name="angle-right"
              type="font-awesome-5"
              size={50}
              color="#3f32d2"
              style={{ marginLeft: "5%" }}
              onPress={() => {
                this.setState(
                  { quoteOffset: this.state.quoteOffset + 1 },
                  async () => {
                    await this.fetchFromInside();
                    await this.addRecentSearched();
                  }
                );
              }}
            />
          </View>
          {this.showRespects()}
          {this.showButtons()}
        </View>
      );
    } else {
      return (
        <View
          style={{
            backgroundColor: "white",
            marginTop: "5%",
            width: "96%",
            alignSelf: "center",
            borderRadius: 20,
            elevation: 20,
            marginBottom: "10%",
            paddingVertical: "5%",
          }}
        >
          <Text style={{ alignSelf: "center", fontSize: 30, color: "gray" }}>
            {this.props.translateText("beacon.no_result")}
          </Text>
        </View>
      ); //should be the same but without names
    }
  }
  recentlySearchedField(item, key) {
    return (
      <View style={{ alignSelf: "center" }}>
        <View
          key={key}
          style={{
            flexDirection: "row",
            borderWidth: 1,
            borderColor: "blue",
            backgroundColor: "#dedbfe",
            alignItems: "center",
            borderRadius: 20,
            alignSelf: "flex-start",
            marginVertical: "2%",
            padding: "5%",
            marginLeft: "1%",
          }}
        >
          <Text
            style={{ fontSize: 20 }}
            numberOfLines={1}
            onPress={() => {
              this.setState({ searchWord: item }, async () => {
                await this.fetchQuote();
              });
            }}
          >
            {item}
          </Text>
          <Icon
            name="cancel"
            type="material"
            size={25}
            color="gray"
            style={{ marginLeft: "5%", alignSelf: "center" }}
            onPress={() => {
              this.deleteRecentSearch(item);
            }}
          />
        </View>
      </View>
    );
  }
  showRecentlySearched() {
    return (
      <View
        style={{
          backgroundColor: "white",
          marginTop: "5%",
          width: "96%",
          alignSelf: "center",
          borderRadius: 20,
          elevation: 20,
          marginBottom: "10%",
          paddingVertical: "5%",
        }}
        key={3}
      >
        <Text
          style={{
            fontSize: 20,
            fontWeight: "bold",
            color: "black",
            marginLeft: "5%",
          }}
        >
          {this.props.translateText("beacon.recently_searched")}
        </Text>
        <View
          style={{
            flexWrap: "wrap",
            flexDirection: "row",
            marginHorizontal: "5%",
          }}
        >
          {this.state.recentlySearched.map((item, i) =>
            this.recentlySearchedField(item, i)
          )}
        </View>
      </View>
    );
  }
  render() {
    return (
      <SafeAreaView style={styles.container}>
        <Spinner
          visible={this.state.loading}
          textContent={this.props.translateText("beacon.loading")}
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
              {this.props.translateText("beacon.beaconLabel")}
            </Text>
            <View style={{ flexDirection: "row" }}>
              <TouchableOpacity
                style={{
                  flex: 0.5,
                  borderBottomColor: "white",
                  borderBottomWidth: 5,
                }}
              >
                <View
                  style={{
                    alignSelf: "center",
                    marginTop: "5%",
                    flexDirection: "row",
                    alignItems: "center",
                    padding: 5,
                  }}
                >
                  <Text style={{ fontSize: 17, color: "white" }}>
                    {this.props.translateText("beacon.quotes")}
                  </Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  this.props.navigation.navigate("BeaconPageReflection");
                }}
                style={{ flex: 0.5 }}
              >
                <View
                  style={{
                    alignSelf: "center",
                    marginTop: "5%",
                    flexDirection: "row",
                    alignItems: "center",
                    padding: 5,
                  }}
                >
                  <Text style={{ fontSize: 17, color: "white" }}>
                    {this.props.translateText("beacon.refcention")}
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
          <ScrollView>
            {this.showFilterQuotes()}
            {this.showQuote()}
            {this.showRecentlySearched()}
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
    marginTop: Platform.OS !== 'ios' ? 30 : 0
  },
});

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(
    {
      updateKey,
      getNotifications,
      handleFriendRequest,
      deleteNotification,
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

export default connect(mapStateToProps, mapDispatchToProps)(BeaconPageQuotes);

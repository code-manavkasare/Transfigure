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
  ImageBackground,
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
import { Header, Icon, Overlay, Avatar } from "react-native-elements";
import { sendCode } from "../func/resetpassword";
import { getOneUser } from "../func/findUsers";
import {
  likeQuote,
  dislikeQuote,
  likeComment,
  dislikeComment,
  replyToComment,
  replyToQuote,
  getOneQuote,
  deleteQuote,
  deleteCommentOfQuoteFunc,
  deleteCommentOfCommentFunc,
} from "../func/quotes";
import Beacon from "react-native-vector-icons/MaterialCommunityIcons";
import MyFooter from "../components/centerComp";
import Spinner from "react-native-loading-spinner-overlay";
import { Thumbnail } from "native-base";
// import moment from "moment";
import moment from "moment-timezone";
import { fetchSettingsInfo } from "../func/userSettings";
import { getAvatar } from "../func/userSettings";
import { getFont } from "../components/chosenfonts";
import FlashMessage from "react-native-flash-message";
import { showMessage, hideMessage } from "react-native-flash-message";
import { SliderBox } from "react-native-image-slider-box";
import RBSheet from "react-native-raw-bottom-sheet";

class ShowQuote extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      myQuote: null,
      foundUser: 0,
      username: "",
      commentOverlayVis: false,
      comment: "",
      loading: false,
      chosenCommentID: "",
      chosenCommentType: 0,
      timezone: "Europe/Belfast",
      nameOnImage: "",
      usersAvatarURI: "",
      imageOverlayVis: false,
      selectedIndex: null,
      replies: null,
      chosenReplyID: "",
      searchTreeKey: "",
      chosenTotalData: []
    };
  }

  async componentDidMount() {
    console.disableYellowBox = true;
    this.setState({ loading: true });
    let quote = await getOneQuote(
      this.props.user.authKey,
      this.props.route.params.quoteID
    );
    await this.setTimezone();

    await this.getUserInfo(quote);
    this.setState({ myQuote: quote });
    this.setState({ loading: false });
  }
  async setTimezone() {
    let resp = await fetchSettingsInfo(this.props.user.authKey);
    if (resp) {
      this.setState({ timezone: resp.timezone });
    }
  }
  capitalizeFirstLetter(string) {
    //console.log(string)
    return string.charAt(0).toUpperCase() + string.slice(1);
  }
  async getUserInfo(quote) {
    //userID authkey to send
    this.setState({ loading: true });

    let resp = await getOneUser(this.props.user.authKey, quote.addedByUuid);
    let base64ava = "";
    let user = 0;
    let displayName = "";
    let username = "";
    let date = 0;
    if (resp) {
      base64ava = resp.avatar;
      user = resp.user;
      date = this.getDateText(quote.dateAdded);
      username =
        this.capitalizeFirstLetter(user.firstName) +
        " " +
        this.capitalizeFirstLetter(user.lastName[0]) +
        ".";

      if (user.displayName == "" || !("displayName" in user)) {
        displayName = username;
      } else {
        displayName = user.displayName;
      }
    }

    this.setState({
      foundUser: user,
      username: username,
      date: date,
      nameOnImage: displayName,
      usersAvatarURI: base64ava,
      loading: false,
    });
  }
  getDateText(date) {
    moment.tz.setDefault(this.state.timezone);
    let duration = moment
      .duration(moment().diff(moment(date).startOf("day")))
      .asHours();
    let splitedDate = moment(date).format("DD-MM-YYYY h:mm a").split(" ");
    let dateText = "";
    if (duration <= 24) {
      dateText =
        "Today at " + splitedDate[1] + " " + splitedDate[2].toUpperCase();
    }
    if (duration > 24 && duration <= 48) {
      dateText =
        "Yesterday at " + splitedDate[1] + " " + splitedDate[2].toUpperCase();
    }
    if (duration > 48) {
      dateText =
        splitedDate[0] +
        " at " +
        splitedDate[1] +
        " " +
        splitedDate[2].toUpperCase();
    }
    return dateText;
  }

  showAvatarTitle(ava) {
    if (this.state.myQuote) {
      if (ava == "") {
        let img = require("../images/defaultAvatar.jpg");
        return (
          <TouchableOpacity
            style={{ borderRadius: 10 }}
            onPress={() => {
              this.props.navigation.navigate("UserPage", {
                uuID: this.state.myQuote.addedByUuid,
              });
            }}
          >
            <Thumbnail style={{ borderRadius: 10 }} square source={img} />
          </TouchableOpacity>
        );
      } else {
        let myuri = ava;
        return (
          <TouchableOpacity
            style={{ borderRadius: 10 }}
            onPress={() => {
              this.props.navigation.navigate("UserPage", {
                uuID: this.state.myQuote.addedByUuid,
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
  }

  renderTitle() {
    return (
      <View
        style={{
          flexDirection: "row",
          margin: "5%",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          {this.showAvatarTitle(this.state.usersAvatarURI)}
          <View style={{ marginLeft: "5%" }}>
            <Text style={{ color: "black", fontSize: 20, fontWeight: "bold" }}>
              {this.state.username}
            </Text>
            <Text style={{ color: "black", fontSize: 12 }}>
              {this.state.foundUser.displayTitle}
            </Text>
          </View>
        </View>
        <Text style={{ color: "black", fontSize: 12, textAlign: "right" }}>
          {this.state.date}
        </Text>
      </View>
    );
  }

  renderImage() {
    if (this.state.myQuote != null) {
      if (!this.state.myQuote.imageChosen) {
        return (
          <View
            style={{
              backgroundColor: this.state.myQuote.backgroundColor,
              width: "90%",
              paddingVertical: "20%",
              marginHorizontal: "5%",
              justifyContent: "center",
              alignItems: "center",
              borderRadius: 10,
              alignSelf: "center",
            }}
          >
            <Text style={{ color: "white", fontWeight: "bold", fontSize: 30 }}>
              {this.state.nameOnImage}
            </Text>
          </View>
        );
      } else {
        let base64text = this.state.myQuote.imageURI;
        return (
          <TouchableOpacity
            onPress={() => {
              this.setState({ imageOverlayVis: true });
            }}
            style={{ overflow: "hidden" }}
          >
            {/* <ImageBackground source={{uri:base64text}}  style={{width:parseInt(Dimensions.get('window').width*0.9*0.96),
                    paddingVertical:'20%',justifyContent: 'center',alignItems: 'center',alignSelf:'center'}} resizeMode='cover' imageStyle={{borderRadius:10}}>
                        <Text style={{color:'white',fontWeight:'bold',fontSize:30}}> </Text>
                    </ImageBackground> */}
            <SliderBox
              images={base64text}
              onCurrentImagePressed={(i) =>
                this.setState({ imageOverlayVis: true, selectedIndex: i })
              }
            />
          </TouchableOpacity>
        );
      }
    } else {
      return null;
    }
  }
  renderText() {
    if (this.state.myQuote != null) {
      let fixedFontFamily = "";
      let iosFonts = getFont("ios");
      if (Platform.OS == "ios") {
        if (iosFonts.includes(this.state.myQuote.style.fontFamily)) {
          //one of the IOS fonts
          fixedFontFamily = this.state.myQuote.style.fontFamily;
        } else {
          fixedFontFamily = "system font";
        }
      } else {
        fixedFontFamily = this.state.myQuote.style.fontFamily;
      }

      let textStyle = {
        fontSize: 15,
        color: "black",
        fontStyle: "normal",
        fontWeight: "normal",
        fontFamily: fixedFontFamily,
      };
      if (this.state.myQuote.style.fontWeight != "") {
        textStyle.fontWeight = "bold";
      }
      if (this.state.myQuote.style.fontSize != "") {
        textStyle.fontSize = 20;
      }
      if (this.state.myQuote.style.fontStyle != "") {
        textStyle.fontStyle = "italic";
      }
      textStyle.color = this.state.myQuote.style.color;

      return (
        <View style={{ margin: "5%", marginBottom: 0 }}>
          <Text style={{ color: "green", fontSize: 25, fontWeight: "bold" }}>
            {this.state.myQuote.title}
          </Text>
          <Text style={textStyle}>{this.state.myQuote.quoteText}</Text>
        </View>
      );
    } else {
      return null;
    }
  }

  renderLikesCommentsNumber() {
    if (this.state.myQuote != null) {
      let likes = this.state.myQuote.likes;
      let comments = this.state.myQuote.comments.length;
      return (
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            alignSelf: "flex-start",
            marginHorizontal: "5%",
          }}
        >
          <Icon
            name="comment"
            type="material-community"
            size={15}
            color="gray"
          />
          <Text
            style={{ fontWeight: "bold", marginLeft: "2%", marginRight: "5%" }}
          >
            {comments}
          </Text>
          <Icon name="heart" type="font-awesome" size={15} color="gray" />
          <Text style={{ fontWeight: "bold", marginLeft: "2%" }}>{likes}</Text>
        </View>
      );
    } else {
      return null;
    }
  }

  async handleAddComment() {
    // type 0-comment quote type 1-reply to comment
    if (this.state.chosenCommentType == 1) {
      this.setState({ loading: true, commentOverlayVis: false });
      let resp = await replyToComment(
        this.props.user.authKey,
        this.state.myQuote.quoteID,
        this.state.chosenCommentID,
        (this.state.comment + "_" + (this.state.chosenReplyID)),
      );

      if (resp) {
        //refresh
        let quote = await getOneQuote(
          this.props.user.authKey,
          this.state.myQuote.quoteID
        );
        this.setState({ myQuote: quote });
      }
      this.setState({ loading: false, comment: "" });
      this.RBSheet.close()
      
    }
    if (this.state.chosenCommentType == 0) {
      this.setState({ loading: true, commentOverlayVis: false });
      let resp = await replyToQuote(
        this.props.user.authKey,
        this.state.myQuote.quoteID,
        this.state.comment
      );

      if (resp) {
        //refresh
        let quote = await getOneQuote(
          this.props.user.authKey,
          this.state.myQuote.quoteID
        );
        this.setState({ myQuote: quote });
      }
      this.setState({ loading: false, comment: "" });
    }
  }
  async handleLikeComment(data) {
    this.setState({ loading: true });
    let resp = await likeComment(
      this.props.user.authKey,
      this.state.myQuote.quoteID,
      data.commentID
    );

    if (resp) {
      //refresh
      let quote = await getOneQuote(
        this.props.user.authKey,
        this.state.myQuote.quoteID
      );
      this.setState({ myQuote: quote });
    }
    this.setState({ loading: false });
  }
  async handleDislikeComment(data) {
    this.setState({ loading: true });
    let resp = await dislikeComment(
      this.props.user.authKey,
      this.state.myQuote.quoteID,
      data.commentID
    );

    if (resp) {
      //refresh
      let quote = await getOneQuote(
        this.props.user.authKey,
        this.state.myQuote.quoteID
      );
      this.setState({ myQuote: quote });
    }
    this.setState({ loading: false });
  }
  showRespectDislikeComment(data) {
    if (this.state.myQuote != null && data != undefined && "likedBy" in data) {
      if (data.likedBy.includes(this.props.user.uuID)) {
        return (
          <View>
            <TouchableOpacity
              style={{ flexDirection: "row" }}
              onPress={() => {
                this.handleDislikeComment(data);
              }}
            >
              <Icon name="ios-heart" type="ionicon" size={15} color="red" />
              <Text
                style={{
                  fontWeight: "bold",
                  color: "red",
                  marginLeft: "5%",
                  marginTop: -1,
                  fontSize: 12,
                }}
              >
                {this.props.translateText("showQuote.dislike")}
              </Text>
            </TouchableOpacity>
          </View>
        );
      } else {
        return (
          <TouchableOpacity
            style={{ flexDirection: "row" }}
            onPress={() => {
              this.handleLikeComment(data);
            }}
          >
            <Icon name="ios-heart" type="ionicon" size={15} color="#3f32d2" />
            <Text
              style={{
                fontWeight: "bold",
                color: "#3f32d2",
                marginLeft: "5%",
                marginTop: -1,
                fontSize: 12,
              }}
            >
              {this.props.translateText("showQuote.respect")}
            </Text>
          </TouchableOpacity>
        );
      }
    } else {
      return null;
    }
  }
  async deleteCommentOfQuote(item) {
    let resp = await deleteCommentOfQuoteFunc(
      this.props.user.authKey,
      this.state.myQuote.quoteID,
      item.commentID
    );
    if (resp) {
      let quote = await getOneQuote(
        this.props.user.authKey,
        this.state.myQuote.quoteID
      );
      this.setState({ myQuote: quote });
    }
  }
  renderLikesCommentsNumberReply(data) {
    if (this.state.myQuote != null && data != undefined) {
      let likes = data.likes;
      let comments = data.replies.length;
      return (
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            alignSelf: "flex-start",
          }}
        >
          {/* <Icon
            name="comment"
            type="material-community"
            size={15}
            color="gray"
          />
          <Text
            style={{ fontWeight: "bold", marginLeft: "2%", marginRight: "5%" }}
          >
            {comments}
          </Text>
          <Icon name="ios-heart" type="ionicon" size={15} color="gray" />
          <Text
            style={{ fontWeight: "bold", marginLeft: "2%", marginRight: "5%" }}
          >
            {likes}
          </Text> */}
          <TouchableOpacity
            style={{ flexDirection: "row", marginRight: "2%" }}
            onPress={() =>
              this.setState({
                commentOverlayVis: true,
                chosenCommentType: 1,
                chosenCommentID: data.commentID,
                chosenReplyID: data.addedAt
              })
            }
          >
            <Icon name="reply" type="font-awesome" size={15} color="#3f32d2" />
            {/* <Text
              style={{
                fontWeight: "bold",
                color: "#3f32d2",
                marginLeft: "5%",
                marginTop: -1,
                fontSize: 12,
              }}
            >
              {this.props.translateText("showQuote.reply")}
            </Text> */}
          </TouchableOpacity>
          {/* {this.showRespectDislikeComment(data)} */}
        </View>
      );
    } else {
      return null;
    }
  }
  async respectQuote() {
    this.setState({ loading: true });
    let resp = await likeQuote(
      this.props.user.authKey,
      this.state.myQuote.quoteID
    );

    if (resp) {
      //refresh
      let quote = await getOneQuote(
        this.props.user.authKey,
        this.state.myQuote.quoteID
      );
      this.setState({ myQuote: quote });
    }
    this.setState({ loading: false });
  }
  async dislikeQuote() {
    this.setState({ loading: true });
    let resp = await dislikeQuote(
      this.props.user.authKey,
      this.state.myQuote.quoteID
    );

    if (resp) {
      //refresh
      let quote = await getOneQuote(
        this.props.user.authKey,
        this.state.myQuote.quoteID
      );
      this.setState({ myQuote: quote });
    }
    this.setState({ loading: false });
  }
  showDislikeRespect() {
    //sciagnac uuid
    if (this.state.myQuote != null) {
      if (this.state.myQuote.likedBy.includes(this.props.user.uuID)) {
        return (
          <TouchableOpacity
            onPress={() => {
              this.dislikeQuote();
            }}
            style={{ flexDirection: "row", alignItems: "center" }}
          >
            <Icon
              name="dislike1"
              type="antdesign"
              size={16}
              color="red"
            />
            <Text
              style={{
                fontSize: 14,
                color: "red",
                marginLeft: 4,
                marginTop: -1,
              }}
            >
              {this.props.translateText("showQuote.dislike")}
            </Text>
          </TouchableOpacity>
        );
      } else {
        return (
          <TouchableOpacity
            onPress={() => {
              this.respectQuote();
            }}
            style={{ flexDirection: "row", alignItems: "center" }}
          >
            <Icon name="heart" type="font-awesome" size={16} color="#3f32d2" />
            <Text
              style={{
                fontSize: 14,
                color: "#3f32d2",
                marginLeft: 4,
                marginTop: -1,
              }}
            >
              {this.props.translateText("showQuote.respect")}
            </Text>
          </TouchableOpacity>
        );
      }
    }
  }
  async handleDeleteQuote() {
    let resp = await deleteQuote(
      this.props.user.authKey,
      this.state.myQuote.quoteID
    );
    if (resp) {
      showMessage({ message: "DELETED QUOTE", type: "danger" });
      setTimeout(() => {
        this.props.navigation.pop(2);
      }, 500);
    }
  }
  renderReportOrDelete() {
    if (this.state.myQuote) {
      if (this.state.myQuote.addedByUuid != this.props.user.uuID) {
        return (
          <TouchableOpacity
            onPress={() => {
              this.props.navigation.navigate("ReportQuote", {
                quoteID: this.state.myQuote.quoteID,
              });
            }}
            style={{ flexDirection: "row", alignItems: "center" }}
          >
            <Icon name="flag" type="font-awesome" size={16} color="red" />
            <Text
              style={{
                fontSize: 14,
                color: "red",
                marginLeft: 4,
                marginTop: -1,
              }}
            >
              {this.props.translateText("userPage.report")}
            </Text>
          </TouchableOpacity>
        );
      } else {
        return (
          <TouchableOpacity
            onPress={() => {
              this.handleDeleteQuote();
            }}
            style={{ flexDirection: "row", alignItems: "center" }}
          >
            <Icon
              name="trash"
              type="font-awesome"
              size={16}
              color="red"
              style={{ marginTop: -2 }}
            />
            <Text
              style={{
                fontSize: 14,
                color: "red",
                marginLeft: 4,
                marginTop: -1,
              }}
            >
              {this.props.translateText("showQuote.delete")}
            </Text>
          </TouchableOpacity>
        );
      }
    } else {
      return null;
    }
  }
  renderSpacer() {
    return (
      <View
        style={{
          justifyContent: "space-between",
          width: "90%",
          paddingVertical: "2%",
          borderTopWidth: 1,
          borderBottomWidth: 1,
          borderColor: "#dbdbdb",
          flexDirection: "row",
          alignSelf: "center",
        }}
      >
        <TouchableOpacity
          onPress={() => {
            this.setState({ commentOverlayVis: true, chosenCommentType: 0 });
          }}
          style={{ flexDirection: "row", alignItems: "center" }}
        >
          <Icon
            name="comment"
            type="material-community"
            size={15}
            color="#3f32d2"
          />
          <Text
            style={{
              fontSize: 13,
              color: "#3f32d2",
              marginTop: -1,
            }}
          >
            {this.props.translateText("showQuote.comment")}
          </Text>
        </TouchableOpacity>
        {this.showDislikeRespect()}
        {this.renderReportOrDelete()}
      </View>
    );
  }

  showAvatar(ava, uuID) {
    if (ava == "" || ava == false) {
      let img = require("../images/defaultAvatar.jpg");
      return (
        <TouchableOpacity
          style={{
            borderRadius: 30,
            width: 40,
            height: 40,
            backgroundColor: "#f2f2f2",
          }}
          onPress={() => {
            this.props.navigation.navigate("UserPage", { uuID: uuID });
          }}
        >
          <Thumbnail
            style={{ borderRadius: 30, width: "100%", height: "100%" }}
            square
            source={img}
          />
        </TouchableOpacity>
      );
    } else {
      let myuri = ava;
      return (
        <TouchableOpacity
          style={{
            borderRadius: 30,
            width: 40,
            height: 40,
            backgroundColor: "#f2f2f2",
          }}
          onPress={() => {
            this.props.navigation.navigate("UserPage", { uuID: uuID });
          }}
        >
          <Thumbnail
            style={{ borderRadius: 30, width: "100%", height: "100%" }}
            square
            source={{ uri: myuri }}
          />
        </TouchableOpacity>
      );
    }
  }

  async deleteCommentOfComment(item, commentID, addedByUuid) {
    console.log(commentID, addedByUuid, item.replyID);
    let resp = await deleteCommentOfCommentFunc(
      this.props.user.authKey,
      this.state.myQuote.quoteID,
      commentID,
      addedByUuid,
      item.replyID
    );
    if (resp) {
      let quote = await getOneQuote(
        this.props.user.authKey,
        this.state.myQuote.quoteID
      );
      this.setState({ myQuote: quote });
    }
  }

  renderOneCommentOfComment(item, iterator, dataAJH) {
    console.log(item, "replies");
    if (!item) {
      return;
    }
    let name = item.addedBy.split(" ");
    let firstName = this.capitalizeFirstLetter(name[0]);
    let lastname = this.capitalizeFirstLetter(name[1]);
    let username =
      this.capitalizeFirstLetter(firstName) +
      " " +
      this.capitalizeFirstLetter(lastname[0]) +
      ".";
    let addedat = this.getDateText(item.addedAt);
    return (
      <View
        key={iterator}
        style={{
          width: "100%",
          alignSelf: "flex-start",
          alignItems: "flex-start",
          marginTop: "5%",
          paddingHorizontal: 10,
        }}
      >
        <View style={{ flexDirection: "row" }}>
          {this.showAvatar(item.avatarURI, item.addedByUuid, "gray")}
          <View style={{ marginHorizontal: "5%" }}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Text style={{ fontWeight: "bold", fontSize: 15 }}>
                {username}
              </Text>
              {/* {item.addedByUuid === this.props.user.uuID ? (
                <TouchableOpacity
                  style={{
                    justifyContent: "center",
                    paddingRight: "5%",
                    marginLeft: 5,
                  }}
                  onPress={() =>
                    this.deleteCommentOfComment(item, commentID, addedBy)
                  }
                >
                  <Icon
                    name="trash"
                    type="font-awesome"
                    size={16}
                    color="red"
                  />
                </TouchableOpacity>
              ) : null} */}
              <Text style={{ fontSize: 12, marginLeft: 10 }}>{addedat}</Text>
            </View>
            <Text style={{ textAlign: "justify", marginRight: "10%" }}>
              {(item.replyText).split('_')[0]}
            </Text>
          </View>
        </View>
        {this.showTreeRespectDislikeComment(dataAJH, item)}
      </View>
    );
  }

  showTreeRespectDislikeComment(data, item) {
    let treeData = (typeof this.state.chosenTotalData === 'object') && this.state.chosenTotalData.filter(tree => tree.replyText.search(item.addedAt) >= 0 )
    return (
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          // alignSelf: "flex-start",
          marginLeft: "15%",
        }}
      >
        {/* <Icon name="comment" type="material-community" size={15} color="gray" />
        <Text
          style={{ fontWeight: "bold", marginLeft: "2%", marginRight: "5%" }}
        >
          {comments}
        </Text>
        <Icon name="ios-heart" type="ionicon" size={15} color="gray" />
        <Text
          style={{ fontWeight: "bold", marginLeft: "2%", marginRight: "5%" }}
        >
          {likes}
        </Text> */}
        <TouchableOpacity
          style={{ flexDirection: "row", marginRight: "2%" }}
          onPress={() =>
            this.setState({
              commentOverlayVis: true,
              chosenCommentType: 1,
              chosenReplyID: item.addedAt
            })
          }
        >
          <Icon name="reply" type="font-awesome" size={15} color="#3f32d2" />
          {/* <Text
            style={{
              fontWeight: "bold",
              color: "#3f32d2",
              marginLeft: "5%",
              marginTop: -1,
              fontSize: 12,
            }}
          >
            {this.props.translateText("showQuote.reply")}
          </Text> */}
        </TouchableOpacity>
        {/* {this.showRespectDislikeComment(data)} */}
        {treeData.length ? (
          <TouchableOpacity
            style={{ marginLeft: "20%", marginVertical: "2%" }}
            onPress={() => {
              this.showReplies(treeData)
              this.setState({ searchTreeKey: item.addedAt })
            }}
          >
            <Text style={{ fontSize: 13, color: "red", fontWeight: "700" }}>
              {treeData.length} REPLIES
            </Text>
          </TouchableOpacity>
        ) : null}
      </View>
    );
  }

  renderCommentsOfComment() {
    let data = this.state.replies;
    if (this.state.searchTreeKey == '' && data) {
      console.log("test+++++++++++++++++++++")
      console.log(data)
      let beforeReverse = data.replies;
      let afterReverse = [].concat(beforeReverse);
      return (
        <View>
          {afterReverse.map((item, i) =>
            ((typeof item === 'object') && (item.replyText).search(data.addedAt) >= 0) &&
            this.renderOneCommentOfComment(
              item,
              i,
              data
            )
          )}
        </View>
      );
    }

    if (this.state.searchTreeKey != '' && data) {
         return (
          <View>
            {data.map((item, i) =>
              this.renderOneCommentOfComment(
                item,
                i,
                data
              )
            )}
          </View>
        );
    }
  }

  renderOneComment(data, iterator) {
    let name = data.addedBy.split(" ");
    let firstName = this.capitalizeFirstLetter(name[0]);
    let lastname = this.capitalizeFirstLetter(name[1]);
    let username =
      this.capitalizeFirstLetter(firstName) +
      " " +
      this.capitalizeFirstLetter(lastname[0]) +
      ".";
    let addedat = this.getDateText(data.addedAt);

    return (
      <View
        key={iterator}
        style={{
          width: "90%",
          alignSelf: "center",
          alignItems: "flex-start",
          marginTop: "5%",
        }}
      >
        <View style={{ flexDirection: "row" }}>
          {this.showAvatar(data.avatarURI, data.addedByUuid)}
          <View style={{ marginHorizontal: "5%" }}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Text style={{ fontWeight: "bold", fontSize: 14 }}>
                {username}
              </Text>
              {data.addedByUuid === this.props.user.uuID ? (
                <TouchableOpacity
                  style={{ marginLeft: 5 }}
                  onPress={() => this.deleteCommentOfQuote(data)}
                >
                  <Icon
                    name="trash"
                    type="font-awesome"
                    size={16}
                    color="red"
                  />
                </TouchableOpacity>
              ) : null}
              <Text style={{ fontSize: 10, marginLeft: "10%" }}>{addedat}</Text>
            </View>
            <Text style={{ textAlign: "justify", marginRight: "10%" }}>
              {data.commentText}
            </Text>
            {this.renderLikesCommentsNumberReply(data)}
          </View>
        </View>
        {data.replies.length ? (
          <TouchableOpacity
            style={{ marginLeft: "20%", marginVertical: "2%" }}
            onPress={() => {
              this.showReplies(data)
              this.setState({ searchTreeKey: "" })
              this.setState({chosenCommentID: data.commentID})
              this.setState({chosenTotalData: data.replies})
            }}
          >
            <Text style={{ fontSize: 13, color: "red", fontWeight: "700" }}>
              {data.replies.length} REPLIES
            </Text>
          </TouchableOpacity>
        ) : null}
      </View>
    );
  }

  showReplies(data) {
    console.log(data, "test data");
    this.setState({ replies: data });
    this.RBSheet.open();
  }

  renderComments() {
    if (this.state.myQuote !== null) {
      let beforReverse = this.state.myQuote.comments;
      let afterReverse = [].concat(beforReverse).reverse();
      return (
        <View>
          {afterReverse.map((item, i) => this.renderOneComment(item, i))}
          <RBSheet
            ref={(ref) => {
              this.RBSheet = ref;
            }}
            height={400}
            closeOnDragDown={true}
            openDuration={250}
            customStyles={{
              container: {},
            }}
          >
            <View style={styles.mainHeading}>
              <Text style={styles.mainHeadingText}>Replies</Text>
            </View>
            {this.renderCommentsOfComment()}
          </RBSheet>
        </View>
      );
    } else {
      return null;
    }
  }

  commentOverlay() {
    return (
      <Overlay
        isVisible={this.state.commentOverlayVis}
        onBackdropPress={() => {
          this.setState({
            commentOverlayVis: !this.state.commentOverlayVis,
            comment: "",
          });
        }}
        overlayStyle={{ width: "80%" }}
      >
        <View>
          <Text
            style={{ textAlign: "center", fontSize: 20, fontWeight: "bold" }}
          >
            {this.props.translateText("showQuote.add_your_comment")}
          </Text>
          <TextInput
            placeholder={this.props.translateText("showQuote.add_comment")}
            value={this.state.comment}
            onChangeText={(value) => this.setState({ comment: value })}
            multiline={true}
            maxLength={300}
            style={{ fontSize: 20 }}
          />
          <TouchableOpacity
            style={{
              backgroundColor: "#3f32d2",
              width: "50%",
              padding: 10,
              alignSelf: "center",
              borderRadius: 20,
            }}
            onPress={() => {
              this.handleAddComment();
            }}
          >
            <Text style={{ color: "white", fontSize: 20, textAlign: "center" }}>
              {this.props.translateText("showQuote.post")}
            </Text>
          </TouchableOpacity>
        </View>
      </Overlay>
    );
  }
  imageOverlay() {
    if (this.state.myQuote != null) {
      if (this.state.myQuote.imageChosen) {
        let base64text = this.state.myQuote.imageURI;
        console.log(base64text, "base64text");
        return (
          <Overlay
            isVisible={this.state.imageOverlayVis}
            onBackdropPress={() => {
              this.setState({ imageOverlayVis: !this.state.imageOverlayVis });
            }}
            overlayStyle={{
              width: "100%",
              backgroundColor: "rgba(0,0,0,0.8)",
              padding: 0,
            }}
          >
            <TouchableOpacity
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                height: "100%",
                width: "100%",
                zIndex: 20,
                overflow: "hidden",
              }}
              onPress={() => {
                this.setState({ imageOverlayVis: !this.state.imageOverlayVis });
              }}
            ></TouchableOpacity>
            <ImageBackground
              source={{ uri: base64text[this.state.selectedIndex] }}
              style={{
                width: "100%",
                height: "100%",
                justifyContent: "center",
                alignItems: "center",
                alignSelf: "center",
                zIndex: 10,
              }}
              resizeMode="contain"
            ></ImageBackground>
          </Overlay>
        );
      } else {
        return null;
      }
    } else {
      return null;
    }
  }
  render() {
    return (
      <SafeAreaView style={styles.container}>
        {this.commentOverlay()}
        {this.imageOverlay()}
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
            <FlashMessage ref="myLocalFlashMessage1" />
          </View>

          <ScrollView>
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
              }}
            >
              {this.renderTitle()}
              {this.renderImage()}
              {this.renderText()}
              {this.renderLikesCommentsNumber()}
              {this.renderSpacer()}
              {this.renderComments()}
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
  mainHeading: {
    textAlign: 'center'
  },
  mainHeadingText: {
    fontSize: 16,
    fontWeight: '500',
    backgroundColor: '#f2f2f2',
    padding: 10
  }
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

export default connect(mapStateToProps, mapDispatchToProps)(ShowQuote);

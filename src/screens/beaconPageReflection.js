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
  ImageBackground,
  Platform,
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
// import moment from "moment";
import moment from "moment-timezone";
import MyFooter from "../components/centerComp";
import Spinner from "react-native-loading-spinner-overlay";
import {
  likeQuote,
  dislikeQuote,
  getRandomQuote,
  fetchrecentlySearched,
  addRecentlySearched,
  deleteRecentlySearched,
} from "../func/quotes";
import { getOneUser } from "../func/findUsers";
import {
  getReflection,
  likeReflection,
  dislikeReflection,
  addCommentReflection,
  replyToCommentReflection,
  likeCommentReflection,
  dislikeCommentReflection,
} from "../func/reflections";
import { fetchSettingsInfo } from "../func/userSettings";
import RBSheet from "react-native-raw-bottom-sheet";

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

class BeaconPageReflection extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      notifications: [],
      loading: false,
      doWeLikeIt: false,
      reflection: null,
      commentOverlayVis: false,
      comment: "",
      chosenCommentID: "",
      chosenCommentType: 0,
      timezone: "Europe/Belfast",
      reflectionImage: "",
      replies: [],
      chosenReplyID: "",
      searchTreeKey: "",
      chosenTotalData: [],
    };
  }

  async componentDidMount() {
    await this.fetchReflection();
    await this.setTimezone();
  }
  async setTimezone() {
    let resp = await fetchSettingsInfo(this.props.user.authKey);
    if (resp) {
      this.setState({ timezone: resp.timezone });
    }
  }
  capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  async fetchReflection() {
    this.setState({ loading: true });
    let resp = await getReflection(this.props.user.authKey);
    if (resp) {
      this.setState(
        {
          reflection: resp.ref,
          loading: false,
          reflectionImage: resp.ref.imageurl,
        },
        () => {
          this.checkIfLiked();
        }
      );
    }
  }
  checkIfLiked() {
    let liked = false;
    if (this.state.reflection != null) {
      for (let i = 0; i < this.state.reflection.likedBy.length; i++) {
        if (this.state.reflection.likedBy[i] == this.props.user.uuID) {
          liked = true;
        }
      }
      this.setState({ doWeLikeIt: liked });
    }
  }

  async handleRespect(type) {
    //0 like,1 dislike
    let resp = null;
    if (type) {
      resp = await likeReflection(this.props.user.authKey);
    } else {
      resp = await dislikeReflection(this.props.user.authKey);
    }
    if (resp) {
      await this.fetchReflection();
    }
  }
  showLikesComments() {
    return (
      <View
        style={{
          flexDirection: "row",
          marginHorizontal: "5%",
          marginTop: "2%",
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Icon name="heart" type="font-awesome" size={20} color="black" />
          <Text style={{ color: "black", marginLeft: "2%", fontSize: 20 }}>
            {this.state.reflection.likes}
          </Text>
        </View>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Icon
            name="comment"
            type="material-community"
            size={20}
            color="black"
          />
          <Text style={{ color: "black", marginLeft: "2%", fontSize: 20 }}>
            {this.state.reflection.comments.length}
          </Text>
        </View>
      </View>
    );
  }
  showRespectButton() {
    if (!this.state.doWeLikeIt) {
      return (
        <TouchableOpacity
          style={{ flexDirection: "row", alignItems: "center" }}
          onPress={() => {
            this.handleRespect(1);
          }}
        >
          <Icon name="heart" type="font-awesome" size={18} color="#3f32d2" />
          <Text style={{ color: "#3f32d2", fontSize: 18, fontWeight: "bold" }}>
            {this.props.translateText("beacon.respect")}
          </Text>
        </TouchableOpacity>
      );
    } else {
      return (
        <TouchableOpacity
          style={{ flexDirection: "row", alignItems: "center" }}
          onPress={() => {
            this.handleRespect(0);
          }}
        >
          <Icon name="dislike1" type="antdesign" size={18} color="red" />
          <Text style={{ color: "red", fontSize: 18, fontWeight: "bold" }}>
            {this.props.translateText("beacon.dislike")}
          </Text>
        </TouchableOpacity>
      );
    }
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
  showButtons() {
    return (
      <View
        style={{
          flexDirection: "row",
          marginTop: "4%",
          alignSelf: "center",
          borderTopWidth: 1,
          borderBottomWidth: 1,
          borderColor: "#dbdbdb",
          padding: "2%",
          justifyContent: "space-between",
          width: "90%",
        }}
      >
        <TouchableOpacity
          style={{ flexDirection: "row", alignItems: "center" }}
          onPress={() => {
            this.setState({ commentOverlayVis: true, chosenCommentType: 0 });
          }}
        >
          <Icon
            name="comment"
            type="material-community"
            size={18}
            color="gray"
          />
          <Text style={{ color: "gray", fontSize: 18, fontWeight: "bold" }}>
            {this.props.translateText("beacon.comment")}
          </Text>
        </TouchableOpacity>
        {this.showRespectButton()}
        <TouchableOpacity
          style={{ flexDirection: "row", alignItems: "center" }}
          onPress={() => {
            this.props.navigation.navigate("ReportReflection", {
              reflectionID: this.state.reflection._id,
            });
          }}
        >
          <Icon name="flag" type="font-awesome" size={18} color="red" />
          <Text style={{ color: "red", fontSize: 18, fontWeight: "bold" }}>
            {this.props.translateText("beacon.report")}
          </Text>
        </TouchableOpacity>
      </View>
    );
  }
  showImageText() {
    let imgWidth = parseInt(Dimensions.get("window").width * 0.96);
    let imgHeight = parseInt(Dimensions.get("window").height * 0.4);
    let base64 = this.state.reflectionImage;
    return (
      <View style={{ alignSelf: "center" }}>
        <ImageBackground
          source={{ uri: base64 }}
          style={{
            width: imgWidth,
            height: imgHeight,
            alignItems: "center",
            alignSelf: "stretch",
            justifyContent: "center",
          }}
          resizeMode="cover"
          imageStyle={{ borderTopLeftRadius: 20, borderTopRightRadius: 20 }}
        >
          <Text
            style={{
              fontSize: 20,
              color: this.state.reflection.fontColor,
              textAlign: "center",
            }}
          >
            {this.state.reflection.reflectionText}
          </Text>
        </ImageBackground>
      </View>
    );
  }

  /*renderOneCommentOfComment(item,iterator){
    let name=item.addedBy.split(' ')
    let firstName=this.capitalizeFirstLetter(name[0])
    let lastname=this.capitalizeFirstLetter(name[1])
    let username=this.capitalizeFirstLetter(firstName)+' '+this.capitalizeFirstLetter(lastname[0])+'.'
    let addedat=this.getDateText(item.addedAt)
    return(
    <View key={ iterator} style={{width:'70%',alignSelf:'flex-start',alignItems:'flex-start',marginTop:'5%',marginLeft:'20%'}}>
        <View style={{flexDirection:'row'}}>
            {this.showAvatar(item.avatarURI,item.addedByUuid)}
            <View style={{marginHorizontal:'5%'}}> 
                <View style={{flexDirection:'row',alignItems:'center'}}>
                    <Text style={{fontWeight:'bold',fontSize:18}}>{username}</Text>
                    <Text style={{fontSize:12,marginLeft:'10%'}}>{addedat}</Text>  
                </View>
                <Text style={{textAlign:'justify',marginRight:'10%'}}>{item.replyText}</Text>
            </View>
        </View>
    </View>
    )
}*/

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
              {item.replyText.split("_")[0]}
            </Text>
          </View>
        </View>
        {this.showTreeRespectDislikeComment(dataAJH, item)}
      </View>
    );
  }

  renderCommentsOfComment() {
    let data = this.state.replies;
    if (this.state.searchTreeKey == "" && data) {
      let beforeReverse = data.replies;
      let afterReverse = [].concat(beforeReverse);
      return (
        <View>
          {afterReverse.map(
            (item, i) =>
              typeof item === "object" &&
              item.replyText.search(data.addedAt) >= 0 &&
              this.renderOneCommentOfComment(item, i, data)
          )}
        </View>
      );
    }

    if (this.state.searchTreeKey != "" && data) {
      return (
        <View>
          {data.map((item, i) => this.renderOneCommentOfComment(item, i, data))}
        </View>
      );
    }
  }

  renderLikesCommentsNumberReply(data) {
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
          onPress={() => {
            this.setState({ chosenCommentID: data.commentID });
            this.setState({
              commentOverlayVis: true,
              chosenCommentType: 1,
              chosenReplyID: data.addedAt,
            });
          }}
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
            <Text>PP</Text>
            {this.props.translateText("showQuote.reply")}
          </Text> */}
        </TouchableOpacity>
        {/* {this.showRespectDislikeComment(data)} */}
      </View>
    );
  }

  async handleLikeComment(data) {
    this.setState({ loading: true });
    let resp = await likeCommentReflection(
      this.props.user.authKey,
      data.commentID
    );

    if (resp) {
      await this.fetchReflection();
    }
    this.setState({ loading: false });
  }
  async handleDislikeComment(data) {
    this.setState({ loading: true });
    let resp = await dislikeCommentReflection(
      this.props.user.authKey,
      data.commentID
    );

    if (resp) {
      await this.fetchReflection();
    }
    this.setState({ loading: false });
  }
  async handleAddComment() {
    // type 0-comment quote type 1-reply to comment
    if (this.state.chosenCommentType == 1) {
      console.log(
        "test_reply========================>",
        this.state.chosenCommentID
      );
      console.log(this.state.comment + "_" + this.state.chosenReplyID);
      this.setState({ loading: true, commentOverlayVis: false });
      let resp = await replyToCommentReflection(
        this.props.user.authKey,
        this.state.comment + "_" + this.state.chosenReplyID,
        this.state.chosenCommentID
      );

      if (resp) {
        await this.fetchReflection();
      }
      this.setState({ loading: false, comment: "" });
    }
    if (this.state.chosenCommentType == 0) {
      this.setState({ loading: true, commentOverlayVis: false });
      let resp = await addCommentReflection(
        this.props.user.authKey,
        this.state.comment
      );

      if (resp) {
        await this.fetchReflection();
      }
      this.setState({ loading: false, comment: "" });
    }
  }

  showTreeRespectDislikeComment(data, item) {
    let treeData =
      typeof this.state.chosenTotalData === "object" &&
      this.state.chosenTotalData.filter(
        (tree) => tree.replyText.search(item.addedAt) >= 0
      );
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
              chosenReplyID: item.addedAt,
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
              console.log("??????????????????????", this.state.chosenCommentID);
              this.showReplies(treeData);
              this.setState({ searchTreeKey: item.addedAt });
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

  showRespectDislikeComment(data) {
    if (data.likedBy.includes(this.props.user.uuID)) {
      return (
        <View>
          <TouchableOpacity
            style={{ flexDirection: "row" }}
            onPress={() => {
              this.handleDislikeComment(data);
            }}
          >
            <Icon
              name="ios-heart"
              type="ionicon"
              size={15}
              color="red"
              style={{ marginLeft: "15%" }}
            />
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
          <Icon
            name="ios-heart"
            type="ionicon"
            size={15}
            color="#3f32d2"
            style={{ marginLeft: "15%" }}
          />
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
            {this.props.translateText("beacon.add_your_comment")}
          </Text>
          <TextInput
            placeholder={this.props.translateText("beacon.add_comment")}
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
              {this.props.translateText("beacon.post")}
            </Text>
          </TouchableOpacity>
        </View>
      </Overlay>
    );
  }
  showAvatar(ava, uuID, bgColor) {
    if (ava == "" || ava == false) {
      let img = require("../images/defaultAvatar.jpg");
      return (
        <TouchableOpacity
          style={{
            borderRadius: 30,
            width: 40,
            height: 40,
            backgroundColor: bgColor ? "#f2f2f2" : "#fff",
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
            backgroundColor: bgColor ? "#f2f2f2" : "#fff",
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
              {/*data.addedByUuid === this.props.user.uuID ? (
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
              ) : null*/}
              <Text style={{ fontSize: 10, marginLeft: "10%" }}>{addedat}</Text>
            </View>
            <Text style={{ textAlign: "justify", marginRight: "10%" }}>
              {data.commentText.split("_")[0]}
            </Text>
            {this.renderLikesCommentsNumberReply(data)}
          </View>
        </View>
        {data.replies.length ? (
          <TouchableOpacity
            style={{ marginLeft: "20%", marginVertical: "2%" }}
            onPress={() => {
              this.showReplies(data);
              this.setState({ searchTreeKey: "" });
              this.setState({ chosenCommentID: data.commentID });
              this.setState({ chosenTotalData: data.replies });
            }}
          >
            <Text style={{ fontSize: 13, color: "red", fontWeight: "700" }}>
              {/* {data.replies.length} 22REPLIES */}
              {data.replies.length}REPLIES
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
    let beforReverse = this.state.reflection.comments;
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
            {/* <Text style={styles.mainHeadingText}>Replies ###+++</Text> */}
            <Text style={styles.mainHeadingText}>Replies</Text>
          </View>
          <ScrollView>{this.renderCommentsOfComment()}</ScrollView>
        </RBSheet>
      </View>
    );
  }

  showReflection() {
    if (!this.state.loading) {
      if (this.state.reflection != null) {
        return (
          <View
            style={{
              backgroundColor: "white",
              marginTop: "5%",
              width: "96%",
              alignSelf: "center",
              borderRadius: 20,
              elevation: 20,
              marginBottom: 10,
            }}
          >
            {this.showImageText()}

            {this.showLikesComments()}
            {this.showButtons()}
            {!this.state.loading &&
              this.state.reflection != null &&
              this.renderComments()}
          </View>
        );
      } else {
        return null;
      }
    } else {
      return (
        <View
          style={{
            backgroundColor: "white",
            marginTop: "5%",
            width: "96%",
            alignSelf: "center",
            height: "60%",
            borderRadius: 20,
            elevation: 20,
            paddingVertical: "5%",
          }}
        >
          <Text></Text>
        </View>
      );
    }
  }

  render() {
    return (
      <SafeAreaView style={styles.container}>
        {this.commentOverlay()}
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
              BEACON
            </Text>
            <View style={{ flexDirection: "row" }}>
              <TouchableOpacity
                onPress={() => {
                  this.props.navigation.navigate("BeaconPageQuotes");
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
                    {this.props.translateText("beacon.quotes")}
                  </Text>
                </View>
              </TouchableOpacity>
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
                    {this.props.translateText("beacon.refcention")}
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
          <ScrollView>{this.showReflection()}</ScrollView>
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
    marginTop: Platform.OS !== "ios" ? 30 : 0,
  },
  mainHeading: {
    textAlign: "center",
  },
  mainHeadingText: {
    fontSize: 16,
    fontWeight: "500",
    backgroundColor: "#f2f2f2",
    padding: 10,
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

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(BeaconPageReflection);

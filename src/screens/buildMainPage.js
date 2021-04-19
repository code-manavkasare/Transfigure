
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
import { getUserPostsOfDay } from "../func/quotes";
import Beacon from "react-native-vector-icons/MaterialCommunityIcons";
import MyFooter from "../components/centerComp";
import Spinner from "react-native-loading-spinner-overlay";
import { Thumbnail, Badge, Container, Content } from "native-base";
import moment from "moment";
import { Svg, Polyline, Circle, parse } from "react-native-svg";
import Calendars from "../components/calendars";
import MonthSelectorCalendar from "react-native-month-selector";

class BuildMainPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      posts: [],
      loading: false
    };
  }

  getRandomColor() {
	  var letters = '0123456789ABCDEF';
	  var color = '#';
	  for (var i = 0; i < 6; i++) {
	    color += letters[Math.floor(Math.random() * 16)];
	  }
	  return color;
	}

	async componentWillMount() {
		this.props.navigation.addListener('focus', async () => {
      this.setState({ loading: true });
	    await this.getFullQuotes();
	    this.setState({ loading: false });
    });

    this.props.navigation.addListener('blur', async () => {
      //this.setState({posts: []})
    });
  }

	async getFullQuotes() {
    let posts = null;
    let uuID = this.props.route.params.uuID;

    console.log(uuID, 'uuID')

    let resp = await getUserPostsOfDay(this.props.user.authKey, uuID, this.props.route.params.date);
    console.log(resp, 'resp test')
    if (resp) {
      posts = resp.posts;
    }

    this.setState({ posts: posts });
  }

  renderText(text) {
  	let maxlimit = 50;
		return <Text style={{padding: 5}}>{ ((text).length > maxlimit) ? 
		  (((text).substring(0,maxlimit-3)) + '...') : text }
			</Text>
  }

  renderAllBuilds() {
  	let {posts} = this.state;

  	console.log(posts, 'posts test')

  	if (posts && posts.length) {
  		return posts.map((item, i) => {
  			if (i === 0) {
  				return <View style={styles.mainBuild} key={i}>
      			<TouchableOpacity style={[styles.innerBuildCon, !item.imageURI.length && {alignItems: 'center', justifyContent: 'center'}]} onPress={() => this.goToDetail(item.quoteID)}>
      				{item.imageURI.length && <View style={styles.imageBox}>
      				      					<Image source={{uri: item.imageURI[0]}} style={styles.imageItem} />
      				      				</View>}
      				{this.renderText(item.quoteText)}
      				<View style={styles.commentsSection}>
      					<Icon
	                name="comment"
	                type="material-community"
	                size={13}
	                style={styles.commentIcon}
	                color="gray"
	              />
      					<Text style={styles.commentText}>{item.comments.length}</Text>
      					<Icon
	                name="heart"
	                type="font-awesome"
	                size={13}
	                style={styles.commentIcon}
	                color="gray"
	              />
      					<Text style={styles.commentText}>{item.likes}</Text>
      				</View>
      			</TouchableOpacity>
      		</View>
  			} else {
  				return 	<View style={styles.otherBuild} key={i}>
      			<TouchableOpacity style={[styles.innerBuildCon, {borderColor: this.getRandomColor()}, !item.imageURI.length && {alignItems: 'center', justifyContent: 'center'}]} onPress={() => this.goToDetail(item.quoteID)}>
      				{item.imageURI.length && <View style={styles.imageBox}>
      				      					<Image source={{uri: item.imageURI[0]}} style={styles.imageItem} />
      				      				</View>}
      				{this.renderText(item.quoteText)}
      				<View style={styles.commentsSection}>
      					<Icon
	                name="comment"
	                type="material-community"
	                size={13}
	                style={styles.commentIcon}
	                color="gray"
	              />
      					<Text style={styles.commentText}>{item.comments.length}</Text>
      					<Icon
	                name="heart"
	                type="font-awesome"
	                size={13}
	                style={styles.commentIcon}
	                color="gray"
	              />
      					<Text style={styles.commentText}>{item.likes}</Text>
      				</View>
      			</TouchableOpacity>
      		</View>
  			}
  		})
  	} else if(!this.state.loading) {
  		return <View style={{justifyContent: 'center', alignItems: 'center', textAlign: 'center', width: '100%'}}>	
  			<Text style={{fontSize: 20, textAlign: 'center', marginTop: 30}}>No Build Found</Text>
  		</View>
  	}
  }

  goToDetail(id) {
  	this.props.navigation.navigate("ShowQuote", {
      quoteID: id
    });
  }

  
  render() {
  	console.log(this.props, 'props')
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
              BUILDS({moment(this.props.route.params.date).format('DD-MM-YYYY')})
            </Text>
          </View>
          <ScrollView>
          	<View style={styles.buildCon}>
          		{this.renderAllBuilds()}
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
  buildCon:{
  	flexDirection: 'row',
  	flexWrap: 'wrap',
  	padding: 2.5
  },
  mainBuild: {
  	width: '100%',
  	height: 150,
  	padding: 5
  },
  otherBuild:{
  	width: '50%',
  	height: 150,
  	padding: 5
  },
  innerBuildCon: {
  	width: '100%',
  	height: '100%',
  	borderWidth: 3,
  	//alignItems: 'center',
  	//justifyContent: 'center',
  	borderColor: '#ed6e62',
  },
  commentsSection: {
  	position: 'absolute',
  	bottom: 5,
  	right: 5,
  	flexDirection: 'row'
  },
  commentText:{
  	top: -2,
  	marginLeft: 2,
  	fontSize: 13
  },
  commentIcon: {
  	marginLeft: 8,
  	color: 'gray'
  },
  imageBox: {
  	backgroundColor: '#e9eaec',
  	height: 80,
  	width: '100%'
  },
  imageItem: {
  	width: '100%',
  	height: '100%'
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

export default connect(mapStateToProps, mapDispatchToProps)(BuildMainPage);

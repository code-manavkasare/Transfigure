import React from 'react'
import { View, TextInput, StyleSheet,Text, TouchableOpacity,Image, Alert,SafeAreaView ,Dimensions, Settings, ScrollView,Switch ,FlatList, Platform} from 'react-native'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { updateKey, translateText } from '../actions/user'
import {Header,Icon,Overlay,Input,Avatar  } from 'react-native-elements';
import Beacon from 'react-native-vector-icons/MaterialCommunityIcons';
import moment from "moment-timezone"
import {fetchSettingsInfo} from '../func/userSettings'
import MyFooter from '../components/centerComp'
import Spinner from 'react-native-loading-spinner-overlay';
import { Badge } from 'native-base';
import { getMyPostsNotification,getNotifLength,deleteNotification } from '../func/notifications'

import { LogBox } from "react-native";

import { Container, Content, List, ListItem, Left, Body, Right, Thumbnail} from 'native-base';


class NotificationsMyPosts extends React.Component {
  constructor(props) {
    super(props);
this.state={notifications:[],loading:true,timezone:'Europe/Belfast',lengthOfAllNotif:0} 


///we need to change that notifications
 
  }
async  componentDidMount() {
     LogBox.ignoreAllLogs(true);

await this.setTimezone()
await this.fetchNotifications()
await this.fetchNotificationsLength()
// this.transformNotifications()
this.setState({loading:false})
  }
  async setTimezone(){
    let resp=await fetchSettingsInfo(this.props.user.authKey)
    if(resp){
        this.setState({timezone:resp.timezone})
    }
  }
  async fetchNotifications(){
    let resp=await getMyPostsNotification(this.props.user.authKey);
    console.log(resp, 'resp')
    if(resp){
        let transformed=[]
        for(let j=0;j<resp.length;j++){
            transformed.push({item:{notification:resp[j]},key:j.toString()})
        }
        let beforeReverse=transformed
        let afterReverse=[].concat(beforeReverse).reverse()
        this.setState({notifications:afterReverse})
        
    }
      }
      async fetchNotificationsLength(){
        let resp=await getNotifLength(this.props.user.authKey);
        if(resp){
            this.setState({lengthOfAllNotif:resp})
        }
        else{
            this.setState({lengthOfAllNotif:0})
        }
          }
 transformNotifications(){

    // -2 user posted comment under quote --my posts
    // -4 someone liked our quote --my posts



    if('notifications' in this.props.user){
    let notifications=this.props.user.notifications
    let newNotifications=[]
    //here we should also filter our notifications
    for(let i=0;i<notifications.length;i++){
        if([2,4].includes(parseInt(notifications[i].action))){ //filter our all posts notifications
            if('quoteID' in notifications[i]){
                let id=notifications[i].quoteID
                let quote=this.props.user.quotes[id]
                let likes=quote.likes
                let comments=quote.comments.length
                newNotifications.push({item:{notification:notifications[i],likes:likes,comments:comments},key:i.toString()});
            }
            else{
                newNotifications.push({item:{notification:notifications[i]},key:i.toString()});
            }
        }
    }
    


    this.setState({notifications:newNotifications})
}
  }


 getDateText(date){
    moment.tz.setDefault(this.state.timezone)
    let duration = moment.duration(moment().diff(moment( date).startOf('day'))).asHours();
    let splitedDate=moment(date).format('DD-MM-YYYY h:mm a').split(' ')
    let dateText=''
    if(duration<=24){
        dateText=this.props.translateText("notification.today_at") +' '+splitedDate[1]+' '+splitedDate[2]
    }
    if(duration>24 && duration<=48){
        dateText=this.props.translateText("notification.yesterday_at") + ' '+splitedDate[1]+' '+splitedDate[2]
    }
    if(duration>48){
        dateText=splitedDate[0]+' ' + this.props.translateText("notification.at") + ' ' +splitedDate[1]+' '+splitedDate[2]
    }
    return dateText
 }


actionToText(notification){
    let actionText=''
    switch(notification.action){
        case 2:actionText=this.props.translateText("notification.commented_your_quote")
            break;
        case 4:actionText=this.props.translateText("notification.liked_your_quote")
            break;

        default:break;
    }
    return actionText;
}
showLikesComments(data){
        return(
            <View style={{flexDirection:'row',alignItems:'center',alignSelf:'flex-start'}}>
                <Icon name='comment' type='material-community' size={15} color='gray'  />
                <Text style={{fontWeight:'bold'}}>{data.notification.comments}</Text>
                <Icon name='heart' type='font-awesome' size={15} color='gray' style={{marginLeft:'10%'}} />
                <Text style={{fontWeight:'bold'}}>{data.notification.likes}</Text>
            </View>
        )
}


async handleCardPress(data){
    let action=data.notification.action
    let resp1=''
    let resp2=''

    switch(action){
        case 2://commented our quote
             resp1=await deleteNotification(this.props.user.authKey,data.notification.notificationID)
            if(resp1){
                this.setState({loading:true})
                await this.fetchNotifications()
                await this.fetchNotificationsLength()
                this.setState({loading:false})
                this.props.navigation.navigate('ShowQuote',{quoteID:data.notification.quoteID});
            }
            
            break;
        case 4://user replied to our comment
             resp2=await deleteNotification(this.props.user.authKey,data.notification.notificationID)
            if(resp2){
                this.setState({loading:true})
                await this.fetchNotifications()
                await this.fetchNotificationsLength()
                this.setState({loading:false})
                this.props.navigation.navigate('ShowQuote',{quoteID:data.notification.quoteID});
            }
            break;
    }

}
showBottomActions(data){
    let action=data.notification.action

    if(action==2){//user posted comment under quote

        return(this.showLikesComments(data))
   
    }
    if(action==4){//someone liked our quote
        return(this.showLikesComments(data))
    }

}
showNotificationBadge(whichSide){
    let myPostsNotifications=this.state.notifications.length
    let allPostsNotifications=this.state.lengthOfAllNotif-myPostsNotifications
    


    if(whichSide){
        if(myPostsNotifications>0){
        return(
            <Badge warning style={{marginLeft:'5%'}} visible={false}>
                <Text style={{fontSize:17,color:'white'}}>{myPostsNotifications}</Text>
            </Badge>
        )
        }
        else{
            return(null)
        }
    }
    else{
        if(allPostsNotifications>0){
            return(
                <Badge warning style={{marginLeft:'5%'}} visible={false}>
                    <Text style={{fontSize:17,color:'white'}}>{allPostsNotifications}</Text>
                </Badge>
            )
            }
            else{
                return(null)
            }
    }

}
showAvatarBase64(ava){
     
    if (ava=='' || ava==false){
        let img=require('../images/defaultAvatar.jpg')
        return(
        <Thumbnail source={img} style={{marginHorizontal:'5%'}}/>
        )
    }
    else{
        
        let myuri=ava
        return(
        <Thumbnail source={{uri: myuri}} style={{marginHorizontal:'5%'}}/>
        )
    }
    
}
renderRow(data){
    console.log(this.state.notifications, 'data')
    let notification=data.item.item.notification    
    let dateText=this.getDateText(notification.addedAt)
    let splitedName=notification.name.split(' ')
    let fixedName=''
    if(splitedName[0]!=undefined &&splitedName[1][0]!=undefined){
         fixedName=splitedName[0]+' '+splitedName[1][0]+'.'

    }
    else{
        fixedName='user'
    }
    let actionText=this.actionToText(notification) 

    return(

    <TouchableOpacity style={{width:'90%',borderRadius:10,elevation:10,backgroundColor:'white',
    alignItems:"center",alignSelf:'center',paddingVertical:'5%',flexDirection:'row',marginBottom:'5%'}} onPress={()=>{this.handleCardPress(data.item.item)}} disabled={[0].includes(parseInt(notification.action))}>
    
        
        {this.showAvatarBase64(notification.avatarURI)}
        
        <View style={{marginRight:'15%'}}>
       
            <View style={{alignSelf:'center'}}>
                <View style={{flexDirection:'row',alignItems:'center'}} >
                    <Text style={{fontSize:20,fontWeight:'bold'}}>{fixedName} </Text>
                    <Text note style={{fontSize:12}}>{dateText} </Text>
                </View>
                <Text style={{fontSize:17}}>{ actionText} </Text>
                {this.showBottomActions(data.item.item)}
            </View>
            
        
        </View>

       
  </TouchableOpacity>
        )
}
    render() {
        return (

            <SafeAreaView style={styles.container}>
                <View style={{flex:1}}>
                    <View style={styles.upperPart}>
                        <View style={{flexDirection:'row',justifyContent:'space-between',paddingHorizontal:'5%'}}>
                            <Icon name='arrowleft' type='antdesign' size={30} color='white' backgroundColor='#6a5df5' style={{borderRadius:50}} onPress={()=>{this.props.navigation.goBack()}} />
                            {/* <Beacon name="lighthouse" size={50} color="#f07c4a"/> */}
                            <Image source={require('../images/przezroczyste.png')} style={{width:parseInt(Dimensions.get('window').width*0.2),height:parseInt(Dimensions.get('window').height*0.1),alignSelf:'center',marginTop:'-2%',backgroundColor:'transparent'}} resizeMode='cover' />

                            <Icon name='cog' type='font-awesome' size={30} color='white' onPress={()=>{ this.props.navigation.navigate('Settings')}} />
                        </View>
                        <View style={{flexDirection:'row'}}>
                            <TouchableOpacity onPress={()=>{this.props.navigation.navigate('NotificationsAllPosts')}} style={{flex:0.5}} >
                                <View style={{alignSelf:'center',marginTop:'5%',flexDirection:'row',alignItems:'center',padding:5}}>
                                    <Text  style={{fontSize:17,color:'white'}}>{this.props.translateText("notification.all")}</Text>
                                    {this.showNotificationBadge(0)}
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={()=>{this.props.navigation.navigate('NotificationsMyPosts')}}  style={{flex:0.5,borderBottomColor:'white',borderBottomWidth:5}}>
                                <View style={{alignSelf:'center',marginTop:'5%',flexDirection:'row',alignItems:'center',padding:5}}>
                                    <Text  style={{fontSize:17,color:'white'}}>{this.props.translateText("notification.my_posts")}</Text>
                                    {this.showNotificationBadge(1)}
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <Spinner
                        visible={this.state.loading}
                        textContent={this.props.translateText("beacon.loading")}
                       
                    />
                    <FlatList 
                        style={{marginTop:'5%'}}
                        data={this.state.notifications}
                        renderItem={(data) =>this.renderRow(data)}
                        keyExtractor={item => item.key}
                    />

                    

                </View>
 
                <MyFooter parentProps={this.props}/>
            </SafeAreaView>
            
            
            

        )
    } 
}

const styles = StyleSheet.create({
    container: {

        backgroundColor: '#f5f5f5',
        flex: 1,
    },
    upperPart:{
        backgroundColor:'#3f32d2',
        paddingTop:'5%',
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

})

const mapDispatchToProps = dispatch => {
    return bindActionCreators({ updateKey, translateText }, dispatch)
}

const mapStateToProps = state => {
    return {
        user: state.user
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(NotificationsMyPosts)
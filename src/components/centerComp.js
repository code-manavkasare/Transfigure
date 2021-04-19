import React, { Component } from 'react';
import {Header,Icon,withBadge } from 'react-native-elements';
import { View} from 'react-native'



class MyFooter extends Component {
  constructor(props) {
    super(props)
    this.state={notificationCount:null,colors:['gray','gray','gray','gray','gray'],parentName:''}
}
 componentDidMount(){
    this.checkActive()
    // if('notifications' in this.props.parentProps.user){
    // this.setState({notificationCount:this.props.parentProps.user.notifications.length})
    // }
}


checkActive(){
    let colorr=this.state.colors
    switch(this.props.parentProps.route.name){
        
        case 'Main':colorr[0]='#3f32d2'
                    this.setState({colors:colorr})
                    break;
        case 'CreatePost':colorr[0]='#3f32d2'
                    this.setState({colors:colorr})
                    break;
        case 'Settings':colorr[0]='#3f32d2'
                    this.setState({colors:colorr})
                    break;
        case 'UpdateBio':colorr[0]='#3f32d2'
                    this.setState({colors:colorr})
                    break;
        case 'SettingsMirrorReflection':colorr[0]='#3f32d2'
                    this.setState({colors:colorr})
                    break;
        case 'SettingsUpdatePassword':colorr[0]='#3f32d2'
                    this.setState({colors:colorr})
                    break;
        case 'SettingsDeleteAccount':colorr[0]='#3f32d2'
                    this.setState({colors:colorr})
                    break;              
        case 'NotificationsAllPosts':colorr[4]='#3f32d2'
                    this.setState({colors:colorr})
                    break;
        case 'FindFriends':colorr[3]='#3f32d2'
                    this.setState({colors:colorr})
                    break;
        case 'UserPage':colorr[3]='#3f32d2'
                    this.setState({colors:colorr})
                    break;
        case 'NotificationsMyPosts':colorr[4]='#3f32d2'
                    this.setState({colors:colorr})
                    break;
        case 'BuildPage':colorr[1]='#3f32d2'
                    this.setState({colors:colorr})
                    break;
        case 'BeaconPageQuotes':colorr[2]='#3f32d2'
                    this.setState({colors:colorr})
                    break;
        case 'BeaconPageReflection':colorr[2]='#3f32d2'
                    this.setState({colors:colorr})
                    break;
                    
    }
    
}
renderCenter(){
    return(
        <View style={{flexDirection:'row',justifyContent:'space-between',width:'90%'}}>
            <Icon name='hammer' type='font-awesome-5' size={30}  color={this.state.colors[1]}  onPress={()=>{this.props.parentProps.navigation.navigate('BuildPage')}}/>
            <Icon name='monument' type='font-awesome-5' size={30} color={this.state.colors[2]} onPress={()=>{this.props.parentProps.navigation.navigate('BeaconPageQuotes')}} />
            <Icon name='user-friends' type='font-awesome-5' size={30} color={this.state.colors[3]}  onPress={()=>{this.props.parentProps.navigation.navigate('FindFriends')}}/>
        </View>
    )
}


  render() {

    return(
        <View style={{backgroundColor:'#f5f5f5',height:'10%'}}>
            <Header containerStyle={{alignSelf:'flex-end',borderTopLeftRadius:50,borderTopRightRadius:50,elevation:20,backgroundColor:'white',paddingTop:0,justifyContent:'space-evenly',paddingHorizontal:'10%'}}>
                <Icon name='user' type='entypo' color={this.state.colors[0]} size={30}  onPress={()=>{this.props.parentProps.navigation.navigate('Main')}}/>
                {this.renderCenter()}
                <Icon name='bell' type='entypo' color={this.state.colors[4]} size={30} onPress={()=>{this.props.parentProps.navigation.navigate('NotificationsAllPosts')}} />

            </Header>
        </View>
    )
  }
}
export default MyFooter
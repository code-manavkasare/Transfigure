import React from 'react'
import { View, TextInput, StyleSheet,TouchableWithoutFeedback,Keyboard, TouchableOpacity, Text,Image, Alert,SafeAreaView ,Dimensions, Settings, ScrollView,Switch, Platform} from 'react-native'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { updateKey, translateText } from '../actions/user'
import {Header,Icon,Overlay,Input,Avatar  } from 'react-native-elements';
import Beacon from 'react-native-vector-icons/MaterialCommunityIcons';
import moment from "moment";
import MyFooter from '../components/centerComp'
import ParsedText from 'react-native-parsed-text';
import { RadioButton } from 'react-native-paper';
import ImagePicker from 'react-native-image-picker';
import {fetchDisplayName,fetchDisplayTitle,fetchMyBio,updateDisplayName,updateDisplayTitle,updateMyBio,setAvatar,getAvatar} from '../func/userSettings'
import Spinner from 'react-native-loading-spinner-overlay';

import { LogBox } from "react-native";
import {
    Menu,
    MenuOptions,
    MenuOption,
    MenuTrigger,
  } from 'react-native-popup-menu';

class UpdateBio extends React.Component {
  constructor(props) {
    super(props);
this.state={bgColor:'black',inputText:'',chosenColor:'black',avatarUri:'',displayName:'',displayTitle:'',biography:'',loading:false}




  }
  async componentDidMount() {
     LogBox.ignoreAllLogs(true);
    this.setState({loading:true})
    await this.fetchInfo()
    await this.fetchAvatar()
    this.setState({loading:false})
  }
  async fetchAvatar(){
    this.setState({loading:true})
    let resp=await getAvatar(this.props.user.authKey,this.props.user.uuID)

    if(resp){
      this.setState({avatarUri:resp})
    }
    this.setState({loading:false})

    
}

  async fetchInfo(){
      let myDisplayName= await fetchDisplayName(this.props.user.authKey)
      let myDisplayTitle= await fetchDisplayTitle(this.props.user.authKey)
      let myBio= await fetchMyBio(this.props.user.authKey)
      this.setState({displayName:myDisplayName,displayTitle:myDisplayTitle,biography:myBio})
  }
  async updateInfo(){
      this.setState({loading:true})
      if(this.state.displayName!=''){
          await updateDisplayName(this.props.user.authKey,this.state.displayName)
      }
      if(this.state.displayTitle!=''){
        await updateDisplayTitle(this.props.user.authKey,this.state.displayTitle)
    }
        if(this.state.biography!=''){
            await updateMyBio(this.props.user.authKey,this.state.biography)
        }
      await this.fetchInfo()
      this.setState({loading:false})
      this.props.navigation.goBack()
  }
 chooseImage(){
    const options = {
        title: 'Select Avatar',
        customButtons: [{ name: 'fb', title: 'Choose Photo from Facebook' }],
        storageOptions: {
          skipBackup: true,
          path: 'images',
        },
      };

    ImagePicker.showImagePicker(async (response) => {

      
        if (response.didCancel) {
          console.log('User cancelled image picker');
        } else if (response.error) {
          console.log('ImagePicker Error: ', response.error);
        } else if (response.customButton) {
          console.log('User tapped custom button: ', response.customButton);
        } else {
        this.setState({loading:true})
        let myresp=await setAvatar(this.props.user.authKey,response.data)
        if(myresp){
            await this.fetchAvatar()
        }
        this.setState({loading:false})

        }
      });
}


showAvatar(){
     
    if (this.state.avatarUri=='' || this.state.avatarURI==false){
        let img=require('../images/defaultAvatar.jpg')
        return(
            <Avatar size={parseInt(Dimensions.get('window').height*0.10)} source={img} showAccessory rounded onPress={()=>{this.chooseImage()}}  
        containerStyle={{position:'absolute',top:'20%',elevation:30,alignSelf:'center', marginTop:20}}
        />
        )
    }
    else{
        
        let myuri=this.state.avatarUri
        return(
            <Avatar size={parseInt(Dimensions.get('window').height*0.10)} source={{uri: myuri}} showAccessory rounded onPress={()=>{this.chooseImage()}}  
        containerStyle={{position:'absolute',top:'20%',elevation:30,alignSelf:'center', marginTop:20}}
        />
        )
    }
    
}
    render() {
        return (

<TouchableWithoutFeedback onPress={()=>{Keyboard.dismiss()}}>
            <SafeAreaView style={styles.container}>
                <View style={{flex:1}}>
                    <Spinner
                        visible={this.state.loading}
                        textContent={this.props.translateText("beacon.loading.en")}
                    />
                    <View style={styles.upperPart}>
                        <View style={{flexDirection:'row',justifyContent:'space-between',}}>
                            <Icon name='arrowleft' type='antdesign' size={50} color='white' backgroundColor='#6a5df5' style={{borderRadius:50}} onPress={()=>{this.props.navigation.goBack()}} />
                            {/* <Beacon name="lighthouse" size={50} color="#f07c4a"/> */}
                            <Image source={require('../images/przezroczyste.png')} style={{width:parseInt(Dimensions.get('window').width*0.2),height:parseInt(Dimensions.get('window').height*0.1),alignSelf:'center',marginTop:'-2%',backgroundColor:'transparent'}} resizeMode='cover' />
                            <Icon name='arrowleft' type='antdesign' size={50} color='#3f32d2'   />
                        </View>
                        <Text  style={{alignSelf:'center',fontSize:20,marginTop:'2%',color:'#f07c4a',fontWeight:'bold'}}>{this.props.translateText("updateBio.mybio")}</Text>
     
                            
                        
                    </View>
                    <View  style={{width:'100%'}}>
                        <View style={{width:'90%',height:'80%',backgroundColor:'white',alignSelf:'center',marginTop:'2%',elevation:20,borderRadius:10,paddingTop:'2%'}}>
                            <Text style={{alignSelf:'flex-start',marginLeft:'4%',fontWeight:'bold',fontSize:15}}>{this.props.translateText("updateBio.display_name")}</Text>
                            <Input
                            placeholder={this.props.translateText("updateBio.display_name")}
                            leftIcon={{type:'entypo',name:'user'}}
                            value={this.state.displayName}
                            onChangeText={value =>  this.setState({displayName:value})}
                            inputContainerStyle={{borderWidth:2,marginTop:'2%',marginLeft:'2%',alignSelf:'flex-start',paddingLeft:'2%',width:'98%',borderColor:'black'}}
                            />
                            <Text style={{alignSelf:'flex-start',marginLeft:'4%',fontWeight:'bold',fontSize:15,marginTop:'-4%'}}>{this.props.translateText("updateBio.display_title")}</Text>
                            <Input
                            placeholder={this.props.translateText("updateBio.display_title")}
                            leftIcon={{type:'font-awesome-5',name:'toolbox'}}
                            value={this.state.displayTitle}
                            onChangeText={value =>  this.setState({displayTitle:value})}
                            inputContainerStyle={{borderWidth:2,marginTop:'2%',marginLeft:'2%',alignSelf:'flex-start',paddingLeft:'2%',width:'98%',borderColor:'black'}}
                            />  

                            <Text style={{alignSelf:'flex-start',marginLeft:'4%',fontWeight:'bold',fontSize:15,marginTop:'-4%'}}>{this.props.translateText("updateBio.your_biography")}</Text>
                            <View style={{borderWidth:2,marginTop:'2%',marginLeft:'4%',alignSelf:'flex-start',paddingLeft:'2%',height:'30%',width:'92%'}}>
                                <TextInput
                                placeholder={this.props.translateText("updateBio.your_biography")}
                                value={this.state.biography}
                                onChangeText={value => this.setState({biography:value}) }
                                multiline={true}
                                maxLength={300}
                                style={{height:'72%'}}
                                />
                                <View style={{paddingBottom:'2%',alignItems:'flex-end',paddingRight:'2%',marginTop:'1%'}}>
                                    <Text>{this.state.biography.length} / 300</Text>
                                </View>
                            </View>

                            <TouchableOpacity onPress={()=>{this.updateInfo()}} style={{backgroundColor:'#3f32d2',flexDirection:'row',borderRadius:20,
                            alignItems:'center',width:'40%',padding:8,justifyContent:'center',alignSelf:'center',marginTop:'3%'}}>
                                <Icon name='check' type='antdesign' size={20} color='white'  />
                                <Text style={{color:'white',marginLeft:'10%',fontWeight:'bold'}}>{this.props.translateText("updateBio.update")}</Text>
                            </TouchableOpacity>
                        </View>

                    </View>
                </View>
                {this.showAvatar()}
                <MyFooter parentProps={this.props}/>
            </SafeAreaView>
            </TouchableWithoutFeedback>
            
            

        )
    } 
}

const styles = StyleSheet.create({
    container: {

        backgroundColor: '#f5f5f5',
        flex: 1,
    },
    circle:{
        position:'absolute',
        alignSelf:'center',
        width: '100%',
        height: '75%',
        bottom:'0%',
        backgroundColor:'#f5f5f5'
    },
    inputBox:{
        marginTop:'1%',
        alignSelf:'center',
        borderRadius:10,
        alignItems:'center',
        backgroundColor:'white',
        width:'95%',
        height:'75%',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 10,
        },
        shadowOpacity: 0.51,
        shadowRadius: 13.16,
        elevation: 20,
    },
    upperPart:{
        height:'30%',
        backgroundColor:'#3f32d2',
        paddingTop:'5%',
        paddingHorizontal:'5%',
        borderBottomLeftRadius:30,
        borderBottomRightRadius:30,
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
    curvedButton:{
        width:'80%',
        marginTop:'5%',
        backgroundColor:'#3f32d2',
        height:'20%',
        justifyContent:'center',
        alignItems:'center',
        borderBottomRightRadius:parseInt(Dimensions.get('window').height*0.2*0.4),
        borderTopLeftRadius:parseInt(Dimensions.get('window').height*0.2*0.4),
    }

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
)(UpdateBio)
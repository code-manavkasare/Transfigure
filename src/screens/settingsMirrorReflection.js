import React from 'react'
import { View, TextInput, StyleSheet, TouchableOpacity, Text,Image, Alert,SafeAreaView ,Dimensions, Settings, ScrollView,Switch,ImageBackground, Platform} from 'react-native'
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
import {fetchDisplayName} from '../func/userSettings'
import { updateInfo,fetchSettingsInfo,getAvatar} from '../func/userSettings'
import Spinner from 'react-native-loading-spinner-overlay';

import {
    Menu,
    MenuOptions,
    MenuOption,
    MenuTrigger,
  } from 'react-native-popup-menu';

class SettingsMirrorReflection extends React.Component {
  constructor(props) {
    super(props);
this.state={inputText:'',chosenColor:'white',avatarUri:'',imagechosen:false,imageUri:'',displayName:'',loading:false}




  }
  async componentDidMount() {
    console.disableYellowBox = true;
    this.setState({loading:true}) 
    let resp=await fetchDisplayName(this.props.user.authKey)
    await this.fetchSet()
    this.setState({displayName:resp,loading:false})

  }
  async fetchSet(){
    let resp=await fetchSettingsInfo(this.props.user.authKey)
if(resp){
    let mydefaults=resp.defaultMirrorReflection
    if(mydefaults.imageChosen==true){
        this.setState({imageUri:mydefaults.imageBase64,imagechosen:true})
    }
    else{
        this.setState({imageUri:'',imagechosen:false,chosenColor:mydefaults.backgroundColor})
    }
    let myav=await getAvatar(this.props.user.authKey,this.props.user.uuID)
    if(myav){
      this.setState({avatarUri:myav})
    }
}
  }


showAvatar(){
     
    if (this.state.avatarUri==''){
        let img=require('../images/defaultAvatar.jpg')
        return(
            <Avatar size={50} source={img}  rounded onPress={()=>{this.props.navigation.navigate('UpdateBio')}}/>
        )
    }
    else{
        
        let myuri=this.state.avatarUri
        return(
            <Avatar size={50} source={{uri: myuri}}  rounded onPress={()=>{this.props.navigation.navigate('UpdateBio')}}/>
        )
    }
    
}
showCheck(color){
    
    if(color==this.state.chosenColor){
        return (
            <Icon name='check' type='antdesign' size={30} color='white'    />
        )
    }
    else{
        return (
            <Icon name='check' type='antdesign' size={30} color={color}    />
        )
    }
    }

    makeSquare(color){
        
        return(
    
            <MenuOption onSelect={()=>{this.setState({chosenColor:color,imagechosen:false})}}>
            <View style={{backgroundColor:color,margin:10,borderRadius:5,marginBottom:5}}>
                {this.showCheck(color)}
             </View>    
            </MenuOption>
    
        )
    }
    showImage(){
        ImagePicker.showImagePicker((response) => {

          
            if (response.didCancel) {
              console.log('User cancelled image picker');
            } else if (response.error) {
              console.log('ImagePicker Error: ', response.error);
            } else if (response.customButton) {
              console.log('User tapped custom button: ', response.customButton);
            } else {

          
              // You can also display the image using data:
              // const source = { uri: 'data:image/jpeg;base64,' + response.data };
              
              this.setState({
                imageUri: response.data,imagechosen:true
              });
            }
          });
    }
showSquare(){

    if(!this.state.imagechosen){
    return(
        

        <View style={{backgroundColor:this.state.chosenColor,width:'90%',height:'60%',marginBottom:0,margin:'5%' ,alignItems: 'center',borderRadius:10}}>
             <Text style={{color:'white',fontWeight:'bold',fontSize:30,marginTop:'30%'}}>{this.state.displayName}</Text>
             <View style={{flexDirection:'row',alignSelf:'flex-start',marginTop:'20%'}}>
                <View style={{marginHorizontal:'5%',borderRadius:20,borderWidth:5,borderColor:'#6a5df5',backgroundColor:'#6a5df5'}}>
                    <Icon name='image' type='entypo' size={30} color='white' 
                    backgroundColor='#6a5df5' onPress={()=>{this.showImage()}}/>
                </View>
                <Menu>
                    <MenuTrigger  > 
                        <Icon name='square' type='font-awesome' size={30} color={this.state.chosenColor} backgroundColor='#6a5df5' style={{borderRadius:20,borderWidth:5,borderColor:'#6a5df5'}}/>
                    </MenuTrigger>
                    <MenuOptions>
                        <View style={{alignItems:'center'}}>
                            <View style={{borderBottomWidth:3,borderBottomColor:'gray'}}>
                                <Text>{this.props.translateText("settingsMirrorReflection.select_bg_color")}</Text>
                            </View>                                   
                            <View style={{alignItems:'center',flexDirection:'row'}}>
                                {this.makeSquare('black')}
                                {this.makeSquare('blue')}
                                {this.makeSquare('green')} 
                            </View>
                            <View style={{alignItems:'center',flexDirection:'row'}}>
                                {this.makeSquare('orange')}
                                {this.makeSquare('red')}
                                {this.makeSquare('yellow')} 
                            </View>
                            <View style={{alignItems:'center',flexDirection:'row'}}>
                                {this.makeSquare('purple')}
                                {this.makeSquare('cyan')}
                                {this.makeSquare('gray')} 
                            </View>
                        </View>
                    </MenuOptions>
                </Menu>
            </View>
        </View>
    )
    }
    else{
        let base64text=''
        if(this.state.imageUri.length<500){
            base64text=this.state.imageUri

        }
        else{
            base64text='data:image/png;base64,'+this.state.imageUri

        }
        return(
            <ImageBackground source={{uri:base64text}} style={{width:parseInt(Dimensions.get('window').width*0.9*0.9),height:parseInt(Dimensions.get('window').height*0.6*0.63),
            marginBottom:0,margin:'5%' ,alignItems: 'center',alignSelf:'stretch'}} resizeMode='cover' imageStyle={{borderRadius:10}}>
                 <Text style={{color:'white',fontWeight:'bold',fontSize:30,marginTop:'30%'}}>{this.state.displayName}</Text>
                 <View style={{flexDirection:'row',alignSelf:'flex-start',marginTop:'20%'}}>
                    <View style={{marginHorizontal:'5%',borderRadius:20,borderWidth:5,borderColor:'#6a5df5',backgroundColor:'#6a5df5'}}>
                        <Icon name='image' type='entypo' size={30} color='white' 
                        backgroundColor='#6a5df5' onPress={()=>{this.showImage()}}/>
                    </View>
                    <Menu>
                        <MenuTrigger  > 
                            <Icon name='square' type='font-awesome' size={30} color={this.state.chosenColor} backgroundColor='#6a5df5' style={{borderRadius:20,borderWidth:5,borderColor:'#6a5df5'}}/>
                        </MenuTrigger>
                        <MenuOptions>
                            <View style={{alignItems:'center'}}>
                                <View style={{borderBottomWidth:3,borderBottomColor:'gray'}}>
                                    <Text>{this.props.translateText("settingsMirrorReflection.select_bg_color")}</Text>
                                </View>                                   
                                <View style={{alignItems:'center',flexDirection:'row'}}>
                                    {this.makeSquare('black')}
                                    {this.makeSquare('blue')}
                                    {this.makeSquare('green')} 
                                </View>
                                <View style={{alignItems:'center',flexDirection:'row'}}>
                                    {this.makeSquare('orange')}
                                    {this.makeSquare('red')}
                                    {this.makeSquare('yellow')} 
                                </View>
                                <View style={{alignItems:'center',flexDirection:'row'}}>
                                    {this.makeSquare('purple')}
                                    {this.makeSquare('cyan')}
                                    {this.makeSquare('gray')} 
                                </View>
                            </View>
                        </MenuOptions>
                    </Menu>
                </View>
            </ImageBackground>
        )
    }
}
async handleUpdate(){
if(this.state.imagechosen){
    let objwithimage={imageChosen:true,backgroundColor:'black',imageBase64:this.state.imageUri}
    let respwith=await updateInfo(this.props.user.authKey,'defaultMirrorReflection',objwithimage)
    if(respwith){
        this.props.navigation.goBack()
    }
    
}
else{
    let objwithoutimage={imageChosen:false,backgroundColor:this.state.chosenColor,imageBase64:''}

    let respwithout=await updateInfo(this.props.user.authKey,'defaultMirrorReflection',objwithoutimage)
    if(respwithout){
        this.props.navigation.goBack()
    }
}
}
    render() {

        return (


            <SafeAreaView style={styles.container}>
                <Spinner
                visible={this.state.loading}
                textContent={this.props.translateText("beacon.loading.en")}
                textStyle={{color:'white'}}    
                />
                <View style={{flex:1}}>
                    <View style={styles.upperPart}>
                        <View style={{flexDirection:'row',justifyContent:'space-between',}}>
                            <Icon name='arrowleft' type='antdesign' size={50} color='white' backgroundColor='#6a5df5' style={{borderRadius:50}} onPress={()=>{this.props.navigation.navigate('Settings')}} />
                            {/* <Beacon name="lighthouse" size={50} color="#f07c4a"/> */}
                            <Image source={require('../images/przezroczyste.png')} style={{width:parseInt(Dimensions.get('window').width*0.2),height:parseInt(Dimensions.get('window').height*0.1),marginTop:'-2%'}} resizeMode='cover' />

                            {this.showAvatar()}
                        </View>
                        <Text  style={{alignSelf:'center',fontSize:20,marginTop:'2%',color:'#f07c4a',fontWeight:'bold'}}>{this.props.translateText("settingsMirrorReflection.mirror_reflection")}</Text>
                    </View>

                    <View style={{alignSelf:'center',alignItems:"center",marginTop:'2%',width:'90%',elevation:20,height:'75%',backgroundColor:'white',borderRadius:10}}>
                        {this.showSquare()}
                        
                        <TouchableOpacity onPress={()=>{this.handleUpdate()}} style={{backgroundColor:'#3f32d2',marginTop:'20%',flexDirection:'row',
                        borderRadius:20,width:'60%',padding:8,justifyContent:'center'}}>
                            <Icon name='check' type='antdesign' size={20} color='white' />
                            <Text style={{color:'white',marginLeft:'2%',fontWeight:'bold'}}>{this.props.translateText("updateBio.update.en")}</Text>
                        </TouchableOpacity>
                    </View>
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
        height:'20%',
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
    return bindActionCreators({ updateKey,translateText }, dispatch)
}

const mapStateToProps = state => {
    return {
        user: state.user
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(SettingsMirrorReflection)
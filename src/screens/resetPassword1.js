import React from 'react'
import { View, TextInput, StyleSheet, TouchableOpacity, Text,Image,TouchableWithoutFeedback,Keyboard, Alert,SafeAreaView ,Dimensions, Platform} from 'react-native'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { loginUser,updateEmail,updatePassword, translateText } from '../actions/user'
import { Input } from 'react-native-elements';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {sendCode} from '../func/resetpassword'

import { LogBox } from "react-native";
class ResetPassword1 extends React.Component {
  constructor(props) {
    super(props);
    this.state={email:''}
  
  }

  componentDidMount() {
     LogBox.ignoreAllLogs(true);

  }
 async handleSendCode(){
     let resp=await sendCode(this.state.email);
resp=true
    if(resp){
        this.props.navigation.navigate('ResetPassword2',{email:this.state.email}) 
    }
}


    render() {
        return (

<TouchableWithoutFeedback onPress={()=>{Keyboard.dismiss()}}>
            <SafeAreaView style={styles.container}>
                <View style={styles.circle}/>
                <View style={styles.iconStyle}>
                    <Text style={{color:'white',fontSize:30}}>{this.props.translateText("login.transfigure")}</Text>
                    {/* <Icon name="lighthouse" size={80} color="#f07c4a" /> */}
                    <Image source={require('../images/przezroczyste.png')} style={{width:parseInt(Dimensions.get('window').width*0.2),height:parseInt(Dimensions.get('window').height*0.2)}} resizeMode='cover' />

                    <Text style={{color:'white',fontSize:20}}>{this.props.translateText("reset.enter_your_email")}</Text>
                    <Text style={{color:'white',fontSize:16}}>{this.props.translateText("reset.email_verification_code")} </Text>
                    <Text style={{color:'white',fontSize:16}}>{this.props.translateText("reset.sent_to_your_email")}</Text>
                </View>
                <View style={styles.inputBox}>
                        <Input
                        placeholder={this.props.translateText("login.your_email")}
                        leftIcon={{type:'entypo' ,name:'user'}}
                        value={this.state.email}
                        onChangeText={value => this.setState({email:value})}
                        inputContainerStyle={{borderWidth:2,marginTop:'10%'}}
                        />  
                </View>
               
                <TouchableOpacity  style={styles.buttonLogin} onPress={()=>{this.handleSendCode() }}>
                            <Text style={{color:'white',fontSize:25}}>{this.props.translateText("reset.send_code")}</Text>
                </TouchableOpacity>   
                <View style={styles.signup}>
                    <Text style={{color:'black',fontSize:15}}>{this.props.translateText("login.dont_have_account")}?</Text> 
                    <TouchableOpacity  style={styles.buttonSignup} onPress={()=>{this.props.navigation.navigate('Signup')}}>
                            <Text style={{color:'white',fontSize:20}}>{this.props.translateText("login.signup")}</Text>
                    </TouchableOpacity> 
                </View>       
            </SafeAreaView>
            </TouchableWithoutFeedback>
            
            

        )
    } 
}

const styles = StyleSheet.create({
    container: {

        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
    },
    circle:{
        position:'absolute',
        width: '110%',
        height: '70%',
        top:'0%',
        borderBottomRightRadius:150,
        borderBottomLeftRadius:150,
        backgroundColor:'#3f32d2'
    },
    buttonLogin:{
        width: '50%',
        bottom:'4%',
        borderRadius:25,
        backgroundColor:'#3f32d2',
        padding:10,
        alignItems:'center',
        elevation:25
    },
    buttonSignup:{
        width: '100%',
        marginTop:'2%',
        bottom:'4%',
        borderRadius:25,
        backgroundColor:'#3f32d2',
        padding:5,
        alignItems:'center',
        elevation:25
    },
    iconStyle:{
        alignItems:'center',
        position:'absolute',
        top:'5%',
        elevation:20
    },
    signup:{
        position:'absolute',
        top:'88%',
        alignItems:'center'
    },
    inputBox:{
        marginTop:'55%',
        borderRadius: 10,
        justifyContent:'center',
        backgroundColor:'white',
        width:'80%',
        height:'30%',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 10,
        },
        shadowOpacity: 0.51,
        shadowRadius: 13.16,
        elevation: 20,
    },

})

const mapDispatchToProps = dispatch => {
    return bindActionCreators({ loginUser,updateEmail,updatePassword, translateText }, dispatch)
}

const mapStateToProps = state => {
    return {
        user: state.user
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ResetPassword1)
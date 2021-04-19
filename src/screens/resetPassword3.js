import React from 'react'
import { View, TextInput, StyleSheet,TouchableWithoutFeedback,Keyboard, TouchableOpacity, Text,Image, Alert,SafeAreaView ,Dimensions, Platform} from 'react-native'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { loginUser,updateEmail,updatePassword,updateResetEmail,sendCode, translateText } from '../actions/user'
import { Input } from 'react-native-elements';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {resetPassword} from '../func/resetpassword'
import { HelperText } from 'react-native-paper';
class ResetPassword3 extends React.Component {
  constructor(props) {
    super(props);
    this.state={password:'',confPassword:'',passVis:true,confpassVis:true,alertText:''}
  
  }


  
  componentDidMount() {
    console.disableYellowBox = true;

  }
async resetPassword(){
    let resp=0;
    if(this.state.password==this.state.confPassword && this.state.password.length>7){
         resp=await resetPassword(this.props.route.params.email,this.state.password);
         if(resp){
            Alert.alert('Success!',this.props.translateText("reset.success_password"))
            this.props.navigation.navigate('Login')
         }
         
    }
    else{
        if(this.state.password!=this.state.confPassword){this.setState({alertText: this.props.translateText("reset.confirm_password")})}
        if(this.state.password.length<8 ){this.setState({alertText: this.props.translateText("reset.password_must_have")})}
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

                    <Text style={{color:'white',fontSize:20}}>{this.props.translateText("reset.reset_your_password")}</Text>
                    <Text style={{color:'white',fontSize:16}}>{this.props.translateText("reset.set_your_new_password")}</Text>
                </View>
                <View style={styles.inputBox}>
                        <HelperText type="info" visible={true} style={{padding:0,textAlign:'center'}} >{this.state.alertText}</HelperText>
                        <Input
                        placeholder={this.props.translateText("reset.new_password")}
                        leftIcon={{type:'entypo' ,name:'user',onPress:()=>{this.setState({passVis:!this.state.passVis}) }  }}
                        value={this.state.password}
                        onChangeText={value => this.setState({password:value})}
                        secureTextEntry={this.state.passVis}
                        inputContainerStyle={{borderWidth:2,marginTop:'1%'}}
                        />  
                        <Input
                        placeholder={this.props.translateText("reset.confirm_new_password")}
                        leftIcon={{type:'entypo' ,name:'user',onPress:()=>{this.setState({confpassVis:!this.state.confpassVis}) }}}
                        value={this.state.confPassword}
                        onChangeText={value => this.setState({confPassword:value})}
                        secureTextEntry={this.state.confpassVis}
                        inputContainerStyle={{borderWidth:2,marginTop:'0%'}}
                        />  
                </View>
               
                <TouchableOpacity  style={styles.buttonLogin} onPress={()=>{this.resetPassword() }}>
                            <Text style={{color:'white',fontSize:25}}>{this.props.translateText("reset.reset")}</Text>
                </TouchableOpacity>   
   
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
    return bindActionCreators({ loginUser,updateEmail,updatePassword,updateResetEmail,sendCode, translateText }, dispatch)
}

const mapStateToProps = state => {
    return {
        user: state.user
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ResetPassword3)
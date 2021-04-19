import React from 'react'
import { View, TextInput, StyleSheet, TouchableOpacity ,Text,Image, Alert,SafeAreaView ,Dimensions,TouchableWithoutFeedback,Keyboard} from 'react-native'
import { bindActionCreators } from 'redux'
import  AsyncStorage  from '@react-native-community/async-storage'
import { connect } from 'react-redux'
import { updateEmail,updatePassword ,updateKey,updateUuid,translateText,setLanguage} from '../actions/user'
import { Input } from 'react-native-elements';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { loginUser} from '../func/userSettings'
import { Svg,Polyline,Circle} from 'react-native-svg';
// import { PowerTranslator, ProviderTypes, TranslatorConfiguration, TranslatorFactory } from 'react-native-power-translator';

// TranslatorConfiguration.setConfig(ProviderTypes.Google, 'AIzaSyCf6Q7WZT0ZUjQcaYPE50C80qMJh9hGdkg','fr');



class Login extends React.Component {
  constructor(props) { 
    super(props);
    this.state={secureText:true, languageCode: 'fr'}
    this.changeVis=this.changeVis.bind(this)
  }


  
  async componentDidMount() {
    console.disableYellowBox = true;
        // const translator = TranslatorFactory.createTranslator();
        // console.log(translator,"translator")
        // translator.translate('Engineering physics or engineering science').then(translated => {
        //     //Do something with the translated text
        //     console.log(translated,"translated")
        // }).catch(err => {
        //     console.log(err,"fdhghgfkdg")
        // });

    await this.checkStorage()
  }
  async checkStorage(){
    try {
        let value = await AsyncStorage.getItem('UserAccount');
        let language = await AsyncStorage.getItem('UserLanguage');
        language = JSON.parse(language)
        if (value !== null) {
        
        let myObjValue=JSON.parse(value)
        
        if(myObjValue.keepsignedin==1){
            this.props.updateKey(myObjValue.authKey)
            this.props.updateUuid(myObjValue.uuID)
            this.props.setLanguage(language.lang)
            this.props.navigation.navigate('Main')
            }else{
                if(language) {
                    this.props.setLanguage(language.lang)
                }
            }
        }else {
            if(language) {
                this.props.setLanguage(language.lang)
            }
        }
        } catch (error) {
        console.log(error)
        }
    
  }
async loadFromLocalStorage(){
    try {
        let value = await AsyncStorage.getItem('UserAccount');
        if (value !== null) {
          console.log(value);
        }
      } catch (error) {
        // Error retrieving data
        console.log(error)
      }
}
async handleLogin(){
    let newemail=this.props.user.email.replace(/\s+/g, '');
    newemail=newemail.toLowerCase()
    
    this.props.updateEmail(newemail)
    let resp= await loginUser(this.props.user.email,this.props.user.password)
    console.log(resp,"respresp")
    if(resp.success){
        let value = await AsyncStorage.getItem('UserAccount');
        let language = await AsyncStorage.getItem('UserLanguage');
        console.log(value,"value")
        if(!value) {
            let myObj={authKey:resp.key,uuID:resp.uuID,keepsignedin:1, notificationEnabled: 1}
            await AsyncStorage.setItem(
                'UserAccount',
                JSON.stringify(myObj)
            );    
        }
        if(!language) {
            await AsyncStorage.setItem('UserLanguage',JSON.stringify({lang:'en'}));
        }
        this.props.updateKey(resp.key)
        this.props.updateUuid(resp.uuID)
        this.props.navigation.navigate('Main')
    }
    else{
        if(resp.reason==1){
            Alert.alert('Login failed', this.props.translateText("login.wrong_password"))
        }
        if(resp.reason==0){
            Alert.alert('Login failed', this.props.translateText("login.email_auth"))
        }
    }

}
changeVis(){
    this.setState({secureText:!this.state.secureText})
}
    render() {
        console.log(this.props.user,"user")
        return (

<TouchableWithoutFeedback onPress={()=>{Keyboard.dismiss()}}>

            <SafeAreaView style={styles.container}>
                <View style={styles.circle}>

                    <Text style={{color:'white',fontSize:30,marginTop:'2%'}}>{this.props.translateText("login.transfigure")}</Text>
                    {/* <PowerTranslator style={{color:'white',fontSize:30,marginTop:'2%', backgroundColor: 'red', width: '100%'}} text={'A Confucian Revival Began'} /> */}
                    <Image source={require('../images/przezroczyste.png')} style={{width:parseInt(Dimensions.get('window').width*0.2),height:parseInt(Dimensions.get('window').height*0.2)}} resizeMode='cover' />
                    <Text style={{color:'white',fontSize:20}}>{this.props.translateText("login.welcome")}</Text>
                    <Text style={{color:'white',fontSize:16,fontStyle:'italic'}}>{this.props.translateText("login.please_login")}</Text>
                </View>
                <View style={styles.inputBox}>
                        <Input
                        placeholder={this.props.translateText("login.your_email")}
                        leftIcon={{type:'entypo' ,name:'user'}}
                        value={this.props.user.email}
                        onChangeText={value => this.props.updateEmail(value)}
                        inputContainerStyle={{borderWidth:2,marginTop:'10%'}}
                        />
                        <Input
                        placeholder={this.props.translateText("login.your_password")}
                        leftIcon={{type:'entypo',name:'lock',onPress:this.changeVis}}
                        value={this.props.user.password}
                        onChangeText={value =>  this.props.updatePassword(value)}
                        secureTextEntry={this.state.secureText}
                        inputContainerStyle={{borderWidth:2}}
                        />
                        <TouchableOpacity style={{alignItems:'flex-end',marginRight:'3%'}} onPress={()=>{this.props.navigation.navigate('ResetPassword1')}}>
                            <Text style={{color:'orange',fontSize:17}}>{this.props.translateText("login.forgot_password")}?</Text>
                        </TouchableOpacity>        
                </View>
               
                <TouchableOpacity  style={styles.buttonLogin} onPress={()=>{this.handleLogin() }}>
                            <Text style={{color:'white',fontSize:25}}>{this.props.translateText("login.login")}</Text>
                </TouchableOpacity>   
                <View style={{alignSelf:'center',alignItems:"center",width:'90%'}}>
                    <Text style={{color:'black',fontSize:15}}>{this.props.translateText("login.dont_have_account")}?</Text> 
                    <TouchableOpacity  style={{backgroundColor:'#3f32d2',padding:5,borderRadius:30,width:'40%',alignItems:'center'}} onPress={()=>{this.props.navigation.navigate('Signup')}}>
                            <Text style={{color:'white',fontSize:25}}>{this.props.translateText("login.signup")}</Text>
                    </TouchableOpacity> 
                </View>       
            </SafeAreaView>
            </TouchableWithoutFeedback>

            
            

        )
    } 
}

const styles = StyleSheet.create({
    container: {

        backgroundColor: 'white'
    },
    circle:{
        alignSelf:'center',
        alignItems:'center',
        width: '110%',
        height: '70%',
        borderBottomRightRadius:150,
        borderBottomLeftRadius:150,
        backgroundColor:'#3f32d2'
    },
    buttonLogin:{
        alignSelf:'center',
        width: '50%',
        top:'-3%',
        borderRadius:25,
        backgroundColor:'#3f32d2',
        padding:5,
        alignItems:'center',
        elevation:25
    },
    buttonSignup:{
        top:'-80%',
        borderRadius:25,
        backgroundColor:'#3f32d2',
        padding:5,
        alignItems:'center',
        alignSelf:'center',
        elevation:50
    },
    iconStyle:{
        alignItems:'center',
        top:'-40%',
        elevation:20
    },
    signup:{
        top:'88%',
        alignItems:'center'
    },
    inputBox:{
        marginTop:'-50%',
        alignSelf:'center',
        borderRadius: 10,
        backgroundColor:'white',
        width:'80%',
        height:'40%',
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
    return bindActionCreators({ updateEmail,updatePassword ,updateKey,updateUuid, translateText,setLanguage}, dispatch)
}

const mapStateToProps = state => {
    return {
        user: state.user
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Login)
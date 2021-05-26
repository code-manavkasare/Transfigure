import React from 'react'
import { View, TextInput, StyleSheet, TouchableOpacity ,Text,Image, Alert,SafeAreaView ,Dimensions, Platform} from 'react-native'
import { bindActionCreators } from 'redux'
import  AsyncStorage  from '@react-native-community/async-storage'
import { connect } from 'react-redux'
import { loginUser,updateEmail,updatePassword ,updateKey,updateUuid} from '../actions/user'
import { Input } from 'react-native-elements';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';


import { LogBox } from "react-native";
class SplashScreen extends React.Component {
  constructor(props) { 
    super(props);

  }

  async componentDidMount() {

     LogBox.ignoreAllLogs(true);
    setTimeout(() => {
        this.props.navigation.reset({
            index: 0,
            routes: [{ name: 'Login' }],
          });
    }, 1000);  
  }




    render() {
        let img=require('../images/newlogo.png')
        return (


            <SafeAreaView style={styles.container}>

                <Image source={img} style={{width:parseInt(Dimensions.get('window').width),height:parseInt(Dimensions.get('window').height)}} resizeMode='cover'/>
            </SafeAreaView>
            
            
            

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

})

const mapDispatchToProps = dispatch => {
    return bindActionCreators({ loginUser,updateEmail,updatePassword ,updateKey,updateUuid}, dispatch)
}

const mapStateToProps = state => {
    return {
        user: state.user
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(SplashScreen)
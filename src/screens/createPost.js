import React from 'react'
import { View, TextInput, StyleSheet, TouchableOpacity, Text,Image, Alert,SafeAreaView ,Dimensions,ImageBackground,FlatList,Platform,TouchableWithoutFeedback,Keyboard} from 'react-native'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { updateKey,translateText } from '../actions/user'
import Beacon from 'react-native-vector-icons/MaterialCommunityIcons';
import moment from "moment";
import MyFooter from '../components/centerComp'
import {addQuote} from '../func/quotes'
import {fetchDisplayName,fetchSettingsInfo} from '../func/userSettings'
import {getFont} from '../components/chosenfonts'
import ImagePicker from 'react-native-image-crop-picker';
import Spinner from 'react-native-loading-spinner-overlay';
import {Header,Icon,Overlay,Avatar  } from 'react-native-elements';
import { SliderBox } from "react-native-image-slider-box";

import {
    Menu,
    MenuOptions,
    MenuOption,
    MenuTrigger,
  } from 'react-native-popup-menu';

class CreatePost extends React.Component {
  constructor(props) {
    super(props);
this.state={bgColor:'black',inputText:'',chosenColorBackground:'white',boldOn:false,italicOn:false,biggerFontOn:false,shareWith:'Everyone',title:'',myDisplayName:'',imageUri:[],imageChosen:false,chosenColorFont:'black',loading:false,chosenFontFamily: Platform.OS === 'ios' ? 'system font' : 'normal',fontStyleOverlayVis:false}
  }
 async componentDidMount() {
    console.disableYellowBox = true;
    this.setState({loading:true})
    let resp=await fetchDisplayName(this.props.user.authKey)
    await this.fetchSet()
    this.setState({myDisplayName:resp,loading:false})
    this.checkParams()

  }


  
  async fetchSet(){
    let resp=await fetchSettingsInfo(this.props.user.authKey)
if(resp){
    let mydefaults=resp.defaultMirrorReflection
    if(mydefaults.imageChosen==true){
        
        this.setState({imageUri:mydefaults.imageBase64,imageChosen:true})
    }
    else{
        this.setState({imageUri:[],imageChosen:false,chosenColorBackground:mydefaults.backgroundColor})
    }

}
  }
checkParams(){
    if(this.props.route.params!=undefined){
        this.setState({title:this.props.route.params.title})
    }
}



showCheckBackground(color){
    
    if(color==this.state.chosenColorBackground){
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
  

showCheck(color){
    
if(color==this.state.chosenColorFont){
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
async handlePost(){
    if ((this.state.inputText != '' && this.state.title != '')) {
        console.log('if')
        let myStyle={fontWeight:'',fontSize:'',fontStyle:'',color:this.state.chosenColorFont,fontFamily:this.state.chosenFontFamily}
        if(this.state.boldOn){
            myStyle.fontWeight='bold' 
        }
        if(this.state.italicOn){
            myStyle.fontStyle='italic' 
        }
        if(this.state.biggerFontOn){
            myStyle.fontSize='big' 
        }
        let share=0 //everyone,friends,me
        switch(this.state.shareWith){

            case 'Friends':share=1;
                            break;
            case 'Me Only':share=2;
                            break;
            case 'Everyone':share=0;
                            break;
        }
        let imagetoSend=[]
        if(this.state.imageChosen==true){
            imagetoSend=this.state.imageUri
        }
        else{
            imagetoSend=[]
        }
        this.setState({ loading: true })
        let resp =await addQuote(this.props.user.authKey,myStyle,this.state.title,this.state.inputText,share,this.state.chosenColorBackground,imagetoSend,this.state.imageChosen)
        this.setState({ loading: false })
        console.log(resp,"resp")
        if(resp){
            this.props.navigation.goBack();
        }
        
    }
    else {
        console.log('else')
        if (this.state.title == '') {
            Alert.alert('Failed to add quote', this.props.translateText("createpost.title_feild"))
        }
        else if(!this.state.inputText){
            Alert.alert('Failed to add quote', this.props.translateText("createpost.description_feild"))
        }
    }
}
makeSquare(color){
    
    return(

        <MenuOption onSelect={()=>{this.setState({chosenColorFont:color})}}>
        <View style={{backgroundColor:color,margin:10,borderRadius:5,marginBottom:5}}>
            {this.showCheck(color)}
         </View>    
        </MenuOption>

    )
}



fullInputStyle(){
    let inp={}
    inp.fontSize=20
    inp.fontStyle='normal';
    inp.color=this.state.chosenColorFont
    inp.fontFamily=this.state.chosenFontFamily
let change=0
if(this.state.boldOn){
    inp.fontWeight='bold'
}
if(this.state.italicOn){
    inp.fontStyle='italic'
}
if(this.state.biggerFontOn){
    inp.fontSize=30
    change=1
}
return inp

}

   showShare(whoToShare){
    let icName=''
    let type=''
    let bgColor='white'
    switch(whoToShare){

        case 'Friends':icName='user-friends'
                        type='font-awesome-5'
                        break;
        case 'Me Only':icName='user'
                        type='entypo'
                        break;
        case 'Everyone':icName='globe'
                        type='font-awesome-5'
                        break;
    }
    if(whoToShare==this.state.shareWith){
        bgColor='#9cafff';
    }


    return(
        

    
    
        <MenuOption onSelect={()=>{this.setState({shareWith:whoToShare})}}>
           <View style={{flexDirection:'row',justifyContent:'space-evenly',backgroundColor:bgColor}}>
                <Icon name={icName} type={type} size={20} color='blue'    />
                <Text style={{color:'blue',fontSize:20}}>{whoToShare}</Text>
            </View>    
        </MenuOption>

    )
}

  showTitle(){
      if(this.props.route.params!=undefined){
      return(
        <View style={{backgroundColor:'#4a4a4a',alignItems:'flex-start',borderTopLeftRadius:9,borderTopRightRadius:9}}>
                <Text style={{color:'white',fontWeight:'bold',fontSize:20,marginLeft:'5%'}}>{this.state.title}</Text>
        </View>
      )
      }
      else{
          return(
            <View style={{backgroundColor:'#4a4a4a',alignItems:'flex-start',borderTopLeftRadius:9,borderTopRightRadius:9}}>
                <TextInput placeholder={this.props.translateText("createpost.title")} value={this.state.title} onChangeText={value => this.setState({title:value}) }
                        style={{color:'white',fontWeight:'bold',fontSize:20,marginLeft:'5%'}}
                        placeholderTextColor='white'
                        multiline={false}
                        maxLength={30}
                        />
            </View>
          )
      }
  }
  makeSquareBackground(color){
    return(

        <MenuOption onSelect={()=>{this.setState({chosenColorBackground:color,imageChosen:false})}}>
        <View style={{backgroundColor:color,margin:10,borderRadius:5,marginBottom:5}}>
            {this.showCheckBackground(color)}
         </View>    
        </MenuOption>

    )
  }

showImage(){
    // const options = {
    //     quality: 0.5
    // };
    // ImagePicker.showImagePicker(options,(response) => {

      
    //     if (response.didCancel) {
    //       console.log('User cancelled image picker');
    //     } else if (response.error) {
    //       console.log('ImagePicker Error: ', response.error);
    //     } else if (response.customButton) {
    //       console.log('User tapped custom button: ', response.customButton);
    //     } else {

      
    //       // You can also display the image using data:
    //       // const source = { uri: 'data:image/jpeg;base64,' + response.data };
          
    //       this.setState({
    //         imageUri: response.data,imageChosen:true
    //       });
    //     }
    //   });

    ImagePicker.openPicker({
        multiple: true,
        includeBase64: true
      }).then(images => {
        console.log(images);
        if(images.length) {
            let imagesArray = images.map(item => {
                return item.data
            })
            this.setState({
                imageUri: imagesArray,imageChosen:true
            });
        }
        
      });
}
showNewSquare(){
    if(!this.state.imageChosen){
    return(
            <View style={{backgroundColor:this.state.chosenColorBackground,width:'90%',height:'40%',marginBottom:0,margin:'5%' ,justifyContent: 'center',alignItems: 'center',borderRadius:10}}>
                <Text style={{color:'white',fontWeight:'bold',fontSize:30,marginTop:'18%'}}>{this.state.myDisplayName}</Text>
                <View style={{flexDirection:'row',alignSelf:'flex-start',marginTop:'5%'}}>
                    <View style={{marginHorizontal:'5%',borderRadius:20,borderWidth:5,borderColor:'#6a5df5',backgroundColor:'#6a5df5'}}>
                        <Icon name='image' type='entypo' size={30} color='white' 
                        backgroundColor='#6a5df5' onPress={()=>{this.showImage()}}/>
                    </View>
                    <Menu>
                        <MenuTrigger  > 
                            <Icon name='square' type='font-awesome' size={30} color={this.state.chosenColorBackground} backgroundColor='#6a5df5' style={{borderRadius:20,borderWidth:5,borderColor:'#6a5df5'}}/>
                        </MenuTrigger>
                        <MenuOptions>
                            <View style={{alignItems:'center'}}>
                                <View style={{borderBottomWidth:3,borderBottomColor:'gray'}}>
                                    <Text>{this.props.translateText("createpost.select_background")}</Text>
                                </View>                                   
                                <View style={{alignItems:'center',flexDirection:'row'}}>
                                    {this.makeSquareBackground('black')}
                                    {this.makeSquareBackground('blue')}
                                    {this.makeSquareBackground('green')} 
                                </View>
                                <View style={{alignItems:'center',flexDirection:'row'}}>
                                    {this.makeSquareBackground('orange')}
                                    {this.makeSquareBackground('red')}
                                    {this.makeSquareBackground('yellow')} 
                                </View>
                                <View style={{alignItems:'center',flexDirection:'row'}}>
                                    {this.makeSquareBackground('purple')}
                                    {this.makeSquareBackground('cyan')}
                                    {this.makeSquareBackground('gray')} 
                                </View>
                            </View>
                        </MenuOptions>
                    </Menu>
                </View>
            </View> 
    )
    }
    else{
        let base64Array=[]
        if(this.state.imageUri.length){
            base64Array=this.state.imageUri.map(item => {
                return 'data:image/png;base64,'+item
            })
        }
        // console.log(this.state.imageUri,"sdshjgdasd")
        return(
            <View style={{backgroundColor:this.state.chosenColorBackground,width:'90%',height:'40%',marginBottom:0,margin:'5%' ,justifyContent: 'center',alignItems: 'center',borderRadius:10, overflow: 'hidden'}}>
                {/* <View style={{overflow: 'hidden', position: 'absolute', top: 0}}> */}
                    <SliderBox images={base64Array} />
                {/* </View> */}
                <View style={{position: 'absolute',bottom: 10, left: 10}}>
                <View style={{flexDirection:'row',alignSelf:'flex-start',marginTop:'5%'}}>
                    <View style={{marginHorizontal:'5%',borderRadius:20,borderWidth:5,borderColor:'#6a5df5',backgroundColor:'#6a5df5'}}>
                        <Icon name='image' type='entypo' size={30} color='white' 
                        backgroundColor='#6a5df5' onPress={()=>{this.showImage()}}/>
                    </View>
                    <Menu>
                        <MenuTrigger  > 
                            <Icon name='square' type='font-awesome' size={30} color={this.state.chosenColorBackground} backgroundColor='#6a5df5' style={{borderRadius:20,borderWidth:5,borderColor:'#6a5df5'}}/>
                        </MenuTrigger>
                        <MenuOptions>
                            <View style={{alignItems:'center'}}>
                                <View style={{borderBottomWidth:3,borderBottomColor:'gray'}}>
                                    <Text>{this.props.translateText("createpost.select_background")}</Text>
                                </View>                                   
                                <View style={{alignItems:'center',flexDirection:'row'}}>
                                    {this.makeSquareBackground('black')}
                                    {this.makeSquareBackground('blue')}
                                    {this.makeSquareBackground('green')} 
                                </View>
                                <View style={{alignItems:'center',flexDirection:'row'}}>
                                    {this.makeSquareBackground('orange')}
                                    {this.makeSquareBackground('red')}
                                    {this.makeSquareBackground('yellow')} 
                                </View>
                                <View style={{alignItems:'center',flexDirection:'row'}}>
                                    {this.makeSquareBackground('purple')}
                                    {this.makeSquareBackground('cyan')}
                                    {this.makeSquareBackground('gray')} 
                                </View>
                            </View>
                        </MenuOptions>
                    </Menu>
                </View>
                </View>
            </View>
        )
    }
}
  showCard(){
//if we add image,text disapears,change bg color  ,change text color
    return(
        <View style={styles.cardBox}>

            {this.showNewSquare()}
            <View style={{marginTop:'5%',marginHorizontal:'5%',borderRadius:10,width:'90%',borderWidth:1,borderColor:'gray',height:'45%'}}>
                {this.showTitle()}
                <View style={{backgroundColor:'#e8e8e8',flexDirection:'row',alignItems:'stretch',justifyContent:'space-between',paddingTop:5,paddingBottom:5,paddingHorizontal:5}}   >
                    <Icon name='text-size' type='octicon' size={30} color='#3f32d2'    onPress={()=>this.setState({biggerFontOn:!this.state.biggerFontOn})}/>
                    <Icon name='italic' type='font-awesome' size={30} color='#3f32d2'    onPress={()=>this.setState({italicOn:!this.state.italicOn})}/>
                    <Icon name='bold' type='font-awesome' size={30} color='#3f32d2'    onPress={()=>this.setState({boldOn:!this.state.boldOn})}/>
                    <Icon name='edit' type='material' size={30} color='#3f32d2'    onPress={()=>this.setState({fontStyleOverlayVis:!this.state.fontStyleOverlayVis})}/>
                    
                    <View  style={{backgroundColor:this.state.chosenColorFont,width:30}} > 
                        <Menu>
                            <MenuTrigger  > 
                                <Text style={{color:this.state.chosenColorFont,fontSize:20}}> </Text>
                            </MenuTrigger>
                            <MenuOptions>
                            
                                <View style={{alignItems:'center'}}>
                                    <View style={{borderBottomWidth:3,borderBottomColor:'gray'}}>
                                        <Text>{this.props.translateText("createpost.select_font_color")}</Text>
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
                <View style={{width:'100%',height:'56%'}}>

                    <TextInput
                            placeholder={this.props.translateText("createpost.your_quote")}
                            value={this.state.inputText}
                            onChangeText={value => this.setState({inputText:value}) }
                            style={this.fullInputStyle()}
                            multiline={true}
                            maxLength={200}
                            />
                </View>
                <View style={{paddingRight:10,width:'100%',alignItems:'flex-end'}}>
                    <Text style={{color:'gray'}}>{this.state.inputText.length}/200</Text>
                </View> 
                
            </View>
            <View style={{alignSelf:'flex-start',marginLeft:'5%',flexDirection:'row'}}>
            <Text style={{color:'gray',fontSize:20,fontStyle:'italic'}}>{this.props.translateText("createpost.share_with")}</Text>
            <Menu>
                <MenuTrigger  >

                        
                        <Text style={{color:'#3f32d2',fontSize:20,fontWeight:'bold'}}>{this.state.shareWith}</Text>
                </MenuTrigger>
                <MenuOptions>
                    

                    {this.showShare('Everyone')}
                    {this.showShare('Me Only')}
                    {this.showShare('Friends')} 
                    
                </MenuOptions>
            </Menu>
            </View>
   
        </View>
    )
}

  onSwipeLeft(val){
      if(this.state.currentCardIndex<2){
          this.setState({currentCardIndex:this.state.currentCardIndex+1})
      }
  }
  onSwipeRight(val){
    if(this.state.currentCardIndex>0){
        this.setState({currentCardIndex:this.state.currentCardIndex-1})
    }
}
renderFontRow(data){
    if(data.fontName==this.state.chosenFontFamily){
        return(
            <TouchableOpacity style={{flexDirection:'row',marginHorizontal:'2%',marginVertical:'3%',justifyContent:"space-between"}} key={ data.key} onPress={()=>{this.setState({chosenFontFamily:data.fontName})}}>
                <Text style={{fontSize:20,fontFamily:data.fontName}}>{data.fontName}</Text>
                <Icon name='checkcircle' type='antdesign' size={20} color='#3f32d2'   />
            </TouchableOpacity>
        )
    }
    else{
        return(
            <TouchableOpacity style={{flexDirection:'row',marginHorizontal:'2%',marginVertical:'3%',justifyContent:"space-between"}} key={data.key} onPress={()=>{this.setState({chosenFontFamily:data.fontName})}}>
                <Text style={{fontSize:20,fontFamily:data.fontName}}>{data.fontName}</Text>
            </TouchableOpacity>
        )
    }
}
fontStyleOverlay(){

    let chosenplatformfonts=Platform.OS === 'ios' ? getFont('ios') : getFont('android')
    let fulldata=[]
    let obj=0
    for (let i=0;i<chosenplatformfonts.length;i++){
        obj={fontName:chosenplatformfonts[i],key:i}
        fulldata.push(obj)
    }
    return(
        <Overlay isVisible={this.state.fontStyleOverlayVis} onBackdropPress={()=>{this.setState({fontStyleOverlayVis:!this.state.fontStyleOverlayVis})}} overlayStyle={{width:'80%',height:'60%'}}>
            <View >
                <Text style={{textAlign:'center',fontSize:20,fontWeight:'bold'}}>{this.props.translateText("createpost.choose_font")}</Text>
                <FlatList 
                        style={{marginBottom:'6%'}}
                        data={fulldata}
                        renderItem={(data) =>this.renderFontRow(data.item)}
                        keyExtractor={item => item.key}
                    />
            </View>
        </Overlay>
    )
}
    render() {
        return (

<TouchableWithoutFeedback onPress={()=>{Keyboard.dismiss()}}>
            <SafeAreaView style={styles.container}>
                
                {this.fontStyleOverlay()}
                 <Spinner
                visible={this.state.loading}
                textContent={this.props.translateText("beacon.loading")}
                textStyle={{color:'white'}}    
                />
                <View style={{flex:1}}>
                    <View style={styles.upperPart}>
                        <View style={{flexDirection:'row',justifyContent:'space-between',paddingHorizontal:'5%'}}>
                            <Icon name='arrowleft' type='antdesign' size={30} color='white' backgroundColor='#6a5df5' style={{borderRadius:50}} onPress={()=>{this.props.navigation.goBack()}} />
                            <Image source={require('../images/przezroczyste.png')} style={{width:parseInt(Dimensions.get('window').width*0.2),height:parseInt(Dimensions.get('window').height*0.1),alignSelf:'center',marginTop:'-2%',backgroundColor:'transparent'}} resizeMode='cover' />
                            <Icon name='cog' type='font-awesome' size={30} color='white' onPress={()=>{ this.props.navigation.navigate('Settings')}} />
                        </View>
                    </View>
                    
                    {this.showCard()}
                    <TouchableOpacity style={{flexDirection:'row',justifyContent:'space-evenly',
                    backgroundColor:'#3f32d2',alignSelf:'center',width:'40%',marginTop:'1%',height:'6%',borderRadius:20,alignItems:'center',elevation:20}} onPress={()=>{this.handlePost()}}>
                        <Icon name='paper-plane' type='font-awesome' size={20} color='white'    />
                        <Text style={{color:'white',fontSize:20}}>{this.props.translateText("beacon.post")}</Text>
                    </TouchableOpacity>
                
                </View>
                
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
    upperPart:{
        height:'25%',
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
    cardBox:{
        marginTop:'-15%',
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
)(CreatePost)





// <ImageBackground source={{uri:base64text}} style={{width:parseInt(Dimensions.get('window').width*0.9*0.95),height:parseInt(Dimensions.get('window').height*0.4*0.65),marginBottom:0,margin:'5%' ,justifyContent: 'center',alignItems: 'center',alignSelf:'stretch'}} imageStyle={{borderRadius:10}} resizeMode='cover' >
//                 {/* <Text style={{color:'white',fontWeight:'bold',fontSize:30,marginTop:'18%'}}>{this.state.myDisplayName}</Text> */}
//                 <Text style={{color:'white',fontWeight:'bold',fontSize:30,marginTop:'18%'}}> </Text>

//                 <View style={{flexDirection:'row',alignSelf:'flex-start',marginTop:'5%'}}>
//                     <View style={{marginHorizontal:'5%',borderRadius:20,borderWidth:5,borderColor:'#6a5df5',backgroundColor:'#6a5df5'}}>
//                         <Icon name='image' type='entypo' size={30} color='white' 
//                         backgroundColor='#6a5df5' onPress={()=>{this.showImage()}}/>
//                     </View>
//                     <Menu>
//                         <MenuTrigger  > 
//                             <Icon name='square' type='font-awesome' size={30} color={this.state.chosenColorBackground} backgroundColor='#6a5df5' style={{borderRadius:20,borderWidth:5,borderColor:'#6a5df5'}}/>
//                         </MenuTrigger>
//                         <MenuOptions>
//                             <View style={{alignItems:'center'}}>
//                                 <View style={{borderBottomWidth:3,borderBottomColor:'gray'}}>
//                                     <Text>Select a background color</Text>
//                                 </View>                                   
//                                 <View style={{alignItems:'center',flexDirection:'row'}}>
//                                     {this.makeSquareBackground('black')}
//                                     {this.makeSquareBackground('blue')}
//                                     {this.makeSquareBackground('green')} 
//                                 </View>
//                                 <View style={{alignItems:'center',flexDirection:'row'}}>
//                                     {this.makeSquareBackground('orange')}
//                                     {this.makeSquareBackground('red')}
//                                     {this.makeSquareBackground('yellow')} 
//                                 </View>
//                                 <View style={{alignItems:'center',flexDirection:'row'}}>
//                                     {this.makeSquareBackground('purple')}
//                                     {this.makeSquareBackground('cyan')}
//                                     {this.makeSquareBackground('gray')} 
//                                 </View>
//                             </View>
//                         </MenuOptions>
//                     </Menu>
//                 </View>
//             </ImageBackground>
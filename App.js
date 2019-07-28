import * as React from 'react';
import { CameraRoll,Text, View, StyleSheet,ScrollView,ActivityIndicator,Dimensions,Animated,TouchableWithoutFeedback,TouchableHighlight,Share } from 'react-native';
import Constants from 'expo-constants';

import * as Permissions from 'expo-permissions'
import * as FileSystem from 'expo-file-system'
import axios from 'axios';
// You can import from local files


// or any pure javascript modules available in npm
import { Card } from 'react-native-paper';

class WallPapers extends React.Component{
  animatedScale=new Animated.Value(1)
  animatedPosition=new Animated.Value(-100)

  state={
    isTapped:false
  }
  handlePress=()=>{
    
    let tempTap=this.state.isTapped;
    this.setState({
      isTapped:!tempTap
    },()=>{
      if(this.state.isTapped){
        Animated.parallel([
    Animated.timing(this.animatedScale, {
        toValue: 0.6,
        duration: 300
    }),
    Animated.timing(this.animatedPosition, {
        toValue: 80,
        duration: 300
    })
]).start();
      }else{
        Animated.parallel([
    Animated.timing(this.animatedScale, {
        toValue: 1,
        duration: 300
    }),
    Animated.timing(this.animatedPosition, {
        toValue: -100,
        duration: 300
    })
]).start();
      }
    })
  }
  handleScroll=()=>{
    if(this.state.isTapped){
      this.handlePress();
    }
  }
  handleSave=async img=>{
    let cameraPermissions=await Permissions.getAsync(Permissions.CameraRoll);
    if(cameraPermissions.status!=='granted'){
      cameraPermissions=await Permissions.askAsync(Permissions.CameraRoll);
    }
    if(cameraPermissions.status==='granted'){
      FileSystem.downloadAsync(img.urls.regular,FileSystem.documentDirectory+img.id+'.jpg')
      .then(({uri})=>{
        CameraRoll.saveToCameraRoll(uri);
        alert('Saved To Gallery');
        this.handlePress();
      })
      .catch(err=>{
        alert('Error!')
      })
    }else{
      alert('Requires Camera Roll Permission');
    }
  }

handleShare=async (img)=>{
  const shareOptions = {
    title: 'Checkout this amazing wallpaper!'+img
  
  };
  try{
  await  Share.share(shareOptions)
  this.handlePress()
    
  }catch(err){
    alert('Error in sharing the image')
  }


}
  render(){
  let {height,width}=Dimensions.get('screen')
  let tempWidth=width-50
  return(
    <ScrollView onScroll={this.handleScroll} style={{height:height,width:width,backgroundColor:'black'}} pagingEnabled={true} horizontal={true}>
      {this.props.imgs.map(img=><View  key={img.id}   style={{alignItems:'center',height:height,width:width}}>
        <Animated.View  style={{height:height,width:width,transform:[{scaleX:this.animatedScale},{scaleY:this.animatedScale}]}}>
      <TouchableWithoutFeedback  onPress={this.handlePress}>
      <Animated.Image style={{flex:1,height:null,width:null}} source={{uri:img.urls.regular}} />
   
     
      </TouchableWithoutFeedback>
      </Animated.View>
      <Animated.View  style={{height:100, width:tempWidth,bottom:this.animatedPosition,backgroundColor:'#ddd',position:'absolute',zIndex:5,borderRadius:10,flexDirection:'row'}}>
      <View style={{flex:1,flexDirection:'row',alignItems:'center',justifyContent:'space-around'}}>
      <TouchableHighlight onPress={()=>this.handleSave(img)}><Text>Save</Text></TouchableHighlight>
      <TouchableHighlight><Text>Refresh</Text></TouchableHighlight>
      <TouchableHighlight onPress={()=>this.handleShare(img.urls.regular)}><Text>Share</Text></TouchableHighlight>
      </View>
      </Animated.View>

      </View>)}
    </ScrollView>
  )
}
}




export default class App extends React.Component {
  state={
    isLoading:true,
    isTapped:false,
    imgs:[]
  }

  animatedScale=new Animated.Value(1)
  animatedPosition=new Animated.Value(-100)

  handleSave=async img=>{
    let cameraPermissions=await Permissions.getAsync(Permissions.CAMERA_ROLL);
    if(cameraPermissions.status!=='granted'){
      cameraPermissions=await Permissions.askAsync(Permissions.CAMERA_ROLL);
    }
    if(cameraPermissions.status==='granted'){
      FileSystem.downloadAsync(img.urls.regular,FileSystem.documentDirectory+img.id+'.jpg')
      .then(({uri})=>{
        CameraRoll.saveToCameraRoll(uri);
        alert('Saved To Gallery');
      })
      .catch(err=>{
        alert('Error!')
      })
    }else{
      alert('Requires Camera Roll Permission');
    }
  }
  handlePress=()=>{
    
    let tempTap=this.state.isTapped;
    this.setState({
      isTapped:!tempTap
    },()=>{
      if(this.state.isTapped){
        Animated.parallel([
    Animated.timing(this.animatedScale, {
        toValue: 0.6,
        duration: 300
    }),
    Animated.timing(this.animatedPosition, {
        toValue: 80,
        duration: 300
    })
],{
  useNativeDriver:true
}).start();
      }else{
        Animated.parallel([
    Animated.timing(this.animatedScale, {
        toValue: 1,
        duration: 300
    }),
    Animated.timing(this.animatedPosition, {
        toValue: -100,
        duration: 300
    })
],{
  useNativeDriver:true
}).start();
      }
    })
  }
handleShare=(img)=>{
  const shareOptions = {
    title: 'Checkout this amazing wallpaper!',
    message: '',
    url: img,
    subject: ''
  };

  Share.share(shareOptions);
}

loadNewImgs=()=>{
  let Access_Key='b8d550f7d39de466959b71323278c395ec976d37c9c1ded31217d02c69c62a6a'; //replace the Access Key here
  axios.get('https://api.unsplash.com/photos/random?count=10&client_id='+Access_Key).then(data => {
    this.setState({ imgs: data.data , isLoading:false});
    if(this.state.isTapped){
      this.handlePress();
    }
  
  })
  .catch(err => {
    console.log('Error happened during fetching!', err);
  });
}

  componentDidMount=()=>{
    this.loadNewImgs();
  }
  render() {
     if(this.state.isLoading){
      return(
        <View style={{flex:1,justifyContent:'center',alignItems:'center',backgroundColor:'black'}}>
          <ActivityIndicator size='large'/>
        </View>
      )
    }else{
      let {height,width}=Dimensions.get('screen')
      let tempWidth=width-50
      return(
        <View style={styles.container}>
        <ScrollView style={{height:height,width:width,backgroundColor:'black'}} pagingEnabled={true} horizontal={true}>
          {this.state.imgs.map(img=><View  key={img.id}   style={{alignItems:'center',height:height,width:width}}>
            <Animated.View  style={{height:height,width:width,transform:[{scaleX:this.animatedScale},{scaleY:this.animatedScale}]}}>
          <TouchableWithoutFeedback  onPress={this.handlePress}>
          <Animated.Image style={{flex:1,height:null,width:null}} source={{uri:img.urls.regular}} />
       
         
          </TouchableWithoutFeedback>
          </Animated.View>
          <Animated.View  style={{height:100, width:tempWidth,bottom:this.animatedPosition,backgroundColor:'#ddd',position:'absolute',zIndex:5,borderRadius:10,flexDirection:'row'}}>
          <View style={{flex:1,flexDirection:'row',alignItems:'center',justifyContent:'space-around'}}>
          <TouchableHighlight style={{padding:10}} onPress={()=>this.handleSave(img)}><Text>Save</Text></TouchableHighlight>
          
          <TouchableHighlight style={{padding:10}} onPress={()=>this.handleShare(img.urls.regular)}><Text>Share</Text></TouchableHighlight>
          <TouchableHighlight style={{padding:10}} onPress={this.loadNewImgs}><Text>Refresh</Text></TouchableHighlight>
          </View>
          </Animated.View>
    
          </View>)}
        </ScrollView>
        </View>
      )


  }
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  
    paddingTop: Constants.statusBarHeight,
    backgroundColor: 'black'
   
  },

});

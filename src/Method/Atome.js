import { View ,StyleSheet,Dimensions,Text,StatusBar} from "react-native"
import {useEffect} from "react"
import AtomeSvg from "../HomeScreen/svg/AtomeSvg"
import CheckSvg from "../HomeScreen/svg/CheckSvg"
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated,{ useAnimatedStyle, useSharedValue,withTiming,withSpring } from "react-native-reanimated";
const yPos = Dimensions.get('window').height/2-30
const xPos = Dimensions.get('window').width*0.9
export default Atome = () => {

    const translationX = useSharedValue(0)
    const translationY = useSharedValue(0)
    const isAnimating = useSharedValue(false)
    const isOverlapping = useSharedValue(false)
    const initialLayout = useSharedValue(false)
    const originalX = useSharedValue(0)
    const originalY = useSharedValue(0)
    const dragged = useSharedValue(null)
    const placedPoint = useSharedValue(false)
    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ translateX: translationX.value }, { translateY: translationY.value }],
        zIndex: isAnimating.value?99:0,
        backgroundColor:placedPoint.value? "transparent": withTiming(isOverlapping.value?'#cae1ff':"white",{duration:50}),
        borderWidth:withTiming(placedPoint.value?0:1),
      }));
      const placeHolderStyle = useAnimatedStyle(() => ({
        width:dragged.value?.width,
        height:dragged.value?.height,
        position:'absolute'
      }));
      const animatedTextStyle = useAnimatedStyle(() => ({
        color:withTiming(isOverlapping.value?'#6eaaff': "#000",{duration:50}),
        fontSize:18
      }));
      const animatedShadowStyle = useAnimatedStyle(() => ({
        borderBottomWidth:withTiming(placedPoint.value?0:3),
      }));
      const pan = Gesture.Pan()
      .activateAfterLongPress(100)
      .onStart(()=>{
        isAnimating.value=true
        placedPoint.value=false
        originalX.value=translationX.value
        originalY.value=translationY.value
      })
      .onUpdate((e) => {
        const draggedWidth = dragged.value?.width;
        const draggedHeight = dragged.value?.height;
 
        const draggedLeft = translationX.value+1+10;
        const draggedRight = translationX.value+ draggedWidth+1+10;
        const draggedTop = translationY.value  + yPos;
        const draggedBottom = draggedTop + draggedHeight;
        translationX.value = originalX.value+ e.translationX;
        translationY.value = originalY.value+e.translationY;
        const isOverlapY = -yPos+draggedHeight>translationY.value && translationY.value>-yPos-draggedHeight+20
        const isOverlapX = xPos-draggedWidth-90<translationX.value && translationX.value<xPos-draggedWidth+50
        isOverlapping.value = isOverlapX && isOverlapY
      })
      .onEnd((e)=>{
    // Optional: Reset the translation values if you want to return to the original position
       if (isOverlapping.value) {
        isOverlapping.value=false
        translationX.value = withSpring(xPos-dragged.value?.width-19,{damping:13});
        translationY.value = withSpring(-yPos-dragged.value?.height+55,{damping:13},()=>{
          isAnimating.value=false
        });
       } else {
        translationX.value = withSpring(0,{damping:13});
        translationY.value = withSpring(0,{damping:13},()=>{
          isAnimating.value=false
        });
       }
      })
    return(
        <View style={{flex:1,alignItems:'center',backgroundColor:'#fff',paddingTop:100}}>
         <Animated.View 
         style={[{borderWidth:1.5,borderStyle:'dashed',borderRadius:8,top:'7%',right:45},placeHolderStyle]}>
            <View style={{width:7,height:7,backgroundColor:'black',borderRadius:100,position:'absolute',bottom:-5,right:'50%'}}/>
            <View style={{width:2.5,height:58,backgroundColor:'black',position:'absolute',
            bottom:-50,right:'80%', transform:[{rotate:'50deg'}]}}/>
        </Animated.View>   
         <AtomeSvg/>
         <View style={{position:'absolute',left:0,top:Dimensions.get('window').height/2-30}}>
         <View style={{height:30,paddingLeft:10}}>
      <Text style={{color:'#C1C0C0'}}>Q : Placer ces termes sur le schéma</Text>
      </View>
    <View style={{flexDirection:'row',gap:10}}>
    <GestureDetector gesture={pan}>
        <View style={{alignSelf:'flex-start'}}>

        <Animated.View 
        style={[styles.container,animatedStyle]}
        onLayout={(e)=>{
          const {width,height} = e.nativeEvent.layout
          if (!initialLayout.value) {
            dragged.value={width,height}
          }

          initialLayout.value = true
        }}
        >
          <Animated.Text style={[styles.text,animatedTextStyle]}>électron</Animated.Text>
          <Animated.View style={[styles.shadow,animatedShadowStyle]}></Animated.View>
          
        </Animated.View>
        <Animated.View style={[styles.placeHolder,placeHolderStyle]}></Animated.View>
      </View> 
      </GestureDetector> 
      <View style={{alignSelf:'flex-start'}}>

   <Animated.View 
        style={[styles.container,{width:90,alignItems:'center'}]}
    >
  <Animated.Text style={[styles.text,{fontSize:18}]}>proton</Animated.Text>
  <Animated.View style={[styles.shadow,animatedShadowStyle]}></Animated.View>
  
     </Animated.View>
     <Animated.View style={[styles.placeHolder,placeHolderStyle]}></Animated.View>
    </View> 
      </View>
      </View>
         <View
          style={{backgroundColor:'white', borderColor: '#FF9A24',
          borderRadius:100 , paddingVertical:10,paddingHorizontal:7,borderWidth:2,zIndex:-1,marginTop:'auto',marginBottom:20
         }}> 
          <View style={{transform:[{translateY:-7}]}}>   
         <CheckSvg/>
         </View>   
         </View>

        </View>
    )
}
const styles = StyleSheet.create({
    container: {
      paddingRight: 8,
      paddingLeft:8,
      paddingVertical:8,
      borderWidth: 1,
      borderRadius: 8,
      borderColor: "#E8E6E8",
      backgroundColor:'white',
      left:10,
    },
    text: {
      fontFamily: 'Janda',
    },
    rotatedText: {
      transform:[{rotate:'45deg'}],
      fontFamily: 'Janda',
    },
    shadow: {
      ...StyleSheet.absoluteFillObject,
      borderRadius: 8,
      borderColor: "#E8E6E8",
      top: 4,
    },
    placeHolder:{
      backgroundColor:'#E8E6E8',
      zIndex:-1,
      borderRadius: 8,
      left:10,
    },})
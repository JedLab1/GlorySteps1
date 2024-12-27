import React, { useState, useEffect } from 'react';
import { View, Dimensions, Text, StyleSheet,TouchableOpacity,StatusBar } from 'react-native';
import Base from './Base';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { useSharedValue,useAnimatedStyle, withTiming, runOnJS, runOnUI, useAnimatedRef ,measure, withSpring} from 'react-native-reanimated';
import CheckSvg from '../HomeScreen/svg/CheckSvg';
import { vec } from '@shopify/react-native-skia';
import Svg, { Line,Path} from 'react-native-svg';
// Enable LayoutAnimation on Android
const CloseSvg = ()=>(
  <Svg height="18" width="18" viewBox="0 0 24 24">
  <Line 
    x1="5" 
    y1="5" 
    x2="19" 
    y2="19" 
    stroke="#000" 
    strokeWidth="3" 
    strokeLinecap="round" 
  />
  <Line 
    x1="19" 
    y1="5" 
    x2="5" 
    y2="19" 
    stroke="#000" 
    strokeWidth="3" 
    strokeLinecap="round" 
  />
</Svg>
)
export const ArrowSvg = ()=>(
  <Svg
  fill="#000"
  height="18"
  width="18"
  viewBox="0 0 330 330"
>
<Path d="M15 180h263.787l-49.394 49.394c-5.858 5.857-5.858 15.355 0 21.213C232.322 253.535 236.161 255 240 255s7.678-1.465 10.606-4.394l75-75c5.858-5.857 5.858-15.355 0-21.213l-75-75c-5.857-5.857-15.355-5.857-21.213 0-5.858 5.857-5.858 15.355 0 21.213L278.787 150H15c-8.284 0-15 6.716-15 15s6.716 15 15 15z" />
   
 
</Svg>
)

export default function Graph() {
  useEffect(() => {
    StatusBar.setBarStyle('light-content');
    const delay = 100; // Delay in milliseconds
    return () => {
      StatusBar.setBarStyle('dark-content');
    }; // Cleanup timer on unmount
  }, []);
  const initialWidth = Dimensions.get('window').width;
  const [axisLength, setAxisLength] = useState(initialWidth* 0.8 );
  const [fontSize, setFontSize] = useState(12);
  const [key, setKey] = useState(0);  // Key to force re-render
  const isOverlapping = useSharedValue(false)
  const placedPoint = useSharedValue(false)
  const initialLayout = useSharedValue(false)
  const initialTop = useSharedValue(0)
  const move = useSharedValue(0)
  const verif = useSharedValue(false)
  const toggleSizes = () => {
    // Apply layout animation for smoother updates

    setAxisLength(prev => (prev === initialWidth * 0.8 ? initialWidth * 0.5 : initialWidth * 0.8));
    setFontSize(prev => (prev === 12 ? 8 : 12));

    // Update key to force re-render of Base component
    setKey(prevKey => prevKey + 1);
  };
  const translationX = useSharedValue(0);
  const translationY = useSharedValue(0);
  const isAnimating = useSharedValue(false)
  const originalX = useSharedValue(0)
  const originalY = useSharedValue(0)
  const dragged = useSharedValue(null)
  const position = useSharedValue(-2)
  const [points, setPoints] = useState([]);
  const [lines, setLines] = useState([]);
  const verticalCursorShown=useSharedValue(false)
  const horizantalCursorShown=useSharedValue(false)
  const pan = Gesture.Pan()
    .activateAfterLongPress(100)
    .onStart(()=>{
      isAnimating.value=true
      placedPoint.value=false
      originalX.value=translationX.value
      originalY.value=translationY.value
    })
    .onUpdate((e) => {
      
      translationX.value = originalX.value+ e.translationX;
      translationY.value = originalY.value+e.translationY;
      if (points.length!==0) {
      //origin - point.y * scale
       const otherXStart = (axisLength-8)/8+(axisLength+2)*(points[0].x+5)/10;
       const otherXEnd = (axisLength-8)/8+(axisLength+2)*(points[0].x+5)/10;
       const otherYStart = axisLength/10*(5-points[0].y)+3
       const otherYEnd = axisLength/10*(5-points[0].y)-3;

       const draggedWidth = dragged.value?.width;
       const draggedHeight = dragged.value?.height;

       const draggedLeft = translationX.value+1+10;
       const draggedRight = translationX.value+ draggedWidth+1+10;
       const draggedTop = translationY.value  + axisLength + 20+initialTop.value;
       const draggedBottom = draggedTop + draggedHeight;

       // Check if any part of `other` is within the `dragged` boundaries
       const isOverlapX = draggedLeft <= otherXEnd && draggedRight >= otherXStart;
       const isOverlapY = draggedTop <= otherYEnd && draggedBottom >= otherYStart;
    // Final overlap check
       const isOverlap = isOverlapX && isOverlapY;
       if (isOverlap) {
        isOverlapping.value=true
       }else{
        isOverlapping.value=false
       }
      }

    })
    .onEnd((e) => {
      if (isOverlapping.value && points.length!==0) {
        isOverlapping.value=false
        const otherXStart = (axisLength-8)/8+(axisLength+2)*(points[0].x+5)/10;
        const otherXEnd = (axisLength-8)/8+(axisLength+2)*(points[0].x+5)/10;
        const otherYStart = axisLength/10*(5-points[0].y)+3
        const otherYEnd = axisLength/10*(5-points[0].y)-3;
        placedPoint.value=true
        const mouvementX = points[0].x>=0 ? otherXStart-15 :otherXStart-70
        const mouvementY =  points[0].y<0? otherYEnd- 1.7*dragged.value?.height-axisLength - 20-30 :
        otherYEnd- 2.1*dragged.value?.height-axisLength - 20-30
        translationX.value = withSpring(mouvementX,{damping:13});
        translationY.value = withSpring(mouvementY,{damping:13},()=>{
          isAnimating.value=false
        });
      }else{
      // Optional: Reset the translation values if you want to return to the original position
      translationX.value = withSpring(0,{damping:13});
      translationY.value = withSpring(0,{damping:13},()=>{
        isAnimating.value=false
      });
      }

    });

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
    color:withTiming(isOverlapping.value?'#6eaaff':verif.value? '#07db5c': "#000",{duration:verif.value?300:50}),
    fontSize: placedPoint.value?11 :18,
  }));
  const animatedShadowStyle = useAnimatedStyle(() => ({
    borderBottomWidth:withTiming(placedPoint.value?0:3),
  }));
  //cursorShowStyle
  const cursorShowStyle = useAnimatedStyle(() => ({
    transform:[{scale:withTiming(verticalCursorShown.value?0:1)}]
  }));
  const cursorNotShowStyle = useAnimatedStyle(() => ({
    transform:[{scale:withTiming(verticalCursorShown.value?1:0)},{rotate:'45deg'},{translateY:30},{translateX:-30}]
  }));
  const cursorShowStyle1 = useAnimatedStyle(() => ({
    transform:[{scale:withTiming(horizantalCursorShown.value?0:1)}]
  }));
  const cursorNotShowStyle1 = useAnimatedStyle(() => ({
    transform:[{scale:withTiming(horizantalCursorShown.value?1:0)},{rotate:'45deg'},{translateY:5},{translateX:-5}],
    pointerEvents:horizantalCursorShown.value?'auto':'none'
  }));
  const animatedConfetti = useAnimatedStyle(()=>({
    fontSize:verif.value?24:0,
    transform:[
      {translateX:2},
      {translateY:-5}
    ]
  }))
  const animatedSuper = useAnimatedStyle(()=>({
    fontSize:verif.value?16:0,
  }))
  
  const addPoint = () => {
    setPoints((prevPoints) => {
      const newPoint = { x: 3, y: -3};
      const updatedPoints = [...prevPoints, newPoint];
  
      setLines((prevLines) => [
        ...prevLines,
        { direction: 'horizontal', value: newPoint.y, crossedPoints: [] },
        { direction: 'vertical', value: newPoint.x, crossedPoints: [] }
      ]);
  
      return updatedPoints;
    });
  };
  const origin = axisLength / 2;
  const scale = axisLength / 10;
  const coordPool =  Array.from({ length:20 }, (_, index) => ({
    coord: useSharedValue(vec(0,0)),
  }));
  const horizantalCoordPool =  Array.from({ length:20 }, (_, index) => ({
    coord: useSharedValue(vec(0,0)),
  }));
  const addVerticalLine = ()=>{
    verticalCursorShown.value = true
    coordPool[lines.length].coord.value = vec(origin + 1 * scale, axisLength);
    coordPool[lines.length].coord.value = withTiming(vec(origin + 1 * scale, 0),{duration:500})
    coordPool[lines.length+1].coord.value = vec(origin + 1 * scale, axisLength)
    const p1 =coordPool[lines.length].coord
    const p2 =   coordPool[lines.length+1].coord
    setLines((prevLines) => [
      ...prevLines,
      { direction: 'vertical', value: 3, crossedPoints: [],p1:p1,p2:p2 },
    ]);
  }
  const addHorizontalLine = ()=>{
    //p1={{ x: 0, y: origin-line.value * scale }} p2={{ x: axisLength, y: origin-line.value * scale }} 
    horizantalCursorShown.value = true
    horizantalCoordPool[lines.length].coord.value = vec(0, origin-1 * scale);
    horizantalCoordPool[lines.length+1].coord.value = vec(0, origin-1 * scale);
    horizantalCoordPool[lines.length+1].coord.value = withTiming(vec(axisLength, origin-1 * scale),{duration:500})
    const p1 =horizantalCoordPool[lines.length].coord
    const p2 =   horizantalCoordPool[lines.length+1].coord
    setLines((prevLines) => [
      ...prevLines,
      { direction: 'vertical', value: 3, crossedPoints: [],p1:p1,p2:p2 },
    ]);
  }
  const [currentPosition, setCurrentPosition] = useState(0);
  const [currentHorizontalPosition, setCurrentHorizontalPosition] = useState(0);
const handleUpPress = () => {
    const line = lines[1];
    let newY
    if (currentHorizontalPosition===0) {
      newY = line.p1.value.y - scale;
    }else{
      newY = currentHorizontalPosition - scale;
    }
     // Increment the current position by scale
  
    // Update the current position immediately
    setCurrentHorizontalPosition(newY);
  
    // Animate the line to the new position
    line.p1.value = withTiming(vec(0, newY));
    line.p2.value = withTiming(vec(axisLength,newY));
  };
  const handleDownPress = () => {
    const line = lines[1];
    let newY
    if (currentHorizontalPosition===0) {
      newY = line.p1.value.y + scale;
    }else{
      newY = currentHorizontalPosition + scale;
    }
     // Increment the current position by scale
  
    // Update the current position immediately
    setCurrentHorizontalPosition(newY);
  
    // Animate the line to the new position
    line.p1.value = withTiming(vec(0, newY));
    line.p2.value = withTiming(vec(axisLength,newY));
  };
const handleRightPress = () => {
  const line = lines[0];
  let newX
  if (currentPosition===0) {
    newX = line.p1.value.x + scale;
  }else{
    newX = currentPosition + scale;
  }
   // Increment the current position by scale

  // Update the current position immediately
  setCurrentPosition(newX);

  // Animate the line to the new position
  line.p1.value = withTiming(vec(newX, 0));
  line.p2.value = withTiming(vec(newX, axisLength));
};

const handleLeftPress = () => {
  const line = lines[0];
  let newX
  if (currentPosition===0) {
    newX = line.p1.value.x - scale;
  }else{
    newX = currentPosition - scale;
  }
   // Increment the current position by scale

  // Update the current position immediately
  setCurrentPosition(newX);

  // Animate the line to the new position
  line.p1.value = withTiming(vec(newX, 0));
  line.p2.value = withTiming(vec(newX, axisLength));
};
const handleClosePress = () => {
  verticalCursorShown.value=false
  horizantalCursorShown.value = false
  setPoints([...points,{x:(lines[0].p1.value.x-origin)/scale,y:(origin-lines[1].p1.value.y)/scale}])
  lines[0].p1.value = withTiming(vec(lines[0].p1.value.x,axisLength-((origin-lines[1].p1.value.y)/scale+5)*scale))
  lines[0].p2.value = withTiming(vec(lines[0].p1.value.x,origin))
  lines[1].p1.value = withTiming(vec(origin,lines[1].p1.value.y))
  lines[1].p2.value = withTiming(vec(axisLength-((origin-lines[0].p1.value.x)/scale+5)*scale,lines[1].p1.value.y))
}
const handleVerif = ()=>{
  verif.value = true
}
  return (
    <View style={{flex:1,backgroundColor:'white'}}>
    <View style={{alignItems:'center'}}>
      <Base
        key={key}  // Force re-render by changing key
        xMin={-5}
        lines={lines}
        points={points}
        xMax={5} 
        yMin={-5}
        yMax={5}
        functions={[x => x**2]} //x => Math.cos(x), x => 2 * x - 2
        axisLength={axisLength}
        fontSize={fontSize}
        move={move}
      />
    </View>
    <View style={{alignItems: 'flex-start',position:'absolute',top:axisLength+20}}>

      <View  style={{paddingBottom:20,flexDirection:'row',width:'100%',paddingHorizontal:10,alignItems:'center'}} onLayout={(e)=>{
        const {width,height,} = e.nativeEvent.layout
        initialTop.value = height+30
      }}>
           <TouchableOpacity onPress={addVerticalLine}>
          <Animated.View  style={[styles.cursor,cursorShowStyle]} >
            <Text style={[styles.text,{fontSize:20,lineHeight:26}]}>x</Text>
          </Animated.View>
          </TouchableOpacity>
          <View style={{marginLeft:3,transform:[{rotate:'-90deg'}]}}>
            <ArrowSvg/>
          </View>
       
          <Animated.View style={[styles.circle,cursorNotShowStyle]}>
          {/* Top Left Quadrant */}
          <View style={[styles.quadrant, styles.topLeft]} >
            <View style={{transform:[{rotate:'-45deg'},{translateY:-7}]}}>
            <CheckSvg width={15} color={'black'}/>
            </View>
          </View>
  
          {/* Top Right Quadrant */}
          
          
          <TouchableOpacity style={[styles.quadrant, styles.topRight]} onPress={handleRightPress}>
          <View style={{transform:[{rotate:'-45deg'},]}}>
              <ArrowSvg/>
            </View>
           </TouchableOpacity> 
          
          
  
          {/* Bottom Left Quadrant */}
          
          
          <TouchableOpacity style={[styles.quadrant, styles.bottomLeft]} onPress={handleLeftPress}>
          <View style={{transform:[{rotate:'135deg'}]}}>
            <ArrowSvg/>
          </View>
          </TouchableOpacity>  
          
  
          {/* Bottom Right Quadrant */}
          
         
          <TouchableOpacity style={[styles.quadrant, styles.bottomRight]} onPress={handleClosePress}>
          <View style={{transform:[{rotate:'-45deg'}]}}>
            <CloseSvg/>
            </View>
          </TouchableOpacity>
        
          
        </Animated.View>
        <View style={{marginLeft:'auto',marginRight:5}}>
              <ArrowSvg/>
        </View>
        <Animated.View  style={[styles.cursor,cursorShowStyle1,{paddingVertical:3}]} onTouchEnd={()=>{
                    addHorizontalLine()
                  }}>
            <Text style={[styles.text,{fontSize:20,lineHeight:20}]}>y</Text>
          </Animated.View>

       
          <Animated.View style={[styles.circle,cursorNotShowStyle1,{position:'absolute',right:10}]}>
          {/* Top Left Quadrant */}
          <TouchableOpacity style={[styles.quadrant, styles.topLeft]} onPress={handleUpPress}>
          <View style={{transform:[{rotate:'-135deg'}]}}>
            <ArrowSvg/>
          </View>
          </TouchableOpacity>
  
          {/* Top Right Quadrant */}
          <TouchableOpacity style={[styles.quadrant, styles.topRight]}  >
          <View style={{transform:[{rotate:'-45deg'},{translateY:-7}]}}>
            <CheckSvg width={15} color={'black'}/>
            </View>
          </TouchableOpacity>
  
          {/* Bottom Left Quadrant */}
          <TouchableOpacity style={[styles.quadrant, styles.bottomLeft]} onPress={handleClosePress}>
          <View style={{transform:[{rotate:'-45deg'}]}}>
            <CloseSvg/>
            </View>
          </TouchableOpacity>
  
          {/* Bottom Right Quadrant */}
          <View style={[styles.quadrant, styles.bottomRight]} onTouchEnd={handleDownPress}>
          <View style={{transform:[{rotate:'45deg'}]}}>
            <ArrowSvg/>
          </View>
          </View>
        </Animated.View>

        


      </View>
      <View style={{height:30,paddingLeft:10}}>
      <Text style={{color:'#C1C0C0'}}>Q : Placer ce point sur le repère</Text>
      </View>
      <GestureDetector gesture={pan}>
        <View>
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
          <Animated.Text style={[styles.text,animatedTextStyle]}>A (2,4)</Animated.Text>
          <Animated.View style={[styles.shadow,animatedShadowStyle]}></Animated.View>
          
        </Animated.View>
        <Animated.View style={[styles.placeHolder,placeHolderStyle]}></Animated.View>
      </View> 
      </GestureDetector> 
      
            {/* Button to add point at (1, 2) */}
      

    </View>
    <TouchableOpacity style={{marginTop:'auto',alignItems:'center',marginBottom:10}} onPress={handleVerif}>
      <View style={{flexDirection:'row',alignItems:'center',justifyContent:'center'}}>
      <Animated.Text style={animatedSuper}>Super</Animated.Text>
      <Animated.Text style={animatedConfetti}>🎉</Animated.Text>
      </View>

    <View
        style={{backgroundColor:'white', borderColor: '#FF9A24',
            borderRadius:100 , paddingVertical:10,paddingHorizontal:7,borderWidth:2,zIndex:-1
            }}> 
      <View style={{transform:[{translateY:-7}]}}>   
      <CheckSvg/>
      </View>   
    </View>
    </TouchableOpacity>

    </View>
  );
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
  },
  cursor:{
    borderWidth:2,
    borderRadius:5,
    borderColor:'#E7E4E4',
    paddingHorizontal:7,
    backgroundColor:'white',
    justifyContent:'center',
    alignItems:'center'
  },
  line: {
    height: 35,
    borderRightWidth: 1.5,
    borderColor: 'black',    // Set the color of the dashed line
    borderStyle: 'dashed',   // Apply the dashed style
  },
  horizantalLine: {
    height: 3,
    width:35,
    borderTopWidth: 1.5,
    borderColor: 'black',    // Set the color of the dashed line
    borderStyle: 'dashed',   // Apply the dashed style
  },
  circle: {
    width:60,
    height: 60,
    backgroundColor: 'white',
    position: 'relative',
    borderWidth:1.5,
    borderColor:'#E8E6E8',
    
  },
  quadrant: {
    position: 'absolute',
    width: '50%',
    height: '50%',
    borderColor:'#E8E6E8',
    justifyContent:'center',
    alignItems:'center'
  },
  topLeft: {
    left: 0,
    top: 0,
    borderBottomWidth:1.5,
    borderRightWidth:1.5,
  },
  topRight: {
    right: 0,
    top: 0,
    borderBottomWidth:1.5,
  },
  bottomLeft: {
    left: 0,
    bottom: 0,
    borderRightWidth:1.5,
  },
  bottomRight: {
    right: 0,
    bottom: 0,
  },

});
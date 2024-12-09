import React, { useState, useEffect } from 'react';
import { View, Dimensions, Text, LayoutAnimation, UIManager, Platform,Button, StyleSheet } from 'react-native';
import Base from './Base';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { useSharedValue,useAnimatedStyle, withTiming, runOnJS, runOnUI, useAnimatedRef ,measure} from 'react-native-reanimated';

// Enable LayoutAnimation on Android

export default function Graph() {
  const initialWidth = Dimensions.get('window').width;
  const [axisLength, setAxisLength] = useState(initialWidth * 0.8);
  const [fontSize, setFontSize] = useState(12);
  const [key, setKey] = useState(0);  // Key to force re-render

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
  const pointUi = useSharedValue(null)
  const position = useSharedValue(null)
  const checkHover = () => {
    'worklet';
    if (!pointUi.value) return false;
    const origin = axisLength / 2;
    const scale = axisLength / (8); // Dynamically scale to fit the x range          
    const cx=origin + pointUi.value.x * scale
    const cy=origin - pointUi.value.y * scale
    const posX=translationX.value+57
    const posY=translationY.value+axisLength+10
    const dx=posX-cx
    const dy = posY-cy
    const distance = Math.sqrt(dx * dx + dy * dy);
    console.log(distance)
  };
  const pan = Gesture.Pan()
    .onBegin(()=>{
      isAnimating.value=true
    })
    .onUpdate((e) => {
      translationX.value = e.translationX;
      translationY.value = e.translationY;
      checkHover(); // Check if hovering during drag
    })
    .onEnd(() => {
      // Optional: Reset the translation values if you want to return to the original position
      translationX.value = withTiming(0);
      translationY.value = withTiming(0,{},()=>{
        isAnimating.value=false
      });
    });

  const animatedStyle = useAnimatedStyle(() => ({

    transform: [{ translateX: translationX.value }, { translateY: translationY.value }],
    zIndex: isAnimating.value?99:0
  }));
  const [point, setPoint] = useState();
  const addPoint = () => {
    'worklet';
    pointUi.value={ x: -1, y: 3 }
    runOnJS(setPoint)({ x: -1, y: 3 });
  };


  return (
    <View style={{flex:1,gap:20,padding:10,backgroundColor:'white'}}>
    <View style={{justifyContent: 'flex-end', alignItems: 'center' }}>
      <Base
        key={key}  // Force re-render by changing key
        xMin={-5}
        point={point}
        xMax={5} 
        yMin={-5}
        yMax={5}
        functions={[x => Math.cos(x), x => 2 * x - 2]}
        axisLength={axisLength}
        fontSize={fontSize}
      />
    </View>
    <View style={{alignItems: 'flex-start' }}>
      <GestureDetector gesture={pan}>
        <Animated.View 
        style={[{padding:5,borderWidth:1,borderRadius:6,backgroundColor:'white'},animatedStyle]}>
          <Text style={{fontFamily:'Janda'}}>A (2,-3)</Text>
        </Animated.View>
      </GestureDetector> 
            {/* Button to add point at (1, 2) */}
      <Button title="Add Point" onPress={addPoint} />

    </View>
    
    </View>
  );
}

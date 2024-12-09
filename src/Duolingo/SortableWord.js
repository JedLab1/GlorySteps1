import { View, StyleSheet,Dimensions } from 'react-native';
import React, { useEffect } from 'react';
import { useAnimatedStyle, useSharedValue, withSpring ,useDerivedValue,useAnimatedReaction, withTiming} from 'react-native-reanimated';
import {
  calculateLayout,
  reorder
} from './Layout';
import Animated from 'react-native-reanimated';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import { useVector } from "react-native-redash";

const keyHeight = Dimensions.get('window').height/2-40;
export default function SortableWord({
  offsets,
  index,
  children,
  containerWidth,
  containerHeight,
  isActive,
  keyboardHeight,
  onRendering,
}) {
  const offset = offsets[index];
  const isGestureActive = useSharedValue(false)
  const isAnimating = useSharedValue(false);
  const translation = useVector();
  const hasSwapped = useSharedValue(false)
  const originalX = useSharedValue(0)
  const originalY = useSharedValue(0)
  useEffect(() => {
    if (index===offsets.length-1) {
      calculateLayout(offsets, containerWidth, containerHeight,true);
      
    }
  }, [index]);
  // Worklet to check for overlap with other items
  // Worklet to check if a significant part of the dragged item overlaps another item
const checkOverlapForSwap = (x, y) => {
  'worklet'; // This function runs on the UI thread
  const draggedWidth = offset.width.value;
  const draggedCenterX = x + draggedWidth / 2;
  const draggedCenterY = y + offset.height.value / 2;

  for (let i = 0; i < offsets.length; i++) {
    if (i !== index && i!==0 && index!==0) {
      const otherOffset = offsets[i];
      const otherXStart = otherOffset.x.value;
      const otherXEnd = otherXStart + otherOffset.width.value;
      const otherYStart = otherOffset.y.value;
      const otherYEnd = otherYStart + otherOffset.height.value;
      
      // Check if the center of the dragged item is within the bounds of another item 
      const isOverlapX = draggedCenterX >= otherXStart && draggedCenterX <= otherXEnd;
      const isOverlapY = draggedCenterY >= otherYStart && draggedCenterY <= otherYEnd;

      if (isOverlapX && isOverlapY) {
        // Trigger the swap behavior when a nice portion of overlap is detected
        otherOffset.status.value='swapTarget'
        reorder(offsets,offset.order.value,otherOffset.order.value)
        calculateLayout(offsets, containerWidth,containerHeight,false)
        hasSwapped.value=true
        break;
      }
    }
  }
};
 
  // Pan gesture handler
  const pan = Gesture.Pan()
    .activateAfterLongPress(100)
    .onStart((e)=>{  
      if (!isActive || keyboardHeight.value!==0) return;  // Disable the gesture if isActive is true          
      translation.x.value = offset.x.value;
      translation.y.value = offset.y.value;
      originalX.value = translation.x.value
      originalY.value = translation.y.value
      isGestureActive.value=true
    })
    .onUpdate((event) => {
      if (!isActive || keyboardHeight.value!==0) return;  // Disable the gesture if isActive is true

      offset.status.value='dragging'
    
      translation.x.value = originalX.value+event.translationX;
      translation.y.value = originalY.value+event.translationY;
      checkOverlapForSwap(translation.x.value,translation.y.value);
    })
    .onEnd((event ) => {
      if (!isActive || keyboardHeight.value!==0) return;  // Disable the gesture if isActive is true
      isAnimating.value = true;
      offset.status.value='resting'
      translation.x.value = withSpring(
        offset.x.value,
        { velocity: event.velocityX },
        () => {
          isAnimating.value = false
          
        }
      );
      translation.y.value = withSpring(offset.y.value, { velocity: event.velocityY });
      isGestureActive.value = false
    });
    const translateX = useDerivedValue(() => {
      if (isGestureActive.value) {
        return translation.x.value;
      }
      if (offset.order.value===-1) {
        return withTiming(
          -600
        );
      }
      return withSpring(
        offset.x.value,{damping:13}
      );
    });
    const translateY = useDerivedValue(() => {
      if (isGestureActive.value) {
        return translation.y.value;
      }
      if (offset.order.value===-1) {
        return withTiming(0)
      }
      return withSpring(
        offset.y.value,{damping:13},()=>{
          if (offset.status.value==='swapTarget') {
            offset.status.value='resting'
          }
        }
      );
    });
  useAnimatedReaction(
    ()=>offset.order.value,
    (current,previous)=>{
      if (current!==previous ) {
        if (current===-1) { 
          offset.x.value=-600
          calculateLayout(offsets,containerWidth,containerHeight)
        }
      }
    }
  )  
  // Animated style for the word
  const animatedStyle = useAnimatedStyle(() => {
    return {
      width: offset.width.value,
      height: offset.height.value,
      position: index!==0  ?'absolute':'relative',
      transform: [
        { translateX:isActive? index!==0 ?translateX.value:0 : offset.x.value},
        { translateY:isActive ? index!==0 ?translateY.value:withSpring(offset.y.value) :offset.y.value},
      ],
      zIndex: isGestureActive.value || isAnimating.value  ? 100:0,
    };
  });

  return (
    <GestureDetector gesture={Gesture.Simultaneous(pan)} >
      <Animated.View style={[animatedStyle]}>
        <View style={StyleSheet.absoluteFill} onLayout={()=>{
        }}>
          {children}
        </View>
      </Animated.View>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  animatedView: {
    top: 0,
    left: 0,
  },
});

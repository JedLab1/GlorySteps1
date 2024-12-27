import { View, Text, Dimensions ,StyleSheet } from 'react-native'
import React,{useState,useEffect} from 'react'
import { useSharedValue, runOnUI, runOnJS } from "react-native-reanimated";
import SortableWord from './SortableWord';
const containerWidth = Dimensions.get("window").width;
const styles = StyleSheet.create({
    container: {
      flexDirection:'row',
    },
})    
export default function WordList({children, containerHeight,isActive,onRendering,offsets,index,keyboardHeight}) {
    const [ready, setReady] = useState(false);
    if (!ready) {
        return (
          <View style={[styles.container, { opacity: 0, position: 'absolute', top: -1000, left: -1000 }]}>
          {React.Children.map(children, (child, index) => {
            const offset = offsets[index];
            return (
              <View
                key={index}
                onLayout={({ nativeEvent: { layout: { width, height } } }) => {
                  if (offset) { // Check if offset is defined
                    runOnUI(() => {
                      "worklet";
                      if (index===offsets.length-1) {
                        runOnJS(setReady)(true);
                      }
                    })();
                  } else {
                    console.warn(`Offset is undefined for index ${index}`); // Log warning
                  }
                }}
              >
                {React.cloneElement(child, { offset,isMain:false,offsets,containerHeight,containerWidth  })} 
              </View>
            );
          })}
        </View>
        );
      }
  return (
    <View style={styles.container} onLayout={()=>{
      onRendering()
    }}>   
    {children.map((child, index) => {
      const offset = offsets[index];
      return(
      <SortableWord
        key={index} 
        offsets={offsets}
        index={index}
        containerWidth={containerWidth}
        containerHeight={containerHeight}
        isActive={isActive}
        onRendering={onRendering}
        keyboardHeight={keyboardHeight}
      >
        {React.cloneElement(child, { offset,isMain:true,offsets,containerHeight,containerWidth })} 
      </SortableWord>
    )})}
  </View>
  )
    }
    

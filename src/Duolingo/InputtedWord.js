import { View, Text ,StyleSheet,Dimensions} from 'react-native'
import React from 'react'
import Animated, { withTiming,useAnimatedStyle } from 'react-native-reanimated'
import Svg, { Path} from 'react-native-svg';
import { FractionDisplay, analyzeExpression, isFraction } from "../Fraction/Fraction";
const keyHeight = Dimensions.get('window').height/2-40;
const KeyboardSvg = ()=>{
    return(
        <Svg
        width={15}
        height={10}
        viewBox="0 0 15 10"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        >
        <Path
          d="M3.552 5.652a.634.634 0 00-.225-.143.682.682 0 00-.518 0 .614.614 0 00-.368.368.682.682 0 101.254 0 .682.682 0 00-.143-.225zm4.97-1.561h.683a.682.682 0 000-1.364h-.682a.682.682 0 000 1.364zm-2.727 0h.682a.682.682 0 000-1.364h-.682a.682.682 0 000 1.364zM3.75 2.727h-.682a.682.682 0 000 1.364h.682a.682.682 0 000-1.364zM12.954 0H2.045A2.045 2.045 0 000 2.045V7.5a2.045 2.045 0 002.045 2.045h10.91A2.046 2.046 0 0015 7.5V2.045A2.045 2.045 0 0012.954 0zm.682 7.5a.682.682 0 01-.681.682H2.044a.682.682 0 01-.681-.682V2.045a.682.682 0 01.681-.681h10.91a.682.682 0 01.681.681V7.5zm-4.09-2.045H5.454a.682.682 0 000 1.363h4.09a.682.682 0 000-1.363zm2.386-2.728h-.682a.682.682 0 000 1.364h.682a.682.682 0 000-1.364zm.484 2.925a.681.681 0 00-.225-.143.682.682 0 00-.518 0 .634.634 0 00-.225.143.684.684 0 00-.143.225.683.683 0 001.063.792.681.681 0 00.246-.533.572.572 0 00-.055-.259.682.682 0 00-.143-.225z"
          fill="#000"
        />
      </Svg>
    )
}
export default function InputtedWord({offset,containerHeight,containerWidth,calculateLayout,offsets,keyboardHeight}) {

    const handleBack = ()=>{
        offset.reInputted.value=true
        keyboardHeight.value = withTiming(keyHeight)
    }   
    const animatedStyle = useAnimatedStyle(() => {
        const isDragging = offset.status.value === 'dragging' && offset.order.value!==0;
        return {
          transform: [{ scale: withTiming(isDragging ? 1.2 : 1) }],
        };
        
      });
    const wordsList = analyzeExpression(offset.word.value).item_list
    return (
        <Animated.View style={[{flex:1,paddingLeft:10},animatedStyle]}>
        <View 
        style={styles.container}
        >

            <View 
                onLayout={(e)=>{
                    const {width,height} = e.nativeEvent.layout
                    offset.width.value=withTiming(width+30,{duration:50},()=>{
                        offset.height.value = height+15
                        calculateLayout(offsets,containerWidth,containerHeight)
                    })
                }}
                style={{flexDirection:"row",alignItems:'center',gap:3}}
            >
            {wordsList.map((word, index) => (
             <React.Fragment key={index}>
              {word.isfraction ? (
                <View style={{flexDirection:"row",alignItems:'center',gap:3}}>
                <Text style={{ fontFamily: 'Janda', fontSize: 18 }}>
                {word.index===0 && word.sign==='+'?'':word.sign}
                </Text>
               <FractionDisplay expression={`${word.value}`} />
               </View>
               ) : (
              <Text style={{ fontFamily: 'Janda', fontSize: 18 }}>
               {word.index===0 && word.sign==='+'?'':word.sign}{word.value}
              </Text>
               )}
            </React.Fragment>
             ))}


            </View>
            <View style={styles.back} onTouchStart={handleBack}>
                <KeyboardSvg/>
            </View>
        </View>
        </Animated.View>
    )
}

const styles = StyleSheet.create({
    container:{
        borderStyle:'dashed',
        borderRadius:10,
        borderWidth:1.5,
        backgroundColor:'white',
        alignItems:'center',
        justifyContent:'center',
        flex:1
    }, 
    text:{
        fontFamily:'Janda',
        fontSize:18
    },
    back:{
        borderRadius:100,
        paddingHorizontal:5,
        paddingVertical:7,
        borderWidth:1.5,
        borderStyle:'dashed',
        position:'absolute',
        bottom:-16,
        left:-12,
        zIndex:100,
        alignItems:'center',
        justifyContent:'center',
        backgroundColor:'white',
        borderColor:'#d7d6d7'
    }
})
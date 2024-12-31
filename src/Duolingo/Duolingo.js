import React, { useCallback,useState } from 'react';
import { StyleSheet, Dimensions, Text,TouchableOpacity, FlatList } from 'react-native';
import Word from './Word';
import WordList from './WordList';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, useAnimatedReaction,runOnUI} from 'react-native-reanimated';
import StaticLine from './StaticLine';
import { calculateLayout } from '../Duolingo/Layout';
import DeleteButton from '../HomeScreen/svg/Delete';
const containerWidth = Dimensions.get('window').width;
const screenHeight =Dimensions.get('window').height/2; 
const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderTopWidth: 2,
    borderBottomWidth: 2,
    borderColor: '#edeaea', 
  },
});
import Validate from '../HomeScreen/svg/Validate';
import CheckSvg from '../HomeScreen/svg/CheckSvg';
import StartSvg from '../HomeScreen/svg/StartSvg';

// Memoized Duolingo component for optimized re-rendering
const Duolingo = ({ 
  onRendering, 
  words,
  containerHeight,
  keyboardHeight,
  staticLineUnmount, scroll,
  animatedText, scrollViewRef
 }) => {
  const [staticLineList, setStaticLineList] = useState([]);
  // Animated style for dynamic container height
  const animatedContainerStyle = useAnimatedStyle(() => ({
    width: containerWidth,
    height: containerHeight.value,
  }));
  const shouldMoveUp = useSharedValue(false)
  const translationY = useSharedValue(0)
  const offsets = words.map((e, index) => ({
    order: useSharedValue(index),
    width: useSharedValue(0),
    height: useSharedValue(0),
    x: useSharedValue(0),
    y: useSharedValue(0),
    status: useSharedValue('resting'),
    word: useSharedValue(e.word),
    clicked: useSharedValue(false),
    inputted:useSharedValue(false),
    reInputted:useSharedValue(false),
    operationFirst :useSharedValue(''),
    operationSecond :useSharedValue(''),
    operationWidth:useSharedValue(0),
    operationHeight:useSharedValue(0),
    operationNeighborIndex : useSharedValue(-1),
    operationOrder : useSharedValue(-1),
  }));
  const offsetPool =  Array.from({ length:20 }, (_, index) => ({
    order: useSharedValue(-1),
    width: useSharedValue(0),
    height: useSharedValue(0),
    x: useSharedValue(0),
    y: useSharedValue(0),
    status: useSharedValue('resting'),
    word: useSharedValue(''),
    clicked: useSharedValue(false),
    inputted: useSharedValue(false),
    reInputted:useSharedValue(false),
    operationFirst :useSharedValue(''),
    operationSecond :useSharedValue(''),
    operationWidth:useSharedValue(0),
    operationHeight:useSharedValue(0),
    operationNeighborIndex : useSharedValue(-1),
    operationOrder : useSharedValue(-1),
  }));


  const [lineList, setLineList] = useState(offsets);

  useAnimatedReaction(
    ()=>keyboardHeight.value,
    (current,prev)=>{
      if (current!==prev && current<prev) {
        shouldMoveUp.value=false
      }
      if (current!==prev && current>prev && translationY.value!==0) {
        shouldMoveUp.value=true
      }
    }
  )
  const animatedBigContainerStyle = useAnimatedStyle(() => {
    return{
    transform:[{
      translateY: withTiming(shouldMoveUp.value && keyboardHeight.value!==0 ?translationY.value:0)
    }],
  }});
  const animatedControl = useAnimatedStyle(() => {
    return{
      opacity:keyboardHeight.value===0?1:0
  }});
  const unmount = useCallback(() => {
    setStaticLineList(prev => prev.slice(0, -1));
  }, []);
  const getOffsetsSnapshot = () => {
    return offsets.map(item => ({
      order: item.order.value,
      width: item.width.value,
      height: item.height.value,
      x: item.x.value,
      y: item.y.value,
      status: item.status.value,
      word: item.word.value,
      clicked: item.clicked.value,
      inputted:item.inputted.value,
      reInputted:item.reInputted.value,
      operationFirst: item.operationFirst.value,
      operationSecond: item.operationSecond.value,
      operationWidth:item.operationWidth.value,
      operationHeight:item.operationHeight.value,
      operationNeighborIndex:item.operationNeighborIndex.value,
      operationOrder:item.operationOrder.value,
    }));
  };
  const getContainerHeightSnapshot = ()=>{
    return containerHeight.value
  }
  
  const addNewLine =  useCallback(() => {
    const offsetsSnapshot = getOffsetsSnapshot();
    const containerHeightSnapshot = getContainerHeightSnapshot()

    setStaticLineList(prev => [...prev, {offsets:offsetsSnapshot,containerHeight:containerHeightSnapshot}]);
    runOnUI(() => {
      offsets.forEach(offset => {   
        offset.clicked.value = false;
        offset.inputted.value = false
      });
    })();
  })
  const deleteLastLine = () => {
    'worklet';
    if (staticLineList.length > 0) {
      const lastStaticLine = staticLineList[staticLineList.length - 1];
      
      runOnUI(() => {
        // Batch all offset updates within a single UI thread block
        offsets.forEach((offset, index) => {
          const source = lastStaticLine.offsets[index];
          // Update offset properties in batch on the UI thread
          offset.order.value = source.order;
          offset.width.value = withTiming(source.width,{},()=>{
            offset.x.value = source.x;

            calculateLayout(offsets, containerWidth, containerHeight)
          }); // Simplified without callback
          offset.height.value = source.height;
          offset.y.value = source.y;
          offset.status.value = source.status;
          offset.word.value = source.word;
          offset.clicked.value = false;
          offset.inputted.value = source.inputted;
          offset.operationFirst.value = source.operationFirst;
          offset.operationSecond.value = source.operationSecond;
          offset.operationWidth.value = source.operationWidth;
          offset.operationHeight.value = source.operationHeight;
          offset.operationNeighborIndex.value = source.operationNeighborIndex
          offset.operationOrder.value = source.operationOrder
          
        });
        
        // Perform layout recalculation directly on the UI thread
        //calculateLayout(offsets, containerWidth, containerHeight);
      })();

      // Use runOnJS minimally to update state in React
      
    }
  };
  const onDismiss = useCallback((index) => {
    
    
    setStaticLineList((staticLineList) => 
        staticLineList.filter((_, itemIndex) => itemIndex !== index)
    );
}, []);
  const shouldLastDismiss = useSharedValue(false)

  return (
    <Animated.View
      onLayout={(e)=>{
        const {height} = e.nativeEvent.layout         
        if (height>screenHeight*2-220+containerHeight.value) {
          //scrollViewRef.current.scrollToEnd({animated:true})
          scroll.value = withTiming(height, { duration: 500 })
        }
        if (height>screenHeight-20 ) {
          if (height-screenHeight-20>240) {
            translationY.value = -screenHeight+containerHeight.value/3
          }else{
            translationY.value=screenHeight-height-100+containerHeight.value/3
          }
          shouldMoveUp.value=true
        }else{
          shouldMoveUp.value=false
          translationY.value=-screenHeight+height
        }
      }}
      style={[animatedBigContainerStyle]}
    >
      {/* Render static lines */}
      <Text style={{paddingHorizontal:5,color:'#C1C0C0'}}>Q : simplifier au maximum</Text>
      {staticLineList.map((line, index) => {
          return(
            <StaticLine 
            offsets={line.offsets}  
            containerHeight={line.containerHeight} 
            key={`${index}-${line.containerHeight}`} 
            staticLineUnmount={index===staticLineList.length-1?staticLineUnmount:null}
            staticLineList={staticLineList}
            setStaticLineList={setStaticLineList}
            onDismiss={onDismiss}
            shouldLastDismiss={shouldLastDismiss}
            index={index}
            />
        )
        }
    )}

      
      {/* Render dynamic words */}
      <Animated.View style={[styles.container, animatedContainerStyle,{zIndex:99}]}>
        <MemoizedWordList
          containerHeight={containerHeight}
          isActive={staticLineList.length !== 0}
          onRendering={onRendering}
          offsets={lineList}
          keyboardHeight={keyboardHeight}
          scrollViewRef={scrollViewRef}
        >
          {lineList.map((item,index) => (
            
            <MemoizedWord key={index} isActive={staticLineList.length !== 0}  keyboardHeight={keyboardHeight} animatedText={animatedText} staticLineList={staticLineList}/>
          ))}
        </MemoizedWordList>
      </Animated.View>
      {staticLineList.length===0 ? (
        <Animated.View style={{alignItems:'center'}}>
        <TouchableOpacity onPress={()=>{
          addNewLine()
        }}>
          <Animated.View
          style={{backgroundColor:'white', borderColor: '#1b6ff5',
          borderRadius:100 ,borderWidth:2, paddingVertical:7,paddingHorizontal:6,zIndex:-1,transform:[{translateY:-5}]
          }}>
            <StartSvg/>
          </Animated.View>
        </TouchableOpacity>
      </Animated.View>
      ):(
        <Animated.View style={[{ flexDirection: 'row',justifyContent:'space-around',marginBottom:20},animatedControl]} >
        <TouchableOpacity onPress={addNewLine}>
        <Animated.View
          style={{backgroundColor:'white', borderColor: '#07db5c',
            borderRadius:100 ,borderWidth:2, paddingVertical:8,paddingHorizontal:6,zIndex:-1,transform:[{translateY:-5}]
            }} >
            <Validate/>  
        </Animated.View>
        </TouchableOpacity>
          <TouchableOpacity onPress={()=>{
              deleteLastLine()
              shouldLastDismiss.value=!shouldLastDismiss.value
            }}>
          <Animated.View 
          style={{backgroundColor:'white', borderColor: '#F33E62',
            borderRadius:100 , paddingVertical:7,paddingHorizontal:8,borderWidth:2,zIndex:-1,transform:[{translateY:-5}]
            }} >
              
              <DeleteButton/>
          </Animated.View>
          </TouchableOpacity>

        <Animated.View
          style={{backgroundColor:'white', borderColor: '#FF9A24',
            borderRadius:100 , paddingVertical:4,paddingHorizontal:8,borderWidth:2,zIndex:-1,transform:[{translateY:-5}]
            }}> 
            <CheckSvg/>
          </Animated.View>
      </Animated.View>
      )}
      
    </Animated.View>
  );
};

// Memoize WordList to prevent unnecessary re-renders
const MemoizedWordList = React.memo(WordList);

// Memoize Word for efficient re-renders of individual words
const MemoizedWord = React.memo(Word);

export default Duolingo;

import React ,{useEffect}from 'react';
import { View, Text, StyleSheet, StatusBar, TouchableOpacity, Pressable,Dimensions } from 'react-native';
import Svg, { Line,G,Rect,Mask,Path,Defs,ClipPath } from 'react-native-svg';
import useStore from './Store';
import {
  Canvas,
  LinearGradient,
  RoundedRect,
  Skia,
  Shader,
  vec,
  Circle
} from "@shopify/react-native-skia";
import FunctionSvg from './svg/FunctionSvg';
import ChemistrySvg from './svg/ChemistrySvg';
export const TestSvg = ()=>(
  <Svg
  width={40}
  height={40}
  viewBox="0 0 40 40"
  fill="none"
  xmlns="http://www.w3.org/2000/svg"
>
  <G clipPath="url(#clip0_1777_4759)">
    <Rect width={40} height={40} rx={20} fill="#6555C0" />
    <Mask
      id="a"
      style={{
        maskType: "alpha"
      }}
      maskUnits="userSpaceOnUse"
      x={0}
      y={0}
      width={40}
      height={40}
    >
      <Path d="M40 0H0v40h40V0z" fill="#fff" />
    </Mask>
    <G mask="url(#a)">
      <Path
        d="M28.469 5.625H11.437a2.754 2.754 0 00-2.75 2.75v22.719c0 1.531 1.25 2.75 2.75 2.75h17c1.532 0 2.75-1.25 2.75-2.75V8.406a2.735 2.735 0 00-2.718-2.781z"
        fill="#fff"
      />
      <Path
        d="M27.844 12.688H13.625a.907.907 0 010-1.813h14.219a.907.907 0 010 1.813zM27.844 16.719H13.625a.907.907 0 010-1.813h14.219a.907.907 0 010 1.813zM19.094 20.75h-5.469a.907.907 0 010-1.813h5.469a.907.907 0 010 1.813z"
        fill="#D3E0EA"
      />
      <Path
        d="M10.188 28.875H7.405a.907.907 0 010-1.813h2.782a.907.907 0 010 1.813zM10.188 23.5H7.405a.907.907 0 010-1.813h2.782a.907.907 0 010 1.813zM10.188 18.094H7.405a.907.907 0 010-1.813h2.782a.907.907 0 010 1.813zM10.188 12.688H7.405a.907.907 0 010-1.813h2.782a.907.907 0 010 1.813z"
        fill="#2A5083"
      />
      <Path
        d="M30.625 10.5c-1.625-.844-3.281-.906-3.688-.125l-1.343 2.563 5.875 3.093 1.343-2.593c.407-.75-.562-2.094-2.187-2.938z"
        fill="#FF4E4A"
      />
      <Path
        d="M32.906 13.125c.063-.781-.875-1.875-2.281-2.625l-2.094 3.969L31.47 16l.187-.344 1.157-2.219a.528.528 0 00.093-.312z"
        fill="#D63E3E"
      />
      <Path
        d="M24.843 14.338l5.895 3.09.914-1.743-5.895-3.09-.914 1.743z"
        fill="#EBF2F9"
      />
      <Path
        d="M28.781 16.406l-1.968-1.031-1.97-1.031-5.905 11.281 1.968 1.031 1.969 1.032 1.938 1.03 5.937-11.312-1.969-1z"
        fill="#FFC400"
      />
      <Path
        d="M22.47 26.406l-.063-.218-1.5.468-.469-1.5-1.5.469-.031.063a.434.434 0 00-.063.343l.219 3.125 1.563.813 1.843-3.563z"
        fill="#FFD49B"
      />
      <Path
        d="M28.781 16.375l-1-.5-5.906 11.281 1 .532 1.938 1 .75-1.438 5.156-9.844-1.938-1.031z"
        fill="#FF991F"
      />
      <Path
        d="M21.844 30.625l2.718-1.594a.556.556 0 00.22-.25l.03-.062-.468-1.5-1.469.468-.469-1.5-2 3.688c.188.125 1.219.875 1.438.75z"
        fill="#E2AD79"
      />
      <Path
        d="M20.406 29.875l-.937 1.719a.237.237 0 00.125.062h.031c.063.032.094.032.156.032H20c.063 0 .125-.032.188-.063l1.687-1-1.469-.75z"
        fill="#173E68"
      />
      <Path
        d="M19.063 29.156l.125 1.938a.54.54 0 00.28.468l.938-1.718-1.343-.688z"
        fill="#2A5083"
      />
    </G>
  </G>
  <Defs>
    <ClipPath id="clip0_1777_4759">
      <Rect width={40} height={40} rx={20} fill="#fff" />
    </ClipPath>
  </Defs>
</Svg>
)
export const CloseSvg = ({size})=>(
  <Svg height="18" width={size?size:"18"} viewBox="0 0 24 24">
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

const Header = ({isFunction,setShowFunction,isChemistry,setShowChemistry}) => {
  const { setShouldHideTab, shouldHideTab,showDuolingo,setShowDuolingo } = useStore();
  const handleClose = () => {
    if (isFunction) {
      setShouldHideTab(false)
      setShowFunction(false)

    }if (isChemistry) {
      setShouldHideTab(false)
      setShowChemistry(false)
    } 
    else {
      setShowDuolingo(!showDuolingo)
      setTimeout(()=>{
        setShouldHideTab(!shouldHideTab);
      },500)
    }

  };
  const { width } = Dimensions.get('window');
  return (
    <View style={styles.container}>
      <Canvas style={{
            position: 'absolute',
            left: -400,
            bottom: -width / 2+160 ,//165
            width: width + 800,
            height: width + 800,
            }}>
      <Circle
        cx={(width + 800) / 2} // Center within the Canvas
        cy={(width + 1000) / 2} // Center within the Canvas
        r={(width + 500) / 2}
        color={'#143F5F'}
      >
      <LinearGradient
        start={vec((width + 800) / 2, (width + 300))} // Top of gradient (vertical orientation)
        end={vec((width + 800) / 2, (width + 1200))} // Bottom of gradient
        colors={["#143F5F", "#2983C5"]}
        />
      </Circle>
      </Canvas>
      <View style={styles.headerContainer} >
        <View style={styles.levelContainer}>
          <View style={[{backgroundColor:'#42FF58',paddingHorizontal:12},styles.levelStyle]}/>
          <View style={[{backgroundColor:'#fff',borderWidth:1.5,paddingHorizontal:10,},styles.levelStyle]}/>
          <View style={[{backgroundColor:'#fff',borderWidth:1.5,paddingHorizontal:10,},styles.levelStyle]}/>
        </View>
        <View>
          <View style={styles.chapterContainer}>
            {isFunction? (
            <View style={{height:40,width:40,backgroundColor:'#6555C0',borderRadius:100,alignItems:'center',justifyContent:'center'}}>
              <FunctionSvg/>
            </View>
            ) :
            isChemistry?(
              <ChemistrySvg/>
            ):
            (<TestSvg/>)
            }
            
          </View>
        </View>
        <TouchableOpacity onPress={handleClose}>
        <View style={styles.closeContainer}>
          <CloseSvg/>
        </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container:{
    zIndex:1,
    paddingTop:StatusBar.currentHeight,
  },
  headerContainer:{
    paddingHorizontal:10,
    flexDirection:'row',
    alignItems:'center',
    justifyContent:'space-between',
    paddingTop:15,
    paddingBottom:5
  },
  levelContainer:{
    flexDirection:'row',
    gap:5
  },
  levelStyle:{
    borderColor:'#E7E4E4',
    paddingVertical:3,
    borderRadius:7
  },
  closeContainer:{
    borderWidth:2,
    borderColor:'#E7E4E4',
    borderRadius:100,
    padding:5,
    backgroundColor:'#fff'
  },
  chapterContainer:{
    width:50,
    height:50,
    backgroundColor:'#fff',
    borderRadius:100,
    overflow:'hidden',
    justifyContent:'center',
    alignItems:'center',
    transform:[{translateX:-20}]
  }
});

export default Header;

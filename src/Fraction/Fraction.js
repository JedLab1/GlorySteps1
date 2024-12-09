import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, { useAnimatedStyle, withTiming } from 'react-native-reanimated';

// Fraction Component
export const Fraction = ({ numerator, denominator,size ,offset}) => {
  const colorFracStyle = useAnimatedStyle(()=>{
    return{
      color:withTiming(offset?.clicked?.value?'#6eaaff':'black'),
    }
  })
  const lineColor = useAnimatedStyle(()=>{
    return{
      backgroundColor:withTiming(offset?.clicked?.value?'#6eaaff':'black'),
    }
  })
  return (
    <View style={styles.container}>
      <View style={styles.numeratorContainer}>
        {typeof numerator === 'object' ? numerator : 
        <Animated.Text style={[styles.text,{fontSize:size?size:18},colorFracStyle]}>
          {numerator}
        </Animated.Text>}
      </View>
      <Animated.View style={[styles.line,lineColor]} />
      <View style={styles.denominatorContainer}>
        {typeof denominator === 'object' ? denominator : 
        <Animated.Text style={[styles.text,{fontSize:size?size:18},colorFracStyle]}>{denominator}
        </Animated.Text>}
      </View>
    </View>
  );
};

// Example Usage
export const FractionDisplay = ({ expression, size, offset }) => {
  const fractionInfo = parseFraction(expression);
  
  if (!fractionInfo.isNested) {
    return (
      <View>
        <Fraction
          size={size}
          offset={offset}
          numerator={fractionInfo.numerator}
          denominator={fractionInfo.denominator}
        />
      </View>
    );
  } else {
    const numeratorData = analyzeExpression(fractionInfo.numerator);
    const denominatorData = analyzeExpression(fractionInfo.denominator);
    const denominatorAllAreNotFractions = denominatorData.item_list.every(item => item.isfraction === false);
    const numeratorAllAreNotFractions = numeratorData.item_list.every(item => item.isfraction === false);
    
    return (
        <View style={{transform:[{translateY:numeratorAllAreNotFractions?15:denominatorAllAreNotFractions?-15:0}]}}>
          <Fraction
            numerator={
              numeratorData.is_solo_fraction ? (
                <Fraction
                  numerator={parseFraction(numeratorData.item_list[0].value).numerator}
                  denominator={parseFraction(numeratorData.item_list[0].value).denominator}
                />
              ) : (
                <View style={styles.nestedNumerator}>
                  {numeratorData.item_list.map((item, index) => {
                    if (item.isfraction) {
                      if (item.sign === '+' && item.index === 0) {
                        return (
                          <Fraction
                            key={`numerator-fraction-${index}`}
                            numerator={parseFraction(item.value).numerator}
                            denominator={parseFraction(item.value).denominator}
                          />
                        );
                      } else {
                        return (
                          <React.Fragment key={`numerator-item-${index}`}>
                            <Text style={styles.text}>{item.sign}</Text>
                            <Fraction
                              numerator={parseFraction(item.value).numerator}
                              denominator={parseFraction(item.value).denominator}
                            />
                          </React.Fragment>
                        );
                      }
                    } else {
                      if (item.sign === '+' && item.index === 0) {
                        return (
                          <Text key={`numerator-text-${index}`} style={styles.text}>
                            {item.value}
                          </Text>
                        );
                      } else {
                        return (
                          <React.Fragment key={`numerator-text-sign-${index}`}>
                            <Text style={styles.text}>{item.sign}</Text>
                            <Text style={styles.text}>{item.value}</Text>
                          </React.Fragment>
                        );
                      }
                    }
                  })}
                </View>
              )
            }
            denominator={
              denominatorData.is_solo_fraction ? (
                <Fraction
                  numerator={parseFraction(denominatorData.item_list[0].value).numerator}
                  denominator={parseFraction(denominatorData.item_list[0].value).denominator}
                />
              ) : (
                <View style={styles.nestedNumerator}>
                  {denominatorData.item_list.map((item, index) => {
                    if (item.isfraction) {
                      if (item.sign === '+' && item.index === 0) {
                        return (
                          <Fraction
                            key={`denominator-fraction-${index}`}
                            numerator={parseFraction(item.value).numerator}
                            denominator={parseFraction(item.value).denominator}
                          />
                        );
                      } else {
                        return (
                          <React.Fragment key={`denominator-item-${index}`}>
                            <Text style={styles.text}>{item.sign}</Text>
                            <Fraction
                              numerator={parseFraction(item.value).numerator}
                              denominator={parseFraction(item.value).denominator}
                            />
                          </React.Fragment>
                        );
                      }
                    } else {
                      if (item.sign === '+' && item.index === 0) {
                        return (
                          <Text key={`denominator-text-${index}`} style={styles.text}>
                            {item.value}
                          </Text>
                        );
                      } else {
                        return (
                          <React.Fragment key={`denominator-text-sign-${index}`}>
                            <Text style={styles.text}>{item.sign}</Text>
                            <Text style={styles.text}>{item.value}</Text>
                          </React.Fragment>
                        );
                      }
                    }
                  })}
                </View>
              )
            }
          />
        </View>
    );
  }
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    gap:1
  },
  numeratorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal:2
  },
  nestedNumerator: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  line: {
    height: 2,
    width: '100%',

    borderRadius: 3, // Rounded edges

  },
  text: {
    fontFamily:'Janda',
    lineHeight:26.5,
    marginHorizontal:3
  },
});

export function parseFraction(expression) {
    // Remove whitespace
    expression = expression.replace(/\s+/g, '');
  
    // Check if the expression contains nested fractions by verifying fractions inside parentheses
    const nestedPattern = /\(.+\/.+\)/;
    let isNested = nestedPattern.test(expression);
  
    // Function to extract numerator and denominator by keeping balanced parentheses
    function extractFractionParts(expr) {
      let openParentheses = 0;
      let splitIndex = -1;
  
      for (let i = 0; i < expr.length; i++) {
        if (expr[i] === '(') openParentheses++;
        if (expr[i] === ')') openParentheses--;
  
        // Split at the main '/' outside any parentheses
        if (expr[i] === '/' && openParentheses === 0) {
          splitIndex = i;
          break;
        }
      }
  
      // If we found a valid split index, return the parts
      if (splitIndex !== -1) {
        return [expr.slice(0, splitIndex), expr.slice(splitIndex + 1)];
      }
  
      // If no '/', the entire expression is the numerator, denominator is 1
      return [expr, "1"];
    }
  
    // Get numerator and denominator from the expression
    let [numerator, denominator] = extractFractionParts(expression);
  
    // Remove parentheses from the numerator and denominator if present
    numerator = numerator.replace(/^\((.*)\)$/, '$1');
    denominator = denominator.replace(/^\((.*)\)$/, '$1');
  
    // Check if the numerator or denominator is a negative number in parentheses
    const isNegativeNumberInParentheses = (expr) => /^-\d+(\.\d+)?$/.test(expr);
  
  
    // Fix: If it's just negative numbers in parentheses, it's not a nested fraction
    if (isNegativeNumberInParentheses(numerator) && isNegativeNumberInParentheses(denominator)) {
      isNested = false; // Mark it as non-nested if it is a negative number in parentheses
    }
  
    // Return the result without modifying the `isNested` property later
    return {
      isNested,
      numerator,
      denominator
    };
  }
  export function isFraction(term) { 
    // Check if the term contains a "/"
    if (!term.includes('/')) return false;

    // Split the string into numerator and denominator by "/"
    const [numerator, denominator] = term.split('/');

    // Check if both numerator and denominator are valid (allowing parentheses, variables, and numbers)
    const isValidPart = (part) => {
        const cleanedPart = part.replace(/[()]/g, ''); // Remove parentheses for checking
        return /^-?\d+$/.test(cleanedPart) || /^[a-zA-Z]+$/.test(cleanedPart) || /^-?[a-zA-Z\+\-\*\/\d]+$/.test(cleanedPart);
    };
    
    // Both numerator and denominator should be valid (either integers, variables, or simple algebraic expressions)
    return isValidPart(numerator) && isValidPart(denominator);
}



export function analyzeExpression(expression) {
  // Step 1: Clean the expression (remove spaces)
  const cleanExpression = expression.replace(/\s+/g, '');
  
  // Step 2: Initialize variables to store results
  const result = {
      is_solo_fraction: false,
      item_list: []  // Will hold all items (values, operators)
  };
  
  let currentItem = '';  // Temporarily hold characters to form terms
  let prevSign = '+';    // Assume the first item has a positive sign
  let index = 0;
  let insideParentheses = 0;  // To track parentheses
  
  // Step 3: Loop through the expression
  for (let i = 0; i < cleanExpression.length; i++) {
      const char = cleanExpression[i];

      // Handle parentheses
      if (char === '(') {
          insideParentheses++;
          currentItem += char;
          continue;
      }

      if (char === ')') {
          insideParentheses--;
          currentItem += char;
          continue;
      }

      // Handle negative signs that appear before numbers or fractions
      if (char === '-' && (i === 0 || ['+', '-', '*', '/'].includes(cleanExpression[i - 1]) || cleanExpression[i - 1] === '(')) {
          currentItem += char; // Add the negative sign to the current term
          continue;
      }

      // Handle fractions (e.g., 5/4, 3/5)
      if (char === '/' && insideParentheses === 0) {
          currentItem += char; // Add the '/' to the fraction
          continue;  // Keep adding next numbers until we complete the fraction
      }

      // If the character is an operator or parentheses, finalize the current term
      if (['+', '-', '*', '/'].includes(char) && insideParentheses === 0) {
          if (currentItem) {
              result.item_list.push({
                  value: currentItem,
                  isfraction: isFraction(currentItem),
                  sign: prevSign,
                  index
              });
              index++;
          }
          currentItem = '';  // Reset current term to start a new one
          prevSign = char;   // Update the sign for the next term
      } else {
          // Add the current character to the current term
          currentItem += char;
      }

      // If we reach the last character, push the final item
      if (i === cleanExpression.length - 1) {
          result.item_list.push({
              value: currentItem,
              isfraction: isFraction(currentItem),
              sign: prevSign,
              index
          });
      }
  }

  // Step 4: Check if it's a solo fraction (only one item in the list and it's a fraction)
  if (result.item_list.length === 1 && result.item_list[0].isfraction) {
      result.is_solo_fraction = true;
  }

  return result;
}


const ExpressionWithFraction = ()=>(
  <View style={{flexDirection:'row',backgroundColor:'pink',alignItems:'center'}}>
    <View style={{transform:[{translateY:-15}]}}>
    <FractionDisplay expression={'(1/(2-y)-4)/(x+5)'}/>
    </View>
    <Text style={styles.text}>+</Text>
    <View >
    <FractionDisplay expression={'(1/2-4)/(3+5/5)'}/>
    </View>
    <View>
    <Text style={styles.text}>+2x+</Text>
    </View>
    <View style={{transform:[{translateY:15}]}}>
    <FractionDisplay expression={'4/(2/x+2)'}/>
    </View>
  </View>

)

  
const FractionWrapper = ()=>(
    <View style={{flex:1,alignItems:'center',justifyContent:'center'}}>
      <FractionDisplay expression={'(1/(2-y)-4)/(x+5)'}/>
      
    </View>
)
export default FractionWrapper;

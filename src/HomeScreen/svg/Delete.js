// DeleteButton.js
import React from 'react';
import Svg, { Path, Line } from 'react-native-svg';

export default function DeleteButton() {
    return (
      <Svg
      width={21}
      height={22}
      viewBox="0 0 21 23"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <Path
        d="M17.51 6.292l-1 13.023a2.04 2.04 0 01-2.04 2.04H6.06a2.04 2.04 0 01-2.04-2.04l-1-13.024"
        stroke="#F33E62"
        strokeWidth={1.33333}
        strokeMiterlimit={10}
        strokeLinecap="round"
      />
      <Path
        d="M17.51 6.292l-1 13.023a2.04 2.04 0 01-2.04 2.04H6.06a2.04 2.04 0 01-2.04-2.04l-1-13.024M13.628 4.98H7.555M5.319 4.98H1V3.717a.933.933 0 01.933-.933h6.279v-.01c0-.98.92-1.774 2.055-1.774 1.135 0 2.055.795 2.055 1.775v.009H18.6a.934.934 0 01.933.933V4.98H15.98M6.844 9.699v8.17M10.266 9.699v8.17M13.688 9.699v8.17"
        stroke="#F33E62"
        strokeWidth={1.33333}
        strokeMiterlimit={10}
        strokeLinecap="round"
      />
    </Svg>
  );
}

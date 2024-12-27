import * as React from "react"
import Svg, { Path, Circle } from "react-native-svg"

function FunctionSvg(props) {
  return (
    <Svg
      width={32}
      height={31}
      viewBox="0 0 32 31"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <Path
        d="M6.53.47a.75.75 0 00-1.06 0L.697 5.243a.75.75 0 101.06 1.06L6 2.061l4.243 4.242a.75.75 0 001.06-1.06L6.53.47zM6.75 31V1h-1.5v30h1.5z"
        fill="#fff"
      />
      <Path
        d="M31.53 24.664a.75.75 0 000-1.06l-4.773-4.774a.75.75 0 00-1.06 1.06l4.242 4.244-4.242 4.242a.75.75 0 101.06 1.06l4.773-4.772zM1 24.884h30v-1.5H1v1.5z"
        fill="#fff"
      />
      <Path
        d="M3 21.508l3.74-7.541c1.626-3.278 6.435-2.833 7.432.687l.33 1.167c1.093 3.856 6.547 3.889 7.685.046L25.5 4.679"
        stroke="#FF4E4A"
        strokeWidth={1.5}
      />
      <Circle cx={6} cy={8} r={1} fill="#000" />
    </Svg>
  )
}

export default FunctionSvg

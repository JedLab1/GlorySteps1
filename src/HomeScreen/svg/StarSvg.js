import * as React from "react"
import Svg, { Path } from "react-native-svg"

function StarSvg(props) {
  return (
    <Svg
      width={34}
      height={33}
      viewBox="0 0 44 43"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <Path
        d="M19.109 1.721c1.244-2.295 4.538-2.295 5.782 0l5.369 9.9 11.057 2.083c2.553.48 3.567 3.592 1.787 5.485l-7.74 8.233 1.447 11.214c.334 2.585-2.327 4.512-4.679 3.39L22 37.188l-10.132 4.837c-2.352 1.123-5.013-.804-4.68-3.389l1.448-11.214-7.74-8.233c-1.78-1.893-.766-5.004 1.787-5.485L13.74 11.62l5.369-9.9z"
        fill="#FF9A24"
      />
    </Svg>
  )
}

export default StarSvg

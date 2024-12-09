import * as React from "react"
import Svg, { Path } from "react-native-svg"

function Validate(props) {
  return (
    <Svg
      width={24}
      height={19}
      viewBox="0 0 24 19"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
      style={{transform:[{translateY:2}]}}
    >
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M0 11.571a1.286 1.286 0 011.286-1.285h15.428a3.857 3.857 0 003.857-3.857V1.286a1.286 1.286 0 012.572 0v5.143a6.429 6.429 0 01-6.429 6.428H1.286A1.286 1.286 0 010 11.571z"
        fill="#07DB5C"
      />
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M.376 12.477a1.286 1.286 0 010-1.818L5.52 5.516a1.286 1.286 0 011.818 1.818l-4.234 4.234L7.337 15.8A1.286 1.286 0 115.52 17.62L.376 12.477z"
        fill="#07DB5C"
      />
    </Svg>
  )
}

export default Validate
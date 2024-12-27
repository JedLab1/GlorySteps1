import * as React from "react"
import Svg, { Path } from "react-native-svg"

function CheckSvg({color,width}) {
  return (
    <Svg
    width={width?width:20}
    height={15}
    viewBox="0 0 20 15"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    style={{transform:[{translateY:7}]}}
  >
    <Path
      d="M18.586 0c-.362.013-.73.168-1.016.453L7.636 10.766l-5.18-5.56A1.421 1.421 0 00.46 5.11a1.423 1.423 0 00-.096 1.997l6.227 6.702c.285.285.618.475 1.045.475.38 0 .76-.143 1.046-.428L19.613 2.4c.523-.57.524-1.473-.047-1.996a1.256 1.256 0 00-.98-.404z"
      fill={color?color : "#FF9A24"}
    />
  </Svg>
  )
}

export default CheckSvg

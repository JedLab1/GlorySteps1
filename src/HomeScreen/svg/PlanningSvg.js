import * as React from "react"
import Svg, { Path } from "react-native-svg"

function PlanningSvg(props) {
  return (
    <Svg
      width={27}
      height={27}
      viewBox="0 0 27 27"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <Path
        d="M.38 3.162c.119-1.159.879-2.076 2.019-2.319C4.198.46 7.589 0 13.5 0c5.91 0 9.302.46 11.101.843 1.14.243 1.9 1.16 2.02 2.32C26.798 4.88 27 8.036 27 13.5s-.202 8.619-.38 10.338c-.119 1.159-.879 2.076-2.019 2.319-1.799.383-5.19.843-11.101.843-5.91 0-9.302-.46-11.101-.843-1.14-.243-1.9-1.16-2.02-2.32C.202 22.12 0 18.964 0 13.5S.202 4.881.38 3.162z"
        fill="#3AFF89"
      />
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M26.867 6.75H.13C.2 5.155.292 3.991.377 3.162c.12-1.159.88-2.076 2.02-2.319C4.196.46 7.587 0 13.498 0c5.91 0 9.302.46 11.101.843 1.14.243 1.9 1.16 2.02 2.32.085.828.177 1.992.248 3.587z"
        fill="#059D54"
      />
      <Path
        d="M4.73 12.15c0-.745.605-1.35 1.35-1.35h1.35c.746 0 1.35.604 1.35 1.35v1.35a1.35 1.35 0 01-1.35 1.35H6.08a1.35 1.35 0 01-1.35-1.35v-1.35zM4.73 18.9c0-.745.605-1.35 1.35-1.35h1.35c.746 0 1.35.604 1.35 1.35v1.35a1.35 1.35 0 01-1.35 1.35H6.08a1.35 1.35 0 01-1.35-1.35V18.9zM11.48 12.15c0-.745.605-1.35 1.35-1.35h1.35c.746 0 1.35.604 1.35 1.35v1.35a1.35 1.35 0 01-1.35 1.35h-1.35a1.35 1.35 0 01-1.35-1.35v-1.35zM11.48 18.9c0-.745.605-1.35 1.35-1.35h1.35c.746 0 1.35.604 1.35 1.35v1.35a1.35 1.35 0 01-1.35 1.35h-1.35a1.35 1.35 0 01-1.35-1.35V18.9zM18.23 12.15c0-.745.605-1.35 1.35-1.35h1.35c.746 0 1.35.604 1.35 1.35v1.35a1.35 1.35 0 01-1.35 1.35h-1.35a1.35 1.35 0 01-1.35-1.35v-1.35z"
        fill="#059D54"
      />
    </Svg>
  )
}

export default PlanningSvg

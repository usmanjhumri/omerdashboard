// import { ReactComponent as Icon } from "assets/img/properfansIcon.svg"
import React from "react"
import {Spin} from 'antd'
// import { ThreeDots } from  'react-loader-spinner'

const Loader = () => {
    return (
        <>
            {/* <div className="fixed top-0 left-0 flex h-full w-full items-center justify-center overflow-hidden bg-purple">
        <div className="relative text-24 text-white sm:text-48 md:text-64">
         
        </div>
      </div> */}
            <Spin/>
        </>
    )
}

export default Loader

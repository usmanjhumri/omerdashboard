import React from "react"

const ToastWrapper = ({ children }) => {
  return (
    <>
      <div className="w-full overflow-hidden rounded-4">{children}</div>
    </>
  )
}

export default ToastWrapper

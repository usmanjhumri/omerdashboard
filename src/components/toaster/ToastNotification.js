// import ToastWrapper from "./ToastWrapper"
// import React from "react"
// import { FiAlertTriangle, FiCheckCircle, FiInfo } from "react-icons/fi"
// import { MdClose } from "react-icons/md"
// import { useNavigate } from "react-router"

// const ToastNotification = ({
//   message,
//   title,
//   url,
//   type
// }) => {
//   const history = useNavigate()
//   const onCssBg = () => {
//     let newCss

//     switch (type) {
//       case Error:
//         newCss = "bg-toast-error hover:bg-toast-error-2 active:bg-toast-error-3"
//         break
//       case type.Info:
//         newCss = "bg-toast-info hover:bg-toast-info-2 active:bg-toast-info-3"
//         break
//       case type.InfoSuccess:
//         newCss = "bg-toast-success hover:bg-toast-success-2 active:bg-toast-success-3"
//         break
//       case type.InfoWarning:
//         newCss = "bg-toast-warning hover:bg-toast-warning-2 active:bg-toast-warning-3"
//         break
//       case type.InfoSystem:
//         newCss = "bg-gradient-to-r from-purple to-blue"
//         break
//     }

//     return newCss
//   }

//   const onCssIcon = () => {
//     let newCss

//     switch (type) {
//       case Error:
//         newCss = "text-toast-error-3 group-hover:text-toast-error group-active:text-toast-error"
//         break
//       case type.Info:
//         newCss = "text-toast-info-3 group-hover:text-toast-info group-active:text-toast-info"
//         break
//       case type.Success:
//         newCss = "text-toast-success-3 group-hover:text-toast-success group-active:text-toast-success"
//         break
//       case type.System:
//         newCss = "text-white"
//         break
//       case type.Warning:
//         newCss = "text-toast-warning-3 group-hover:text-toast-warning group-active:text-toast-warning"
//         break
//     }

//     return newCss
//   }

//   return (
//     <>
//       <ToastWrapper>
//         <div
//           className={`light-r group grid w-full grid-cols-[auto,1fr,auto] items-start gap-12 rounded-4 p-16 ${
//             type === type.System ? "pb-16" : "pb-[21px]"
//           } ${onCssBg()}`}
//           onClick={() => (url ? history.push(url) : null)}
//         >
//           <div className="flex h-14 w-28 items-start justify-center">
//             {
//               {
//                 [type.Error]: <FiAlertTriangle className={`text-18 ${onCssIcon()}`} />,
//                 [type.Info]: <FiInfo className={`text-18 ${onCssIcon()}`} />,
//                 [type.Success]: <FiCheckCircle className={`text-18 ${onCssIcon()}`} />,
//                 [type.System]: <FiInfo className={`text-18 ${onCssIcon()}`} />,
//                 [type.Warning]: <FiAlertTriangle className={`text-18 ${onCssIcon()}`} />
//               }[type]
//             }
//           </div>
//           <div className="flex w-full items-center">
//             <div className="grid w-full grid-cols-1 gap-2">
//               <div
//                 className={`w-full text-14 font-bold capitalize ${
//                   type === type.System
//                     ? "text-white"
//                     : "text-black group-hover:text-white group-active:text-white"
//                 }`}
//               >
//                 {title}
//               </div>
//               <div
//                 className={`w-full break-words text-12 font-bold ${
//                   type === type.System
//                     ? "text-white-40"
//                     : "text-grey-40 group-hover:text-white group-active:text-white"
//                 }`}
//               >
//               </div>
//             </div>
//           </div>
//           <div className="flex h-24 w-20 items-start justify-center">
//             <MdClose className={`text-18 ${onCssIcon()}`} />
//           </div>
//         </div>
//       </ToastWrapper>
//     </>
//   )
// }

// export default ToastNotification

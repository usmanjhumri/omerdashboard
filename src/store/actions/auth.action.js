
import { LOGIN, LOGOUT,REFETCH } from "../types"

export const loginAction = (payload) => ({
    type: LOGIN,
    payload
})

export const logoutAction = () => ({
    type: LOGOUT
})

export const refetchAction = (payload) => ({
    type: REFETCH,
    payload
})

// export const refetch = (onSuccessCallback, onErrorCallback, init) => async (dispatch) => {
//     try {
//         console.log({ payload: init, onSuccessCallback, onErrorCallback })
//         let response = await authService.refetch()

//         if (response.status === 200) {
//             dispatch(refetchAction({ ...response.data, init }))
//             console.log("response", response)
//             onSuccessCallback && onSuccessCallback()
//         }
//     } catch (error) {
//         onErrorCallback && onErrorCallback({
//             success: false, error: error.response.data
//         })
//     }
// }
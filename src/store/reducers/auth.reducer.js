

import { LOGIN, LOGOUT, REFETCH } from "../types";

const initialState = {
    access_token: '',
    user: {},
    isAuth:false
}

export const authReducer = (state = initialState, action) => {


    switch (action.type) {
        case LOGIN:
            return { ...action.payload, isAuth: true };
        case LOGOUT:
            return { ...initialState };
        case REFETCH:
            return { ...state, user: action.payload.user,isAuth: true };
        default:
            return state;
    }
}

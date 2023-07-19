import { combineReducers } from 'redux'
import { authReducer } from './auth.reducer'
export const rootReducers = combineReducers({
	auth: authReducer,
})

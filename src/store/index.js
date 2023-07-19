import { createStore, applyMiddleware } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'
import { persistStore, persistReducer } from 'redux-persist'
import thunkMiddleware from 'redux-thunk'
import storage from 'redux-persist/lib/storage'
import { rootReducers } from './reducers'

const composeEnhancers = composeWithDevTools({
	// Specify name here, actionsBlacklist, actionsCreators and other options if needed
})

const persistConfig = {
	key: 'authType',
	storage: storage,
	whitelist: ['auth'], // which reducer want to store
}	

const pReducer = persistReducer(persistConfig, rootReducers)

const store = createStore(
	pReducer,
	composeEnhancers(applyMiddleware(thunkMiddleware))
)

const persistor = persistStore(store)

export { store, persistor }

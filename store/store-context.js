import { createContext, useReducer } from 'react'

export const StoreContext = createContext();

export const ACTION_TYPES = {
	SET_LAT_LNG: 'SET_LAT_LNG',
	SET_COFFEE_STORES: 'SET_COFFEE_STORES'
}

const storeReducer = (state, action) => {
	switch(action.type) {
		case ACTION_TYPES.SET_LAT_LNG:
			return {...state, latLng: action.payload.latLng}
			case ACTION_TYPES.SET_COFFEE_STORES:
				return {...state, coffeeStores: action.payload.coffeeStores}
		default:
			throw new Error(`Unhandled action type: ${action.type}`)
	}
}

const StoreProvider = ({children}) => {
	const initialSate = {
		latLng: '',
		coffeeStores: []
	}
	const [state, dispatch] = useReducer(storeReducer, initialSate)

	return (
		<StoreContext.Provider value={{state, dispatch}}>
			{children}
		</StoreContext.Provider>
	)
}

export default StoreProvider
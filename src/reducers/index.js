import { combineReducers } from 'redux'
import { UPDATE_KEY,UPDATE_EMAIL,UPDATE_PASSWORD,UPDATE_NOTIFICATIONS,UPDATE_QUOTES,UPDATE_NOTHING,UPDATE_UUID,SET_LANGUAGE} from '../actions/user'

const user = (state = {languageCode: 'en'}, action) => {
    switch (action.type) {
        case UPDATE_KEY:
            return { ...state, authKey: action.payload }
        case UPDATE_EMAIL:
            return { ...state, email: action.payload }
        case UPDATE_PASSWORD:
            return { ...state, password: action.payload }
        case UPDATE_NOTIFICATIONS:
            return { ...state, notifications: action.payload }
        case UPDATE_UUID:
            return { ...state, uuID: action.payload }
        case UPDATE_NOTHING:
            return state
        case UPDATE_QUOTES:
            return { ...state,quotes: { ...state.quotes, [action.payload.quoteID]: action.payload.quoteInside} }
        case SET_LANGUAGE:
            return { ...state, languageCode: action.payload }
            
            
        default:
            return state
    }
}

const rootReducer = combineReducers({
    user
})

export default rootReducer

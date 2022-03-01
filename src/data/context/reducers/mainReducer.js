//After wrapping our App.js component with <StateProvider> component, we need configure an initialState and a way to access and manipulate it.
// mainReducer is passed to the reducer prop in <StateProvider> and is accessed when we use the useStateValue hook.


import { userReducer } from './reducers/userReducer'
import { applesReducer } from './reducers/applesReducer'
import { errorReducer } from './reducers/errorReducer'
import { routeReducer } from './reducers/routeReducer'
import logic from  '../../../logic/logic'

// the router object is passed down through prop drilling. Router -> App -> StateProvider
export const initialState= {
    user: logic.sessionId,
    apples: {
        number: 1
    },
    error: ''
}
export const mainReducer = ({ user, apples, error, router }, action) => ({
    user: userReducer(user, action),
    apples : applesReducer(apples, action),
    error: errorReducer(error, action),
    router: routeReducer(router, action)
  })
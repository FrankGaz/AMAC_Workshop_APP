// First, we create a new context and assign it to StateContext containing provider and consumer, we will only need provider

// Secondly, Then we create new React component called StateProvider. We will wrap our App file with this component.

// useReducer accepts reducer and initialState which are passed as props from outside.

// We pass result of the useReducer hook as a value to our Provider. So it becomes available in any component in your app component tree.

import React, {createContext, useContext, useReducer} from 'react'

export const StateContext = createContext()

export const StateProvider = ({reducer, initialState, children}) =>(
  <StateContext.Provider value={useReducer(reducer, initialState)}>
    {children}
  </StateContext.Provider>
)

// In our components, instead of writing useContext(StateContext), we will write, useStateValue()
export const useStateValue = () => useContext(StateContext)
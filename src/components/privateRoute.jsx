import React from 'react'
import { Route, Redirect } from 'react-router-dom'
import logic from '../logic/logic'

const PrivateRoute = ({component: Component, ...props}) => {
    return (
        <Route
            {...props}
            render={innerProps => {
                return logic.loggedIn ?
                    <Component {...innerProps}/>:
                    <Redirect to="/" />
            }
        }
        />    
    )
}


export default PrivateRoute
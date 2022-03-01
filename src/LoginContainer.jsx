import React from 'react'
import { withRouter } from 'react-router-dom'



const LoginContainer = (props) => {

    return (<div className={"no-skin login login-layout light-login"}>
        <div id="main-container" className="main-container">
            <div className="main-content"></div>
            {props.children}
        </div>
    </div>
    )
}

export default withRouter(LoginContainer)

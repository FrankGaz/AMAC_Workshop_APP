import React from 'react'
import { Link } from 'react-router-dom'


const ConfirmActionMessageLink = ({ message, link }) =>
    (
        <Link className={"btn-success btn btn-minier"} to={link}>
            <span className="ng-binding">{message}</span>
        </Link>
    )

export default ConfirmActionMessageLink
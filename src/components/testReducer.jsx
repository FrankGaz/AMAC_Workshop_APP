import React, { useEffect } from 'react'
import { useStateValue } from '../data/context/store'

export const TestReducerButton = () => {
    const [{ user, apples }, dispatch] = useStateValue()

    const doDispatch = () => {
        if (user.username === 'Enric') {
            return dispatch({
                origin: 'user',
                type: 'changeName',
                newName: 'blue'
            })
        }
        return dispatch({
            origin: 'user',
            type: 'changeName',
            newName: 'Enric'
        })

    }
    const doAppleDispatch = () => {
        if(apples.number === 1){
            return dispatch({
                origin: 'apples',
                type: 'changeName',
                newNumber: 'Enric'
            })
        }
        return dispatch({
            origin: 'apples',
            type: 'changeName',
            newNumber: 1
        })


    }
    return (
        <div>
            <input value={user && user.username} />
            <input value={apples && apples.number} />
            <button
                type="button"
                onClick={doDispatch}
            >
                Change my name to Blue or Enric!
        </button>
        <button
                type="button"
                onClick={doAppleDispatch}
            >
                AppleButton
        </button>
        </div>
    )
}
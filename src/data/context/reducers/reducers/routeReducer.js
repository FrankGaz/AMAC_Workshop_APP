
//there are no cases because the management of the route object is down via the router API,
// we only need to access it.
export const routeReducer = (state, action) => {
    if (action.origin === 'router') {
        switch (action.type) {
            case 'changeName':
            return {
                ...state,
                username: action.newName
            };
            case 'doRoute':
                return handleDoRoute(action.url,action.data,state)
            default:
                return state
        }
    }
    return state
}

const handleDoRoute = (url, data, state) => {
    try {
       state.history.push(`${url}`, { data })
    } catch ({ message }) {
      console.error(message)
    }
    finally{
        return {...state,
        history:state.history
    }
    }
  }


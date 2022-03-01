// a test reducer

export const applesReducer = (state, action) => {
    if (action.origin === 'apples') {
        switch (action.type) {
            case 'changeName':
                return {
                    ...state,
                    number: action.newNumber
                };

            default:
                return state
        }
    }
    return state
}
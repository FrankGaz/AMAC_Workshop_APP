
export const userReducer = (state, action) => {
    if (action.origin === 'user') {
        switch (action.type) {
            case 'changeName':
                return {
                    ...state,
                    username: action.newName
                };

            case 'setUser':
                return {
                    ...state,
                    ...action.setUser
                };
            default:
                return state
        }
    }
    return state
}
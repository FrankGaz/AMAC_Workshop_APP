export const errorReducer = (state, action) => {
    if (action.origin === 'error') {
        switch (action.type) {
            case 'clearError':
                return '';

            case 'setError':
                return action.errorMessage
            default:
                return state
        }
    }
    return state
}
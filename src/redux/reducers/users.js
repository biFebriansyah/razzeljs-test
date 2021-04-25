const initialState = {
    data: {},
    isAuth: false,
    token: null,
    premium: false,
    paycode: "",
}

const Users = (state = initialState, action) => {
    const { type, payload } = action

    switch (type) {
        case "SET_AUTH": {
            return {
                ...state,
                isAuth: true,
                token: payload,
            }
        }
        case "SET_TYPE": {
            return {
                ...state,
                premium: payload,
            }
        }
        case "UNSET_AUTH": {
            return {
                ...state,
                isAuth: false,
                token: null,
                premium: false,
                data: {},
            }
        }
        case "SET_USERS": {
            return {
                ...state,
                data: payload,
            }
        }
        case "SET_PAYCODE": {
            return {
                ...state,
                paycode: payload,
            }
        }
        case "UNSET_PAYCODE": {
            return {
                ...state,
                paycode: "",
            }
        }
        default:
            return state
    }
}

export default Users

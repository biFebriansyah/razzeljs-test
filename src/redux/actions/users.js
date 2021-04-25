export const getUsers = (value) => {
    return {
        type: "SET_USERS",
        payload: value,
    }
}

export const login = (value) => {
    return {
        type: "SET_AUTH",
        payload: value,
    }
}

export const setPremium = (value) => {
    return {
        type: "SET_TYPE",
        payload: value,
    }
}

export const logout = () => {
    return {
        type: "UNSET_AUTH",
        payload: true,
    }
}

export const setPayCode = (code) => {
    return {
        type: "SET_PAYCODE",
        payload: code,
    }
}

export const unsetPayCode = () => {
    return {
        type: "UNSET_PAYCODE",
    }
}

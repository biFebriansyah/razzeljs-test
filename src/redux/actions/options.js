export const togleSidebar = (value) => {
    return {
        type: "TOGLE_SIDEBAR",
        payload: value,
    }
}

export const setIsHome = (value) => {
    return {
        type: "CHECK_ISHOME",
        payload: value,
    }
}

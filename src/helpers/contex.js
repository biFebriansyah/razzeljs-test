import React from "react"

export const OptionsContext = React.createContext({})
export const TestContext = React.createContext({
    indexSongs: {},
    setIndex: () => {},
    playWithIndex: {},
    setPlayIndex: () => {},
    deletList: {},
    onDeletList: () => {},
})

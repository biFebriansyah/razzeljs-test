const initialState = {
    data: {},
    playing: {},
    isPlay: false,
    isPause: false,
    setPause: false,
    setPlay: false,
    continue: false,
    adsPlay: 0,
}

const Player = (state = initialState, action) => {
    const { type, payload } = action

    switch (type) {
        case "IS_PLAY": {
            return {
                ...state,
                isPlay: true,
                isPause: false,
                continue: false,
            }
        }
        case "IS_PAUSE": {
            return {
                ...state,
                isPlay: false,
                isPause: true,
                continue: false,
            }
        }
        case "SET_PLAY": {
            return {
                ...state,
                setPause: false,
                setPlay: true,
                continue: false,
            }
        }

        case "SET_PLAYING": {
            return {
                ...state,
                playing: payload,
            }
        }

        case "SET_PAUSE": {
            return {
                ...state,
                setPause: true,
                setPlay: false,
                continue: false,
            }
        }

        case "SAVE_STATE_PLAYER": {
            return {
                ...state,
                isPlay: false,
                isPause: false,
                isStop: false,
                continue: false,
                duration: payload.duratation,
                volume: payload.volume,
                prevSongs: payload.prevSongs,
                Data: {},
            }
        }

        case "SET_PLAYADS": {
            return {
                ...state,
                adsPlay: payload,
            }
        }
        case "SET_CONTINUE": {
            return {
                ...state,
                isPause: false,
                setPause: false,
                continue: true,
            }
        }
        case "SET_SONGS": {
            return {
                ...state,
                data: payload,
                isPause: false,
                setPause: false,
                continue: false,
            }
        }
        default:
            return state
    }
}

export default Player

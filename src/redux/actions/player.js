class Player {
    setPlay() {
        return {
            type: "SET_PLAY",
        }
    }
    isPlay() {
        return {
            type: "IS_PLAY",
        }
    }

    setPause() {
        return {
            type: "SET_PAUSE",
        }
    }
    isPause() {
        return {
            type: "IS_PAUSE",
        }
    }

    setSaveState(value) {
        return {
            type: "SAVE_STATE_PLAYER",
            payload: value,
        }
    }

    setContinue() {
        return {
            type: "SET_CONTINUE",
        }
    }

    setPlaying(value) {
        return {
            type: "SET_PLAYING",
            payload: value,
        }
    }

    setAdsCount(value) {
        return {
            type: "SET_PLAYADS",
            payload: value,
        }
    }

    setSongs(value) {
        return {
            type: "SET_SONGS",
            payload: value,
        }
    }
}

export default new Player()

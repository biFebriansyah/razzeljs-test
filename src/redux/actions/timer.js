class Timer {
    RunTimer() {
        return {
            type: "SET_START",
        }
    }
    ResetTimer() {
        return {
            type: "UNSET_RUN",
        }
    }
    SetMinute(minute) {
        return {
            type: "SET_MINUTE",
            payload: minute,
        }
    }
    SetSecond(second) {
        return {
            type: "SET_MINUTE",
            payload: second,
        }
    }
    SaveTimer(minute, second) {
        return {
            type: "SAVE_TIMER",
            payload: { minute, second },
        }
    }
}

export default new Timer()

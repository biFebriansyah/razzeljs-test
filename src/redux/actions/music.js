import { STATUS } from "../reducers/music"

class Music {
    Playing(data) {
        return {
            type: STATUS.palying,
            payload: data,
        }
    }

    Pausing() {
        return {
            type: STATUS.pausing,
        }
    }

    Resuming() {
        return {
            type: STATUS.resuimng,
        }
    }

    Music(data) {
        return {
            type: STATUS.setMusic,
            payload: data,
        }
    }
}

export default new Music()

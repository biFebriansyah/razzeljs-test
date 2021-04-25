import { combineReducers } from "redux"
import users from "./users"
import player from "./player"
// import music from "./reducers/music"
// import users from "./reducers/users"
// import utils from "./reducers/utils"
// import timers from "./reducers/timer"
// import payment from "./reducers/payment"

const rootReducer = combineReducers({
    users,
    player,
})

export default rootReducer

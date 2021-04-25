import React from "react"
import App from "./App"
import configureStore from "./redux/store"
import { BrowserRouter } from "react-router-dom"
import { hydrate } from "react-dom"
import { Provider } from "react-redux"

const store = configureStore(window.__PRELOADED_STATE__)

hydrate(
    <Provider store={store}>
        <BrowserRouter>
            <App />
        </BrowserRouter>
    </Provider>,
    document.getElementById("root")
)

if (module.hot) {
    module.hot.accept()
}

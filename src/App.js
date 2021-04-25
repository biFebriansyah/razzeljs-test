import React from "react"
import { Route, Switch } from "react-router-dom"
import { ToastProvider } from "react-toast-notifications"

import Home from "views/home"
import AppContainer from "views/Container"
import Songs from "views/Songs"

import "./asset/css/jplayer.flat.css"
import "./asset/css/bootstrap.css"
import "./asset/css/animate.css"
import "./asset/css/font-awesome.min.css"
import "./asset/css/simple-line-icons.css"
import "./asset/css/font.css"
import "./asset/css/app.css"

const App = () => (
    <ToastProvider placement="top-right" autoDismiss={true} autoDismissTimeout={5000}>
        <Switch>
            <Route
                exact
                path="/"
                render={() => (
                    <AppContainer>
                        <Home />
                    </AppContainer>
                )}
            />
            <Route
                exact
                path="/songs/:song_code"
                render={() => (
                    <AppContainer>
                        <Songs />
                    </AppContainer>
                )}
            />
        </Switch>
    </ToastProvider>
)

export default App

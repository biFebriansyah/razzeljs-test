import App from "./App"
import React from "react"
import express from "express"
import configureStore from "./redux/store"
import { StaticRouter } from "react-router-dom"
import { renderToString } from "react-dom/server"
import { Provider } from "react-redux"

const assets = require(process.env.RAZZLE_ASSETS_MANIFEST)

const cssLinksFromAssets = (assets, entrypoint) => {
    return assets[entrypoint]
        ? assets[entrypoint].css
            ? assets[entrypoint].css
                  .map((asset) => `<link rel="stylesheet" href="${asset}">`)
                  .join("")
            : ""
        : ""
}

const jsScriptTagsFromAssets = (assets, entrypoint, extra = "") => {
    return assets[entrypoint]
        ? assets[entrypoint].js
            ? assets[entrypoint].js
                  .map((asset) => `<script src="${asset}"${extra}></script>`)
                  .join("")
            : ""
        : ""
}

const publicFolder =
    process.env.NODE_ENV === "production" ? path.join(__dirname, "../build/public") : "public"

const server = express()
server
    .disable("x-powered-by")
    // process.env.RAZZLE_PUBLIC_DIR
    .use(express.static(publicFolder))
    .get("/*", (req, res) => {
        const context = {}
        const initialStateUsers = {
            data: {},
            isAuth: false,
            token: null,
            premium: false,
            paycode: "",
        }

        // Compile an initial state
        const preloadedState = { users: initialStateUsers }

        // Create a new Redux store instance
        const store = configureStore(preloadedState)

        const markup = renderToString(
            <Provider store={store}>
                <StaticRouter context={context} location={req.url}>
                    <App />
                </StaticRouter>
            </Provider>
        )

        if (context.url) {
            res.redirect(context.url)
        } else {
            res.status(200).send(
                `<!doctype html>
    <html lang="">
    <head>
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
        <meta charset="utf-8" />
        <title>Welcome to Razzle</title>
        <meta name="viewport" content="width=device-width, initial-scale=1">
        ${cssLinksFromAssets(assets, "client")}
    </head>
    <body>
        <div id="root">${markup}</div>
        ${jsScriptTagsFromAssets(assets, "client", " defer crossorigin")}
    </body>
</html>`
            )
        }
    })

export default server

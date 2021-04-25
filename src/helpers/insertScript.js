import { useEffect } from "react"

const scriptHelper = {
    InsertHoks: function(source) {
        useEffect(() => {
            const script = document.createElement("script")

            script.src = source
            script.async = true

            document.body.appendChild(script)

            return () => {
                document.body.removeChild(script)
            }
        }, [source])
    },
    appendScript: function(source) {
        const script = document.createElement("script")
        script.src = source
        script.async = true
        document.body.appendChild(script)
    },
    removeScript: function(source) {
        let allsuspects = document.getElementsByTagName("script")
        for (let i = allsuspects.length; i >= 0; i--) {
            if (
                allsuspects[i] &&
                allsuspects[i].getAttribute("src") !== null &&
                allsuspects[i].getAttribute("src").indexOf(`${source}`) !== -1
            ) {
                allsuspects[i].parentNode.removeChild(allsuspects[i])
            }
        }
    },
}

export default scriptHelper

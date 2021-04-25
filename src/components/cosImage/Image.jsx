import React from "react"
import "./scss/image.scoped.css"

const Image = (props) => {
    const [isLoaded, setIsLoaded] = React.useState(false)
    return (
        <React.Fragment>
            <img
                className="image thumb r r-2x"
                alt={props.alt}
                src={props.thumb}
                style={{ visibility: isLoaded ? "hidden" : "visible" }}
            />
            {/* <Loader style={{ visibility: isLoaded ? "hidden" : "visible" }} /> */}
            <img
                onLoad={() => {
                    setIsLoaded(true)
                }}
                className="image full r r-2x"
                style={{ opacity: isLoaded ? 1 : 0 }}
                alt={props.alt}
                src={props.src}
            />
        </React.Fragment>
    )
}

export default Image

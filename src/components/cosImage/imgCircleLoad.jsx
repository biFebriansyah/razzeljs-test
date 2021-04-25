import React from "react"
import Image from "./Image"
import useIntersectionObserver from "helpers/observer"
import "./scss/imageload.scoped.css"

const ImageContainer = (props) => {
    const ref = React.useRef()
    const [isVisible, setIsVisible] = React.useState(false)

    useIntersectionObserver({
        target: ref,
        onIntersect: ([{ isIntersecting }], observerElement) => {
            if (isIntersecting) {
                if (!isVisible) {
                    setIsVisible(true)
                }
                observerElement.unobserve(ref.current)
            }
        },
    })

    const aspectRatio = (props.height / props.width) * 100

    return (
        <a
            href={props.url}
            ref={ref}
            rel="noopener noreferrer"
            target="_BLANK"
            className="image-container r r-2x circle-loading"
            style={{ paddingBottom: `${aspectRatio}%` }}
        >
            {isVisible && (
                <Image
                    src={props.src}
                    thumb={props.thumb}
                    alt={props.alt}
                    wid={props.width}
                    hig={props.height}
                />
            )}
        </a>
    )
}

export default ImageContainer

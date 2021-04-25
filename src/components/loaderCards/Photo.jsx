import "./scss/style.scoped.scss"
import React, { useEffect, useState, useRef } from "react"
import { Link } from "react-router-dom"

const Image = ({ alt, aspectRatio = "16:9", onLoad = () => null, ...rest }) => {
    const [hasImageLoaded, setHasImageLoaded] = useState(false)
    const [containerHeight, setContainerHeight] = useState(null)
    const containerRef = useRef(null)

    const onImageLoaded = (event) => {
        setHasImageLoaded(true)
        onLoad(event)
    }

    useEffect(() => {
        if (containerRef.current) {
            const [ratioWidth, ratioHeight] = aspectRatio.split(":")
            const height = (containerRef.current.offsetWidth / ratioWidth) * ratioHeight
            setContainerHeight(height)
        }
    }, [containerRef, aspectRatio])

    return (
        <Link
            to="#"
            className="image-wrapper"
            ref={containerRef}
            style={{ minHeight: containerHeight }}
        >
            {containerHeight && (
                <>
                    {!hasImageLoaded && <div className="image-loading" />}
                    <img
                        {...rest}
                        onLoad={onImageLoaded}
                        className="r r-2x img-full"
                        width="188px"
                        height="188px"
                        alt={alt}
                    />
                </>
            )}
        </Link>
    )
}

export default Image

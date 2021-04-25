import React from "react"
import ContentLoader from "react-content-loader"

export default function LoaderNewsongs(props) {
    return (
        <div>
            <ContentLoader
                speed={2}
                width={142}
                height={142}
                viewBox="0 0 142 142"
                backgroundColor="#e3e3e3"
                foregroundColor="#c9c9c9"
                {...props}
            >
                <rect x="0" y="188" rx="2" ry="2" width="190" height="18" />
                <rect x="-2" y="-9" rx="2" ry="2" width="284" height="188" />
                <rect x="-1" y="211" rx="2" ry="2" width="139" height="18" />
            </ContentLoader>
        </div>
    )
}

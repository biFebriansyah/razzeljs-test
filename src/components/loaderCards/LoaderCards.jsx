import React from "react"
import ContentLoader from "react-content-loader"

const MyLoader = (props) => {
    return (
        <div className="col-xs-6 col-sm-4 col-md-3 col-lg-2">
            <div className="item">
                <ContentLoader
                    speed={2}
                    width={187}
                    height={252}
                    viewBox="0 0 187 252"
                    backgroundColor="#e3e3e3"
                    foregroundColor="#c9c9c9"
                    {...props}
                >
                    <rect x="0" y="188" rx="2" ry="2" width="190" height="18" />
                    <rect x="-54" y="-7" rx="2" ry="2" width="284" height="188" />
                    <rect x="-1" y="211" rx="2" ry="2" width="139" height="18" />
                </ContentLoader>
            </div>
        </div>
    )
}

export default MyLoader

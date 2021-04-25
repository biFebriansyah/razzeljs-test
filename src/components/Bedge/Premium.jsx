import "./scss/style.scoped.scss"
import React from "react"

function Premium() {
    return (
        <div className="premium">
            <span className="bg clear badge bg-warning lter text-dark-lter animate">
                <i className="icon-diamond icon" style={{ marginRight: "5px" }} />
                PREMIUM
            </span>
        </div>
    )
}

export default Premium

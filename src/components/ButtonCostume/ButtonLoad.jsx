import "./scss/style.scoped.scss"
import React from "react"

export default function ButtonLoad(props) {
    const btnClicked = () => {
        props.actions()
    }
    return (
        <div className="btn-container">
            <button className={`the-button ${props.gaya}`} onClick={btnClicked}>
                <span className="text">{props.activeText}</span>
                <i className="fa fa-spin fa-spinner text-active" style={{ marginRight: "10px" }} />
                <span className="text-active">{props.clickText}</span>
            </button>
        </div>
    )
}

import React from "react"
import { Link } from "react-router-dom"

function Side(props) {
    const genreClick = () => {
        props.onClick(props.name)
    }
    return (
        <>
            <Link
                to="#"
                className={`list-group-item ${props.active === props.name ? "active" : ""}`}
                onClick={genreClick}
            >
                {props.name}
            </Link>
        </>
    )
}

export default Side

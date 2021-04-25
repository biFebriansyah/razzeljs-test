import "./scss/style.scoped.scss"
import React, { useRef, useState } from "react"
import { Link } from "react-router-dom"

export default function Faq_List(props) {
    const readMore = useRef(null)
    const [showDsc, setShowDsc] = useState(false)

    const ReadDesc = () => {
        setShowDsc(!showDsc)
        if (!readMore.current.classList.contains("active")) {
            readMore.current.classList.add("active")
        } else {
            readMore.current.classList.remove("active")
        }
    }

    return (
        <div className="box">
            <h3>{props.title}</h3>
            <div
                dangerouslySetInnerHTML={{ __html: props.detail }}
                className={`${showDsc ? "show-desc" : "desc"}`}
            />
            <div className="read">
                <Link className="btn-read" to="#" onClick={ReadDesc} ref={readMore}>
                    <span className="text">Read More</span>
                    <span className="text-active">Close Read</span>
                </Link>
            </div>
        </div>
    )
}

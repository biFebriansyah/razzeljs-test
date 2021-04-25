import "./scss/style.scoped.scss"
import React from "react"
import { Link } from "react-router-dom"

export default function Cardswd(props) {
    const Clicked = () => {
        if (props.active === props.code) {
            props.albumClick()
        } else {
            props.albumClick(props.code)
        }
    }
    return (
        <div className="item pos-rlt card-md" onClick={Clicked}>
            <Link
                to="#"
                className={`item-overlay opacity wrapper-md font-xs ${
                    props.active === props.code ? "active" : ""
                }`}
            />
            <span className={`top wrapper-md block ${props.angka % 2 === 0 ? "" : "text-right"}`}>
                <span className="block h3 font-bold text-info">{props.name}</span>
                <span className="text-dark">Release {props.release}</span>
            </span>
            <span
                className={`bottom wrapper-md block ${props.active === props.code ? "active" : ""}`}
            >
                <i
                    className={`fa fa-circle i-lg text ${
                        props.angka % 2 === 0 ? "" : "pull-right"
                    }`}
                />
                <i
                    className={`fa fa-check-circle i-lg text-success text-active ${
                        props.angka % 2 === 0 ? "" : "pull-right"
                    }`}
                />
            </span>
            <div>
                <img className="img-full" src={props.image} alt="..." />
            </div>
        </div>
    )
}

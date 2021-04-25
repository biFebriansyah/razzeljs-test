import "./scss/style.scoped.scss"
import React from "react"
import { Link } from "react-router-dom"
import moment from "moment"

export default function NotifyMsg(props) {
    const waktu = moment(props.time).format("HH:mm")
    const onRead = () => {
        props.reading(props.id)
    }
    return (
        <>
            <div className={`notReadNotif ${props.isRead ? "hide" : ""}`}>
                <Link
                    to="#"
                    className={`media list-group-item ${props.haveread ? "" : "read"}`}
                    onClick={onRead}
                >
                    <span className="pull-left thumb-sm">
                        <i className="fa fa-envelope-o fa-2x text-success" />
                    </span>
                    <span className="media-body block m-b-none">
                        {props.title}
                        <br />
                        <small className="text-muted">Jam {waktu} WIB</small>
                    </span>
                </Link>
            </div>
            <div
                className={`notifRead ${
                    !props.isRead ? "hide" : props.readId === props.id ? "" : "hide"
                }`}
            >
                <div to="#" className="media list-group-item">
                    <span className="media-body block m-b-none">
                        <small className="text-small" style={{ fontWeight: "bold" }}>
                            {props.title}
                        </small>
                        <br />
                        <small className="text-small">{props.message}</small>
                    </span>
                </div>
            </div>
        </>
    )
}

import React, { useRef } from "react"
import { Link } from "react-router-dom"
import OutsideClickHandler from "react-outside-click-handler"
import "./scss/style.scoped.scss"

function Playlist(props) {
    const isActive = props.code === props.active ? "active" : ""
    const RefTools = useRef(null)

    const data = {
        name: props.name,
        code: props.code,
        owner: props.owner,
        image: props.image,
    }

    const setList = () => {
        props.setActive(props.code, data)
    }

    const playTheList = () => {
        props.playSongs(props.code, props.name)
    }

    const deleteList = () => {
        props.removeList(props.id)
    }

    const update = () => {
        props.updatelist(props.id)
    }

    const openTools = () => {
        if (!RefTools.current.classList.contains("open")) {
            RefTools.current.classList.add("open")
        } else {
            RefTools.current.classList.remove("open")
        }
    }

    const OusideHandel = () => {
        RefTools.current.classList.remove("open")
    }

    return (
        <li className={`list-group-item clearfix ${isActive}`} onClick={setList}>
            <OutsideClickHandler onOutsideClick={OusideHandel}>
                <button
                    to="#"
                    className="jp-play-me pull-right m-t-sm m-l text-md btn-costm"
                    onClick={openTools}
                >
                    <div className="btn-group" ref={RefTools}>
                        <span className="icon-set">
                            <i className="fa fa-ellipsis-v" />
                        </span>
                        <ul className="dropdown-menu pull-right">
                            <li>
                                <Link to="#" onClick={update}>
                                    Edit
                                </Link>
                            </li>
                            <li>
                                <Link to="#" onClick={deleteList}>
                                    Delete
                                </Link>
                            </li>
                        </ul>
                    </div>
                </button>
            </OutsideClickHandler>
            <Link
                to="#"
                className={`jp-play-me pull-right m-t-sm m-l text-md`}
                onClick={playTheList}
            >
                <i className="icon-control-play text" />
                <i className="icon-control-pause text-active" />
            </Link>
            <Link to="#" className="pull-left thumb-sm m-r">
                <img src={props.image} alt="..." style={{ width: "40px", height: "40px" }} />
            </Link>
            <Link className="clear" to="#">
                <span className="block text-ellipsis">{props.name}</span>
                <small className="text-muted">{props.owner}</small>
            </Link>
        </li>
    )
}

export default Playlist

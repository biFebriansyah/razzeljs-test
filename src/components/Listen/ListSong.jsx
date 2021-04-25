import React from "react"
import { Link } from "react-router-dom"
import { connect } from "react-redux"

function ListSong(props) {
    const play = !props.player.playing ? false : props.player.playing.isList

    const rmSongs = () => {
        props.remove(props.idx, props.index)
    }

    const playIdx = () => {
        const { isList, listName } = props.player.playing
        const data = {
            name: props.name,
            index: props.index,
            listcode: props.listcode,
            listName: props.listname,
        }

        if (!props.player.isPlay) {
            props.playlist(props.listcode, props.listname, props.index)
        } else if (isList && listName !== props.listname) {
            props.playlist(props.listcode, props.listname, props.index)
        } else {
            props.play(data)
        }
    }
    return (
        <li
            className={`list-group-item ${
                !play ? "" : props.player.playing.code === props.mcode ? "active" : ""
            }`}
        >
            <div className="pull-right m-l">
                <Link to="#" onClick={rmSongs}>
                    <i className="icon-close" />
                </Link>
            </div>
            <Link to="#" className="jp-play-me m-r-sm pull-left" onClick={playIdx}>
                <i className="icon-control-play text" />
                <i className="icon-control-pause text-active" />
            </Link>
            <div className="clear text-ellipsis" style={{ cursor: "pointer" }}>
                <span>{props.name}</span>
                {/* <span className="text-muted"> -- {props.durasi}</span> */}
            </div>
        </li>
    )
}

const mapStateToProps = (state) => {
    return {
        player: state.player,
        users: state.users,
        tokens: state.users.token,
        isAuth: state.users.isAuth,
    }
}

export default connect(mapStateToProps)(ListSong)

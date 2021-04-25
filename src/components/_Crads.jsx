import React, { useRef, useEffect, useContext, useState } from "react"
import { Link } from "react-router-dom"
import { withRouter } from "react-router"
import playerActions from "redux/actions/player"
import { OptionsContext } from "helpers/contex"
import Logs from "helpers/logs"
import api from "helpers/api"
import { connect } from "react-redux"
import { setDetailSongs } from "redux/actions/utils"
import { bindActionCreators } from "redux"
import { useToasts } from "react-toast-notifications"
import ImageContainer from "components/cosImage/imgload"

function Cards2(props) {
    const refLove = useRef(null)
    const refPlay = useRef(null)
    const refHover = useRef(null)
    const [LoveId, setLoveId] = useState(null)
    const [UseLoveId, setUseLoveId] = useState(false)
    const doRequest = new api(props.tokens).req
    const logger = new Logs(false, "Cards2")
    const { addToast } = useToasts()
    const { choiceList } = useContext(OptionsContext)

    const trigerPlayer = () => {
        if (
            typeof props.player.playing.code !== "undefined" &&
            props.player.playing.code === props.code
        ) {
            props.setContinue()
        } else {
            props.setSongs(props.songs)
        }
    }

    const toglePlay = () => {
        // props.playCard(props.idx, refPlay, refHover, props.songs)
        if (!refPlay.current.classList.contains("active")) {
            refPlay.current.classList.add("active")
            refHover.current.classList.add("active")
            trigerPlayer()
        } else {
            refPlay.current.classList.remove("active")
            refHover.current.classList.remove("active")
            if (props.player.isPlay) {
                props.setPausing()
            }
        }
    }

    useEffect(() => {
        logger.Show(props.player.playing)
        if (props.player.isPlay) {
            if (props.player.playing.code === props.code) {
                refPlay.current.classList.add("active")
                refHover.current.classList.add("active")
            } else {
                refPlay.current.classList.remove("active")
                refHover.current.classList.remove("active")
            }
        }
        // if (props.player.isPlay) {
        //     if (props.player.Data.name === props.name) {
        //         refPlay.current.classList.add("active")
        //         refHover.current.classList.add("active")
        //     } else {
        //         refPlay.current.classList.remove("active")
        //         refHover.current.classList.remove("active")
        //     }
        // }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.player])

    useEffect(() => {
        if (props.player.isPause) {
            if (props.player.playing.code === props.code) {
                refPlay.current.classList.remove("active")
                refHover.current.classList.remove("active")
            }
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.player.isPause])

    const toDetail = () => {
        const data = {
            id: props.idx,
            code: props.code,
            uuid: props.idx,
            name: props.name,
            singer: props.singer,
            cover: props.cover,
            songs: props.songs,
            history: props.history,
        }
        props.SetDetail(data)
        props.history.push(`/songs/${props.code}`)
    }

    const togleLove = () => {
        if (!refLove.current.classList.contains("active")) {
            doRequest({
                method: "POST",
                url: "music/love",
                data: {
                    music_code: props.code,
                },
            })
                .then((res) => {
                    const { data } = res
                    setLoveId(data.love_id)
                    setUseLoveId(true)
                    refLove.current.classList.add("active")
                })
                .catch((err) => {
                    logger.Show(err)
                    addToast("Maaf Kesalahan terjadi", { appearance: "error" })
                })
        } else {
            doRequest({
                method: "DELETE",
                url: `music/love?id=${UseLoveId ? LoveId : props.loved}`,
            })
                .then(() => {
                    setUseLoveId(false)
                    refLove.current.classList.remove("active")
                })
                .catch((er) => {
                    addToast(er.response.data.message, { appearance: "error" })
                })
        }
    }

    const selectList = () => {
        if (props.isAuth) {
            choiceList(props.code)
        } else {
            addToast(`Login add playlist`, { appearance: "info" })
        }
    }

    return (
        <div className="col-xs-6 col-sm-4 col-md-3 col-lg-2">
            <div className="item">
                <div className="pos-rlt">
                    <div className="bottom">
                        <span className="badge bg-info m-l-sm m-b-sm">{props.duration}</span>
                    </div>
                    <div className="item-overlay opacity r r-2x bg-black" ref={refHover}>
                        <div className="center text-center m-t-n">
                            <Link to="#" data-toggle="class" ref={refPlay} onClick={toglePlay}>
                                <i className="icon-control-play i-2x text" />
                                <i className="icon-control-pause i-2x text-active" />
                            </Link>
                        </div>
                        <div
                            className={`bottom padder m-b-sm hover-btn ${
                                props.isAuth ? "" : "hide"
                            }`}
                            style={{ right: 0, left: "auto" }}
                        >
                            <Link
                                to="#"
                                className={`pull-right ${props.loved ? "active" : ""}`}
                                ref={refLove}
                                onClick={togleLove}
                                data-toggle="class"
                                style={{ marginLeft: "10px" }}
                            >
                                <i className="fa fa-heart-o text" />
                                <i className="fa fa-heart text-active text-danger" />
                            </Link>
                            <Link to="#" data-toggle="class" onClick={selectList}>
                                <i className="fa fa-plus-circle text" />
                                <i className="fa fa-check-circle text-active text-info" />
                            </Link>
                        </div>
                    </div>
                    {/* <Link to="#">
                        <img src={props.cover} alt="p2" className="r r-2x img-full" />
                    </Link> */}
                    <ImageContainer src={props.cover} alt="a2" height={142} width={142} />
                </div>
                <div className="padder-v">
                    <Link to="#" onClick={toDetail} className="text-ellipsis">
                        {props.name}
                    </Link>
                    <Link
                        to={`/artis/${props.artiscod}`}
                        className="text-ellipsis text-xs text-muted"
                    >
                        {props.singer}
                    </Link>
                </div>
            </div>
        </div>
    )
}

const mapDispatchToProps = (dispatch) => {
    return {
        SetDetail: bindActionCreators(setDetailSongs, dispatch),
        setSongs: bindActionCreators(playerActions.setSongs, dispatch),
        setPausing: bindActionCreators(playerActions.setPause, dispatch),
        setContinue: bindActionCreators(playerActions.setContinue, dispatch),
    }
}

const mapStateToProps = (state) => {
    return {
        player: state.player,
        isAuth: state.users.isAuth,
        tokens: state.users.token,
    }
}

export default withRouter(
    connect(
        mapStateToProps,
        mapDispatchToProps
    )(Cards2)
)

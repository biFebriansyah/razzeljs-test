import "./scss/style.scoped.scss"
import React, { useRef, useEffect, useState, useContext } from "react"
import { Link, useParams } from "react-router-dom"
import { bindActionCreators } from "redux"
import { connect } from "react-redux"
import { objIsEmpty } from "helpers/utils"
import { OptionsContext } from "helpers/contex"
import { useToasts } from "react-toast-notifications"
import { FacebookShareButton, FacebookIcon, WhatsappShareButton, WhatsappIcon } from "react-share"
import AsideSong from "components/AsideSongs/AsideSong"
import loggs from "helpers/logs"
import moment from "moment"
import playerActions from "redux/actions/player"
import HelmetMeta from "views/Helmet"
// import ImageContainer from "components/cosImage/imgload"
import api from "helpers/api"

function Songs(props) {
    const refAdd = useRef(null)
    const refLike = useRef(null)
    const refPlay = useRef(null)
    const refBtnShare = useRef(null)
    const logger = new loggs(true, "Songs")
    const refItem = useRef(null)
    const refOverlay = useRef(null)
    const doRequest = new api(props.tokens).req
    const { addToast } = useToasts()
    const { choiceList } = useContext(OptionsContext)
    const [LoveId, setLoveId] = useState(null)
    const [UseLoveId, setUseLoveId] = useState(false)
    const [sonsgData, setSongsData] = useState({})
    const [sonsgGenre, setGenre] = useState(null)
    const { song_code } = useParams()

    // TODO mounted
    useEffect(() => {
        doRequest({
            method: "GET",
            url: `music/all?music_code=${song_code}`,
        })
            .then((res) => {
                const { data } = res.data
                const { genre } = data[0]
                if (genre) {
                    setGenre(genre[0].genre_short_text)
                }
                setSongsData(data[0])
            })
            .catch((er) => {
                logger.Show(er.respone)
            })

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [song_code])

    useEffect(() => {
        if (props.Songs.isPlay) {
            if (props.Songs.playing.code !== song_code) {
                refPlay.current.classList.remove("active")
                refOverlay.current.classList.remove("active")
            } else {
                refItem.current.classList.add("item")
                refPlay.current.classList.add("active")
                refOverlay.current.classList.add("active")
            }
        }

        // [props.Detail, props.Songs]
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [song_code, props.Songs])

    useEffect(() => {
        if (props.Songs.isPause) {
            if (!objIsEmpty(props.Songs.playing) && props.Songs.playing.code === song_code) {
                refPlay.current.classList.remove("active")
                refOverlay.current.classList.remove("active")
            }
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.Songs.isPause])

    const trigerPlayer = () => {
        const data = {
            id: sonsgData.id,
            name: sonsgData.music_title,
            code: sonsgData.music_code,
            artisCod: sonsgData.artis_code,
            singer: sonsgData.artis_name,
            writer: sonsgData.music_writer,
            cover: sonsgData.music_image_priority,
            duration: sonsgData.music_duration,
            musicSrc: sonsgData.music_storage_path,
        }
        if (
            typeof props.Songs.playing.code !== "undefined" &&
            props.Songs.playing.code === song_code
        ) {
            props.setContinue()
        } else {
            props.setSongs(data)
        }
    }

    const btnEvent = (args) => {
        let refs = args === 0 ? refAdd : refLike
        if (args === 2) {
            if (!refPlay.current.classList.contains("active")) {
                refItem.current.classList.add("item")
                refPlay.current.classList.add("active")
                refOverlay.current.classList.add("active")
                trigerPlayer()
            } else {
                refPlay.current.classList.remove("active")
                refOverlay.current.classList.remove("active")
                props.setPausing()
            }
        } else {
            if (!refs.current.classList.contains("active")) {
                refs.current.classList.add("active")
            } else {
                refs.current.classList.remove("active")
            }
        }
    }

    const togleLove = () => {
        if (!refLike.current.classList.contains("active")) {
            doRequest({
                method: "POST",
                url: "music/love",
                data: {
                    music_code: sonsgData.music_code,
                },
            })
                .then((res) => {
                    const { data } = res
                    setLoveId(data.love_id)
                    setUseLoveId(true)
                    refLike.current.classList.add("active")
                })
                .catch((er) => {
                    addToast(er.response.data.message, { appearance: "error" })
                })
        } else {
            doRequest({
                method: "DELETE",
                url: `music/love?id=${UseLoveId ? LoveId : sonsgData.love_id}`,
            })
                .then(() => {
                    setUseLoveId(false)
                    refLike.current.classList.remove("active")
                })
                .catch((er) => {
                    addToast(er.response.data.message, { appearance: "error" })
                })
        }
    }

    const selectList = () => {
        choiceList(sonsgData.music_code)
    }

    const itemHOver = () => {
        if (!refPlay.current.classList.contains("active")) {
            refItem.current.classList.remove("item")
        }
    }

    const openShare = () => {
        if (!refBtnShare.current.classList.contains("open")) {
            refBtnShare.current.classList.add("open")
        } else {
            refBtnShare.current.classList.remove("open")
        }
    }

    return (
        <div className="songs">
            <HelmetMeta
                title={`Musicfly ${sonsgData.artis_name} - ${sonsgData.music_title}`}
                desc={`Dengarkan lagu terbaru dari ${sonsgData.artis_name} - ${sonsgData.music_title} hanya di Musicfly`}
                img={sonsgData.music_image_priority}
                imgalt={`Picture - ${sonsgData.artis_name}`}
            />
            <section className="hbox stretch">
                <section className="vbox">
                    <section className="scrollable padder-lg" style={{ paddingRight: 0 }}>
                        <div className="main">
                            <div className="top-content boxx">
                                <div className="image_songs">
                                    <div className="item" ref={refItem} onMouseOver={itemHOver}>
                                        <div className="pos-rlt">
                                            <div
                                                className="item-overlay opacity r r-2x bg-black"
                                                ref={refOverlay}
                                            >
                                                <div className="center text-center m-t-n">
                                                    <span
                                                        className="musicbar animate inline m-l-sm"
                                                        style={{ width: 30, height: 30 }}
                                                    >
                                                        <span className="bar1 a1 text-light lter" />
                                                        <span className="bar2 a2 text-white lt" />
                                                        <span className="bar3 a3 bg-success" />
                                                        <span className="bar4 a4 bg-warning dk" />
                                                        <span className="bar5 a5 bg-danger dker" />
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="img-container">
                                                <img
                                                    src={sonsgData.music_image_priority}
                                                    alt="p2"
                                                    className="r r-2x img-full"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="detailt_songs">
                                    <div className="top-detail">
                                        <h1 className="text-ellipsis txt">
                                            {sonsgData.music_title}
                                        </h1>
                                        <h1 className="text-ellipsis txt-sub">
                                            {sonsgData.artis_name}
                                        </h1>
                                    </div>
                                    <div className="botom-detail">
                                        <div className="dsc">
                                            <h1 className="text-ellipsis txt-sub">
                                                Release{" "}
                                                {moment(sonsgData.begin_date).format(
                                                    "DD MMMM YYYY"
                                                )}
                                            </h1>
                                            <h1 className="text-ellipsis txt-sub">
                                                {sonsgData.total_love} likes
                                            </h1>
                                        </div>
                                        <div className="contorl">
                                            <div className="play">
                                                <Link
                                                    className="btn btn-success"
                                                    to="#"
                                                    onClick={() => {
                                                        btnEvent(2)
                                                    }}
                                                    ref={refPlay}
                                                >
                                                    <i className="fa fa-play-circle text" />
                                                    <span className="text">Play</span>
                                                    <i className="fa fa-pause text-active" />
                                                    <span className="text-active">Pause</span>
                                                </Link>
                                            </div>
                                            <div className={`like ${props.isAuth ? "" : "hide"}`}>
                                                <Link
                                                    className={`btn btn-default ${
                                                        sonsgData.love_id ? "active" : ""
                                                    }`}
                                                    to="#"
                                                    onClick={togleLove}
                                                    ref={refLike}
                                                >
                                                    <i className="fa fa-heart-o text" />
                                                    <span className="text">Like</span>
                                                    <i className="fa fa-heart text-active text-danger" />
                                                    <span className="text-active">Likes</span>
                                                </Link>
                                            </div>
                                            <div className="share">
                                                {/* <FacebookShareButton
                                                    url={`https://www.musicfly.id${window.location
                                                        .pathname + window.location.search}`}
                                                    quote={`Dengarkan lagu terbaru dari ${
                                                        sonsgData.artis_name
                                                    } - ${sonsgData.music_title} hanya di Musicfly`}
                                                    hashtag="#Musicfly"
                                                >
                                                    <Link
                                                        className="btn btn-default"
                                                        id="btn-1"
                                                        to="#"
                                                    >
                                                        <i className="icon-share text" />
                                                        <span className="text">Share</span>
                                                    </Link>
                                                </FacebookShareButton> */}
                                                <div className="btn-group" ref={refBtnShare}>
                                                    <button
                                                        type="button"
                                                        className="btn btn-default dropdown-toggle"
                                                        data-toggle="dropdown"
                                                        onClick={openShare}
                                                    >
                                                        <i className="icon-share text-success" />
                                                        Share
                                                        <span
                                                            className="caret text-success"
                                                            style={{ marginLeft: "3px" }}
                                                        />
                                                    </button>
                                                    <ul className="dropdown-menu">
                                                        <li>
                                                            <Link to="#" className="btn-share-con">
                                                                <FacebookShareButton
                                                                    url={`https://www.musicfly.id`}
                                                                    quote={`Dengarkan lagu terbaru dari ${sonsgData.artis_name} - ${sonsgData.music_title} hanya di Musicfly`}
                                                                    hashtag="#Musicfly"
                                                                    className="share-btn"
                                                                >
                                                                    <FacebookIcon size={25} round />
                                                                    <span>Facebook</span>
                                                                </FacebookShareButton>
                                                            </Link>
                                                        </li>
                                                        <li>
                                                            <Link to="#" className="btn-share-con">
                                                                <WhatsappShareButton
                                                                    url={`https://www.musicfly.id`}
                                                                    title={`Dengarkan lagu terbaru dari ${sonsgData.artis_name} - ${sonsgData.music_title} hanya di Musicfly`}
                                                                    className="share-btn"
                                                                >
                                                                    <WhatsappIcon size={25} round />
                                                                    <span>Whatsapp</span>
                                                                </WhatsappShareButton>
                                                            </Link>
                                                        </li>
                                                    </ul>
                                                </div>
                                            </div>
                                            <div
                                                className={`addList ${props.isAuth ? "" : "hide"}`}
                                            >
                                                <Link
                                                    className="btn btn-default"
                                                    id="btn-1"
                                                    to="#"
                                                    onClick={selectList}
                                                    ref={refAdd}
                                                >
                                                    <i className="fa fa-plus-circle text" />
                                                    <span className="text">Add to list</span>
                                                    <i className="fa fa-check text-active text-success" />
                                                    <span className="text-active">Added</span>
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="bottom-content">
                                {sonsgData.music_lyric ? (
                                    <>
                                        <h2 className="text-ellipsis">
                                            {sonsgData.music_title} Lyric
                                        </h2>
                                        <div className="lirik">
                                            <p>{sonsgData.music_lyric}</p>
                                        </div>
                                    </>
                                ) : (
                                    <h2 className="text-ellipsis">Music No Have Lyric</h2>
                                )}
                            </div>
                        </div>
                    </section>
                </section>
                {sonsgData.artis_code ? (
                    <AsideSong
                        execept={sonsgData.music_title}
                        artisCode={sonsgData.artis_code}
                        genres={sonsgGenre || "All"}
                    />
                ) : null}
            </section>
        </div>
    )
}

const mapStateToProps = (state) => {
    return {
        Detail: state.utils,
        Songs: state.player,
        tokens: state.users.token,
        isAuth: state.users.isAuth,
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        setSongs: bindActionCreators(playerActions.setSongs, dispatch),
        setPausing: bindActionCreators(playerActions.setPause, dispatch),
        setContinue: bindActionCreators(playerActions.setContinue, dispatch),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Songs)

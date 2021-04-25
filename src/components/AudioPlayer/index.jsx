import React, { useState, useContext, useRef, useEffect } from "react"
import { formatTime } from "helpers/utils"
import ReactPlayer from "react-jinke-music-player"
import { Link } from "react-router-dom"
import { OptionsContext, TestContext } from "helpers/contex"
import logs from "helpers/logs"
import api from "helpers/api"
import { useToasts } from "react-toast-notifications"
import Slider from "rc-slider"
import "rc-slider/assets/index.css"
import { SliderConfig, SliderSet, VolumeSet, adsSlider, adsVolume } from "helpers/sliderConfig"
import { connect } from "react-redux"
import PlayerActions from "redux/actions/player"
import { bindActionCreators } from "redux"
import moment from "moment"

function AudioPlayer(props) {
    const options = {
        mode: "full",
        spaceBar: false,
        playMode: "order",
        responsive: false,
        preload: "none",
        autoPlay: false,
    }

    const [audio, setAudio] = useState({})
    const duration = useRef(null)
    const timeLine = useRef(null)
    const logger = new logs(true, "player")
    const doRequest = new api(props.tokens).req
    const datenow = moment().format("YYYY-MM-DD")
    const { theme } = useContext(OptionsContext)
    const { indexSongs, playWithIndex, deletList } = useContext(TestContext)
    const { addToast } = useToasts()
    let bgPlayer =
        theme === "bg-black" ? "bg-dark" : theme === "bg-dark" ? "bg-info dker" : "bg-success dker"
    const sliderSet = SliderSet(theme)
    const volumeSet = VolumeSet(theme)

    const [unmount] = useState(false)
    const [mounted, setMounted] = useState(false)
    const [isPause, setIsPause] = useState(true)
    const [listOpen, setListOpen] = useState(false)
    const [unmute, setUnmute] = useState(true)
    const [doShuffle, setDoShuffle] = useState(false)
    const [doRepeat, setDoRepeat] = useState(false)
    const [playTitle, setPlayTitle] = useState("")
    const [playName, setPlayName] = useState("")
    const [slideValue, setSlideValue] = useState(0)
    const [durasi, setDurasi] = useState(100)
    const [playVolume, setPlayVolume] = useState(0.2)
    const [prefVolume, setPrevVolume] = useState(0)
    const [audioLists, setAudioLists] = useState([])
    const [AdsAudioLists, setAdsAudioLists] = useState([])
    const [manyListen, setManyListen] = useState(null)
    const [autoPlay, setAutoPlay] = useState(false)
    const [playingAds, setPlayAds] = useState(false)
    const [trackConfig, setTrackCOnfig] = useState(4)
    const [songsCode, setSongsCode] = useState("")
    const [listNames, SetListName] = useState("")
    const [isList, setIsList] = useState(false)
    const [recentPlayIndex, setRecentPlayIndex] = useState(0)
    const [PlayIndex, setPlayIndex] = useState(0)
    const [params, setParams] = useState({
        ...options,
    })

    const objIsEmpty = (obj) => {
        return Object.keys(obj).length === 0
    }

    useEffect(() => {
        if (props.player.setPause) {
            pauseMusic()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.player.setPause])

    useEffect(() => {
        if (props.player.continue) {
            playMusic()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.player.continue])

    // TODO Handle Cards SideEfect while playlist playing
    useEffect(() => {
        if (playingAds) {
            props.isPausing()
            addToast(`Wait Until Iklan Selesai`, { appearance: "warning" })
            return
        }
        if (mounted && Array.isArray(props.player.data) && props.player.data.length > 0) {
            const { listName } = props.player.data[0]
            setRecentPlayIndex(0)
            setPlayIndex(0)
            setIsList(true)
            SetListName(listName)
            addToast(`Playing playlist ${listName}`, { appearance: "success" })
            onAddListAudio(props.player.data)
            setAutoPlay(true)
            playMusic()
        }
        if (mounted && typeof props.player.data.name !== "undefined") {
            setIsList(false)
            SetListName("")
            onAddAudio(props.player.data)
            setAutoPlay(true)
            playMusic()
            addToast(`Playing ${props.player.data.name}`, { appearance: "success" })
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.player.data])

    useEffect(() => {
        props.isPausing()
        getAdsAudio()
        getConfigTracker()
        getConfigAudio()
        setMounted(!mounted)
        // if (!objIsEmpty(props.player.data) && typeof props.player.data.name !== "undefined") {
        //     setAutoPlay(false)
        //     onAddAudio(props.player.data)
        //     pauseMusic()
        // }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        if (!objIsEmpty(indexSongs)) {
            if (indexSongs.listName === listNames) {
                setPlayIndex(indexSongs.index)
            }
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [indexSongs])

    // TODO playng index
    useEffect(() => {
        if (!objIsEmpty(playWithIndex)) {
            const { index, songs } = playWithIndex
            setPlayIndex(index)
            setIsList(true)
            onAddListAudio(songs)
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [playWithIndex])

    useEffect(() => {
        if (!objIsEmpty(deletList)) {
            const { index } = deletList
            onDeletListSong(index)
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [deletList])

    const getConfigAudio = () => {
        doRequest({
            method: "GET",
            url: `config/count/audio?page=1&per_page=5`,
        })
            .then((res) => {
                const { data } = res.data
                setManyListen(data[0].count)
            })
            .catch((er) => {
                logger.Show(er.respone)
            })
    }

    const getConfigTracker = () => {
        doRequest({
            method: "GET",
            url: `config/count/tracker?page=1&per_page=5`,
        })
            .then((res) => {
                const { data } = res.data
                setTrackCOnfig(data[0].percent)
            })
            .catch((er) => {
                logger.Show(er.respone)
            })
    }

    const getAdsAudio = () => {
        doRequest({
            method: "GET",
            url: `banner/audio?begin_date_lte=${datenow}&end_date_gte=${datenow}`,
        })
            .then((res) => {
                const { data } = res.data
                const ads = []
                data.map((value) => {
                    const music = {
                        id: value.id,
                        code: value.banner_code,
                        name: value.banner_title,
                        singer: value.banner_credit,
                        cover: null,
                        musicSrc: value.banner_image_path,
                    }
                    ads.push(music)
                    return true
                })
                setAdsAudioLists(ads)
            })
            .catch((er) => {
                logger.Show(er.respone)
            })
    }

    const trackMusic = (code) => {
        doRequest({
            method: "POST",
            url: "tracker/listen",
            data: {
                music_code: code,
            },
        }).catch((er) => {
            logger.Show(er.respone)
        })
    }

    const playAds = () => {
        const random = Math.floor(Math.random() * AdsAudioLists.length)
        setPlayAds(true)
        setPlayIndex(0)
        onAddAudio(AdsAudioLists[random])
        setAutoPlay(true)
        playMusic()
    }

    const onAddAudio = (songs) => {
        setAudioLists([songs])
    }

    const onAddListAudio = (songs) => {
        setAudioLists(songs)
    }

    // TODO timer for music while playing
    const musicOnProgress = (audioInfo) => {
        setSlideValue(Math.ceil(audioInfo.currentTime))
        const trackIn = (Math.ceil(audioInfo.duration) * Number(trackConfig)) / 100
        if (!playingAds && trackIn > 0 && Math.ceil(audioInfo.currentTime) === Math.ceil(trackIn)) {
            logger.Show("Track run")
            trackMusic(audioInfo.code)
            return
        }
    }

    const updateParams = (config) => {
        const data = {
            ...params,
            ...config,
        }
        setParams(data)
    }

    const openList = () => {
        setListOpen(!listOpen)
    }

    const repeatMode = () => {
        setDoRepeat(!doRepeat)
        setDoShuffle(false)
        if (doRepeat) {
            updateParams({ playMode: "order" })
        } else {
            if (audioLists.length > 1) {
                updateParams({ playMode: "orderLoop" })
            } else {
                updateParams({ playMode: "singleLoop" })
            }
        }
    }

    const suffleMode = () => {
        setDoShuffle(!doShuffle)
        setDoRepeat(false)
        if (doShuffle) {
            updateParams({ playMode: "order" })
        } else {
            updateParams({ playMode: "shufflePlay" })
        }
    }

    const setPlayTime = (value) => {
        setSlideValue(value)
        audio.currentTime = value
    }

    const setVolume = (value) => {
        audio.volume = value
        setPlayVolume(value)
    }

    const playMuted = () => {
        setUnmute(!unmute)
        if (unmute) {
            audio.volume = 0
            setPrevVolume(playVolume)
            setPlayVolume(0)
        } else {
            audio.volume = prefVolume
            setPlayVolume(prefVolume)
            // audio.volume = 0.2
            // setPlayVolume(0.2)
        }
    }

    const playMusic = () => {
        if (typeof audio.play === "function") {
            const playPromise = audio.play()
            if (playPromise !== undefined) {
                playPromise
                    .then(() => {
                        return true
                    })
                    .catch((er) => {
                        logger.Show(er)
                    })
            }
        }
    }

    const onDeletListSong = (index) => {
        if (isList) {
            const newList = [...audioLists].filter((val, idx) => {
                return index !== idx
            })
            onAddListAudio(newList)
        }
    }

    const musicEnd = () => {
        setIsPause(true)
        if (playingAds) {
            props.setAdsCount(0)
            setPlayAds(false)
            if (isList) {
                // updateParams({
                //     playIndex: recentPlayIndex,
                // })
                setPlayIndex(recentPlayIndex)
                onAddListAudio(props.player.data)
                setAutoPlay(true)
            } else {
                onAddAudio(props.player.data)
                setAutoPlay(true)
            }
        } else {
            if (isList) {
                if (recentPlayIndex !== audioLists.length - 1) {
                    setPlayIndex(recentPlayIndex + 1)
                }
            }
        }
    }

    const pauseMusic = () => {
        setIsPause(true)
        if (typeof audio.pause === "function") {
            audio.pause()
        }
    }
    const playNext = () => {
        if (isList) {
            if (recentPlayIndex !== audioLists.length - 1) {
                setPlayIndex(recentPlayIndex + 1)
            } else {
                setPlayIndex(0)
            }
        }
    }
    const playPrev = () => {
        if (isList) {
            if (recentPlayIndex !== 0) {
                setPlayIndex(recentPlayIndex - 1)
            } else {
                setPlayIndex(0)
            }
        }
    }

    const onPausePlayer = () => {
        props.isPausing()
    }

    const prepareMusic = (audioInfo) => {
        setSongsCode(audioInfo.code)
        if (!playingAds && isList) {
            setRecentPlayIndex(audioInfo.playIndex)
        }
        if (!props.isPremium) {
            if (songsCode !== audioInfo.code && props.adsState >= Number(manyListen)) {
                playAds()
            } else if (songsCode !== audioInfo.code) {
                props.setAdsCount(props.adsState + 1)
            }
        }
        props.isPlaying()
        props.setPlaying()
        const title = `${audioInfo.name} - ${audioInfo.singer}`
        props.Playing({
            title: audioInfo.name,
            singer: audioInfo.singer,
            cover: audioInfo.cover,
            code: audioInfo.code,
            isList: isList,
            listName: audioInfo.listName,
        })
        logger.Show("Prepare innject")
        setPlayName(audioInfo.name)
        setPlayTitle(title)
        setIsPause(false)
        setDurasi(Math.ceil(audioInfo.duration))
    }

    const renderUi = () => {
        return (
            <footer className={`footer footer ${bgPlayer}`}>
                <div id="jp_container_N">
                    <div className="jp-type-playlist">
                        <div id="jplayer_N" className="jp-jplayer hide" />
                        <div className="jp-gui">
                            <div className="jp-video-play hide">
                                <Link to="#" className="jp-video-play-icon">
                                    play
                                </Link>
                            </div>
                            <div className="jp-interface">
                                <div className="jp-controls">
                                    <div>
                                        <Link to="#" className="jp-previous" onClick={playPrev}>
                                            <i className="icon-control-rewind i-lg" />
                                        </Link>
                                    </div>
                                    <div>
                                        <Link
                                            to="#"
                                            className={`jp-play ${isPause ? "" : "hid"}`}
                                            onClick={playMusic}
                                        >
                                            <i className="icon-control-play i-2x" />
                                        </Link>
                                        <Link
                                            to="#"
                                            className={`jp-pause ${isPause ? "hid" : ""}`}
                                            onClick={pauseMusic}
                                        >
                                            <i className="icon-control-pause i-2x" />
                                        </Link>
                                    </div>
                                    <div>
                                        <Link to="#" className="jp-next" onClick={playNext}>
                                            <i className="icon-control-forward i-lg" />
                                        </Link>
                                    </div>
                                    <div className="hide">
                                        <Link to="#" className="jp-stop">
                                            <i className="fa fa-stop" />
                                        </Link>
                                    </div>
                                    <div>
                                        <Link to="#" onClick={openList}>
                                            <i className="icon-list" />
                                        </Link>
                                    </div>
                                    <div className="jp-progress hidden-xs">
                                        <div className="jp-seek-bar dk" ref={timeLine}>
                                            <Slider
                                                {...SliderConfig}
                                                max={durasi}
                                                value={slideValue}
                                                onChange={setPlayTime}
                                                railStyle={sliderSet.railStyle}
                                                trackStyle={sliderSet.trackStyle}
                                                handleStyle={sliderSet.dotStyle}
                                                style={{ padding: 0, height: "60px" }}
                                            />
                                            <p className="player-title text-lt">
                                                {playTitle ? playTitle : "Fly Music"}
                                            </p>
                                        </div>
                                    </div>
                                    <div
                                        className="hidden-xs hidden-sm jp-current-time text-xs text-muted"
                                        ref={duration}
                                    >
                                        {audio.currentTime
                                            ? formatTime(audio.currentTime)
                                            : "00:00"}
                                    </div>
                                    <div className="hidden-xs hidden-sm jp-duration text-xs text-muted">
                                        {/* {playDuration ? playDuration : "00:00"} */}
                                        {audio.duration ? formatTime(audio.duration) : "00:00"}
                                    </div>
                                    <div className="hidden-xs hidden-sm">
                                        <Link
                                            to="#"
                                            className={`jp-mute ${unmute ? "" : "hid"}`}
                                            title="mute"
                                            onClick={playMuted}
                                        >
                                            <i className="icon-volume-2" />
                                        </Link>
                                        <Link
                                            to="#"
                                            className={`jp-unmute ${unmute ? "hid" : ""}`}
                                            title="unmute"
                                            onClick={playMuted}
                                        >
                                            <i className="icon-volume-off" />
                                        </Link>
                                    </div>
                                    <div className="hidden-xs hidden-sm jp-volume">
                                        <div className="jp-volume-bar dk">
                                            <div className="jp-volume-bar-value lter">
                                                <Slider
                                                    {...SliderConfig}
                                                    max={1}
                                                    value={playVolume}
                                                    onChange={setVolume}
                                                    railStyle={volumeSet.railStyle}
                                                    trackStyle={volumeSet.trackStyle}
                                                    handleStyle={volumeSet.dotStyle}
                                                    style={{ padding: 0 }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div>
                                        <Link
                                            to="#"
                                            className={`jp-shuffle ${doShuffle ? "hid" : ""}`}
                                            title="shuffle"
                                            onClick={suffleMode}
                                        >
                                            <i className="icon-shuffle text-muted" />
                                        </Link>
                                        <Link
                                            to="#"
                                            className={`jp-shuffle-off ${doShuffle ? "" : "hid"}`}
                                            title="shuffle off"
                                            onClick={suffleMode}
                                        >
                                            <i className="icon-shuffle text-lt" />
                                        </Link>
                                    </div>
                                    <div>
                                        <Link
                                            to="#"
                                            className={`jp-repeat ${doRepeat ? "hid" : ""}`}
                                            title="repeat"
                                            onClick={repeatMode}
                                        >
                                            <i className="icon-loop text-muted" />
                                        </Link>
                                        <Link
                                            to="#"
                                            className={`jp-repeat-off ${doRepeat ? "" : "hid"}`}
                                            title="repeat off"
                                            onClick={repeatMode}
                                        >
                                            <i className="icon-loop text-lt" />
                                        </Link>
                                    </div>
                                    <div className="hide">
                                        <Link to="#" className="jp-full-screen" title="full screen">
                                            <i className="fa fa-expand" />
                                        </Link>
                                        <Link
                                            to="#"
                                            className="jp-restore-screen"
                                            title="restore screen"
                                        >
                                            <i className="fa fa-compress text-lt" />
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div
                            className={`jp-playlist dropup ${listOpen ? "open" : ""}`}
                            id="playlist"
                        >
                            <ul className="dropdown-menu aside-xl dker">
                                {audioLists.length > 0 ? (
                                    audioLists.map((value, index) => {
                                        return (
                                            <li
                                                key={index}
                                                className={`${
                                                    value.name === playName
                                                        ? "jp-playlist-current"
                                                        : "non"
                                                }`}
                                            >
                                                <div>
                                                    <Link
                                                        to="#"
                                                        onClick={() => onDeletListSong(index)}
                                                        className="jp-playlist-item-remove"
                                                    >
                                                        ×
                                                    </Link>
                                                    <Link
                                                        to="#"
                                                        onClick={() => setPlayIndex(index)}
                                                        className={`jp-playlist-item ${
                                                            value.name === playName
                                                                ? "jp-playlist-current"
                                                                : ""
                                                        }`}
                                                    >
                                                        {value.name}
                                                    </Link>
                                                </div>
                                            </li>
                                        )
                                    })
                                ) : (
                                    <li className="non">
                                        <div>
                                            <Link to="#" className="jp-playlist-item">
                                                Playlist not found
                                            </Link>
                                        </div>
                                    </li>
                                )}
                            </ul>
                        </div>
                    </div>
                </div>
            </footer>
        )
    }

    const renderUiAds = () => {
        return (
            <footer className={`footer footer bg-primary dker`}>
                <div id="jp_container_N">
                    <div className="jp-type-playlist">
                        <div className="jp-gui">
                            <div className="jp-video-play hide">
                                <Link to="#" className="jp-video-play-icon">
                                    play
                                </Link>
                            </div>
                            <div className="jp-interface">
                                <div className="jp-controls">
                                    <div>
                                        <Link to="#" className="jp-previous">
                                            <i className="icon-control-rewind i-lg" />
                                        </Link>
                                    </div>
                                    <div>
                                        <Link to="#" className={`jp-play `}>
                                            <i className="icon-control-play i-2x" />
                                        </Link>
                                    </div>
                                    <div>
                                        <Link to="#" className="jp-next disabled">
                                            <i className="icon-control-forward i-lg" />
                                        </Link>
                                    </div>
                                    <div className="hide">
                                        <Link to="#" className="jp-stop">
                                            <i className="fa fa-stop" />
                                        </Link>
                                    </div>
                                    <div>
                                        <Link to="#">
                                            <i className="icon-list" />
                                        </Link>
                                    </div>
                                    <div className="jp-progress hidden-xs">
                                        <div className="jp-seek-bar dk">
                                            <Slider
                                                {...SliderConfig}
                                                max={durasi}
                                                value={slideValue}
                                                railStyle={adsSlider.railStyle}
                                                trackStyle={adsSlider.trackStyle}
                                                handleStyle={adsSlider.dotStyle}
                                                style={{ padding: 0, height: "60px" }}
                                            />
                                            <p className="player-title text-lt">
                                                {playTitle ? playTitle : "Fly Music"}
                                            </p>
                                        </div>
                                    </div>
                                    <div
                                        className="hidden-xs hidden-sm jp-current-time text-xs text-muted"
                                        ref={duration}
                                    >
                                        {audio.currentTime
                                            ? formatTime(audio.currentTime)
                                            : "00:00"}
                                    </div>
                                    <div className="hidden-xs hidden-sm jp-duration text-xs text-muted">
                                        {/* {playDuration ? playDuration : "00:00"} */}
                                        {audio.duration ? formatTime(audio.duration) : "00:00"}
                                    </div>
                                    <div className="hidden-xs hidden-sm">
                                        <Link
                                            to="#"
                                            className={`jp-mute ${unmute ? "" : "hid"}`}
                                            title="mute"
                                        >
                                            <i className="icon-volume-2" />
                                        </Link>
                                        <Link
                                            to="#"
                                            className={`jp-unmute ${unmute ? "hid" : ""}`}
                                            title="unmute"
                                        >
                                            <i className="icon-volume-off" />
                                        </Link>
                                    </div>
                                    <div className="hidden-xs hidden-sm jp-volume">
                                        <div className="jp-volume-bar dk">
                                            <div className="jp-volume-bar-value lter">
                                                <Slider
                                                    {...SliderConfig}
                                                    max={1}
                                                    railStyle={adsVolume.railStyle}
                                                    trackStyle={adsVolume.trackStyle}
                                                    handleStyle={adsVolume.dotStyle}
                                                    style={{ padding: 0 }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div>
                                        <Link to="#" className={`jp-shuffle`} title="shuffle">
                                            <i className="icon-shuffle text-muted" />
                                        </Link>
                                    </div>
                                    <div>
                                        <Link to="#" className={`jp-repeat `} title="repeat">
                                            <i className="icon-loop text-muted" />
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </footer>
        )
    }

    return (
        <>
            {playingAds ? renderUiAds() : renderUi()}
            {unmount ? null : (
                <div className="test">
                    <ReactPlayer
                        {...params}
                        showMediaSession
                        getAudioInstance={(instance) => {
                            setAudio(instance)
                        }}
                        clearPriorAudioLists={true}
                        quietUpdate={true}
                        audioLists={audioLists}
                        playIndex={PlayIndex}
                        defaultVolume={playVolume}
                        autoPlay={autoPlay}
                        style={{ display: "none" }}
                        onAudioProgress={musicOnProgress}
                        onAudioPlay={prepareMusic}
                        onAudioEnded={musicEnd}
                        onAudioPause={onPausePlayer}
                    />
                </div>
            )}
        </>
    )
}

const mapStateToProps = (state) => {
    return {
        player: state.player,
        adsState: state.player.adsPlay,
        tokens: state.users.token,
        users: state.users,
        isAuth: state.users.isAuth,
        isPremium: state.users.premium,
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        saveState: bindActionCreators(PlayerActions.setSaveState, dispatch),
        isPlaying: bindActionCreators(PlayerActions.isPlay, dispatch),
        setPausing: bindActionCreators(PlayerActions.setPause, dispatch),
        isPausing: bindActionCreators(PlayerActions.isPause, dispatch),
        setPlaying: bindActionCreators(PlayerActions.setPlay, dispatch),
        Playing: bindActionCreators(PlayerActions.setPlaying, dispatch),
        setAdsCount: bindActionCreators(PlayerActions.setAdsCount, dispatch),
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(AudioPlayer)

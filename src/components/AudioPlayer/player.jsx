import React, { useState, useContext, useRef, useEffect } from "react"
import { formatTime, createRandomNum } from "helpers/utils"
import ReactPlayer from "react-jinke-music-player"
import { Link } from "react-router-dom"
import { OptionsContext } from "helpers/contex"
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
        defaultVolume: 0.2,
        playMode: "order",
        responsive: false,
    }
    const Adsoptions = {
        mode: "full",
        spaceBar: false,
        defaultVolume: 0.2,
        playMode: "order",
        responsive: false,
        autoPlayInitLoadPlayList: false,
    }

    const [audio, setAudio] = useState({})
    const [AdsAudio, setAdsAudio] = useState({})
    const [isPLaylist, setIsPlaylist] = useState(false)
    const duration = useRef(null)
    const timeLine = useRef(null)
    const logger = new logs(true, "player")
    const doRequest = new api(props.tokens).req
    const datenow = moment().format("YYYY-MM-DD")
    const { theme } = useContext(OptionsContext)
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
    const [AdsSlideValue, setAdsSlideValue] = useState(0)
    const [durasi, setDurasi] = useState(100)
    const [playVolume, setPlayVolume] = useState(0.2)
    const [prefVolume, setPrevVolume] = useState(0)
    const [audioLists, setAudioLists] = useState([])
    const [AdsAudioLists, setAdsAudioLists] = useState([])
    const [autoPlay, setAutoPlay] = useState(false)
    const [autoPlayAds, setAutoPlayAds] = useState(false)
    const [playingAds, setPlayAds] = useState(false)
    const [manyListen, setManyListen] = useState(null)
    const [trackConfig, setTrackCOnfig] = useState(4)
    const [adsDurasi, setAdsDurasi] = useState(100)
    const [adsTitle, setAdsTitle] = useState("")
    const [songsCode, setSongsCode] = useState("")
    const [params, setParams] = useState({
        ...options,
    })
    const [AdsParams, setAdsParams] = useState({
        ...Adsoptions,
    })

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

    // TODO Side when music playing
    useEffect(() => {
        if (playingAds) {
            addToast(`Wait Until Iklan Selesai`, { appearance: "warning" })
            return
        }
        if (mounted && Array.isArray(props.player.Data) && props.player.Data.length > 0) {
            setIsPlaylist(true)
            onAddAudio(props.player.Data, 1)
            setAutoPlay(true)
            addToast(`Playing List`, { appearance: "info" })
        }

        if (mounted && props.player.Data && typeof props.player.Data.name !== "undefined") {
            setIsPlaylist(false)
            onAddAudio(props.player.Data, 0)
            setAutoPlay(true)
            addToast(`Playing ${props.player.Data.name}`, { appearance: "success" })
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.player.Data])

    // TODO side component mounted
    useEffect(() => {
        props.isPausing()
        getAdsAudio()
        getConfigTracker()
        getConfigAudio()
        setMounted(!mounted)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

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
                setAutoPlayAds(false)
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

    useEffect(() => {
        if (playingAds) {
            if (AdsAudioLists.length > 0) {
                updateParamsAds({ playIndex: createRandomNum(0, AdsAudioLists.length - 1) })
            }
            pauseMusic()
            adsPlay()
            // setAutoPlayAds(true)
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [playingAds])

    const onAddAudio = (songs, type) => {
        if (type === 0) {
            setAudioLists([songs])
        } else {
            setAudioLists(songs)
        }
    }

    const musicOnProgress = (audioInfo) => {
        setSlideValue(Math.ceil(audioInfo.currentTime))
        const trackIn = (Math.ceil(audioInfo.duration) * Number(trackConfig)) / 100
        if (trackIn > 0 && Math.ceil(audioInfo.currentTime) === Math.ceil(trackIn)) {
            logger.Show("Track run")
            trackMusic(audioInfo.code)
            return
        }
    }
    const adsOnProgress = (audioInfo) => {
        setAdsSlideValue(Math.ceil(audioInfo.currentTime))
    }

    const updateParams = (config) => {
        const data = {
            ...params,
            ...config,
        }
        setParams(data)
    }

    const updateParamsAds = (config) => {
        const data = {
            ...params,
            ...config,
        }
        setAdsParams(data)
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
                        console.log(er)
                        console.log(audioLists)
                    })
            }
        }
    }

    const adsPlay = () => {
        if (typeof AdsAudio.load === "function") {
            AdsAudio.load()
        }
    }

    const musicEnd = () => {
        setIsPause(true)
    }

    const pauseMusic = () => {
        setIsPause(true)
        if (typeof audio.pause === "function") {
            audio.pause()
        }
    }
    const playNext = () => {
        audio.playNext()
    }
    const playPrev = () => {
        audio.playPrev()
    }

    const onPausePlayer = () => {
        props.isPausing()
    }

    const prepareMusic = (audioInfo) => {
        if (!isPLaylist) {
            setSongsCode(audioInfo.code)
            if (songsCode !== audioInfo.code && props.adsState >= Number(manyListen)) {
                // playAds()
                setPlayAds(true)
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
        })
        setPlayName(audioInfo.name)
        setPlayTitle(title)
        setIsPause(false)
        setDurasi(Math.ceil(audioInfo.duration))
        // renderCustomAudioTitle()
    }

    const prepareAds = (audioInfo) => {
        logger.Show("ADS PLAY " + audioInfo.name)
        const title = `${audioInfo.name} - ${audioInfo.singer}`
        props.isPlaying()
        props.setPlaying()
        props.Playing({
            title: audioInfo.name,
            singer: audioInfo.singer,
            cover: audioInfo.cover,
            code: audioInfo.code,
        })
        setAdsTitle(title)
        setAdsDurasi(Math.ceil(audioInfo.duration))
    }

    const adsStop = () => {
        if (playingAds) {
            props.setAdsCount(0)
            setPlayAds(false)
            setAutoPlayAds(false)
            playMusic()
        }
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
                                                        className="jp-playlist-item-remove"
                                                    >
                                                        ×
                                                    </Link>
                                                    <Link
                                                        to="#"
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
                                                max={adsDurasi}
                                                value={AdsSlideValue}
                                                railStyle={adsSlider.railStyle}
                                                trackStyle={adsSlider.trackStyle}
                                                handleStyle={adsSlider.dotStyle}
                                                style={{ padding: 0, height: "60px" }}
                                            />
                                            <p className="player-title text-lt">
                                                {adsTitle ? adsTitle : "Fly Music"}
                                            </p>
                                        </div>
                                    </div>
                                    <div
                                        className="hidden-xs hidden-sm jp-current-time text-xs text-muted"
                                        ref={duration}
                                    >
                                        {AdsAudio.currentTime
                                            ? formatTime(AdsAudio.currentTime)
                                            : "00:00"}
                                    </div>
                                    <div className="hidden-xs hidden-sm jp-duration text-xs text-muted">
                                        {/* {playDuration ? playDuration : "00:00"} */}
                                        {AdsAudio.duration
                                            ? formatTime(AdsAudio.duration)
                                            : "00:00"}
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
            {playingAds ? (
                <>
                    {renderUiAds()}
                    <ReactPlayer
                        {...AdsParams}
                        getAudioInstance={(instance) => {
                            setAdsAudio(instance)
                        }}
                        style={{ display: "none" }}
                        onAudioProgress={adsOnProgress}
                        audioLists={AdsAudioLists}
                        autoPlay={autoPlayAds}
                        onAudioPlay={prepareAds}
                        onAudioEnded={adsStop}
                    />
                </>
            ) : unmount ? null : (
                <>
                    {renderUi()}
                    <ReactPlayer
                        {...params}
                        getAudioInstance={(instance) => {
                            setAudio(instance)
                        }}
                        volumeFade={{ fadeIn: 500, fadeOut: 500 }}
                        audioLists={audioLists}
                        autoPlay={autoPlay}
                        clearPriorAudioLists
                        style={{ display: "none" }}
                        onAudioProgress={musicOnProgress}
                        onAudioPlay={prepareMusic}
                        onAudioEnded={musicEnd}
                        onAudioPause={onPausePlayer}
                    />
                </>
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

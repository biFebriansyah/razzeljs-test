import "./scss/style.scoped.scss"
import React, { useState, useEffect } from "react"
import api from "helpers/api"
import logs from "helpers/logs"
import { connect } from "react-redux"
import { Link, useParams } from "react-router-dom"
import moment from "moment"
import { bindActionCreators } from "redux"
import playerActions from "redux/actions/player"
import HelmetMeta from "views/Helmet"
import CardsWd from "./Cards-wd"
import m44 from "asset/images/m44.jpg"

function ArtisProfile(props) {
    const avatar =
        "https://res.cloudinary.com/devops2/image/upload/v1610881331/musicfly/user_l3cqpi.png"
    const doRequest = new api(props.tokens).req
    const logger = new logs(false, "artis")
    const datenow = moment().format("YYYY-MM-DD")
    const [ArtisData, setArtisData] = useState({})
    const [MusicData, setMusicData] = useState([])
    const [MusicAll, SetMusicAll] = useState([])
    const [AlbumData, setAlbumData] = useState([])
    const [AlbumActive, setAlbumActive] = useState("")
    const titleShare = `Musicfly ${ArtisData.artis_name}`
    const desc = `Dengarkan lagu terbaru dari ${titleShare} hanya di Musicfly`
    // const ImageShare = ArtisData.artis_foto_path === null ? avatar : ArtisData.artis_foto_path

    const { artis_code } = useParams()
    useEffect(() => {
        doRequest({
            method: "GET",
            url: `music/all?page=1&per_page=1&order[id]=ASC&artis_code=${artis_code}`,
        })
            .then((res) => {
                const { data } = res.data
                setArtisData(data[0])
                logger.Show(data)
            })
            .catch((er) => {
                logger.Show(er.respone)
            })

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [artis_code])

    useEffect(() => {
        doRequest({
            method: "GET",
            url: `music/all?page=1&per_page=50&order[id]=ASC&artis_code=${artis_code}`,
        })
            .then((res) => {
                const { data } = res.data
                setMusicData(data)
                SetMusicAll(data)
            })
            .catch((er) => {
                logger.Show(er.respone)
            })

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ArtisData.complete_name_artist])

    useEffect(() => {
        doRequest({
            method: "GET",
            url: `artist/album?limit=&page=1&per_page=5&order[id]=ASC&begin_date_lte=${datenow}&end_date_gte=${datenow}&artis_code=${artis_code}`,
        })
            .then((res) => {
                const { data } = res.data
                setAlbumData(data)
            })
            .catch((er) => {
                logger.Show(er.respone)
            })

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ArtisData.complete_name_artist])

    const onAlbumClick = (code = null) => {
        if (code) {
            const newMusic = [...MusicAll].filter((val) => {
                return val.album_code === code
            })
            setAlbumActive(code)
            setMusicData(newMusic)
        } else {
            setMusicData([...MusicAll])
            setAlbumActive("")
        }
    }

    const PlaySongs = (value) => {
        // props.setSongs(value)
        props.setSongs(value)
    }

    // TODO remove about, label, social media icon
    return (
        <div className="artis">
            <HelmetMeta
                title={`Musicfly - ${ArtisData.artis_name}`}
                desc={desc}
                img="https://res.cloudinary.com/devops2/image/upload/v1618237589/musicfly/logo_ekro0x.png"
                imgalt={`Picture - ${ArtisData.artis_name}`}
            />
            <section className="hbox stretch">
                <aside className="aside-lg bg-light lter b-r">
                    <section className="vbox">
                        <section className="scrollable">
                            <div className="wrapper">
                                <div className="text-center m-b m-t">
                                    <Link to="#" className="thumb-lg">
                                        <img
                                            src={
                                                ArtisData.artis_foto_path === null
                                                    ? avatar
                                                    : ArtisData.artis_foto_path
                                            }
                                            className="img-circle"
                                            alt="artis_photo"
                                        />
                                    </Link>
                                    <div>
                                        <div className="h3 m-t-xs m-b-xs">
                                            {ArtisData.artis_name}
                                        </div>
                                        {/* <small className="text-muted">
                                            <i className="fa fa-map-marker" /> Bandung, Jawa barat
                                        </small> */}
                                    </div>
                                </div>
                                <div className="panel wrapper">
                                    <div className="row text-center">
                                        <div className="col-xs-6">
                                            <Link to="#">
                                                <span className="m-b-xs h4 block">
                                                    {MusicAll.length}
                                                </span>
                                                <small className="text-muted">Songs</small>
                                            </Link>
                                        </div>
                                        <div className="col-xs-6">
                                            <Link to="#">
                                                <span className="m-b-xs h4 block">
                                                    {AlbumData.length}
                                                </span>
                                                <small className="text-muted">Album</small>
                                            </Link>
                                        </div>
                                    </div>
                                </div>

                                {/* <div>
                                    <small className="text-uc text-xs text-muted">Label</small>
                                    <p className="text-success-lter">Musika studio</p>
                                    <small className="text-uc text-xs text-muted">About</small>
                                    <p>
                                        Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                                        Morbi id neque quam. Aliquam sollicitudin venenatis ipsum ac
                                        feugiat.
                                    </p>
                                    <div className="line" />
                                    <small className="text-uc text-xs text-muted">connection</small>
                                    <p className="m-t-sm">
                                        <Link
                                            to="#"
                                            className="btn btn-rounded btn-twitter btn-icon"
                                        >
                                            <i className="fa fa-twitter" />
                                        </Link>
                                        <Link
                                            to="#"
                                            className="btn btn-rounded btn-facebook btn-icon"
                                        >
                                            <i className="fa fa-facebook" />
                                        </Link>
                                        <Link to="#" className="btn btn-rounded btn-gplus btn-icon">
                                            <i className="fa fa-google-plus" />
                                        </Link>
                                    </p>
                                </div> */}
                            </div>
                        </section>
                    </section>
                </aside>
                <section className="col-sm-4 no-padder bg">
                    <section className="vbox">
                        <section className="scrollable hover">
                            <div className="playlist">
                                <ul className="list-group no-radius m-b-none m-t-n-xxs list-group-lg no-border">
                                    <li className="hidden-nav-xs padder m-t m-b-sm text-xs text-muted">
                                        Songs
                                    </li>
                                    {MusicData.map((val) => {
                                        const data = {
                                            id: val.id,
                                            uuid: val.genre_code,
                                            name: val.music_title,
                                            code: val.music_code,
                                            artisCod: val.artis_code,
                                            singer: val.artis_name,
                                            writer: val.music_writer,
                                            cover: val.music_image_priority,
                                            duration: val.music_duration,
                                            musicSrc: val.music_storage_path,
                                        }
                                        return (
                                            <li className="list-group-item" key={data.id}>
                                                <Link
                                                    to="#"
                                                    onClick={() => PlaySongs(data)}
                                                    className="thumb-sm pull-left m-t-sm m-l text-md"
                                                >
                                                    <i className="icon-control-play text" />
                                                    <i className="icon-control-pause text-active" />
                                                </Link>
                                                <Link to="#" className="clear">
                                                    <small className="pull-right">
                                                        3 minuts ago
                                                    </small>
                                                    <strong className="block">{data.name}</strong>
                                                    <small>penulis : {data.writer}</small>
                                                </Link>
                                            </li>
                                        )
                                    })}
                                </ul>
                            </div>
                        </section>
                    </section>
                </section>
                <section className="col-sm-3 no-padder lt">
                    <section className="vbox">
                        <section className="scrollable hover">
                            <div className="m-t-n-xxs album">
                                <ul className="list-group no-radius m-b-none m-t-n-xxs list-group-lg no-border">
                                    <li
                                        className="hidden-nav-xs padder m-t m-b-sm text-xs text-muted"
                                        key={"001"}
                                    >
                                        Album
                                    </li>
                                </ul>
                                {AlbumData.length === 0 ? (
                                    <div className="none-list">
                                        <h4> Artis not have album </h4>
                                    </div>
                                ) : (
                                    AlbumData.map((val, idx) => {
                                        const released = moment(val.album_release).format(
                                            "DD MMMM YYYY"
                                        )
                                        const angkas = idx + 1
                                        return (
                                            <CardsWd
                                                key={idx}
                                                angka={angkas}
                                                code={val.album_code}
                                                active={AlbumActive}
                                                name={val.album_complete_name}
                                                release={released}
                                                image={m44}
                                                albumClick={onAlbumClick}
                                            />
                                        )
                                    })
                                )}
                            </div>
                        </section>
                    </section>
                </section>
            </section>
        </div>
    )
}

const mapDispatchToProps = (dispatch) => {
    return {
        setSongs: bindActionCreators(playerActions.setSongs, dispatch),
    }
}

const mapStateToProps = (state) => {
    return {
        users: state.users,
        tokens: state.users.token,
        isAuth: state.users.isAuth,
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ArtisProfile)

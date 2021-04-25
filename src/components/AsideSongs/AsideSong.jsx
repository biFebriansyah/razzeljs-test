import "./scss/style.scoped.scss"
import React, { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { withRouter } from "react-router"
import { connect } from "react-redux"
import { setDetailSongs } from "redux/actions/utils"
import { bindActionCreators } from "redux"
// import Data from "helpers/dumy"
import api from "helpers/api"
import loggs from "helpers/logs"

function AsideSong(props) {
    const logger = new loggs(false, "AsideSongs")
    const doRequest = new api(props.tokens).req

    const [dataAside, setDataAside] = useState([])
    useEffect(() => {
        logger.Show(props.artisCode)
        async function getData() {
            try {
                const sonsgArtis = await getSongsByArtis()
                const songsGenre = await getSongsByGenres()
                const Songs = [...sonsgArtis, ...songsGenre]
                setDataAside(Songs)
            } catch (error) {
                logger.Show(error)
            }
        }
        getData()

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.execept])

    const toDetail = (value) => {
        props.history.push(`/songs/${value.code}`)
    }

    const getSongsByArtis = () => {
        return new Promise((resolve, reject) => {
            doRequest({
                method: "GET",
                url: `music/all?page=1&per_page=20&order[id]=ASC&artis_code=${props.artisCode}`,
            })
                .then((res) => {
                    const { data } = res.data
                    const songs = data.filter((val) => {
                        return val.music_title !== props.execept
                    })
                    resolve(songs)
                })
                .catch((er) => {
                    reject(er)
                })
        })
    }

    const getSongsByGenres = () => {
        return new Promise((resolve, reject) => {
            doRequest({
                method: "GET",
                url: `genre/music?page=1&per_page=20&order[id]=DESC`,
            })
                .then((res) => {
                    const { data } = res.data
                    const songs = data.filter((val, idx) => {
                        if (props.genres === "All") {
                            if (idx <= 10) {
                                return val
                            }
                        }
                        return val.genre_name === props.genres && val.music_title !== props.execept
                    })
                    resolve(songs)
                })
                .catch((er) => {
                    reject(er)
                })
        })
    }

    return (
        <aside className="aside-md bg-light dk main-side" id="sidebar">
            <section className="vbox animated fadeInRight">
                <section className="w-f-md scrollable hover">
                    <h4 className="font-thin m-l-md m-t">Other Songs</h4>
                    <ul className="list-group no-bg no-borders auto m-t-n-xxs">
                        {dataAside.map((value) => {
                            const data = {
                                id: value.id,
                                name: value.music_title,
                                code: value.music_code,
                                singer: value.artis_name,
                                artisCod: value.artis_code,
                                cover: value.music_image_priority,
                                duration: value.music_duration,
                                musicSrc: value.music_storage_path,
                            }
                            return (
                                <li className="list-group-item" key={data.id}>
                                    <span className="pull-left thumb-xs m-t-xs avatar m-l-xs m-r-sm">
                                        <img src={data.cover} alt="..." className="img-circle" />
                                    </span>
                                    <div className="clear">
                                        <div>
                                            <Link
                                                to="#"
                                                onClick={() => {
                                                    toDetail(data)
                                                }}
                                            >
                                                {data.name}
                                            </Link>
                                        </div>
                                        <small className="text-muted">{data.singer}</small>
                                    </div>
                                </li>
                            )
                        })}
                    </ul>
                </section>
            </section>
        </aside>
    )
}

const mapDispatchToProps = (dispatch) => {
    return {
        SetDetail: bindActionCreators(setDetailSongs, dispatch),
    }
}

export default withRouter(
    connect(
        null,
        mapDispatchToProps
    )(AsideSong)
)

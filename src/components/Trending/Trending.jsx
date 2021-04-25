import React, { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { withRouter } from "react-router"
import { connect } from "react-redux"
import { setDetailSongs } from "redux/actions/utils"
import { bindActionCreators } from "redux"
import logs from "helpers/logs"
import api from "helpers/api"
import "./scss/style.scoped.scss"

function Trending(props) {
    const logger = new logs(false, "trending")
    const doRequest = new api(props.tokens).req

    const [topSongs, setTopSongs] = useState([])
    useEffect(() => {
        doRequest({
            method: "GET",
            url: `music/trending?page=1&per_page=5&order[total_score]=DESC`,
        })
            .then((res) => {
                const { data } = res.data
                logger.Show(data)
                setTopSongs(data)
            })
            .catch((er) => {
                logger.Show(er)
            })

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const toDetail = (value) => {
        const data = {
            id: value.id,
            code: value.code,
            uuid: value.id,
            name: value.name,
            singer: value.singer,
            cover: value.cover,
            songs: value,
        }
        props.SetDetail(data)
        props.history.push(`/songs/${value.code}`)
    }

    return (
        <div className="col-md-4">
            <h3 className="font-thin">Trending</h3>
            <div className="list-group bg-white list-group-lg no-bg auto">
                {topSongs.map((val, index) => {
                    const data = {
                        id: val.id,
                        uuid: val.discovery_code,
                        name: val.music_title,
                        code: val.music_code,
                        artisCod: val.artis_code,
                        singer: val.artis_name,
                        cover: val.music_image_priority,
                        duration: val.music_duration,
                        musicSrc: val.music_storage_path,
                    }
                    return (
                        <Link
                            to="#"
                            key={index}
                            className="list-group-item clearfix warpp"
                            onClick={() => {
                                toDetail(data)
                            }}
                        >
                            <span className="pull-right h2 m-l text-dark">{index + 1}</span>
                            <span className="pull-left thumb-sm avatar m-r">
                                <img src={data.cover} alt="a4" />
                            </span>
                            <span className="clear">
                                <span>{data.name}</span>
                                <small className="text-muted clear text-ellipsis">
                                    by {data.singer}
                                </small>
                            </span>
                        </Link>
                    )
                })}
            </div>
        </div>
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
    )(Trending)
)

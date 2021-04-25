import React, { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { withRouter } from "react-router"
import { connect } from "react-redux"
import { setDetailSongs } from "redux/actions/utils"
import { bindActionCreators } from "redux"
import logs from "helpers/logs"
import api from "helpers/api"
import "./scss/style.scoped.scss"

function TopArtis(props) {
    const logger = new logs(false, "topartis")
    const doRequest = new api(props.tokens).req

    const avatar =
        "https://res.cloudinary.com/devops2/image/upload/v1610881331/musicfly/user_l3cqpi.png"

    const [topSongs, setTopSongs] = useState([])
    useEffect(() => {
        doRequest({
            method: "GET",
            url: `artist/chart?limit=&page=1&per_page=5&order[artis_rank]=ASC`,
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

    return (
        <div className="col-md-4">
            <h3 className="font-thin">Top Artis</h3>
            <div className="list-group bg-white list-group-lg no-bg auto">
                {topSongs.map((val, index) => {
                    const data = {
                        id: val.id,
                        name: val.artis_name,
                        code: val.artis_code,
                        cover: val.artis_foto_path || avatar,
                    }
                    return (
                        <Link
                            to={`/artis/${data.code}`}
                            key={index}
                            className="list-group-item clearfix warpp"
                        >
                            <span className="pull-right h2 m-l text-dark">{index + 1}</span>
                            <span className="pull-left thumb-sm avatar m-r">
                                <img src={data.cover} alt="a4" />
                            </span>
                            <span className="artisName">
                                <span>{data.name}</span>
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
    )(TopArtis)
)

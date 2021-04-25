import "./scss/style.scoped.scss"
import React, { useEffect, useState } from "react"
import api from "helpers/api"
import Loader from "components/loaderCards/LoaderCards"
import { withRouter } from "react-router"
import playerActions from "redux/actions/player"
import { connect } from "react-redux"
import { setDetailSongs } from "redux/actions/utils"
import { bindActionCreators } from "redux"
import Cards from "components/_Crads"
import loggs from "helpers/logs"
// import { newSongs } from "helpers/dumy"

function Newsong(props) {
    const [data, setData] = useState([])
    const logger = new loggs(false, "NewSongs")
    const [curentPage, setCurentPage] = useState(1)
    const [count] = useState(12)
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        setIsLoading(true)
        new api()
            .req({
                method: "GET",
                url: `music/all?page=${curentPage}&per_page=12&order[id]=DESC`,
            })
            .then((res) => {
                const { data } = res.data
                logger.Show(res.data)
                setData(data)
                setIsLoading(false)
            })
            .catch((er) => {
                console.log(er)
                setIsLoading(false)
            })

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [curentPage])

    useEffect(() => {
        setCurentPage(1)
        setIsLoading(true)
        new api()
            .req({
                method: "GET",
                url: `music/all?page=1&per_page=12&order[id]=DESC`,
            })
            .then((res) => {
                const { data } = res.data
                logger.Show(res.data)
                setData(data)
                setIsLoading(false)
            })
            .catch((er) => {
                console.log(er)
                setIsLoading(false)
            })

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <>
            <div className="head">
                <h3 className="font-thin">New Songs</h3>
                <div className="next-btn">
                    <button
                        className={`btn btn-sm btn-default btnnxt ${
                            curentPage === 1 ? "hide" : ""
                        }`}
                        data-toggle="tooltip"
                        data-placement="top"
                        title="Previous Songs"
                        onClick={() => setCurentPage(curentPage - 1)}
                    >
                        <i
                            className="fa fa-arrow-circle-left text"
                            style={{ marginRight: "3px" }}
                        />
                        Prev
                    </button>
                    <button
                        className="btn btn-sm btn-default btnnxt"
                        data-toggle="tooltip"
                        data-placement="top"
                        title="Next Songs"
                        onClick={() => setCurentPage(curentPage + 1)}
                    >
                        Next
                        <i
                            className="fa fa-arrow-circle-right text"
                            style={{ marginLeft: "3px" }}
                        />
                    </button>
                </div>
            </div>
            <div className="row row-sm cards-container">
                {isLoading
                    ? Array(count)
                          .fill()
                          .map((_, index) => {
                              return <Loader key={index} />
                          })
                    : data.map((value) => {
                          if (value.music_image_priority === null) {
                              value.music_image_priority =
                                  "https://res.cloudinary.com/devops2/image/upload/v1611190427/musicfly/One-Okerock_ucyy7e.jpg"
                          }
                          const data = {
                              id: value.id,
                              uuid: value.discovery_code,
                              name: value.music_title,
                              code: value.music_code,
                              artisCod: value.artis_code,
                              singer: value.artis_complete_name,
                              cover: value.music_image_priority,
                              duration: value.music_duration,
                              musicSrc: value.music_storage_path,
                          }
                          return (
                              <Cards
                                  key={data.id}
                                  idx={data.id}
                                  name={data.name}
                                  code={data.code}
                                  artiscod={data.artisCod}
                                  cover={data.cover}
                                  singer={data.singer}
                                  duration={data.duration}
                                  songs={data}
                                  history={props.history}
                              />
                          )
                      })}
            </div>
        </>
    )
}

const mapDispatchToProps = (dispatch) => {
    return {
        SetDetail: bindActionCreators(setDetailSongs, dispatch),
        setSongs: bindActionCreators(playerActions.setSongs, dispatch),
    }
}

export default withRouter(
    connect(
        null,
        mapDispatchToProps
    )(Newsong)
)

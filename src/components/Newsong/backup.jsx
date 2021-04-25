import "./scss/style.scoped.scss"
import React, { useEffect, useState } from "react"
import api from "helpers/api"
import { Link } from "react-router-dom"
import { withRouter } from "react-router"
import playerActions from "redux/actions/player"
import { connect } from "react-redux"
import { setDetailSongs } from "redux/actions/utils"
import { bindActionCreators } from "redux"
import ImageContainer from "components/cosImage/imgload"
import loggs from "helpers/logs"
// import { newSongs } from "helpers/dumy"

function NewSongs(props) {
    const [data, setData] = useState([])
    const logger = new loggs(false, "NewSongs")
    const [curentPage, setCurentPage] = useState(1)
    const [isLoading, setIsLoading] = useState(false)

    const savePlaying = (music_code) => {
        new api()
            .req({
                method: "GET",
                url: "/music/artis?page=1&per_page=8&order[change_date]=DESC",
                data: {
                    music_code: music_code,
                },
            })
            .then((res) => {
                const { data } = res.data
                console.log(data)
            })
            .catch((er) => {
                console.log(er)
            })
    }

    const toDetail = (value) => {
        const data = {
            id: value.id,
            uuid: value.artis_code,
            name: value.music_title,
            singer: value.artis_name,
            cover: value.cover,
            songs: {
                id: value.id,
                name: value.music_title,
                singer: value.artis_name,
                cover: value.cover,
                musicSrc: value.music_storage_path,
            },
        }
        savePlaying(value.music_code)
        props.SetDetail(data)
        props.history.push(`/songs/${data.name}`)
    }

    const PlaySongs = (value) => {
        const music = {
            id: value.id,
            code: value.music_code,
            name: value.music_title,
            singer: value.artis_name,
            cover: value.cover,
            musicSrc: value.music_storage_path,
        }
        // props.setSongs(value)
        props.setSongs(music)
    }

    useEffect(() => {
        setIsLoading(true)
        new api()
            .req({
                method: "GET",
                url: `music/all?page=${curentPage}&per_page=8&order[id]=DESC`,
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
                url: `music/trending?page=1&per_page=8&order[total_score]=DESC`,
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

    const LoadingList = () => {
        const styling = {
            width: "100%",
            height: "100vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            fontSize: "40px",
        }
        return (
            <div className="onloadList" style={styling}>
                <i className="fa fa-spin fa-spinner text" style={{ marginRight: "10px" }} />
                <span className="text">Wait..</span>
            </div>
        )
    }

    return (
        <div className="col-md-7">
            <div className="head">
                <h3 className="font-thin">Trending</h3>
            </div>
            <div className="row row-sm">
                {isLoading
                    ? LoadingList()
                    : data.map((val, index) => {
                          if (val.music_image_priority === null) {
                              val.music_image_priority =
                                  "https://res.cloudinary.com/devops2/image/upload/v1611190427/musicfly/One-Okerock_ucyy7e.jpg"
                          }
                          val.cover = val.music_image_priority
                          return (
                              <div className="col-xs-6 col-sm-3" key={index}>
                                  <div className="item">
                                      <div className="pos-rlt">
                                          <div className="item-overlay opacity r r-2x bg-black">
                                              <div className="center text-center m-t-n">
                                                  <Link
                                                      to="#"
                                                      onClick={() => {
                                                          PlaySongs(val)
                                                      }}
                                                  >
                                                      <i className="fa fa-play-circle i-2x" />
                                                  </Link>
                                              </div>
                                          </div>
                                          <ImageContainer
                                              src={val.music_image_priority}
                                              alt="a2"
                                              height={142}
                                              width={142}
                                          />

                                          {/* <Link to="#">
                                              <img
                                                  src={val.music_image_priority}
                                                  alt="a2"
                                                  className="r r-2x img-full"
                                              />

                                          </Link> */}
                                      </div>
                                      <div className="padder-v">
                                          <Link
                                              to="#"
                                              className="text-ellipsis"
                                              onClick={() => {
                                                  toDetail(val)
                                              }}
                                          >
                                              {val.music_title}
                                          </Link>
                                          <Link
                                              to={`/artis/${val.artis_code}`}
                                              className="text-ellipsis text-xs text-muted"
                                          >
                                              {val.artis_name}
                                          </Link>
                                      </div>
                                  </div>
                              </div>
                          )
                      })}
            </div>
        </div>
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
    )(NewSongs)
)

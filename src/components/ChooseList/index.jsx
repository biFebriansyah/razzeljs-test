import "./scss/style.scoped.scss"
import React, { useState, useEffect, useContext } from "react"
import { Link } from "react-router-dom"
import { useToasts } from "react-toast-notifications"
import { connect } from "react-redux"
import { OptionsContext } from "helpers/contex"
import api from "helpers/api"

function ListMusic(props) {
    let isOpen = props.open ? "show" : "hide"

    const { showToast, newList, createList } = useContext(OptionsContext)
    const { addToast } = useToasts()
    const defaultImage =
        "https://res.cloudinary.com/devops2/image/upload/v1612864760/musicfly/m40_x31sif.jpg"
    const [ListData, setListData] = useState([])
    const [onLoading, setOnLoading] = useState(false)

    const loadingList = () => {
        const apis = new api(props.tokens)
        const { username_personal } = props.users.data
        setOnLoading(true)
        apis.req({
            method: "GET",
            url: `/playlist?order[id_playlist]=ASC&per_page=999&page=1&active=1&user_playlist=${username_personal}`,
        })
            .then((res) => {
                const { data } = res.data
                setOnLoading(false)
                setListData(data)
            })
            .catch((er) => {
                setOnLoading(false)
                addToast("Ada kesalahan load data list", { appearance: "error" })
            })
    }

    useEffect(() => {
        if (props.open && props.isAuth) {
            loadingList()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.open])

    useEffect(() => {
        if (props.isAuth) {
            loadingList()
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [newList])

    const saveSongList = (play_code, namelist) => {
        setOnLoading(true)
        const apis = new api(props.tokens)
        apis.req({
            method: "POST",
            url: `/playlist/music`,
            data: {
                playlist_code: play_code,
                music_code: props.music,
            },
        })
            .then(() => {
                setOnLoading(false)
                props.toggleModal()
                showToast(`Music ditambahakan ke ${namelist}`)
            })
            .catch((er) => {
                setOnLoading(false)
                if (er.response) {
                    if (er.response.data.message === "Musik sudah pernah ditambahkan") {
                        addToast("music sudah ada dalam playlist", { appearance: "info" })
                    } else {
                        addToast("ada kesaahan saat menambahkan music", { appearance: "error" })
                    }
                }
            })
    }

    const createNew = () => {
        props.toggleModal()
        createList()
    }

    const toggle = () => {
        props.toggleModal()
    }

    const onLoadStyle = {
        width: "100%",
        height: "100vh",
        display: onLoading ? "flex" : "none",
        position: "absolute",
        justifyContent: "center",
        alignItems: "center",
        fontSize: "40px",
        backdropFilter: "blur(1px)",
        color: "black",
        zIndex: 9999,
    }

    return (
        <div className={`container ${isOpen}`}>
            <div style={onLoadStyle}>
                <i className="fa fa-spin fa-spinner text" style={{ marginRight: "10px" }} />
                <span className="text">Wait..</span>
            </div>
            <div className="modal-cos animated fadeIn">
                <section className="panel bg-white">
                    {ListData.length <= 0 ? (
                        <div className="none-list">
                            <h4>You don't have any list</h4>
                            <Link
                                to="#"
                                onClick={createNew}
                                className="bg-light dk rounded btn-create"
                                style={{ padding: "5px 10px" }}
                            >
                                <i className="icon-plus icon m-r-xs text-success" />
                                <small className="text-success">Create New List</small>
                            </Link>
                        </div>
                    ) : null}
                    <div className="panel-heading b-light bg-light">
                        <strong>Select Playlist</strong>
                        <Link to="#" className="pull-right" onClick={toggle}>
                            <strong>
                                <i className="fa fa-minus-square" />
                            </strong>
                        </Link>
                    </div>
                    <div className="list-group list-group-alt lits-data">
                        {ListData.length > 0
                            ? ListData.map((val, idx) => {
                                  if (val.foto_path_playlist === null) {
                                      val.foto_path_playlist = defaultImage
                                  }
                                  return (
                                      <Link
                                          to="#"
                                          className="media list-group-item"
                                          onClick={() => {
                                              saveSongList(
                                                  val.object_code_playlist,
                                                  val.complete_name_playlist
                                              )
                                          }}
                                      >
                                          <span className="pull-left thumb-sm image-list">
                                              <img
                                                  src={val.foto_path_playlist}
                                                  alt="..."
                                                  style={{ width: "40px", height: "40px" }}
                                              />
                                          </span>
                                          <span className="media-body block m-b-none">
                                              {val.complete_name_playlist}
                                              <br />
                                              <small className="text-muted">
                                                  {val.changed_user_playlist}
                                              </small>
                                          </span>
                                      </Link>
                                  )
                              })
                            : null}
                    </div>
                    <div className="panel-footer text-sm">
                        {ListData.length > 0 ? (
                            <Link to="#" className="pull-right" onClick={createNew}>
                                <i className="fa fa-plus-square icon m-r-xs" />
                                <small className="text">Create</small>
                            </Link>
                        ) : null}
                        {/* <Link to="#" data-toggle="class:show animated fadeInRight">
                            See all the notifications
                        </Link> */}
                    </div>
                </section>
            </div>
        </div>
    )
}

const mapStateToProps = (state) => {
    return {
        tokens: state.users.token,
        users: state.users,
        isAuth: state.users.isAuth,
    }
}

export default connect(mapStateToProps)(ListMusic)

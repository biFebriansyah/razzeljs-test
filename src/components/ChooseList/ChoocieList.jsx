import React, { useEffect, useState, useContext } from "react"
import { Link } from "react-router-dom"
import { withRouter } from "react-router"
import { connect } from "react-redux"
import { useToasts } from "react-toast-notifications"
import api from "helpers/api"
import { OptionsContext } from "helpers/contex"
import "./scss/style.scoped.scss"

function ChoocieList(props) {
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
                addToast("ada kesaahan saat menambahkan music", { appearance: "error" })
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
                <div className="header-modal">
                    <div className="btn-close" onClick={toggle}>
                        <i className="icon-close" />
                    </div>
                    <div className="judul">
                        <span className="hidden-nav-xs padder m-t m-b-sm text-judul">
                            Select Playlist
                        </span>
                    </div>
                </div>
                <section className="vbox animated fadeInUp">
                    <section className="scrollable">
                        <ul className="list-group list-group-lg no-bg auto m-b-none m-t-n-xxs">
                            {ListData.length > 0
                                ? ListData.map((val, idx) => {
                                      if (val.foto_path_playlist === null) {
                                          val.foto_path_playlist = defaultImage
                                      }
                                      return (
                                          <li
                                              key={idx}
                                              className={`list-group-item clearfix card-hover`}
                                          >
                                              {/* <Link to="#" className="pull-left thumb-sm m-r">
                                                  <img
                                                      src={val.foto_path_playlist}
                                                      alt="..."
                                                      //   style={{ width: "40px", height: "40px" }}
                                                  />
                                              </Link> */}
                                              <Link
                                                  className="clear listItems"
                                                  to="#"
                                                  onClick={() => {
                                                      saveSongList(
                                                          val.object_code_playlist,
                                                          val.complete_name_playlist
                                                      )
                                                  }}
                                              >
                                                  <div className="title">
                                                      <span className="block text-ellipsis">
                                                          {val.complete_name_playlist}
                                                      </span>
                                                      <small className="text-muted">
                                                          {val.changed_user_playlist}
                                                      </small>
                                                  </div>
                                                  <i className="fa fa-check text-muted" />
                                              </Link>
                                          </li>
                                      )
                                  })
                                : null}
                        </ul>
                    </section>
                </section>
                {/* <div className="data">
                    <ul className="list-group list-group-lg no-bg auto m-b-none m-t-n-xxs">
                        {ListData.length > 0
                            ? ListData.map((val, idx) => {
                                  if (val.foto_path_playlist === null) {
                                      val.foto_path_playlist = defaultImage
                                  }
                                  return (
                                      <li
                                          key={idx}
                                          className={`list-group-item clearfix card-hover`}
                                      >
                                          <Link to="#" className="pull-left thumb-sm m-r">
                                              <img
                                                  src={val.foto_path_playlist}
                                                  alt="..."
                                                  //   style={{ width: "40px", height: "40px" }}
                                              />
                                          </Link>
                                          <Link
                                              className="clear listItems"
                                              to="#"
                                              onClick={() => {
                                                  saveSongList(
                                                      val.object_code_playlist,
                                                      val.complete_name_playlist
                                                  )
                                              }}
                                          >
                                              <div className="title">
                                                  <span className="block text-ellipsis">
                                                      {val.complete_name_playlist}
                                                  </span>
                                                  <small className="text-muted">
                                                      {val.changed_user_playlist}
                                                  </small>
                                              </div>
                                              <i className="fa fa-check text-muted" />
                                          </Link>
                                      </li>
                                  )
                              })
                            : null}
                    </ul>
                </div> */}
                <div className="footer-modal">
                    <button className="btn btn-s-xs btn-info">Create</button>
                </div>
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

export default withRouter(connect(mapStateToProps)(ChoocieList))

import "./scss/style.scoped.scss"
import React, { useState, useEffect, useContext } from "react"
import { Link } from "react-router-dom"
import { withRouter } from "react-router"
import { OptionsContext } from "helpers/contex"
import logo from "asset/images/lwhite.png"
// import logo from "asset/images/logo.png"
import { connect } from "react-redux"
import { bindActionCreators } from "redux"
import { logout } from "redux/actions/users"
import { useToasts } from "react-toast-notifications"
import OutsideClickHandler from "react-outside-click-handler"
import { DebounceInput } from "react-debounce-input"
import api from "helpers/api"
import times from "redux/actions/timer"
import logs from "helpers/logs"
import Notify from "components/NotifMsg/NotifyMsg"

const Cards = (props) => {
    const [showBL, setShowBL] = useState(false)
    const [showDD, setShowDD] = useState(false)
    const [NavUser, setNavUser] = useState(false)
    const [isReadNotif, setIsReadNotif] = useState(false)
    const [ReadNotifId, setReadNotifId] = useState(0)
    const [notifMessage, setNotifMessage] = useState([])
    const [newNotif, setNewNotif] = useState([])
    const { addToast } = useToasts()
    const logger = new logs(true, "Header")
    const { UpdateUser, showNotif } = useContext(OptionsContext)
    const doRequest = new api(props.tokens).req
    const thems = props.theme === "bg-listen" ? "bg-black" : "bg-white-only"
    const logoThems = props.theme === "bg-listen" ? "bg-success" : "bg-info"

    const togleClass = () => {
        props.func()
    }

    const { complete_name_personal, foto_path_personal } = props.users
    const fullname = complete_name_personal
    const avatar = foto_path_personal
        ? foto_path_personal
        : "https://res.cloudinary.com/devops2/image/upload/v1610881331/musicfly/user_l3cqpi.png"

    const check = props.show ? "" : "nav-xs"
    const bels = showBL ? "open" : ""
    const dds = showDD ? "open" : ""

    const onClicked = (args) => {
        if (args === 0) {
            setShowBL(!showBL)
            setShowDD(false)
        } else {
            setShowDD(!showDD)
            setShowBL(false)
        }
    }

    const showMobile = () => {
        props.mobileShow()
    }

    const OusideHandel = () => {
        setShowBL(false)
        setShowDD(false)
    }

    const UnSetUsers = () => {
        props.UnsetAuth()
    }

    // TODO mounted
    useEffect(() => {
        if (props.isAuth) {
            getMessageNotif()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        if (props.tokens === null) {
            props.history.push(`/`)
            return
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.tokens])

    useEffect(() => {
        if (props.showToast) {
            addToast(props.textToast, { appearance: "success" })
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.showToast])

    const getMessageNotif = () => {
        doRequest({
            method: "GET",
            url: `notif?page=1&per_page=5&order[id_notif]=DESC`,
        })
            .then((res) => {
                const { data } = res.data
                const newMsg = data.filter((val) => {
                    return val.is_read_notif !== "1"
                })
                if (newMsg.length > 0) {
                    UpdateUser()
                }
                setNewNotif(newMsg)
                setNotifMessage(data)
            })
            .catch((er) => {
                logger.Show(er)
            })
    }

    const onReadNotif = (id) => {
        setIsReadNotif(true)
        setReadNotifId(id)
    }

    const onDeleteNotif = () => {
        setIsReadNotif(false)
        doRequest({
            method: "DELETE",
            url: `notif`,
            data: { id: ReadNotifId },
        })
            .then(() => {
                getMessageNotif()
            })
            .catch((er) => {
                logger.Show(er)
            })
    }
    const notReadNotif = () => {
        setIsReadNotif(false)
        doRequest({
            method: "PUT",
            url: `notif`,
            data: { id: ReadNotifId },
        })
            .then(() => {
                getMessageNotif()
            })
            .catch((er) => {
                logger.Show(er)
            })
    }

    const toPrice = () => {
        props.history.push("/price")
    }

    const NotLogin = () => {
        return (
            <header className={`${thems} header header-md navbar navbar-fixed-top-xs`}>
                <div className={`navbar-header aside ${logoThems} ${check}`}>
                    <Link
                        to="#"
                        className="btn btn-link visible-xs"
                        data-toggle="class:nav-off-screen,open"
                        data-target="#nav,html"
                        onClick={showMobile}
                    >
                        <i className="icon-list" />
                    </Link>
                    <Link to="#" className="navbar-brand text-lt">
                        {/* <i className="icon-earphones" /> */}
                        <img src={logo} alt="logo" />
                        <span className="hidden-nav-xs m-l-sm">Musicfly</span>
                    </Link>
                    <Link to="/login" className="btn btn-link visible-xs">
                        <i className="icon-login" />
                    </Link>
                </div>
                <ul className="nav navbar-nav hidden-xs">
                    <li>
                        <Link to="#" className="text-muted active" onClick={togleClass}>
                            <i className="fa fa-indent text" />
                            <i className="fa fa-dedent text-active" />
                        </Link>
                    </li>
                </ul>
                <form
                    className="navbar-form navbar-left input-s-lg m-t m-l-n-xs hidden-xs"
                    role="search"
                >
                    <div className="form-group">
                        <div className="input-group">
                            <span className="input-group-btn">
                                <button
                                    type="submit"
                                    className="btn btn-sm bg-white btn-icon rounded"
                                >
                                    <i className="fa fa-search" />
                                </button>
                            </span>
                            <DebounceInput
                                className="form-control input-sm no-border rounded"
                                placeholder="Search songs, artis..."
                                value={props.kata}
                                debounceTimeout={300}
                                onBlur={() => props.onSeacrh(false)}
                                onChange={(event) => props.setKata(event.target.value)}
                            />
                            {/* <input
                                type="text"
                                className="form-control input-sm no-border rounded"
                                placeholder="Search songs, albums..."
                            /> */}
                        </div>
                    </div>
                </form>
                <div className="navbar-right notlogin">
                    <Link to="/signup" className="cos-btn bg-bright">
                        Daftar
                    </Link>
                    <Link to="/login" className="cos-btn bg-brown">
                        Masuk
                    </Link>
                </div>
            </header>
        )
    }

    const HasLogin = () => {
        return (
            <header className={`${thems} header header-md navbar navbar-fixed-top-xs`}>
                <div className={`navbar-header aside ${logoThems} ${check}`}>
                    <Link
                        to="#"
                        className="btn btn-link visible-xs"
                        data-toggle="class:nav-off-screen,open"
                        data-target="#nav,html"
                        onClick={showMobile}
                    >
                        <i className="icon-list" />
                    </Link>
                    <Link to="#" className="navbar-brand text-lt">
                        {/* <i className="icon-earphones" /> */}
                        <img src={logo} alt="logo-whte" />
                        <span className="hidden-nav-xs m-l-sm">Musicfly</span>
                    </Link>
                    <Link
                        to="#"
                        className="btn btn-link visible-xs"
                        data-toggle="dropdown"
                        data-target=".user"
                        onClick={() => setNavUser(!NavUser)}
                    >
                        <i className="icon-user" />
                        <span
                            className={`badge badge-sm up bg-danger count ${
                                newNotif.length > 0 ? "" : "hide"
                            }`}
                        >
                            {newNotif.length}
                        </span>
                    </Link>
                </div>
                <ul className="nav navbar-nav hidden-xs">
                    <li>
                        <Link to="#" className="text-muted active" onClick={togleClass}>
                            <i className="fa fa-indent text" />
                            <i className="fa fa-dedent text-active" />
                        </Link>
                    </li>
                </ul>
                <form
                    className="navbar-form navbar-left input-s-lg m-t m-l-n-xs hidden-xs"
                    role="search"
                >
                    <div className="form-group">
                        <div className="input-group">
                            <span className="input-group-btn">
                                <button
                                    type="submit"
                                    className="btn btn-sm bg-white btn-icon rounded"
                                >
                                    <i className="fa fa-search" />
                                </button>
                            </span>
                            <DebounceInput
                                className="form-control input-sm no-border rounded"
                                placeholder="Search songs, artis..."
                                value={props.kata}
                                debounceTimeout={300}
                                onBlur={() => props.onSeacrh(false)}
                                onChange={(event) => props.setKata(event.target.value)}
                            />
                        </div>
                    </div>
                </form>
                <div className="navbar-right ">
                    <OutsideClickHandler onOutsideClick={OusideHandel}>
                        <div
                            className={`nav navbar-nav m-n hidden-xs nav-user user ${
                                NavUser ? "open" : ""
                            }`}
                        >
                            <li
                                className={`hidden-xs m-r-xs ${
                                    props.isPremium ? "premium" : "hide"
                                }`}
                            >
                                <span className="bg clear badge bg-warning lter text-dark-lter animate">
                                    <i className="icon-diamond icon m-r-xs" />
                                    PREMIUM
                                </span>
                            </li>
                            <li
                                className={`hidden-xs m-r-xs ${
                                    !props.isPremium ? "Notpremium" : "hide"
                                }`}
                            >
                                <span
                                    className="bg clear badge bg-dark lter text-light-lter"
                                    onClick={toPrice}
                                >
                                    <i className="fa fa-thumbs-up icon m-r-xs" />
                                    UPGRADE PREMIUM
                                </span>
                            </li>
                            <li className={`hidden-xs ${bels}`}>
                                <Link
                                    to="#"
                                    className="dropdown-toggle"
                                    data-toggle="dropdown"
                                    onClick={() => {
                                        onClicked(0)
                                    }}
                                >
                                    <i className="icon-bell" />
                                    <span
                                        className={`badge badge-sm up bg-danger count ${
                                            newNotif.length > 0 ? "" : "hide"
                                        }`}
                                    >
                                        {newNotif.length}
                                    </span>
                                </Link>
                                <section className="dropdown-menu aside-xl animated fadeInUp">
                                    <section className="panel bg-white">
                                        <div className="panel-heading b-light bg-light">
                                            {newNotif.length > 0 ? (
                                                <strong>
                                                    You have{" "}
                                                    <span className="count">{newNotif.length}</span>{" "}
                                                    notifications
                                                </strong>
                                            ) : (
                                                <strong>notifications</strong>
                                            )}
                                        </div>

                                        <div className="list-group list-group-alt listcon">
                                            {notifMessage.map((val) => {
                                                const haveReading = val.is_read_notif === "1"
                                                return (
                                                    <Notify
                                                        key={val.id_notif}
                                                        id={val.id_notif}
                                                        title={val.title_notif}
                                                        time={val.send_notif}
                                                        haveread={haveReading}
                                                        message={val.text_1_notif}
                                                        isRead={isReadNotif}
                                                        readId={ReadNotifId}
                                                        reading={onReadNotif}
                                                    />
                                                )
                                            })}
                                        </div>
                                        <div
                                            className={`panel-footer text-sm ${
                                                isReadNotif ? "" : "hide"
                                            }`}
                                        >
                                            <Link
                                                to="#"
                                                className="pull-left"
                                                onClick={onDeleteNotif}
                                            >
                                                <i className="icon-trash m-r-xs" />
                                                <small className="text-muted">Delet</small>
                                            </Link>
                                            <Link
                                                to="#"
                                                className="pull-right"
                                                onClick={notReadNotif}
                                            >
                                                <i className="fa fa-chevron-left m-r-xs" />
                                                <small className="text-muted">Back</small>
                                            </Link>
                                        </div>
                                    </section>
                                </section>
                            </li>
                            <li className={`dropdown ${dds}`}>
                                <Link
                                    to="#"
                                    className="dropdown-toggle bg clear"
                                    onClick={() => {
                                        onClicked(1)
                                    }}
                                >
                                    <span className="thumb-sm avatar pull-right m-t-n-sm m-b-n-sm m-l-sm photo">
                                        <img src={avatar} alt="..." />
                                    </span>
                                    <div
                                        className={`m-r-xs hidden-xl ${
                                            props.isPremium ? "premium" : "hide"
                                        }`}
                                    >
                                        <span className="bg clear badge bg-warning lter text-dark-lter animate">
                                            <i className="icon-diamond icon m-r-xs" />
                                            PREMIUM
                                        </span>
                                    </div>
                                    <div
                                        className={`m-r-xs hidden-xl ${
                                            !props.isPremium ? "Notpremium" : "hide"
                                        }`}
                                    >
                                        <span
                                            className="bg clear badge bg-dark lter text-light-lter"
                                            onClick={toPrice}
                                        >
                                            <i className="fa fa-thumbs-up icon m-r-xs" />
                                            UPGRADE PREMIUM
                                        </span>
                                    </div>
                                    {fullname}
                                    <b className=" hidden-xs caret" />
                                </Link>
                                <ul className="dropdown-menu animated fadeInRight">
                                    <li>
                                        <Link to="/users">Profile</Link>
                                    </li>
                                    <li>
                                        <Link
                                            to="#"
                                            className="notnot hidden-xl"
                                            onClick={() => showNotif()}
                                        >
                                            Notfikasi
                                            <span
                                                className={`badge badge-sm up bg-danger count ${
                                                    newNotif.length > 0 ? "" : "hide"
                                                }`}
                                            >
                                                {newNotif.length}
                                            </span>
                                        </Link>
                                    </li>
                                    <li>
                                        <Link to="/faq">Help</Link>
                                    </li>
                                    <li className="divider" />
                                    <li>
                                        <Link to="#" onClick={UnSetUsers}>
                                            Logout
                                        </Link>
                                    </li>
                                </ul>
                            </li>
                        </div>
                    </OutsideClickHandler>
                </div>
            </header>
        )
    }

    if (props.isAuth) {
        return <HasLogin />
    } else {
        return <NotLogin />
    }
}

const mapStateToProps = (state) => {
    return {
        users: state.users.data,
        isAuth: state.users.isAuth,
        tokens: state.users.token,
        isPremium: state.users.premium,
        paycode: state.users.paycode,
        timers: state.timers,
        payment: state.payment,
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        UnsetAuth: bindActionCreators(logout, dispatch),
        StopTimer: bindActionCreators(times.ResetTimer, dispatch),
    }
}

export default withRouter(
    connect(
        mapStateToProps,
        mapDispatchToProps
    )(Cards)
)

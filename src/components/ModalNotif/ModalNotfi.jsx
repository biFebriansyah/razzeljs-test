import "./scss/style.scoped.scss"
import React, { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { connect } from "react-redux"
import { useToasts } from "react-toast-notifications"
import api from "helpers/api"
import Notify from "components/NotifMsg/NotifyMsg"

function ModalNotfi(props) {
    let isOpen = props.open ? "show" : "hide"
    const doRequest = new api(props.tokens).req
    const { addToast } = useToasts()

    const [isReadNotif, setIsReadNotif] = useState(false)
    const [ReadNotifId, setReadNotifId] = useState(0)
    const [notifMessage, setNotifMessage] = useState([])
    const [newNotif, setNewNotif] = useState([])

    useEffect(() => {
        if (props.open) {
            getMessageNotif()
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.open])

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
                setNewNotif(newMsg)
                setNotifMessage(data)
            })
            .catch((er) => {
                addToast("Something happen with notif", { appearance: "error" })
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
                addToast("Something happen with notif", { appearance: "error" })
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
                addToast("Something happen with notif", { appearance: "error" })
            })
    }

    const toggle = () => {
        props.toggleModal()
    }

    return (
        <div className={`container ${isOpen}`}>
            <div className="modal-cos">
                <section className="panel bg-white">
                    <div className="header-modal panel-heading b-light bg-light">
                        <div className="btn-close" onClick={toggle}>
                            <i className="icon-close" />
                        </div>
                        <div className="judul">
                            <span className="hidden-nav-xs padder m-t m-b-sm text-judul">
                                {newNotif.length > 0 ? (
                                    <strong>
                                        You have <span className="count">{newNotif.length}</span>{" "}
                                        notifications
                                    </strong>
                                ) : (
                                    <strong>notifications</strong>
                                )}
                            </span>
                        </div>
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
                    <div className={`panel-footer text-sm foot ${isReadNotif ? "" : "hide"}`}>
                        <Link to="#" className="pull-left" onClick={onDeleteNotif}>
                            <i className="icon-trash m-r-xs" />
                            <small className="text-muted">Delet</small>
                        </Link>
                        <Link to="#" className="pull-right" onClick={notReadNotif}>
                            <i className="fa fa-chevron-left m-r-xs" />
                            <small className="text-muted">Back</small>
                        </Link>
                    </div>
                </section>
            </div>
        </div>
    )
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

export default connect(mapStateToProps)(ModalNotfi)

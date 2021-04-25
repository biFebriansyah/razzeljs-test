import React, { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import api from "helpers/api"
import times from "redux/actions/timer"
import { unsetPayCode } from "redux/actions/users"
import { useDropzone } from "react-dropzone"
import { connect } from "react-redux"
import { bindActionCreators } from "redux"
import "./scss/style.scoped.scss"

function Upload(props) {
    const isOpen = props.open ? "show" : "hide"
    const doRequest = new api(props.tokens).FormData
    const { getRootProps, getInputProps, open, acceptedFiles } = useDropzone({
        accept: "image/jpeg, image/png",
        noKeyboard: true,
        noClick: true,
    })

    const [imageFile, setImageFile] = useState(null)
    const [imageName, setImageName] = useState(null)
    const [onProgress, setOnProgress] = useState(false)
    const [onFinish, setOnFinish] = useState(false)

    useEffect(() => {
        if (imageFile !== null) {
            console.log(imageFile)
        }
    }, [imageFile])

    useEffect(() => {
        if (onFinish) {
            setTimeout(() => {
                toggle()
            }, 1000)
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [onFinish])

    useEffect(() => {
        if (acceptedFiles.length > 0) {
            acceptedFiles.map((data) => {
                setImageName(data.name)
                setImageFile(data)
                return true
            })
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [acceptedFiles])

    const upload = () => {
        setOnProgress(true)
        const bodyFormData = new FormData()
        bodyFormData.append("file", imageFile)
        bodyFormData.append("payment_code", props.paycode)
        bodyFormData.append("type", "PREMIUM")

        doRequest({
            method: "POST",
            url: "payment/upload/evidence",
            data: bodyFormData,
        })
            .then(() => {
                props.StopTimer()
                props.RemoveCode()
                setOnProgress(false)
                setOnFinish(true)
            })
            .catch((er) => {
                console.log(er)
            })
    }

    const toggle = () => {
        props.toggleModal()
    }

    const LoadingList = () => {
        const styling = {
            width: "100%",
            height: "100vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            fontSize: "40px",
            color: "white",
        }
        return (
            <div className="onloadList" style={styling}>
                <i className="fa fa-spin fa-spinner text" style={{ marginRight: "10px" }} />
                <span className="text">Wait..</span>
            </div>
        )
    }

    const success = () => {
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
                <i className="fa fa-check-circle text-success" style={{ marginRight: "10px" }} />
                <span className="text text-success">Upload Selesai</span>
            </div>
        )
    }

    return (
        <div className={`container ${isOpen}`}>
            {onProgress ? (
                LoadingList()
            ) : onFinish ? (
                success()
            ) : (
                <div className="modal-cos">
                    <div className="btn-close" onClick={toggle}>
                        <i className="icon-close" />
                    </div>
                    <div {...getRootProps({ className: "dropzone" })}>
                        <input {...getInputProps()} />
                        <div className="main">
                            <div className="top">
                                <Link to="#" className="choose" onClick={open}>
                                    <i className="fa fa-file i-2x text text-image" />
                                    <h3 className="text-image">
                                        {imageName ? imageName : "Choose Struck"}
                                    </h3>
                                </Link>
                            </div>
                            <div className="bot">
                                <Link className={`btn btn-Black`} to="#" onClick={upload}>
                                    <span className="text">Uploads</span>
                                    <i
                                        className="fa fa-spin fa-spinner text-active"
                                        style={{ marginRight: "10px" }}
                                    />
                                    <span className="text-active">Wait..</span>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

const mapDispatchToProps = (dispatch) => {
    return {
        StopTimer: bindActionCreators(times.ResetTimer, dispatch),
        RemoveCode: bindActionCreators(unsetPayCode, dispatch),
    }
}

const mapStateToProps = (state) => {
    return {
        users: state.users,
        tokens: state.users.token,
        paycode: state.users.paycode,
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Upload)

import React, { useState, useEffect } from "react"
import "./scss/style.scoped.scss"
import api from "helpers/api"
import logs from "helpers/logs"
import moment from "moment"
import ImageContainer from "components/cosImage/imgload"

// import ads from "./img/sprite.jpg"

function Modal(props) {
    const isOpen = props.open ? "show" : "hide"
    const [modalValue, setModalValue] = useState("")
    const datenow = moment().format("YYYY-MM-DD")
    const myapi = new api(props.tokens)
    const logger = new logs(false, "Modal")

    useEffect(() => {
        myapi
            .req({
                method: "GET",
                url: `banner/popup?begin_date_lte=${datenow}&end_date_gte=${datenow}`,
            })
            .then((res) => {
                const { data } = res.data
                if (Array.isArray(data) && data.length > 0) {
                    setModalValue(data[0].banner_image_path)
                }
            })
            .catch((er) => {
                logger.Show(er)
            })

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const toggle = () => {
        props.toggleModal()
    }
    return (
        <div className={`container ${isOpen}`}>
            <div className="modal-cos">
                <div className="btn-close" onClick={toggle}>
                    <i className="icon-close" />
                </div>
                <ImageContainer src={modalValue} alt="modal" height={338} width={600} />
                {/* <img src={modalValue} alt="iklan" /> */}
            </div>
        </div>
    )
}

export default Modal

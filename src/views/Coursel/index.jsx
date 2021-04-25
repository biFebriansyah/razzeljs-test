import React, { useEffect, useState } from "react"
import Slider from "react-slick"
// import { Ads } from "helpers/dumy"
import { connect } from "react-redux"
import api from "helpers/api"
import logs from "helpers/logs"
import moment from "moment"
import "./css/style.scoped.scss"

function Coursel(props) {
    const myapi = new api(props.tokens)
    const logger = new logs(false, "Coursel")
    const datenow = moment().format("YYYY-MM-DD")
    const [slideValue, setSlideValue] = useState([])

    useEffect(() => {
        myapi
            .req({
                method: "GET",
                url: `/banner/slide?begin_date_lte=${datenow}&end_date_gte=${datenow}`,
            })
            .then((res) => {
                const { data } = res.data
                setSlideValue(data)
                logger.Show(data)
            })
            .catch((er) => {
                console.log(er.respone)
            })

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const conf = {
        dots: true,
        infinite: true,
        autoplay: true,
        arrows: false,
        className: "center",
        centerPadding: "60px",
        swipeToSlide: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
    }
    return (
        <section className="slid-panel">
            <Slider {...conf}>
                {slideValue.map((items) => {
                    return (
                        <div className="slideItems" key={items.banner_code}>
                            <img src={items.banner_image_path} alt={items.banner_title} />
                        </div>
                    )
                })}
            </Slider>
        </section>
    )
}

const mapStateToProps = (state) => {
    return {
        users: state.users,
        tokens: state.users.token,
        isAuth: state.users.isAuth,
    }
}

export default connect(mapStateToProps)(Coursel)

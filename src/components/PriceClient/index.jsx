import "./scss/style.scoped.css"
import React, { useRef } from "react"
import { connect } from "react-redux"
import { useToasts } from "react-toast-notifications"

function CardsPrice(props) {
    const cradsRef = useRef(null)
    const listInfo = JSON.parse(props.info)
    const { addToast } = useToasts()
    const duraasi =
        props.duration === "1"
            ? "Day"
            : props.duration === "2"
            ? "Week"
            : props.duration === "3"
            ? "Month"
            : props.duration === "4"
            ? "Year"
            : "None"
    const isActive = props.active === props.id ? "cards-active" : ""

    const ClickCards = () => {
        props.setActive(props.id, listInfo, props.title, props.price2, props.duration)
    }

    const btnBuy = () => {
        if (props.isAuth) {
            const cards = {
                name: props.title,
                price: props.price2,
                feature: listInfo,
                users: props.users,
                duration: props.duration,
            }
            props.history.push({
                pathname: `/payment/${props.code}`,
                state: { data: cards },
            })
        } else {
            addToast("Login First to do sometng great.!!", { appearance: "info" })
            // props.showinfo("Login First")
        }
    }

    return (
        <div
            className={`item ${isActive}`}
            ref={cradsRef}
            onClick={ClickCards}
            style={{ cursor: "pointer" }}
        >
            <h3>{props.title}</h3>
            <div className="icons-sets" style={{ fontSize: "40px" }}>
                <i className="icon-diamond" />
            </div>
            <div className="idr" style={{ textAlign: "center" }}>
                <h1>IDR {props.price ? props.price : 0}</h1>
                <h4>/{duraasi}</h4>
            </div>
            <div className="detail">
                <ul>
                    {listInfo.map((data, idx) => {
                        return (
                            <li key={idx}>
                                <div to="#">
                                    <i
                                        className="fa fa-check icon"
                                        style={{ marginRight: "7px" }}
                                    />
                                    <span>{data.value}</span>
                                </div>
                            </li>
                        )
                    })}
                </ul>
            </div>
            <button className="btn btn-s-md btn-info" onClick={btnBuy}>
                Buy
            </button>
        </div>
    )
}

const mapStateToProps = (state) => {
    return {
        users: state.users,
        tokens: state.users.token,
        isAuth: state.users.isAuth,
        timers: state.timers,
        payment: state.payment,
    }
}

export default connect(mapStateToProps)(CardsPrice)

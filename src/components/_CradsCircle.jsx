import React from "react"
import { withRouter } from "react-router"
import ImageContainer from "components/cosImage/imgCircleLoad"

function _CradsCircle(props) {
    const toDetail = () => {
        props.history.push(`/artis/${props.code}`)
    }
    return (
        <div className="col-xs-6 col-sm-4 col-md-3 col-lg-2">
            <div className="item text-center" style={{ cursor: "pointer" }} onClick={toDetail}>
                <div className="pos-rlt">
                    <ImageContainer src={props.image} alt="a2" height={142} width={142} />
                </div>
                <div className="padder-v">
                    <p className="text-ellipsis">{props.name}</p>
                </div>
            </div>
        </div>
    )
}

export default withRouter(_CradsCircle)

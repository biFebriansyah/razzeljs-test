import React from "react"
import ImageContainer from "components/cosImage/imgload"
import { Link } from "react-router-dom"

function CardsMin(props) {
    return (
        <div className="col-xs-6 col-sm-4 col-md-3 col-lg-2" key={props.id}>
            <div className="item">
                <div className="pos-rlt">
                    <div className="item-overlay opacity r r-2x bg-black">
                        <div className="center text-center m-t-n">
                            <Link
                                to="#"
                                onClick={() => {
                                    props.play(props.data)
                                }}
                            >
                                <i className="fa fa-play-circle i-2x" />
                            </Link>
                        </div>
                    </div>
                    <ImageContainer src={props.image} alt="a2" height={140} width={140} />
                </div>
                <div className="padder-v">
                    <Link
                        to="#"
                        className="text-ellipsis"
                        onClick={() => {
                            props.detail(props.data)
                        }}
                    >
                        {props.name}
                    </Link>
                    <Link
                        to={`/artis/${props.artisCod}`}
                        className="text-ellipsis text-xs text-muted"
                    >
                        {props.artis}
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default CardsMin

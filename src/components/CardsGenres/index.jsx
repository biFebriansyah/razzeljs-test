import React from "react"

function CradsGen(props) {
    return (
        <div className="col-xs-6 col-sm-4 col-md-3 col-lg-2">
            <div className="item">
                <div className="pos-rlt">
                    <div className="item-overlay opacity r r-2x bg-black">
                        <div className="center text-center m-t-n">
                            <a href="/#">
                                <i className="fa fa-play-circle i-2x" />
                            </a>
                        </div>
                    </div>
                    <a href="track-detail.html">
                        <img src={props.image} alt="" className="r r-2x img-full" />
                    </a>
                </div>
                <div className="padder-v">
                    <a
                        href="track-detail.html"
                        data-bjax
                        data-target="#bjax-target"
                        data-el="#bjax-el"
                        data-replace="true"
                        className="text-ellipsis"
                    >
                        {props.name}
                    </a>
                    <a
                        href="track-detail.html"
                        data-bjax
                        data-target="#bjax-target"
                        data-el="#bjax-el"
                        data-replace="true"
                        className="text-ellipsis text-xs text-muted"
                    >
                        {props.artis}
                    </a>
                </div>
            </div>
        </div>
    )
}

export default CradsGen
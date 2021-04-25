import React from "react"

export default function _Discovery() {
    return (
        <>
            <h2 className="font-thin m-b">
                Discover{" "}
                <span className="musicbar animate inline m-l-sm" style={{ width: 20, height: 20 }}>
                    <span className="bar1 a1 bg-primary lter" />
                    <span className="bar2 a2 bg-info lt" />
                    <span className="bar3 a3 bg-success" />
                    <span className="bar4 a4 bg-warning dk" />
                    <span className="bar5 a5 bg-danger dker" />
                </span>
            </h2>
            <a href="/#" className="pull-right text-muted">
                <i className="icon-refresh i-lg  inline" id="refresh" />
            </a>
        </>
    )
}

import React from "react"
import { Link, useLocation } from "react-router-dom"
import { withRouter } from "react-router"
import { connect } from "react-redux"
import { bindActionCreators } from "redux"
import { DebounceInput } from "react-debounce-input"
import playerActions from "redux/actions/player"
import a3 from "asset/images/cd.webp"
import "./scss/styel.scoped.scss"

function Sidebar(props) {
    const location = useLocation()
    const curentLocation = location.pathname
    const check = props.show ? "" : "nav-xs"
    const mobileOpen = !props.mobile ? "" : "show" //nav-off-screen
    const thems = props.theme === "bg-listen" ? "bg-black" : props.theme
    const logoThems = props.theme === "bg-listen" ? "bg-success" : "bg-info"

    const imageError = (el) => {
        el.target.src = a3
    }

    return (
        <aside className={`${thems} dk aside hidden-print ${check}`} id="nav">
            <section className="vbox">
                <section className="w-f-md scrollable">
                    <div
                        className="slim-scroll"
                        data-height="auto"
                        data-disable-fade-out="true"
                        data-distance={0}
                        data-size="10px"
                        data-railopacity="0.2"
                    >
                        <nav className={`nav-primary hidden-xs bg navku ${mobileOpen}`}>
                            <div className={`cari ${logoThems}`}>
                                <DebounceInput
                                    className="form-control input-sm no-border rounded show-xs"
                                    placeholder="Search songs, artis..."
                                    value={props.kata}
                                    debounceTimeout={300}
                                    onChange={(event) => props.setKata(event.target.value)}
                                />
                            </div>
                            <ul className="nav bg clearfix">
                                <li className="hidden-nav-xs padder m-t m-b-sm text-xs text-muted">
                                    Discover
                                </li>
                                <li className={curentLocation === "/" ? "active" : ""}>
                                    <Link to="/">
                                        <i
                                            className={`icon-disc icon ${
                                                props.home ? "text-success" : ""
                                            }`}
                                        />
                                        <span className="font-bold">Home</span>
                                    </Link>
                                </li>
                                <li className={curentLocation === "/genres" ? "active" : ""}>
                                    <Link to="/genres">
                                        <i
                                            className={`icon-music-tone-alt icon ${
                                                props.home ? "text-info" : ""
                                            }`}
                                        />
                                        <span className="font-bold">Genres</span>
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/listen">
                                        <i
                                            className={`icon-list icon ${
                                                props.home ? "text-info-dker" : ""
                                            }`}
                                        />
                                        <span className="font-bold">Listen</span>
                                    </Link>
                                </li>
                            </ul>
                            <ul className="nav text-sm">
                                <li className="hidden-nav-xs padder m-t m-b-sm text-xs text-muted">
                                    Company
                                </li>
                                <li>
                                    <Link to="/about">
                                        <i
                                            className={`icon-book-open icon ${
                                                props.home ? "text-primary-lter" : ""
                                            }`}
                                        />
                                        <span>About</span>
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/price">
                                        <i
                                            className={`fa fa-dollar icon ${
                                                props.home ? "text-warning-lter" : ""
                                            }`}
                                        />
                                        <span>Price</span>
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/faq">
                                        <i
                                            className={`icon-question icon ${
                                                props.home ? "text-primary" : ""
                                            }`}
                                        />
                                        <span>FAQ</span>
                                    </Link>
                                </li>
                            </ul>
                        </nav>
                    </div>
                </section>
                <footer className="footer hidden-xs no-padder text-center-nav-xs">
                    <div className="bg hidden-xs ">
                        <div className="dropdown dropup wrapper-sm clearfix">
                            <Link to="#" className="dropdown-toggle" data-toggle="dropdown">
                                <span className="thumb-sm avatar pull-left m-l-xs">
                                    <img
                                        src={
                                            !props.player.playing
                                                ? a3
                                                : props.player.playing.cover
                                                ? props.player.playing.cover
                                                : a3
                                        }
                                        onError={imageError}
                                        className="dker"
                                        style={{ height: "40px", width: "40px" }}
                                        alt="..."
                                    />
                                    <i className="on b-black" />
                                </span>
                                <span className="hidden-nav-xs clear">
                                    <span className="block m-l">
                                        <strong className="font-bold text-lt">
                                            {!props.player.playing
                                                ? "Flymusic"
                                                : props.player.playing.title
                                                ? props.player.playing.title
                                                : "Flymusic"}
                                        </strong>
                                    </span>
                                    <span className="text-muted text-xs block m-l">
                                        {!props.player.playing
                                            ? "Singer"
                                            : props.player.playing.singer
                                            ? props.player.playing.singer
                                            : "Singer"}
                                    </span>
                                </span>
                            </Link>
                        </div>
                    </div>
                </footer>
            </section>
        </aside>
    )
}

const mapStateToProps = (state) => {
    return {
        player: state.player,
        users: state.users,
        tokens: state.users.token,
        isAuth: state.users.isAuth,
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        setSongs: bindActionCreators(playerActions.setSongs, dispatch),
    }
}

export default withRouter(
    connect(
        mapStateToProps,
        mapDispatchToProps
    )(Sidebar)
)

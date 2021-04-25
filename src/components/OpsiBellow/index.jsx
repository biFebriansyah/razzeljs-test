import "./scss/style.scoped.scss"
import React from "react"
import { Link } from "react-router-dom"
import { connect } from "react-redux"

function Opsi(props) {
    return (
        <div className="opsi m-t-lg m-b-lg">
            <div className={`${props.isAuth ? "hide" : "create"}`}>
                <div className="bg-primary wrapper-md r">
                    <Link to="/signup">
                        <span className="h4 m-b-xs block">
                            <i className=" icon-user-follow i-lg" /> Create account
                        </span>
                        <span className="text-muted">
                            Save your playlist and listen with your friends when you login.
                        </span>
                    </Link>
                </div>
            </div>
            <div className={`${props.isAuth ? "hide" : "masuk"}`}>
                <div className="bg-info wrapper-md r">
                    <Link to="/login">
                        <span className="h4 m-b-xs block">
                            <i className=" icon-user-follow i-lg" /> Login to your'e account
                        </span>
                        <span className="text-muted">
                            Login to youre account adn enjoy you're music with us
                        </span>
                    </Link>
                </div>
            </div>
            <div className={`${!props.isAuth ? "hide" : props.isPremium ? "hide" : "upgrade"}`}>
                <div className="bg-black wrapper-md r">
                    <Link to="/price">
                        <span className="h4 m-b-xs block">
                            <i className="icon-diamond i-lg" /> Upgrade Premium
                        </span>
                        <span className="text-muted">
                            Upgrade youre account to remove all the anoying ads.
                        </span>
                    </Link>
                </div>
            </div>
        </div>
    )
}

const mapStateToProps = (state) => {
    return {
        users: state.users,
        tokens: state.users.token,
        isAuth: state.users.isAuth,
        isPremium: state.users.premium,
    }
}

export default connect(mapStateToProps)(Opsi)

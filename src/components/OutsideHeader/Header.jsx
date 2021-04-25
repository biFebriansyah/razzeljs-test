import React from "react"
import logo from "asset/images/brown.png"
import { Link } from "react-router-dom"
import "./scss/style.scoped.scss"

function Header(props) {
    return (
        <header className="my-header bg-white-only">
            <div className="my-left">
                <Link to="/" className="navbar-brand login-head">
                    <img src={logo} alt="." />
                    <span className="hidden-nav-xs m-l-sm">Musicfly</span>
                </Link>
            </div>
            <div className="my-right ">
                <div className="my-btn">
                    <Link to="/" className="cos-btn bg-false">
                        Explore
                    </Link>
                </div>
                {props.auth ? (
                    <div className="my-btn">
                        <Link to="/signup" className="cos-btn bg-true">
                            Daftar
                        </Link>
                    </div>
                ) : null}
            </div>
        </header>
    )
}

export default Header

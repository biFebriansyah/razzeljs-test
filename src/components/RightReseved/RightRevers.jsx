import "./scss/style.scoped.scss"
import React, { useEffect, useState } from "react"
import logoWhite from "asset/images/lwhite.png"
import api from "helpers/api"
import { connect } from "react-redux"

function RightRevers(props) {
    const doRequest = new api(props.tokens).req
    const [socialData, setSocial] = useState([])
    const [email, setEmail] = useState("")
    const [addres, setAddres] = useState("")
    const [phone, setPhone] = useState("")
    const [tags, setTags] = useState("")

    useEffect(() => {
        getGeneral()
        getSocial()

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const getGeneral = () => {
        doRequest({
            method: "GET",
            url: "config/general?page=1&per_page=999",
        }).then((res) => {
            const { data } = res.data
            data.map((val) => {
                if (val.type === "MAIL") {
                    setEmail(val.description)
                } else if (val.type === "ADDRESS") {
                    setAddres(val.description)
                } else if (val.type === "PHONE1") {
                    setPhone(val.description)
                } else if (val.type === "TAG") {
                    setTags(val.description)
                }
                return true
            })
        })
    }

    const getSocial = () => {
        doRequest({
            method: "GET",
            url: "config/social?page=1&per_page=999",
        }).then((res) => {
            const { data } = res.data
            setSocial(data)
        })
    }

    const getIcons = (type) => {
        if (type === "FB") {
            return "icon-social-facebook"
        } else if (type === "INSTA") {
            return "fa fa-instagram"
        } else if (type === "YOUTB") {
            return "fa fa-youtube-play"
        } else if (type === "TWIT") {
            return "icon-social-twitter"
        } else if (type === "GOOGLE") {
            return "fa fa-google-plus"
        }
    }

    return (
        <footer>
            <div className="base">
                <section>
                    <p>About</p>
                    <p>Faq</p>
                    <p>Explorer</p>
                </section>
                <section>
                    <p>{email}</p>
                    <p>{addres}</p>
                    <p>{phone}</p>
                </section>
                <section className="logo">
                    <div className="headline">
                        <img src={logoWhite} alt="." />
                        <div className="ket">
                            <p className="name">MusicFly</p>
                            <p className="desc">{tags}</p>
                        </div>
                    </div>
                    <div className="icons-container">
                        {socialData.map((val, idx) => {
                            return (
                                <a
                                    key={idx}
                                    className="icos fb"
                                    href={val.description}
                                    target="_blank"
                                    rel="noreferrer"
                                >
                                    <i className={getIcons(val.type)} />
                                </a>
                            )
                        })}
                    </div>
                </section>
            </div>
            <hr />
            <div className="cpr">
                <p>Ⓒ 2021 musicfly.id All rights reseved</p>
            </div>
        </footer>
    )
}

const mapStateToProps = (state) => {
    return {
        users: state.users,
        tokens: state.users.token,
    }
}

export default connect(mapStateToProps)(RightRevers)

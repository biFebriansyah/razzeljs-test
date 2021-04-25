import React, { useState, useEffect, useContext } from "react"
import { useLocation } from "react-router-dom"
import { OptionsContext } from "helpers/contex"
import { connect } from "react-redux"
import { logout } from "redux/actions/users"
import { bindActionCreators } from "redux"
import Cards from "components/_Crads"
import CircleCard from "components/_CradsCircle"
import api from "helpers/api"
import Loader from "components/loaderCards/LoaderCards"
import "./css/style.scoped.css"

function Search(props) {
    const doRequest = new api(props.tokens).req
    const lokasi = useLocation()
    const { setTheme } = useContext(OptionsContext)
    const [Songs, setSongs] = useState([])
    const [CurrentLoc, SetCurrentLoc] = useState("")
    const [Artis, setArtis] = useState([])
    const [isLoad, SetIsLoad] = useState(false)
    const [count] = useState(24)

    const avatar =
        "https://res.cloudinary.com/devops2/image/upload/v1610881331/musicfly/user_l3cqpi.png"

    useEffect(() => {
        SetCurrentLoc(lokasi.pathname)
        if (lokasi.pathname === "/genres") {
            setTheme("bg-dark", false)
        } else if (lokasi.pathname === "/listen") {
            setTheme("bg-listen", true)
        } else {
            setTheme("bg-black", true)
        }

        async function getData() {
            try {
                SetIsLoad(true)
                const songs = await findSongs()
                const artis = await findArtis()
                setSongs(songs)
                setArtis(artis)
                SetIsLoad(false)
            } catch (error) {
                SetIsLoad(false)
            }
        }

        if (props.kata !== "") {
            getData()
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.kata])

    useEffect(() => {
        if (CurrentLoc !== "" && lokasi.pathname !== CurrentLoc) {
            props.onSeacrh(false)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [lokasi.pathname])

    const findArtis = () => {
        return new Promise((resolve, reject) => {
            doRequest({
                method: "GET",
                url: `artist?page=1&per_page=5&active=1&order[id_artist]=ASC&search=${props.kata}`,
            })
                .then((res) => {
                    const { data } = res.data
                    resolve(data)
                })
                .catch((er) => {
                    reject(er)
                })
        })
    }

    const findSongs = () => {
        return new Promise((resolve, reject) => {
            doRequest({
                method: "GET",
                url: `music/all?page=1&per_page=8&order[id]=DESC&search=${props.kata}`,
            })
                .then((res) => {
                    const { data } = res.data
                    resolve(data)
                })
                .catch((er) => {
                    reject(er)
                })
        })
    }

    return (
        <section className="scrollable padder-lg w-f-md">
            <div className="dicover">
                <h1>Songs</h1>
            </div>
            <div className="row row-sm cards-container">
                {isLoad ? (
                    Array(count)
                        .fill()
                        .map((_, index) => {
                            return <Loader key={index} />
                        })
                ) : Songs.length <= 0 ? (
                    <div className="notfound">
                        <h3>Songs {props.kata} not found</h3>
                    </div>
                ) : (
                    Songs.map((value) => {
                        const data = {
                            id: value.id,
                            uuid: value.discovery_code,
                            name: value.music_title,
                            code: value.music_code,
                            artisCod: value.artis_code,
                            singer: value.artis_name,
                            cover: value.music_image_priority,
                            duration: value.music_duration,
                            musicSrc: value.music_storage_path,
                        }
                        return (
                            <Cards
                                key={data.id}
                                idx={data.id}
                                name={data.name}
                                code={data.code}
                                artiscod={data.artisCod}
                                cover={data.cover}
                                singer={data.singer}
                                duration={data.duration}
                                loved={value.love_id}
                                songs={data}
                            />
                        )
                    })
                )}
            </div>
            <div className="dicover">
                <h1>Artis</h1>
            </div>
            <div className="row row-sm cards-container">
                {isLoad ? (
                    Array(count)
                        .fill()
                        .map((_, index) => {
                            return <Loader key={index} />
                        })
                ) : Artis.length <= 0 ? (
                    <div className="notfound">
                        <h3>Artis {props.kata} not found</h3>
                    </div>
                ) : (
                    Artis.map((value) => {
                        const data = {
                            id: value.id_artist,
                            name: value.complete_name_artist,
                            code: value.code_artist,
                            image: value.foto_path_artist || avatar,
                        }
                        return (
                            <CircleCard
                                key={data.id}
                                id={data.id}
                                name={data.name}
                                image={data.image}
                                code={data.code}
                            />
                        )
                    })
                )}
            </div>
        </section>
    )
}

const mapDispatchToProps = (dispatch) => {
    return {
        unsetAuth: bindActionCreators(logout, dispatch),
    }
}

const mapStateToProps = (state) => {
    return {
        users: state.users,
        tokens: state.users.token,
        isAuth: state.users.isAuth,
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Search)
